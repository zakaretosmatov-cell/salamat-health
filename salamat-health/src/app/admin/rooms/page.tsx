"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bed, User, Wrench, Lock } from "lucide-react";

const rooms = [
  { id: "101", type: "consultation", floor: 1, status: "occupied", patient: "Sarah Johnson", doctor: "Dr. Ahmed" },
  { id: "102", type: "consultation", floor: 1, status: "available", patient: null, doctor: null },
  { id: "103", type: "treatment", floor: 1, status: "maintenance", patient: null, doctor: null },
  { id: "201", type: "wellness", floor: 2, status: "occupied", patient: "Michael Chen", doctor: "Dr. Fatima" },
  { id: "202", type: "wellness", floor: 2, status: "available", patient: null, doctor: null },
  { id: "203", type: "recovery", floor: 2, status: "reserved", patient: "Emma Williams", doctor: null },
  { id: "ER-1", type: "emergency", floor: 1, status: "occupied", patient: "James Brown", doctor: "Dr. Omar" },
  { id: "ER-2", type: "emergency", floor: 1, status: "available", patient: null, doctor: null },
  { id: "301", type: "consultation", floor: 3, status: "available", patient: null, doctor: null },
  { id: "302", type: "treatment", floor: 3, status: "occupied", patient: "Aisha Patel", doctor: "Dr. Layla" },
  { id: "303", type: "wellness", floor: 3, status: "available", patient: null, doctor: null },
  { id: "304", type: "recovery", floor: 3, status: "maintenance", patient: null, doctor: null },
];

const statusConfig = {
  available: { color: "bg-emerald-100 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800", badge: "success" as const, icon: null },
  occupied: { color: "bg-blue-100 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800", badge: "default" as const, icon: User },
  maintenance: { color: "bg-amber-100 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800", badge: "warning" as const, icon: Wrench },
  reserved: { color: "bg-violet-100 border-violet-200 dark:bg-violet-900/20 dark:border-violet-800", badge: "purple" as const, icon: Lock },
};

const typeColors: Record<string, string> = {
  consultation: "text-blue-600", treatment: "text-emerald-600", wellness: "text-violet-600",
  recovery: "text-amber-600", emergency: "text-red-600",
};

export default function RoomsPage() {
  const [filter, setFilter] = useState("all");
  const filtered = rooms.filter(r => filter === "all" || r.status === filter || r.type === filter);
  const stats = { available: rooms.filter(r => r.status === "available").length, occupied: rooms.filter(r => r.status === "occupied").length, maintenance: rooms.filter(r => r.status === "maintenance").length };

  return (
    <DashboardLayout title="Room Management" subtitle="Monitor and manage all facility rooms">
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Available", count: stats.available, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" },
          { label: "Occupied", count: stats.occupied, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
          { label: "Maintenance", count: stats.maintenance, color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20" },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 text-center`}>
            <p className="text-3xl font-bold">{s.count}</p>
            <p className="text-sm font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Rooms</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="occupied">Occupied</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="consultation">Consultation</SelectItem>
            <SelectItem value="wellness">Wellness</SelectItem>
            <SelectItem value="emergency">Emergency</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {filtered.map((room, i) => {
          const config = statusConfig[room.status as keyof typeof statusConfig];
          const StatusIcon = config.icon;
          return (
            <motion.div key={room.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }} whileHover={{ scale: 1.03 }}>
              <div className={`border-2 rounded-2xl p-3 cursor-pointer transition-all ${config.color}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">#{room.id}</span>
                  {StatusIcon && <StatusIcon className="w-3.5 h-3.5 text-slate-500" />}
                </div>
                <Bed className={`w-6 h-6 mb-1.5 ${typeColors[room.type]}`} />
                <p className={`text-xs font-medium capitalize ${typeColors[room.type]}`}>{room.type}</p>
                <Badge variant={config.badge} className="text-[10px] mt-1.5 capitalize">{room.status}</Badge>
                {room.patient && <p className="text-[10px] text-slate-500 mt-1 truncate">{room.patient}</p>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
