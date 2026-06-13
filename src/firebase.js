import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  writeBatch,
  serverTimestamp,
  onSnapshot,
  deleteField,
  deleteDoc
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAM8_KS-cn8fNQ02vTIjaLc_KmbqIyAYxA",
  authDomain: "panini-companion-2026.firebaseapp.com",
  projectId: "panini-companion-2026",
  storageBucket: "panini-companion-2026.firebasestorage.app",
  messagingSenderId: "1059206050205",
  appId: "1:1059206050205:web:883ff0093d137557a27f74"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const FAMILY_ID = "valentina-family";
export const familyDocRef = doc(db, "families", FAMILY_ID);
const membersCollectionRef = collection(db, "families", FAMILY_ID, "members");

function cleanForFirestore(value) {
  if (value === undefined) return null;
  if (value === null) return null;
  if (Array.isArray(value)) return value.map(cleanForFirestore);
  if (typeof value === "object") {
    const clean = {};
    Object.entries(value).forEach(([key, item]) => {
      if (typeof item !== "function") {
        clean[key] = cleanForFirestore(item);
      }
    });
    return clean;
  }
  return value;
}

function safeDocId(value, fallback = "member") {
  return String(value || fallback)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || fallback;
}

async function loadMembersFromSubcollection() {
  const membersSnapshot = await getDocs(membersCollectionRef);
  if (membersSnapshot.empty) return [];

  return membersSnapshot.docs
    .map(memberDoc => ({ id: memberDoc.id, ...memberDoc.data() }))
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

export async function loadCloudFamily() {
  const [familySnapshot, members] = await Promise.all([
    getDoc(familyDocRef),
    loadMembersFromSubcollection()
  ]);

  const familyData = familySnapshot.exists() ? familySnapshot.data() : {};

  // Nueva estructura escalable: cada perfil vive en su propio documento.
  if (members.length) {
    return {
      ...familyData,
      familyProfiles: members,
      storageMode: "split-members"
    };
  }

  // Compatibilidad temporal: si todavía existe la estructura vieja, la cargamos.
  // En el siguiente Guardar nube se migrará automáticamente a subcolección.
  if (Array.isArray(familyData.familyProfiles) && familyData.familyProfiles.length) {
    return {
      ...familyData,
      storageMode: "legacy-single-document"
    };
  }

  return familySnapshot.exists() ? familyData : null;
}

function compactLog(log, limit = 80) {
  if (!Array.isArray(log)) return [];
  return log.slice(-limit).map(item => {
    if (!item || typeof item !== "object") return { text: String(item || ""), time: "" };
    return {
      text: String(item.text || "").slice(0, 180),
      time: String(item.time || "").slice(0, 60)
    };
  });
}

function sanitizeSticker(sticker) {
  if (!sticker || typeof sticker !== "object") return sticker;
  return {
    id: sticker.id ?? null,
    label: sticker.label ?? null,
    code: sticker.code ?? null,
    number: sticker.number ?? null,
    country: sticker.country ?? null,
    group: sticker.group ?? null,
    name: sticker.name ?? null,
    owned: Boolean(sticker.owned),
    duplicates: Number(sticker.duplicates || 0),
    traded: Number(sticker.traded || 0)
  };
}

function sanitizeCollection(collectionData) {
  if (!collectionData || typeof collectionData !== "object") return {};
  const clean = {};
  Object.entries(collectionData).forEach(([key, stickers]) => {
    clean[key] = Array.isArray(stickers) ? stickers.map(sanitizeSticker) : stickers;
  });
  return clean;
}

function sanitizeProfileForCloud(profile) {
  const cleanProfile = cleanForFirestore(profile || {});

  return {
    id: cleanProfile.id || null,
    name: cleanProfile.name || "Coleccionista",
    emoji: cleanProfile.emoji || "⭐",
    character: cleanProfile.character || null,
    customCharacter: cleanProfile.customCharacter || null,
    color: cleanProfile.color || "dorado",
    pin: cleanProfile.pin || "",
    collection: sanitizeCollection(cleanProfile.collection),
    specials: Array.isArray(cleanProfile.specials) ? cleanProfile.specials.map(sanitizeSticker) : [],
    extraStickers: Array.isArray(cleanProfile.extraStickers) ? cleanProfile.extraStickers : [],
    captureCount: Number(cleanProfile.captureCount || 0),
    achievements: cleanProfile.achievements || {},
    log: compactLog(cleanProfile.log),
    createdAt: cleanProfile.createdAt || cleanProfile.firstUsedAt || cleanProfile.installedAt || new Date().toISOString(),
    firstUsedAt: cleanProfile.firstUsedAt || cleanProfile.createdAt || cleanProfile.installedAt || new Date().toISOString(),
    installedAt: cleanProfile.installedAt || cleanProfile.createdAt || cleanProfile.firstUsedAt || new Date().toISOString(),
    lastUsedAt: cleanProfile.lastUsedAt || new Date().toISOString(),
    cloudPayloadVersion: "14.4-light"
  };
}

export async function saveCloudFamily(data) {
  const cleanData = cleanForFirestore(data || {});
  const familyProfiles = Array.isArray(cleanData.familyProfiles) ? cleanData.familyProfiles.map(sanitizeProfileForCloud) : [];
  const desiredMemberIds = new Set(
    familyProfiles.map((profile, index) => safeDocId(profile.id, `member-${index + 1}`))
  );
  const existingMembersSnapshot = await getDocs(membersCollectionRef);
  const batch = writeBatch(db);

  // El documento principal queda ligero. Nunca vuelve a guardar todos los perfiles juntos.
  batch.set(familyDocRef, {
    schemaVersion: 14.4,
    storageMode: "split-members",
    updatedFrom: cleanData.updatedFrom || "manual-button",
    clientUpdatedAt: cleanData.clientUpdatedAt || new Date().toISOString(),
    updatedAt: serverTimestamp(),
    profileCount: familyProfiles.length,
    familyProfiles: deleteField(),
    activeProfileId: deleteField()
  }, { merge: true });

  familyProfiles.forEach((profile, index) => {
    const memberId = safeDocId(profile.id, `member-${index + 1}`);
    const memberRef = doc(db, "families", FAMILY_ID, "members", memberId);

    batch.set(memberRef, {
      ...profile,
      id: memberId,
      order: index,
      updatedAt: serverTimestamp(),
      // Campos solo locales o pesados: si ya existían en Firebase se eliminan.
      undoStack: deleteField(),
      uiState: deleteField(),
      captureFeedback: deleteField()
    }, { merge: true });
  });

  // Seguridad: ya no borramos automáticamente perfiles que no estén en el dispositivo local.
  // El borrado real queda reservado a deleteCloudMember(profileId), que se ejecuta al eliminar un perfil.
  // Solo conservamos la limpieza del perfil fantasma histórico para que no vuelva a aparecer.
  existingMembersSnapshot.docs.forEach(memberDoc => {
    const memberId = String(memberDoc.id || "").toLowerCase();
    const memberData = memberDoc.data() || {};
    const memberName = String(memberData.name || "").toLowerCase();
    const value = `${memberId} ${memberName}`;
    if (value.includes("mich-y-omar") || value.includes("mich y omar") || (value.includes("mich") && value.includes("omar"))) {
      batch.delete(memberDoc.ref);
    }
  });

  await batch.commit();
}

export async function deleteCloudMember(profileId) {
  const memberId = safeDocId(profileId);
  const memberRef = doc(db, "families", FAMILY_ID, "members", memberId);
  await deleteDoc(memberRef);

  await setDoc(familyDocRef, {
    schemaVersion: 14.4,
    storageMode: "split-members",
    lastDeletedMemberId: memberId,
    clientUpdatedAt: new Date().toISOString(),
    updatedAt: serverTimestamp(),
    familyProfiles: deleteField(),
    activeProfileId: deleteField()
  }, { merge: true });
}

export function subscribeCloudFamily(callback, onError) {
  // Suscripción ligera al documento de metadatos. La app actualmente hace carga inicial/manual.
  return onSnapshot(familyDocRef, snapshot => {
    callback(snapshot.exists() ? snapshot.data() : null);
  }, onError);
}
