"use client";
import React from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@radix-ui/react-progress";
import { Calendar, Heart, FileText, Pill, Video, MessageSquare, Activity, Smile, Meh, Frown, Star } from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

const wellnessData = [
  { subject: "Sleep", A: 80 },
  { subject: "Exercise", A: 65 },
  { subject: "Nutrition", A: 75 },
  { subject: "Stress", A: 55 },
  { subject: "Hydration", A: 85 },
  { subject: "Mood", A: 70 },
];

const upcomingAppointments = [
  { date: "May 20", time: "10:00 AM", doctor: "Dr. Ahmed Al-Rashid", type: "Cardiology Check-up", room: "101" },
  { date: "May 25", time: "02:30 PM", doctor: "Dr. Fatima Hassan", type: "Wellness Session", room: "Spa-2" },
];

const prescriptions = [
  { name: "Lisinopril 10mg", frequency: "Once daily", remaining: 14, total: 30 },
  { name: "Metformin 500mg", frequency: "Twice daily", remaining: 8, total: 60 },
  { name: "Vitamin D3 1000IU", frequency: "Once daily", remaining: 25, total: 30 },
];

const moodOptions = [
  { icon: Smile, label: "Great", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  { icon: Meh, label: "Okay", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
  { icon: Frown, label: "Not well", color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
];

export default function PatientDashboard() {
  return (
    <DashboardLayout title="My Health" subtitle="Welcome back, John Smith">
      {/* Wellness Score Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-2xl p-6 mb-6 text-white relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium mb-1">Overall Wellness Score</p>
            <p className="text-5xl font-bold">78<span className="text-2xl text-blue-200">/100</span></p>
            <p className="text-blue-100 text-sm mt-2">Good — Keep up the healthy habits!</p>
          </div>
          <div className="hidden sm:flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <p className="text-xs text-blue-200">Heart Health: Good</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Book Appointment", icon: Calendar, color: "from-blue-500 to-blue-600" },
          { label: "Video Consult", icon: Video, color: "from-violet-500 to-violet-600" },
          { label: "Message Doctor", icon: MessageSquare, color: "from-emerald-500 to-emerald-600" },
          { label: "View Reports", icon: FileText, color: "from-amber-500 to-amber-600" },
        ].map(({ label, icon: Icon, color }) => (
          <motion.button
            key={label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`bg-gradient-to-br ${color} text-white rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs font-medium text-center">{label}</span>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader><CardTitle>Upcoming Appointments</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {upcomingAppointments.map((apt, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-700"
                >
                  <div className="text-center bg-blue-600 text-white rounded-xl px-3 py-2 flex-shrink-0">
                    <p className="text-xs font-medium">{apt.date.split(" ")[0]}</p>
                    <p className="text-lg font-bold leading-none">{apt.date.split(" ")[1]}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{apt.type}</p>
                    <p className="text-xs text-slate-500">{apt.doctor} · Room {apt.room}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">{apt.time}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Reschedule</Button>
                    <Button size="sm">Check In</Button>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Prescriptions */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Pill className="w-5 h-5 text-blue-500" /> Active Prescriptions</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {prescriptions.map((rx, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{rx.name}</p>
                      <p className="text-xs text-slate-500">{rx.frequency}</p>
                    </div>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{rx.remaining}/{rx.total} left</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(rx.remaining / rx.total) * 100}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className={`h-2 rounded-full ${rx.remaining < 10 ? "bg-red-500" : "bg-blue-500"}`}
                    />
                  </div>
                  {rx.remaining < 10 && (
                    <p className="text-xs text-red-500 mt-1">⚠ Refill needed soon</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Mood Tracker */}
          <Card>
            <CardHeader><CardTitle>How are you feeling today?</CardTitle></CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {moodOptions.map(({ icon: Icon, label, color, bg }) => (
                  <button key={label} className={`flex-1 ${bg} rounded-xl p-3 flex flex-col items-center gap-1 hover:opacity-80 transition-opacity`}>
                    <Icon className={`w-7 h-7 ${color}`} />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Wellness Radar */}
          <Card>
            <CardHeader><CardTitle>Wellness Overview</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={wellnessData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <Radar name="Wellness" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Doctor Rating */}
          <Card>
            <CardHeader><CardTitle>Rate Your Last Visit</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500 mb-3">Dr. Ahmed Al-Rashid · May 10</p>
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s}>
                    <Star className={`w-7 h-7 ${s <= 4 ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                  </button>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full">Submit Review</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
