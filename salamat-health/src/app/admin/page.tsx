"use client";
import React from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { RevenueAreaChart, PatientBarChart } from "@/components/dashboard/RevenueChart";
import AppointmentTable from "@/components/dashboard/AppointmentTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, DollarSign, Bed, Activity, UserCheck, AlertTriangle, Heart, TrendingUp, Download } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const departmentData = [
  { name: "Cardiology", value: 28, color: "#3b82f6" },
  { name: "Neurology", value: 18, color: "#8b5cf6" },
  { name: "Wellness", value: 22, color: "#10b981" },
  { name: "Orthopedics", value: 15, color: "#f59e0b" },
  { name: "Dermatology", value: 17, color: "#ec4899" },
];

const recentActivity = [
  { user: "Dr. Ahmed Al-Rashid", action: "Completed consultation", time: "2m ago", type: "success" },
  { user: "Reception - Sara", action: "Registered new patient", time: "5m ago", type: "info" },
  { user: "System", action: "Emergency alert triggered - Room 3", time: "8m ago", type: "error" },
  { user: "Dr. Fatima Hassan", action: "Updated prescription", time: "12m ago", type: "info" },
  { user: "Admin", action: "Added new staff member", time: "25m ago", type: "success" },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout title="Admin Dashboard" subtitle="Full system overview and control">
      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Patients" value="2,847" subtitle="Active records" icon={Users} trend={12} color="blue" delay={0} />
        <StatCard title="Today's Appointments" value="64" subtitle="8 pending" icon={Calendar} trend={5} color="emerald" delay={0.05} />
        <StatCard title="Monthly Revenue" value="$91,200" subtitle="vs $79k last month" icon={DollarSign} trend={15} color="violet" delay={0.1} />
        <StatCard title="Available Rooms" value="18/32" subtitle="14 occupied" icon={Bed} trend={-3} color="amber" delay={0.15} />
        <StatCard title="Active Staff" value="47" subtitle="3 on leave" icon={UserCheck} trend={2} color="cyan" delay={0.2} />
        <StatCard title="Emergency Cases" value="3" subtitle="All attended" icon={AlertTriangle} color="rose" delay={0.25} />
        <StatCard title="Wellness Sessions" value="28" subtitle="Today" icon={Heart} trend={8} color="emerald" delay={0.3} />
        <StatCard title="Avg. Wait Time" value="12 min" subtitle="Down from 18 min" icon={Activity} trend={33} color="blue" delay={0.35} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <RevenueAreaChart />
        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={departmentData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {departmentData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, "Share"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {departmentData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-slate-600 dark:text-slate-300">{d.name}</span>
                  </div>
                  <span className="font-medium text-slate-700 dark:text-slate-200">{d.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Appointments */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Today&apos;s Appointments</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" /> Export
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <AppointmentTable />
          </CardContent>
        </Card>

        {/* Activity Log */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3"
              >
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.type === "error" ? "bg-red-500" : a.type === "success" ? "bg-emerald-500" : "bg-blue-500"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">{a.user}</p>
                  <p className="text-xs text-slate-500 truncate">{a.action}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{a.time}</p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
