import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC4tDdq1FjjOykHocK4_N6hQgyced1dyHw",
  authDomain: "salamat-8b843.firebaseapp.com",
  projectId: "salamat-8b843",
  storageBucket: "salamat-8b843.firebasestorage.app",
  messagingSenderId: "366050882411",
  appId: "1:366050882411:web:afdc32729b353b9d9e922e",
  measurementId: "G-ETY7Z4P5Z1",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
