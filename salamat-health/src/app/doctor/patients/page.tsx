"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, FileText, MessageSquare, Video, ChevronRight } from "lucide-react";
import { getInitials } from "@/lib/utils";

const myPatients = [
  { id: "P001", name: "Sarah Johnson", age: 34, condition: "Hypertension", lastVisit: "Today", nextVisit: "Jun 1", status: "stable", visits: 12 },
  { id: "P002", name: "Michael Chen", age: 45, condition: "Diabetes Type 2", lastVisit: "Yesterday", nextVisit: "May 30", status: "monitoring", visits: 8 },
  { id: "P003", name: "Emma Williams", age: 28, condition: "Acute Appendicitis", lastVisit: "Today", nextVisit: "May 20", status: "critical", visits: 3 },
  { id: "P004", name: "James Brown", age: 52, condition: "Post-surgery Recovery", lastVisit: "1 week ago", nextVisit: "May 25", status: "recovering", visits: 6 },
  { id: "P005", name: "Aisha Patel", age: 31, condition: "Cardiac Arrhythmia", lastVisit: "3 days ago", nextVisit: "Jun 5", status: "stable", visits: 15 },
];

const statusColors: Record<string, "success" | "warning" | "destructive" | "default"> = {
  stable: "success", monitoring: "warning", critical: "destructive", recovering: "default",
};

export default function DoctorPatientsPage() {
  const [search, setSearch] = useState("");
  const filtered = myPatients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout title="My Patients" subtitle="Manage your patient list">
      <div className="flex gap-3 mb-6">
        <Input placeholder="Search patients..." icon={<Search className="w-4 h-4" />} value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
      </div>

      <div className="space-y-3">
        {filtered.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="text-base">{getInitials(p.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-slate-900 dark:text-white">{p.name}</p>
                      <span className="text-xs text-slate-400">{p.age}y</span>
                      <Badge variant={statusColors[p.status]} className="capitalize text-[10px]">{p.status}</Badge>
                    </div>
                    <p className="text-sm text-slate-500">{p.condition}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                      <span>Last: {p.lastVisit}</span>
                      <span>Next: {p.nextVisit}</span>
                      <span>{p.visits} total visits</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon-sm" title="View Records"><FileText className="w-4 h-4 text-slate-400" /></Button>
                    <Button variant="ghost" size="icon-sm" title="Message"><MessageSquare className="w-4 h-4 text-slate-400" /></Button>
                    <Button variant="ghost" size="icon-sm" title="Video Call"><Video className="w-4 h-4 text-slate-400" /></Button>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
}
