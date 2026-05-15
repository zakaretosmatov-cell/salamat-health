"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Plus, MoreHorizontal, UserCheck, UserX, Shield } from "lucide-react";
import { getInitials } from "@/lib/utils";

const mockUsers = [
  { id: "1", name: "Dr. Ahmed Al-Rashid", email: "ahmed@salamat.health", role: "doctor", department: "Cardiology", status: "active", joined: "Jan 2024" },
  { id: "2", name: "Sara Al-Mansouri", email: "sara@salamat.health", role: "receptionist", department: "Reception", status: "active", joined: "Mar 2024" },
  { id: "3", name: "Dr. Fatima Hassan", email: "fatima@salamat.health", role: "doctor", department: "Neurology", status: "active", joined: "Feb 2024" },
  { id: "4", name: "John Smith", email: "john@example.com", role: "patient", department: "—", status: "active", joined: "Apr 2024" },
  { id: "5", name: "Dr. Omar Khalid", email: "omar@salamat.health", role: "doctor", department: "Wellness", status: "inactive", joined: "Dec 2023" },
  { id: "6", name: "Maria Garcia", email: "maria@example.com", role: "patient", department: "—", status: "active", joined: "May 2024" },
];

const roleColors: Record<string, "default" | "success" | "warning" | "purple" | "secondary"> = {
  admin: "purple",
  doctor: "default",
  receptionist: "success",
  patient: "secondary",
};

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);

  const filtered = mockUsers.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <DashboardLayout title="User Management" subtitle="Manage all platform users and roles">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Input
          placeholder="Search users..."
          icon={<Search className="w-4 h-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="doctor">Doctor</SelectItem>
            <SelectItem value="receptionist">Receptionist</SelectItem>
            <SelectItem value="patient">Patient</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => setAddOpen(true)} className="ml-auto">
          <Plus className="w-4 h-4" /> Add User
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                {["User", "Role", "Department", "Status", "Joined", "Actions"].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9">
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={roleColors[user.role]} className="capitalize">{user.role}</Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-500">{user.department}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${user.status === "active" ? "bg-emerald-500" : "bg-slate-300"}`} />
                      <span className="text-xs text-slate-500 capitalize">{user.status}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-500">{user.joined}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon-sm" title="Toggle status">
                        {user.status === "active" ? <UserX className="w-4 h-4 text-slate-400" /> : <UserCheck className="w-4 h-4 text-slate-400" />}
                      </Button>
                      <Button variant="ghost" size="icon-sm" title="Manage permissions">
                        <Shield className="w-4 h-4 text-slate-400" />
                      </Button>
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontal className="w-4 h-4 text-slate-400" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <Input placeholder="Full Name" />
            <Input placeholder="Email Address" type="email" />
            <Select>
              <SelectTrigger><SelectValue placeholder="Select Role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="doctor">Doctor</SelectItem>
                <SelectItem value="receptionist">Receptionist</SelectItem>
                <SelectItem value="patient">Patient</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Temporary Password" type="password" />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button onClick={() => setAddOpen(false)}>Create User</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
