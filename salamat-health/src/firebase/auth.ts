import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";
import { UserRole } from "@/types";

export async function loginUser(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const userDoc = await getDoc(doc(db, "users", credential.user.uid));
  if (!userDoc.exists()) throw new Error("User profile not found");
  return { firebaseUser: credential.user, userData: userDoc.data() };
}

export async function registerUser(
  email: string,
  password: string,
  name: string,
  role: UserRole = "patient"
) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: name });
  await setDoc(doc(db, "users", credential.user.uid), {
    id: credential.user.uid,
    email,
    name,
    role,
    isActive: true,
    createdAt: serverTimestamp(),
  });
  return credential.user;
}

export async function logoutUser() {
  await signOut(auth);
}

export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function getUserRole(uid: string): Promise<UserRole | null> {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (!userDoc.exists()) return null;
  return userDoc.data().role as UserRole;
}
