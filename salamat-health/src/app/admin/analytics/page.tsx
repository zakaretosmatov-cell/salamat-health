"use client";
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from "recharts";

const monthlyData = [
  { month: "Jan", revenue: 42000, patients: 180, appointments: 210, wellness: 45 },
  { month: "Feb", revenue: 38000, patients: 165, appointments: 190, wellness: 38 },
  { month: "Mar", revenue: 51000, patients: 210, appointments: 245, wellness: 52 },
  { month: "Apr", revenue: 47000, patients: 195, appointments: 228, wellness: 48 },
  { month: "May", revenue: 63000, patients: 240, appointments: 280, wellness: 65 },
  { month: "Jun", revenue: 58000, patients: 225, appointments: 262, wellness: 58 },
  { month: "Jul", revenue: 71000, patients: 270, appointments: 315, wellness: 72 },
  { month: "Aug", revenue: 68000, patients: 255, appointments: 298, wellness: 68 },
  { month: "Sep", revenue: 75000, patients: 285, appointments: 332, wellness: 78 },
  { month: "Oct", revenue: 82000, patients: 310, appointments: 361, wellness: 85 },
  { month: "Nov", revenue: 79000, patients: 295, appointments: 344, wellness: 80 },
  { month: "Dec", revenue: 91000, patients: 340, appointments: 396, wellness: 95 },
];

const staffPerformance = [
  { name: "Dr. Ahmed", patients: 48, rating: 4.9, revenue: 24000 },
  { name: "Dr. Fatima", patients: 42, rating: 4.8, revenue: 21000 },
  { name: "Dr. Omar", patients: 38, rating: 4.7, revenue: 19000 },
  { name: "Dr. Layla", patients: 35, rating: 4.9, revenue: 17500 },
  { name: "Dr. Yusuf", patients: 31, rating: 4.6, revenue: 15500 },
];

const paymentMethods = [
  { name: "Insurance", value: 45, color: "#3b82f6" },
  { name: "Card", value: 30, color: "#10b981" },
  { name: "Cash", value: 15, color: "#f59e0b" },
  { name: "Online", value: 10, color: "#8b5cf6" },
];

export default function AnalyticsPage() {
  return (
    <DashboardLayout title="Analytics" subtitle="Comprehensive performance insights">
      <div className="flex justify-end mb-4">
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-1" /> Export Report
        </Button>
      </div>

      <Tabs defaultValue="revenue">
        <TabsList className="mb-6">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Annual Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue breakdown for the current year</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, "Revenue"]} />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#rev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Revenue vs Wellness Sessions</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={false} name="Revenue" />
                    <Line yAxisId="right" type="monotone" dataKey="wellness" stroke="#10b981" strokeWidth={2} dot={false} name="Wellness" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Payment Methods</CardTitle></CardHeader>
              <CardContent className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={180}>
                  <PieChart>
                    <Pie data={paymentMethods} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                      {paymentMethods.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v}%`, "Share"]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {paymentMethods.map((p) => (
                    <div key={p.name} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="text-slate-600 dark:text-slate-300">{p.name}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-100 ml-auto">{p.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patients">
          <Card>
            <CardHeader><CardTitle>Patient & Appointment Trends</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="patients" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Patients" />
                  <Bar dataKey="appointments" fill="#10b981" radius={[4, 4, 0, 0]} name="Appointments" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff">
          <Card>
            <CardHeader><CardTitle>Staff Performance</CardTitle></CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    {["Doctor", "Patients Seen", "Rating", "Revenue Generated"].map((h) => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {staffPerformance.map((s, i) => (
                    <tr key={i} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="py-3 px-4 text-sm font-medium text-slate-800 dark:text-slate-100">{s.name}</td>
                      <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-300">{s.patients}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <span className="text-amber-500">★</span>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{s.rating}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-emerald-600">${s.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader><CardTitle>Payment Analytics</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
