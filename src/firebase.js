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
  deleteField
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

export async function saveCloudFamily(data) {
  const cleanData = cleanForFirestore(data || {});
  const familyProfiles = Array.isArray(cleanData.familyProfiles) ? cleanData.familyProfiles : [];
  const batch = writeBatch(db);

  // El documento principal queda ligero. Nunca vuelve a guardar todos los perfiles juntos.
  batch.set(familyDocRef, {
    schemaVersion: 13.8,
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
      updatedAt: serverTimestamp()
    }, { merge: true });
  });

  await batch.commit();
}

export function subscribeCloudFamily(callback, onError) {
  // Suscripción ligera al documento de metadatos. La app actualmente hace carga inicial/manual.
  return onSnapshot(familyDocRef, snapshot => {
    callback(snapshot.exists() ? snapshot.data() : null);
  }, onError);
}
