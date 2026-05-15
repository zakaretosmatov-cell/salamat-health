import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./config";

// Generic CRUD helpers
export async function createDocument(collectionName: string, data: Record<string, unknown>, id?: string) {
  const payload = { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
  if (id) {
    await setDoc(doc(db, collectionName, id), payload);
    return id;
  }
  const ref = await addDoc(collection(db, collectionName), payload);
  return ref.id;
}

export async function updateDocument(collectionName: string, id: string, data: Record<string, unknown>) {
  await updateDoc(doc(db, collectionName, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteDocument(collectionName: string, id: string) {
  await deleteDoc(doc(db, collectionName, id));
}

export async function getDocument(collectionName: string, id: string) {
  const snap = await getDoc(doc(db, collectionName, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function getDocuments(collectionName: string, constraints: QueryConstraint[] = []) {
  const q = query(collection(db, collectionName), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export function subscribeToCollection(
  collectionName: string,
  constraints: QueryConstraint[],
  callback: (data: Record<string, unknown>[]) => void
) {
  const q = query(collection(db, collectionName), ...constraints);
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export function subscribeToDocument(
  collectionName: string,
  id: string,
  callback: (data: Record<string, unknown> | null) => void
) {
  return onSnapshot(doc(db, collectionName, id), (snap) => {
    callback(snap.exists() ? { id: snap.id, ...snap.data() } : null);
  });
}

export { where, orderBy, limit, Timestamp };
