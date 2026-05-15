"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Plus, Search, Clock, User } from "lucide-react";

const appointments = [
  { id: "A001", patient: "Sarah Johnson", doctor: "Dr. Ahmed Al-Rashid", dept: "Cardiology", date: "May 16", time: "09:00 AM", type: "Consultation", status: "confirmed", payment: "paid" },
  { id: "A002", patient: "Michael Chen", doctor: "Dr. Fatima Hassan", dept: "Neurology", date: "May 16", time: "10:30 AM", type: "Follow-up", status: "in-progress", payment: "insurance" },
  { id: "A003", patient: "Emma Williams", doctor: "Dr. Omar Khalid", dept: "Emergency", date: "May 16", time: "11:00 AM", type: "Emergency", status: "scheduled", payment: "pending" },
  { id: "A004", patient: "James Brown", doctor: "Dr. Layla Nasser", dept: "Orthopedics", date: "May 17", time: "02:00 PM", type: "Consultation", status: "scheduled", payment: "pending" },
  { id: "A005", patient: "Aisha Patel", doctor: "Dr. Yusuf Ibrahim", dept: "Dermatology", date: "May 17", time: "03:30 PM", type: "Consultation", status: "scheduled", payment: "paid" },
];

const statusColors: Record<string, "default" | "success" | "warning" | "destructive" | "secondary" | "cyan"> = {
  confirmed: "cyan", "in-progress": "warning", scheduled: "default", completed: "success", cancelled: "destructive",
};
const paymentColors: Record<string, "success" | "warning" | "default" | "secondary"> = {
  paid: "success", pending: "warning", insurance: "default", waived: "secondary",
};

export default function AppointmentsPage() {
  const [newOpen, setNewOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = appointments.filter(a =>
    a.patient.toLowerCase().includes(search.toLowerCase()) ||
    a.doctor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Appointments" subtitle="Schedule and manage appointments">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Input placeholder="Search appointments..." icon={<Search className="w-4 h-4" />} value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
        <Select>
          <SelectTrigger className="w-36"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => setNewOpen(true)} className="ml-auto">
          <Plus className="w-4 h-4" /> New Appointment
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                {["Patient", "Doctor", "Department", "Date & Time", "Type", "Status", "Payment"].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <motion.tr key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{a.patient}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-300">{a.doctor}</td>
                  <td className="py-3 px-4 text-sm text-slate-500">{a.dept}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-sm text-slate-700 dark:text-slate-200">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{a.date}</span>
                      <Clock className="w-3.5 h-3.5 text-slate-400 ml-1" />
                      <span>{a.time}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-500 capitalize">{a.type}</td>
                  <td className="py-3 px-4"><Badge variant={statusColors[a.status]} className="capitalize">{a.status}</Badge></td>
                  <td className="py-3 px-4"><Badge variant={paymentColors[a.payment]} className="capitalize">{a.payment}</Badge></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>New Appointment</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <Input placeholder="Patient Name" className="col-span-2" />
            <Select><SelectTrigger><SelectValue placeholder="Select Doctor" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ahmed">Dr. Ahmed Al-Rashid</SelectItem>
                <SelectItem value="fatima">Dr. Fatima Hassan</SelectItem>
                <SelectItem value="omar">Dr. Omar Khalid</SelectItem>
              </SelectContent>
            </Select>
            <Select><SelectTrigger><SelectValue placeholder="Department" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cardiology">Cardiology</SelectItem>
                <SelectItem value="neurology">Neurology</SelectItem>
                <SelectItem value="wellness">Wellness</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" />
            <Input type="time" />
            <Select><SelectTrigger className="col-span-2"><SelectValue placeholder="Appointment Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="consultation">Consultation</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="wellness">Wellness</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
            <div className="col-span-2 flex gap-2 justify-end mt-2">
              <Button variant="outline" onClick={() => setNewOpen(false)}>Cancel</Button>
              <Button onClick={() => setNewOpen(false)}>Create Appointment</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
