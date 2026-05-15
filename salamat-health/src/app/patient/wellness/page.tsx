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
import { Heart, Waves, Wind, Dumbbell, Brain, Leaf, Star, Clock, Calendar } from "lucide-react";

const services = [
  { id: "1", name: "Deep Tissue Massage", icon: Heart, duration: "60 min", price: 120, rating: 4.9, available: true, color: "from-rose-400 to-pink-500", desc: "Therapeutic massage targeting deep muscle layers" },
  { id: "2", name: "Hydrotherapy", icon: Waves, duration: "45 min", price: 95, rating: 4.8, available: true, color: "from-blue-400 to-cyan-500", desc: "Water-based therapy for relaxation and recovery" },
  { id: "3", name: "Meditation Session", icon: Wind, duration: "30 min", price: 60, rating: 4.9, available: true, color: "from-violet-400 to-purple-500", desc: "Guided mindfulness and breathing exercises" },
  { id: "4", name: "Physiotherapy", icon: Dumbbell, duration: "50 min", price: 110, rating: 4.7, available: false, color: "from-emerald-400 to-teal-500", desc: "Targeted physical rehabilitation exercises" },
  { id: "5", name: "Counseling", icon: Brain, duration: "60 min", price: 130, rating: 4.9, available: true, color: "from-amber-400 to-orange-500", desc: "Professional mental health support sessions" },
  { id: "6", name: "Yoga Therapy", icon: Leaf, duration: "45 min", price: 80, rating: 4.8, available: true, color: "from-green-400 to-emerald-500", desc: "Therapeutic yoga for mind-body balance" },
];

const mySessions = [
  { service: "Deep Tissue Massage", date: "May 25", time: "02:00 PM", therapist: "Maria Santos", status: "upcoming" },
  { service: "Meditation Session", date: "Apr 20", time: "10:00 AM", therapist: "Zen Master Ali", status: "completed" },
];

export default function WellnessPage() {
  const [bookOpen, setBookOpen] = useState(false);
  const [selected, setSelected] = useState<typeof services[0] | null>(null);

  return (
    <DashboardLayout title="Wellness Center" subtitle="Book relaxation and recovery sessions">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {services.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} whileHover={{ y: -3 }}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`bg-gradient-to-br ${s.color} p-5 text-white`}>
                <s.icon className="w-8 h-8 mb-2" />
                <h3 className="font-bold text-lg">{s.name}</h3>
                <p className="text-white/80 text-sm mt-1">{s.desc}</p>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{s.duration}</span>
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />{s.rating}</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">${s.price}</span>
                </div>
                <Button
                  className="w-full"
                  variant={s.available ? "default" : "secondary"}
                  disabled={!s.available}
                  onClick={() => { setSelected(s); setBookOpen(true); }}
                >
                  {s.available ? "Book Session" : "Unavailable"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>My Sessions</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {mySessions.map((s, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-100 text-sm">{s.service}</p>
                <div className="flex gap-3 text-xs text-slate-400 mt-0.5">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{s.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{s.time}</span>
                  <span>{s.therapist}</span>
                </div>
              </div>
              <Badge variant={s.status === "upcoming" ? "default" : "success"} className="capitalize">{s.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={bookOpen} onOpenChange={setBookOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Book {selected?.name}</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-sm">
              <p className="font-medium text-slate-700 dark:text-slate-200">{selected?.name}</p>
              <p className="text-slate-500">{selected?.duration} · ${selected?.price}</p>
            </div>
            <Input type="date" />
            <Select><SelectTrigger><SelectValue placeholder="Preferred Time" /></SelectTrigger>
              <SelectContent>
                {["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"].map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select><SelectTrigger><SelectValue placeholder="Select Therapist" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="maria">Maria Santos</SelectItem>
                <SelectItem value="ali">Zen Master Ali</SelectItem>
                <SelectItem value="any">Any Available</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2 justify-end mt-2">
              <Button variant="outline" onClick={() => setBookOpen(false)}>Cancel</Button>
              <Button onClick={() => setBookOpen(false)}>Confirm & Pay</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
