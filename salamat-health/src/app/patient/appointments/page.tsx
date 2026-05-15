"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, MapPin, Video, Plus, X } from "lucide-react";

const appointments = [
  { id: "A1", doctor: "Dr. Ahmed Al-Rashid", specialty: "Cardiology", date: "May 20, 2026", time: "10:00 AM", type: "in-person", status: "upcoming", room: "101" },
  { id: "A2", doctor: "Dr. Fatima Hassan", specialty: "Wellness", date: "May 25, 2026", time: "02:30 PM", type: "video", status: "upcoming", room: "Online" },
  { id: "A3", doctor: "Dr. Ahmed Al-Rashid", specialty: "Cardiology", date: "Apr 15, 2026", time: "09:00 AM", type: "in-person", status: "completed", room: "101" },
  { id: "A4", doctor: "Dr. Omar Khalid", specialty: "Orthopedics", date: "Mar 10, 2026", time: "11:30 AM", type: "in-person", status: "completed", room: "205" },
];

export default function PatientAppointmentsPage() {
  const [bookOpen, setBookOpen] = useState(false);
  const upcoming = appointments.filter(a => a.status === "upcoming");
  const past = appointments.filter(a => a.status === "completed");

  return (
    <DashboardLayout title="My Appointments" subtitle="Manage your healthcare visits">
      <div className="flex justify-end mb-6">
        <Button onClick={() => setBookOpen(true)}>
          <Plus className="w-4 h-4" /> Book Appointment
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Upcoming</h2>
          <div className="space-y-3">
            {upcoming.map((a, i) => (
              <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-slate-900 dark:text-white">{a.doctor}</p>
                          <Badge variant="default" className="text-[10px]">{a.specialty}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-slate-500 mt-2">
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{a.date}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{a.time}</span>
                          <span className="flex items-center gap-1">
                            {a.type === "video" ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                            {a.room}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {a.type === "video" && <Button size="sm"><Video className="w-3.5 h-3.5" /> Join</Button>}
                        <Button variant="outline" size="sm">Reschedule</Button>
                        <Button variant="ghost" size="icon-sm"><X className="w-4 h-4 text-red-400" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Past Visits</h2>
          <div className="space-y-3">
            {past.map((a, i) => (
              <Card key={a.id} className="opacity-70">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-200">{a.doctor}</p>
                      <div className="flex gap-3 text-xs text-slate-400 mt-1">
                        <span>{a.date}</span>
                        <span>{a.time}</span>
                        <span>{a.specialty}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="success">Completed</Badge>
                      <Button variant="outline" size="sm">View Summary</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={bookOpen} onOpenChange={setBookOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Book New Appointment</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <Select><SelectTrigger><SelectValue placeholder="Select Department" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cardiology">Cardiology</SelectItem>
                <SelectItem value="neurology">Neurology</SelectItem>
                <SelectItem value="wellness">Wellness & Spa</SelectItem>
                <SelectItem value="orthopedics">Orthopedics</SelectItem>
              </SelectContent>
            </Select>
            <Select><SelectTrigger><SelectValue placeholder="Select Doctor" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ahmed">Dr. Ahmed Al-Rashid</SelectItem>
                <SelectItem value="fatima">Dr. Fatima Hassan</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" />
            <Select><SelectTrigger><SelectValue placeholder="Preferred Time" /></SelectTrigger>
              <SelectContent>
                {["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"].map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select><SelectTrigger><SelectValue placeholder="Visit Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="in-person">In-Person</SelectItem>
                <SelectItem value="video">Video Consultation</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2 justify-end mt-2">
              <Button variant="outline" onClick={() => setBookOpen(false)}>Cancel</Button>
              <Button onClick={() => setBookOpen(false)}>Confirm Booking</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
