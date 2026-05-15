"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { UserRole } from "@/types";

const roleRedirects: Record<UserRole, string> = {
  admin: "/admin",
  receptionist: "/reception",
  doctor: "/doctor",
  patient: "/patient",
};

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, role, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && role) {
        router.replace(roleRedirects[role]);
      } else {
        router.replace("/login");
      }
    }
  }, [isAuthenticated, role, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 animate-pulse" />
        <p className="text-slate-400 text-sm">Loading Salamat Health...</p>
      </div>
    </div>
  );
}
