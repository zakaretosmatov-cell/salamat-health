"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Search, Download, TrendingUp, CreditCard, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const payments = [
  { id: "PAY001", patient: "Sarah Johnson", amount: 250, method: "card", status: "completed", date: "May 16", desc: "Cardiology Consultation" },
  { id: "PAY002", patient: "Michael Chen", amount: 180, method: "insurance", status: "completed", date: "May 16", desc: "Neurology Follow-up" },
  { id: "PAY003", patient: "Emma Williams", amount: 500, method: "cash", status: "pending", date: "May 16", desc: "Emergency Treatment" },
  { id: "PAY004", patient: "James Brown", amount: 320, method: "card", status: "completed", date: "May 15", desc: "Orthopedic Consultation" },
  { id: "PAY005", patient: "Aisha Patel", amount: 120, method: "online", status: "completed", date: "May 15", desc: "Wellness Session" },
  { id: "PAY006", patient: "Carlos Rodriguez", amount: 95, method: "insurance", status: "refunded", date: "May 14", desc: "Dermatology Check" },
];

const methodColors: Record<string, "default" | "success" | "warning" | "cyan" | "purple"> = {
  card: "default", insurance: "cyan", cash: "warning", online: "success",
};
const statusColors: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  completed: "success", pending: "warning", refunded: "destructive", failed: "secondary",
};

export default function BillingPage() {
  const [search, setSearch] = useState("");
  const total = payments.filter(p => p.status === "completed").reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter(p => p.status === "pending").reduce((s, p) => s + p.amount, 0);

  return (
    <DashboardLayout title="Billing & Payments" subtitle="Track revenue and payment records">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Collected", value: formatCurrency(total), icon: DollarSign, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" },
          { label: "Pending", value: formatCurrency(pending), icon: Clock, color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20" },
          { label: "This Month", value: formatCurrency(91200), icon: TrendingUp, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 flex items-center gap-3`}>
            <s.icon className="w-8 h-8" />
            <div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm font-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-4">
        <Input placeholder="Search payments..." icon={<Search className="w-4 h-4" />} value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
        <Select>
          <SelectTrigger className="w-36"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="ml-auto">
          <Download className="w-4 h-4 mr-1" /> Export
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                {["ID", "Patient", "Description", "Amount", "Method", "Status", "Date"].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.filter(p => p.patient.toLowerCase().includes(search.toLowerCase())).map((p, i) => (
                <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 text-xs font-mono text-slate-400">{p.id}</td>
                  <td className="py-3 px-4 text-sm font-medium text-slate-800 dark:text-slate-100">{p.patient}</td>
                  <td className="py-3 px-4 text-sm text-slate-500">{p.desc}</td>
                  <td className="py-3 px-4 text-sm font-bold text-slate-800 dark:text-slate-100">{formatCurrency(p.amount)}</td>
                  <td className="py-3 px-4"><Badge variant={methodColors[p.method]} className="capitalize flex items-center gap-1"><CreditCard className="w-3 h-3" />{p.method}</Badge></td>
                  <td className="py-3 px-4"><Badge variant={statusColors[p.status]} className="capitalize">{p.status}</Badge></td>
                  <td className="py-3 px-4 text-sm text-slate-500">{p.date}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
