"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { UserRole } from "@/types";
import {
  LayoutDashboard, Users, Calendar, CreditCard, FileText, Settings,
  Activity, Bed, Heart, Stethoscope, ClipboardList, Bell, BarChart3,
  Shield, LogOut, ChevronLeft, Sparkles, Building2, UserCog, Trees
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { logoutUser } from "@/firebase/auth";
import { useRouter } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const navByRole: Record<UserRole, NavItem[]> = {
  admin: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Departments", href: "/admin/departments", icon: Building2 },
    { label: "Staff", href: "/admin/staff", icon: UserCog },
    { label: "Billing", href: "/admin/billing", icon: CreditCard },
    { label: "Rooms", href: "/admin/rooms", icon: Bed },
    { label: "Reports", href: "/admin/reports", icon: FileText },
    { label: "Security", href: "/admin/security", icon: Shield },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ],
  receptionist: [
    { label: "Dashboard", href: "/reception", icon: LayoutDashboard },
    { label: "Patients", href: "/reception/patients", icon: Users },
    { label: "Appointments", href: "/reception/appointments", icon: Calendar },
    { label: "Queue", href: "/reception/queue", icon: ClipboardList },
    { label: "Honalar", href: "/reception/rooms", icon: Bed },
    { label: "Payments", href: "/reception/payments", icon: CreditCard },
    { label: "Notifications", href: "/reception/notifications", icon: Bell },
  ],
  doctor: [],
  patient: [
    { label: "Dashboard", href: "/patient", icon: LayoutDashboard },
    { label: "Honalar", href: "/patient/rooms", icon: Bed },
    { label: "Appointments", href: "/patient/appointments", icon: Calendar },
    { label: "Notifications", href: "/patient/notifications", icon: Bell },
    { label: "Zoopark", href: "/patient/zoopark", icon: Trees },
  ],
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, userName } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const navItems = role ? navByRole[role] : [];

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 256 : 72 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative flex flex-col h-screen bg-white dark:bg-slate-950 border-r border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden z-30"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-md">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="font-bold text-slate-900 dark:text-white text-base leading-tight">Salamat</p>
              <p className="text-xs text-slate-400">Health Platform</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-16 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm hover:shadow-md transition-all z-10"
      >
        <motion.div animate={{ rotate: sidebarOpen ? 0 : 180 }} transition={{ duration: 0.3 }}>
          <ChevronLeft className="w-3 h-3 text-slate-500" />
        </motion.div>
      </button>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 cursor-pointer group",
                  isActive
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                )}
              >
                <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-blue-600 dark:text-blue-400")} />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute right-0 w-1 h-8 bg-blue-600 rounded-l-full"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-slate-100 dark:border-slate-800 p-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9 flex-shrink-0">
            <AvatarFallback>{getInitials(userName || "User")}</AvatarFallback>
          </Avatar>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{userName}</p>
                <p className="text-xs text-slate-400 capitalize">{role}</p>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={handleLogout}
            className="flex-shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
