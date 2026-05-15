"use client";
import React from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Calendar, FileText, Clock, AlertTriangle, Video, MessageSquare, ChevronRight } from "lucide-react";
import { getInitials } from "@/lib/utils";

const todayPatients = [
  { id: "P001", name: "Sarah Johnson", age: 34, time: "09:00", type: "Consultation", status: "waiting", condition: "Hypertension follow-up" },
  { id: "P002", name: "Michael Chen", age: 45, time: "10:00", type: "Follow-up", status: "in-progress", condition: "Diabetes management" },
  { id: "P003", name: "Emma Williams", age: 28, time: "11:00", type: "New Patient", status: "scheduled", condition: "Chest pain evaluation" },
  { id: "P004", name: "James Brown", age: 52, time: "14:00", type: "Consultation", status: "scheduled", condition: "Post-surgery check" },
];

const recentNotes = [
  { patient: "Sarah Johnson", note: "BP 140/90, adjusted medication dosage", date: "Today 09:45" },
  { patient: "Michael Chen", note: "HbA1c improved to 6.8%, continue current plan", date: "Today 10:30" },
  { patient: "Carlos Rodriguez", note: "Referred to physiotherapy for knee pain", date: "Yesterday" },
];

export default function DoctorDashboard() {
  return (
    <DashboardLayout title="My Dashboard" subtitle="Dr. Ahmed Al-Rashid · Cardiology">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Today's Patients" value="8" subtitle="2 completed" icon={Users} color="blue" />
        <StatCard title="Appointments" value="12" subtitle="This week" icon={Calendar} color="emerald" />
        <StatCard title="Pending Notes" value="3" subtitle="Need attention" icon={FileText} color="amber" />
        <StatCard title="Avg. Consult Time" value="22 min" subtitle="Today" icon={Clock} color="violet" />
      </div>

      {/* Emergency Alert */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 mb-6 flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-red-600" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-red-700 dark:text-red-400">Emergency Alert</p>
          <p className="text-sm text-red-600 dark:text-red-300">Patient Emma Williams — Room ER-1 requires immediate attention</p>
        </div>
        <Button variant="destructive" size="sm">Respond</Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Today's Patients */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Today&apos;s Patients</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Video className="w-4 h-4 mr-1" /> Video Call
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayPatients.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group"
              >
                <Avatar className="w-10 h-10">
                  <AvatarFallback>{getInitials(p.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-800 dark:text-slate-100 text-sm">{p.name}</p>
                    <span className="text-xs text-slate-400">{p.age}y</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{p.condition}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{p.time}</p>
                  <Badge
                    variant={p.status === "in-progress" ? "warning" : p.status === "waiting" ? "default" : "secondary"}
                    className="text-[10px] capitalize"
                  >
                    {p.status}
                  </Badge>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <Card>
            <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {[
                { label: "New Note", icon: FileText, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
                { label: "Prescribe", icon: FileText, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" },
                { label: "Video Call", icon: Video, color: "text-violet-600 bg-violet-50 dark:bg-violet-900/20" },
                { label: "Message", icon: MessageSquare, color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20" },
              ].map(({ label, icon: Icon, color }) => (
                <button key={label} className={`${color} rounded-xl p-3 flex flex-col items-center gap-1.5 hover:opacity-80 transition-opacity`}>
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Recent Notes */}
          <Card>
            <CardHeader><CardTitle>Recent Notes</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {recentNotes.map((n, i) => (
                <div key={i} className="border-l-2 border-blue-200 dark:border-blue-800 pl-3">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{n.patient}</p>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.note}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{n.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
