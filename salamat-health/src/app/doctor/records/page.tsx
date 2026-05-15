"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Plus, FileText, Paperclip, Eye } from "lucide-react";

const records = [
  { id: "R001", patient: "Sarah Johnson", date: "May 16, 2026", diagnosis: "Hypertension Stage 1", treatment: "Lisinopril 10mg, lifestyle changes", followUp: "Jun 1, 2026", attachments: 2 },
  { id: "R002", patient: "Michael Chen", date: "May 15, 2026", diagnosis: "Type 2 Diabetes", treatment: "Metformin 500mg, diet plan", followUp: "May 30, 2026", attachments: 1 },
  { id: "R003", patient: "Emma Williams", date: "May 14, 2026", diagnosis: "Acute Appendicitis", treatment: "Surgical referral, antibiotics", followUp: "May 20, 2026", attachments: 3 },
  { id: "R004", patient: "James Brown", date: "May 10, 2026", diagnosis: "Post-op Recovery", treatment: "Physical therapy, pain management", followUp: "May 25, 2026", attachments: 1 },
];

export default function RecordsPage() {
  const [search, setSearch] = useState("");
  const [newOpen, setNewOpen] = useState(false);
  const [viewRecord, setViewRecord] = useState<typeof records[0] | null>(null);

  return (
    <DashboardLayout title="Medical Records" subtitle="Patient treatment notes and history">
      <div className="flex gap-3 mb-6">
        <Input placeholder="Search records..." icon={<Search className="w-4 h-4" />} value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
        <Button onClick={() => setNewOpen(true)} className="ml-auto">
          <Plus className="w-4 h-4" /> New Record
        </Button>
      </div>

      <div className="space-y-3">
        {records.filter(r => r.patient.toLowerCase().includes(search.toLowerCase())).map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-slate-900 dark:text-white">{r.patient}</p>
                        <span className="text-xs text-slate-400">{r.date}</span>
                      </div>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{r.diagnosis}</p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{r.treatment}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                        <span>Follow-up: {r.followUp}</span>
                        {r.attachments > 0 && (
                          <span className="flex items-center gap-1"><Paperclip className="w-3 h-3" />{r.attachments} files</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setViewRecord(r)}>
                    <Eye className="w-3.5 h-3.5" /> View
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* View Record Dialog */}
      <Dialog open={!!viewRecord} onOpenChange={() => setViewRecord(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Medical Record — {viewRecord?.patient}</DialogTitle></DialogHeader>
          {viewRecord && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-1">Date</p>
                  <p className="font-medium text-slate-800 dark:text-slate-100">{viewRecord.date}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-1">Follow-up</p>
                  <p className="font-medium text-slate-800 dark:text-slate-100">{viewRecord.followUp}</p>
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3">
                <p className="text-xs text-blue-500 mb-1 font-medium">Diagnosis</p>
                <p className="text-sm text-slate-800 dark:text-slate-100">{viewRecord.diagnosis}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                <p className="text-xs text-slate-400 mb-1 font-medium">Treatment Plan</p>
                <p className="text-sm text-slate-700 dark:text-slate-200">{viewRecord.treatment}</p>
              </div>
              <Button variant="outline" className="w-full">
                <Paperclip className="w-4 h-4" /> View {viewRecord.attachments} Attachments
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Record Dialog */}
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>New Medical Record</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <Input placeholder="Patient Name" />
            <Input placeholder="Diagnosis" />
            <textarea className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} placeholder="Treatment plan..." />
            <Input placeholder="Prescription (optional)" />
            <Input type="date" placeholder="Follow-up date" />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setNewOpen(false)}>Cancel</Button>
              <Button onClick={() => setNewOpen(false)}>Save Record</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
