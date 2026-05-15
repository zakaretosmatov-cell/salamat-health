import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User as FirebaseUser } from "firebase/auth";
import { UserRole } from "@/types";

interface AuthState {
  user: FirebaseUser | null;
  role: UserRole | null;
  userName: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: FirebaseUser | null, role: UserRole | null, name: string | null) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      userName: null,
      isLoading: true,
      isAuthenticated: false,
      setUser: (user, role, userName) =>
        set({ user, role, userName, isAuthenticated: !!user, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
      clearAuth: () =>
        set({ user: null, role: null, userName: null, isAuthenticated: false, isLoading: false }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ role: state.role, userName: state.userName }),
    }
  )
);
