import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

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
export const albumDocRef = doc(db, "albums", "principal");

export async function loadCloudAlbum() {
  const snapshot = await getDoc(albumDocRef);
  if (!snapshot.exists()) return null;
  return snapshot.data();
}

export async function saveCloudAlbum(data) {
  await setDoc(albumDocRef, {
    ...data,
    updatedAt: serverTimestamp()
  }, { merge: true });
}
