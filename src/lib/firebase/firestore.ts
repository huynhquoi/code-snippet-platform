import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "./config";

export async function createSnippet(data: any) {
  const docRef = await addDoc(collection(db, "snippets"), {
    ...data,
    createdAt: new Date(),
  });
  return docRef.id;
}

export async function getSnippet(id: string) {
  const docSnap = await getDoc(doc(db, "snippets", id));
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
}

export async function getSnippets() {
  const querySnapshot = await getDocs(collection(db, "snippets"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function updateSnippet(id: string, data: any) {
  await updateDoc(doc(db, "snippets", id), data);
}

export async function deleteSnippet(id: string) {
  await deleteDoc(doc(db, "snippets", id));
}
