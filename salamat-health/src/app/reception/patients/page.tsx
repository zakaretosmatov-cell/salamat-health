"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Filter, UserPlus, Eye, Edit, AlertTriangle } from "lucide-react";
import { getInitials } from "@/lib/utils";

const patients = [
  { id: "P001", name: "Sarah Johnson", age: 34, gender: "Female", phone: "+1 555-0101", bloodType: "A+", lastVisit: "Today", status: "active", condition: "Hypertension" },
  { id: "P002", name: "Michael Chen", age: 45, gender: "Male", phone: "+1 555-0102", bloodType: "O+", lastVisit: "Yesterday", status: "active", condition: "Diabetes Type 2" },
  { id: "P003", name: "Emma Williams", age: 28, gender: "Female", phone: "+1 555-0103", bloodType: "B+", lastVisit: "2 days ago", status: "emergency", condition: "Acute Appendicitis" },
  { id: "P004", name: "James Brown", age: 52, gender: "Male", phone: "+1 555-0104", bloodType: "AB-", lastVisit: "1 week ago", status: "active", condition: "Knee Replacement" },
  { id: "P005", name: "Aisha Patel", age: 31, gender: "Female", phone: "+1 555-0105", bloodType: "O-", lastVisit: "3 days ago", status: "active", condition: "Wellness Check" },
  { id: "P006", name: "Carlos Rodriguez", age: 67, gender: "Male", phone: "+1 555-0106", bloodType: "A-", lastVisit: "2 weeks ago", status: "inactive", condition: "Arthritis" },
];

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Patients" subtitle="Search and manage patient records">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Input
          placeholder="Search by name or ID..."
          icon={<Search className="w-4 h-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-1" /> Filter
        </Button>
        <Button className="ml-auto">
          <UserPlus className="w-4 h-4" /> New Patient
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -2 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="text-base">{getInitials(p.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-slate-900 dark:text-white truncate">{p.name}</p>
                      {p.status === "emergency" && (
                        <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{p.id} · {p.age}y · {p.gender}</p>
                  </div>
                  <Badge
                    variant={p.status === "emergency" ? "destructive" : p.status === "active" ? "success" : "secondary"}
                    className="capitalize flex-shrink-0"
                  >
                    {p.status}
                  </Badge>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2">
                    <p className="text-slate-400">Blood Type</p>
                    <p className="font-semibold text-slate-700 dark:text-slate-200">{p.bloodType}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2">
                    <p className="text-slate-400">Last Visit</p>
                    <p className="font-semibold text-slate-700 dark:text-slate-200">{p.lastVisit}</p>
                  </div>
                </div>

                <div className="mt-2 px-2 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium truncate">{p.condition}</p>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-3.5 h-3.5" /> View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
}
