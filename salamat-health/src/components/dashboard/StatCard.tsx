"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: number;
  color?: "blue" | "emerald" | "violet" | "amber" | "rose" | "cyan";
  delay?: number;
}

const colorMap = {
  blue: {
    bg: "from-blue-500 to-blue-600",
    light: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
    icon: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400",
  },
  emerald: {
    bg: "from-emerald-500 to-emerald-600",
    light: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-600 dark:text-emerald-400",
    icon: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400",
  },
  violet: {
    bg: "from-violet-500 to-violet-600",
    light: "bg-violet-50 dark:bg-violet-900/20",
    text: "text-violet-600 dark:text-violet-400",
    icon: "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400",
  },
  amber: {
    bg: "from-amber-500 to-amber-600",
    light: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-600 dark:text-amber-400",
    icon: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400",
  },
  rose: {
    bg: "from-rose-500 to-rose-600",
    light: "bg-rose-50 dark:bg-rose-900/20",
    text: "text-rose-600 dark:text-rose-400",
    icon: "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400",
  },
  cyan: {
    bg: "from-cyan-500 to-cyan-600",
    light: "bg-cyan-50 dark:bg-cyan-900/20",
    text: "text-cyan-600 dark:text-cyan-400",
    icon: "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400",
  },
};

export default function StatCard({ title, value, subtitle, icon: Icon, trend, color = "blue", delay = 0 }: StatCardProps) {
  const c = colorMap[color];
  const isPositive = trend !== undefined && trend >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
          <motion.p
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: delay + 0.1 }}
            className="text-3xl font-bold text-slate-900 dark:text-white mt-1"
          >
            {value}
          </motion.p>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
          {trend !== undefined && (
            <div className={cn("flex items-center gap-1 mt-2 text-xs font-medium", isPositive ? "text-emerald-600" : "text-red-500")}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{Math.abs(trend)}% vs last month</span>
            </div>
          )}
        </div>
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0", c.icon)}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}
