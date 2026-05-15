"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, AlertTriangle, CheckCircle, ArrowUp, ArrowDown, GripVertical } from "lucide-react";
import { getInitials } from "@/lib/utils";

const initialQueue = [
  { id: "Q001", name: "Sarah Johnson", type: "Consultation", doctor: "Dr. Ahmed", waitTime: 5, priority: "normal", status: "waiting" },
  { id: "Q002", name: "Michael Chen", type: "Follow-up", doctor: "Dr. Fatima", waitTime: 12, priority: "normal", status: "waiting" },
  { id: "Q003", name: "Emma Williams", type: "Emergency", doctor: "Dr. Omar", waitTime: 0, priority: "emergency", status: "in-progress" },
  { id: "Q004", name: "James Brown", type: "Wellness", doctor: "Dr. Layla", waitTime: 20, priority: "normal", status: "waiting" },
  { id: "Q005", name: "Aisha Patel", type: "Consultation", doctor: "Dr. Yusuf", waitTime: 28, priority: "normal", status: "waiting" },
  { id: "Q006", name: "Carlos Rodriguez", type: "Follow-up", doctor: "Dr. Ahmed", waitTime: 35, priority: "urgent", status: "waiting" },
];

export default function QueuePage() {
  const [queue, setQueue] = useState(initialQueue);

  const checkIn = (id: string) => setQueue(q => q.map(p => p.id === id ? { ...p, status: "in-progress" } : p));
  const complete = (id: string) => setQueue(q => q.filter(p => p.id !== id));

  const waiting = queue.filter(q => q.status === "waiting");
  const inProgress = queue.filter(q => q.status === "in-progress");

  return (
    <DashboardLayout title="Patient Queue" subtitle="Real-time queue management">
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Waiting", count: waiting.length, color: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400" },
          { label: "In Progress", count: inProgress.length, color: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400" },
          { label: "Avg Wait", count: "15 min", color: "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300" },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 text-center`}>
            <p className="text-3xl font-bold">{s.count}</p>
            <p className="text-sm font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Waiting Queue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Waiting Queue
            </CardTitle>
            <Badge variant="warning">{waiting.length}</Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <AnimatePresence>
              {waiting.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`flex items-center gap-3 p-3 rounded-xl border ${
                    p.priority === "emergency" ? "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800" :
                    p.priority === "urgent" ? "bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800" :
                    "bg-slate-50 border-slate-100 dark:bg-slate-800/30 dark:border-slate-700"
                  }`}
                >
                  <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />
                  <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                    {i + 1}
                  </div>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">{getInitials(p.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.type} · {p.doctor}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    {p.waitTime}m
                  </div>
                  {p.priority !== "normal" && (
                    <Badge variant={p.priority === "emergency" ? "destructive" : "warning"} className="text-[10px] capitalize">{p.priority}</Badge>
                  )}
                  <Button size="icon-sm" variant="ghost" onClick={() => checkIn(p.id)} title="Check In">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* In Progress */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              In Progress
            </CardTitle>
            <Badge variant="default">{inProgress.length}</Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <AnimatePresence>
              {inProgress.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-200 dark:bg-blue-900/10 dark:border-blue-800"
                >
                  <Avatar className="w-9 h-9">
                    <AvatarFallback>{getInitials(p.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.type} · {p.doctor}</p>
                  </div>
                  <Button size="sm" variant="success" onClick={() => complete(p.id)}>
                    <CheckCircle className="w-3.5 h-3.5" /> Complete
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
            {inProgress.length === 0 && (
              <p className="text-center text-sm text-slate-400 py-8">No patients in progress</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
