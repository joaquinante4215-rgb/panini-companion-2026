import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, onSnapshot, serverTimestamp } from "firebase/firestore";

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
export const familyDocRef = doc(db, "families", "valentina-family");

export async function loadCloudFamily() {
  const snapshot = await getDoc(familyDocRef);
  if (!snapshot.exists()) return null;
  return snapshot.data();
}

export async function saveCloudFamily(data) {
  await setDoc(familyDocRef, {
    ...data,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

export function subscribeCloudFamily(callback, onError) {
  return onSnapshot(familyDocRef, snapshot => {
    callback(snapshot.exists() ? snapshot.data() : null);
  }, onError);
}
