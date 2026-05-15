"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Calendar, Clock, Bed, Search, Plus, AlertTriangle, CheckCircle, UserPlus, Printer, QrCode } from "lucide-react";
import { getInitials } from "@/lib/utils";

const queueData = [
  { id: "Q001", name: "Sarah Johnson", type: "Consultation", doctor: "Dr. Ahmed", waitTime: "5 min", status: "waiting", priority: "normal" },
  { id: "Q002", name: "Michael Chen", type: "Follow-up", doctor: "Dr. Fatima", waitTime: "12 min", status: "waiting", priority: "normal" },
  { id: "Q003", name: "Emma Williams", type: "Emergency", doctor: "Dr. Omar", waitTime: "0 min", status: "in-progress", priority: "emergency" },
  { id: "Q004", name: "James Brown", type: "Wellness", doctor: "Dr. Layla", waitTime: "20 min", status: "waiting", priority: "normal" },
  { id: "Q005", name: "Aisha Patel", type: "Consultation", doctor: "Dr. Yusuf", waitTime: "28 min", status: "waiting", priority: "normal" },
];

const todaySchedule = [
  { time: "09:00", patient: "Sarah Johnson", doctor: "Dr. Ahmed", room: "101", status: "confirmed" },
  { time: "09:30", patient: "Michael Chen", doctor: "Dr. Fatima", room: "203", status: "checked-in" },
  { time: "10:00", patient: "Emma Williams", doctor: "Dr. Omar", room: "ER-1", status: "emergency" },
  { time: "10:30", patient: "James Brown", doctor: "Dr. Layla", room: "105", status: "scheduled" },
  { time: "11:00", patient: "Aisha Patel", doctor: "Dr. Yusuf", room: "202", status: "scheduled" },
];

export default function ReceptionDashboard() {
  const [registerOpen, setRegisterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <DashboardLayout title="Reception" subtitle="Patient check-in and queue management">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="In Queue" value="12" subtitle="Avg wait: 15 min" icon={Clock} color="amber" />
        <StatCard title="Today's Patients" value="47" subtitle="8 checked in" icon={Users} trend={8} color="blue" />
        <StatCard title="Appointments" value="64" subtitle="6 remaining" icon={Calendar} color="emerald" />
        <StatCard title="Available Rooms" value="8" subtitle="of 32 total" icon={Bed} color="violet" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Register Patient", icon: UserPlus, color: "bg-blue-600 hover:bg-blue-700", action: () => setRegisterOpen(true) },
          { label: "New Appointment", icon: Calendar, color: "bg-emerald-600 hover:bg-emerald-700", action: () => {} },
          { label: "Emergency Tag", icon: AlertTriangle, color: "bg-red-500 hover:bg-red-600", action: () => {} },
          { label: "Print Receipt", icon: Printer, color: "bg-violet-600 hover:bg-violet-700", action: () => {} },
        ].map(({ label, icon: Icon, color, action }) => (
          <motion.button
            key={label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={action}
            className={`${color} text-white rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm transition-colors`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-sm font-medium">{label}</span>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Live Queue */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Queue
            </CardTitle>
            <Badge variant="warning">{queueData.filter(q => q.status === "waiting").length} waiting</Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <AnimatePresence>
              {queueData.map((q, i) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                    q.priority === "emergency"
                      ? "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800"
                      : "bg-slate-50 border-slate-100 dark:bg-slate-800/30 dark:border-slate-700"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                    {i + 1}
                  </div>
                  <Avatar className="w-9 h-9">
                    <AvatarFallback>{getInitials(q.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{q.name}</p>
                      {q.priority === "emergency" && (
                        <Badge variant="destructive" className="text-[10px] py-0">EMERGENCY</Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{q.type} · {q.doctor}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-300">{q.waitTime}</p>
                    <Badge variant={q.status === "in-progress" ? "success" : "secondary"} className="text-[10px]">
                      {q.status}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {todaySchedule.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <div className="text-xs font-bold text-blue-600 dark:text-blue-400 w-12 flex-shrink-0 pt-0.5">{s.time}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{s.patient}</p>
                  <p className="text-xs text-slate-500 truncate">{s.doctor} · Room {s.room}</p>
                </div>
                <Badge
                  variant={s.status === "emergency" ? "destructive" : s.status === "checked-in" ? "success" : s.status === "confirmed" ? "default" : "secondary"}
                  className="text-[10px] capitalize flex-shrink-0"
                >
                  {s.status}
                </Badge>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Register Patient Dialog */}
      <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Register New Patient</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <Input placeholder="First Name" />
            <Input placeholder="Last Name" />
            <Input placeholder="Email Address" type="email" className="col-span-2" />
            <Input placeholder="Phone Number" />
            <Input placeholder="Date of Birth" type="date" />
            <Select>
              <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger><SelectValue placeholder="Blood Type" /></SelectTrigger>
              <SelectContent>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bt => (
                  <SelectItem key={bt} value={bt}>{bt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input placeholder="Emergency Contact" className="col-span-2" />
            <div className="col-span-2 flex gap-2 justify-end mt-2">
              <Button variant="outline" onClick={() => setRegisterOpen(false)}>Cancel</Button>
              <Button onClick={() => setRegisterOpen(false)}>
                <QrCode className="w-4 h-4" /> Register & Generate QR
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
