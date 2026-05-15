"use client";
import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Appointment } from "@/types";

const statusVariant: Record<string, "default" | "success" | "warning" | "destructive" | "secondary" | "cyan"> = {
  scheduled: "default",
  confirmed: "cyan",
  "in-progress": "warning",
  completed: "success",
  cancelled: "destructive",
  "no-show": "secondary",
};

const mockAppointments: Partial<Appointment>[] = [
  { id: "1", patientName: "Sarah Johnson", doctorName: "Dr. Ahmed Al-Rashid", department: "Cardiology", time: "09:00 AM", status: "confirmed", type: "consultation" },
  { id: "2", patientName: "Michael Chen", doctorName: "Dr. Fatima Hassan", department: "Neurology", time: "10:30 AM", status: "in-progress", type: "follow-up" },
  { id: "3", patientName: "Emma Williams", doctorName: "Dr. Omar Khalid", department: "Wellness", time: "11:00 AM", status: "scheduled", type: "wellness" },
  { id: "4", patientName: "James Brown", doctorName: "Dr. Layla Nasser", department: "Orthopedics", time: "02:00 PM", status: "completed", type: "consultation" },
  { id: "5", patientName: "Aisha Patel", doctorName: "Dr. Yusuf Ibrahim", department: "Dermatology", time: "03:30 PM", status: "scheduled", type: "consultation" },
];

export default function AppointmentTable({ appointments = mockAppointments }: { appointments?: Partial<Appointment>[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-800">
            {["Patient", "Doctor", "Department", "Time", "Type", "Status"].map((h) => (
              <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {appointments.map((apt, i) => (
            <motion.tr
              key={apt.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">{getInitials(apt.patientName || "")}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{apt.patientName}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-300">{apt.doctorName}</td>
              <td className="py-3 px-4 text-sm text-slate-500">{apt.department}</td>
              <td className="py-3 px-4 text-sm font-medium text-slate-700 dark:text-slate-200">{apt.time}</td>
              <td className="py-3 px-4">
                <span className="text-xs text-slate-500 capitalize">{apt.type}</span>
              </td>
              <td className="py-3 px-4">
                <Badge variant={statusVariant[apt.status || "scheduled"]} className="capitalize">
                  {apt.status}
                </Badge>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
