"use client";
import React, { useEffect } from "react";
import { onAuthChange, getUserRole } from "@/firebase/auth";
import { useAuthStore } from "@/store/authStore";
import { UserRole } from "@/types";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, clearAuth } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUser(firebaseUser, data.role as UserRole, data.name);
          } else {
            setUser(firebaseUser, null, firebaseUser.displayName);
          }
        } catch {
          setUser(firebaseUser, null, firebaseUser.displayName);
        }
      } else {
        clearAuth();
      }
    });
    return () => unsubscribe();
  }, [setUser, clearAuth]);

  return <>{children}</>;
}
