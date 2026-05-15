"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Search, Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { toggleSidebar } = useUIStore();
  const { userName, role } = useAuthStore();
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    { id: 1, text: "New patient registered", time: "2m ago", type: "info" },
    { id: 2, text: "Emergency: Room 3 alert", time: "5m ago", type: "error" },
    { id: 3, text: "Appointment confirmed", time: "10m ago", type: "success" },
  ];

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon-sm" onClick={toggleSidebar} className="lg:hidden">
          <Menu className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h1>
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:block w-64">
          <Input
            placeholder="Search patients, appointments..."
            icon={<Search className="w-4 h-4" />}
            className="h-9 text-sm"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <Button variant="ghost" size="icon-sm" onClick={() => setNotifOpen(!notifOpen)} className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
              {notifications.length}
            </span>
          </Button>
          {notifOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute right-0 top-10 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-50"
            >
              <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                <p className="font-semibold text-slate-900 dark:text-white">Notifications</p>
              </div>
              {notifications.map((n) => (
                <div key={n.id} className="flex items-start gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.type === "error" ? "bg-red-500" : n.type === "success" ? "bg-emerald-500" : "bg-blue-500"}`} />
                  <div>
                    <p className="text-sm text-slate-700 dark:text-slate-200">{n.text}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-100 dark:border-slate-800">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900 dark:text-white">{userName}</p>
            <p className="text-xs text-slate-400 capitalize">{role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
