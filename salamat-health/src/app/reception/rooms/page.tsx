"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bed, Star, Wifi, Tv, Coffee, Wind, Bath, Crown, CheckCircle, X, Bell, Clock, User } from "lucide-react";
import { db } from "@/firebase/config";
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from "firebase/firestore";

type RoomCategory = "lux" | "econom" | "oddiy";
type RoomStatus = "bosh" | "band" | "bron";

interface Room {
  id: string;
  number: string;
  category: RoomCategory;
  floor: number;
  price: number;
  status: RoomStatus;
  patient?: string;
  amenities: string[];
  description: string;
}

interface BronRequest {
  id: string;
  patientName: string;
  patientId: string;
  roomNumber: string;
  roomCategory: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  price: number;
  payment: string;
  status: "kutilmoqda" | "tasdiqlandi" | "rad etildi";
  createdAt: { seconds: number } | null;
}

const staticRooms: Room[] = [
  { id: "1", number: "101", category: "lux", floor: 1, price: 500, status: "bosh", amenities: ["WiFi", "TV", "Konditsioner", "Hammom", "Mini-bar"], description: "Hashamatli lux xona" },
  { id: "2", number: "102", category: "lux", floor: 1, price: 500, status: "band", patient: "Sarah Johnson", amenities: ["WiFi", "TV", "Konditsioner", "Hammom", "Mini-bar"], description: "Lux xona, bog' manzarasi" },
  { id: "3", number: "201", category: "lux", floor: 2, price: 600, status: "bosh", amenities: ["WiFi", "TV", "Konditsioner", "Hammom", "Mini-bar", "Balkon"], description: "Premium lux xona" },
  { id: "4", number: "202", category: "lux", floor: 2, price: 600, status: "bron", patient: "Michael Chen", amenities: ["WiFi", "TV", "Konditsioner", "Hammom", "Mini-bar", "Balkon"], description: "Lux xona, panorama" },
  { id: "5", number: "103", category: "econom", floor: 1, price: 200, status: "bosh", amenities: ["WiFi", "TV", "Konditsioner"], description: "Qulay econom xona" },
  { id: "6", number: "104", category: "econom", floor: 1, price: 200, status: "band", patient: "Emma Williams", amenities: ["WiFi", "TV", "Konditsioner"], description: "Econom xona" },
  { id: "7", number: "203", category: "econom", floor: 2, price: 220, status: "bosh", amenities: ["WiFi", "TV", "Konditsioner", "Hammom"], description: "Econom, hammom bilan" },
  { id: "8", number: "301", category: "econom", floor: 3, price: 180, status: "bosh", amenities: ["WiFi", "TV"], description: "Arzon econom xona" },
  { id: "9", number: "105", category: "oddiy", floor: 1, price: 80, status: "bosh", amenities: ["WiFi"], description: "Oddiy xona" },
  { id: "10", number: "106", category: "oddiy", floor: 1, price: 80, status: "band", patient: "Aisha Patel", amenities: ["WiFi"], description: "Oddiy xona" },
  { id: "11", number: "205", category: "oddiy", floor: 2, price: 90, status: "bosh", amenities: ["WiFi", "TV"], description: "Oddiy xona, TV bilan" },
  { id: "12", number: "206", category: "oddiy", floor: 2, price: 90, status: "bron", patient: "Carlos Rodriguez", amenities: ["WiFi", "TV"], description: "Oddiy xona" },
];

const categoryConfig = {
  lux: { label: "Lux", color: "from-amber-400 to-yellow-500", bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-200 dark:border-amber-800", badge: "warning" as const, icon: Crown },
  econom: { label: "Econom", color: "from-blue-400 to-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-200 dark:border-blue-800", badge: "default" as const, icon: Star },
  oddiy: { label: "Oddiy", color: "from-slate-400 to-slate-500", bg: "bg-slate-50 dark:bg-slate-800/50", border: "border-slate-200 dark:border-slate-700", badge: "secondary" as const, icon: Bed },
};

const statusConfig = {
  bosh: { label: "Bo'sh", badge: "success" as const, dot: "bg-emerald-500" },
  band: { label: "Band", badge: "destructive" as const, dot: "bg-red-500" },
  bron: { label: "Bron", badge: "warning" as const, dot: "bg-amber-500" },
};

const amenityIcons: Record<string, React.ElementType> = {
  WiFi: Wifi, TV: Tv, Konditsioner: Wind, Hammom: Bath, "Mini-bar": Coffee, Balkon: Star,
};

export default function ReceptionRoomsPage() {
  const [filter, setFilter] = useState<"all" | RoomCategory>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | RoomStatus>("all");
  const [rooms, setRooms] = useState(staticRooms);
  const [bronRequests, setBronRequests] = useState<BronRequest[]>([]);

  // Firestore dan bron so'rovlarini real-time kuzatish
  useEffect(() => {
    const q = query(collection(db, "room_bookings"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setBronRequests(snap.docs.map(d => ({ id: d.id, ...d.data() } as BronRequest)));
    });
    return () => unsub();
  }, []);

  const pendingCount = bronRequests.filter(b => b.status === "kutilmoqda").length;

  const handleApprove = async (bron: BronRequest) => {
    await updateDoc(doc(db, "room_bookings", bron.id), { status: "tasdiqlandi" });
    setRooms(prev => prev.map(r =>
      r.number === bron.roomNumber ? { ...r, status: "bron" as RoomStatus, patient: bron.patientName } : r
    ));
  };

  const handleReject = async (id: string) => {
    await updateDoc(doc(db, "room_bookings", id), { status: "rad etildi" });
  };

  const filtered = rooms.filter(r => {
    const matchCat = filter === "all" || r.category === filter;
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchCat && matchStatus;
  });

  const stats = {
    bosh: rooms.filter(r => r.status === "bosh").length,
    band: rooms.filter(r => r.status === "band").length,
    bron: rooms.filter(r => r.status === "bron").length,
  };

  return (
    <DashboardLayout title="Honalar" subtitle="Honalarni boshqarish va bron so'rovlari">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Bo'sh", count: stats.bosh, color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700", dot: "bg-emerald-500" },
          { label: "Band", count: stats.band, color: "bg-red-50 dark:bg-red-900/20 text-red-700", dot: "bg-red-500" },
          { label: "Bron", count: stats.bron, color: "bg-amber-50 dark:bg-amber-900/20 text-amber-700", dot: "bg-amber-500" },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 flex items-center gap-3`}>
            <div className={`w-3 h-3 rounded-full ${s.dot}`} />
            <div>
              <p className="text-2xl font-bold">{s.count}</p>
              <p className="text-sm font-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="honalar">
        <TabsList className="mb-4">
          <TabsTrigger value="honalar">Honalar</TabsTrigger>
          <TabsTrigger value="bronlar" className="relative">
            Bron so'rovlari
            {pendingCount > 0 && (
              <span className="ml-2 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {pendingCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* HONALAR TAB */}
        <TabsContent value="honalar">
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex gap-2">
              {(["all", "lux", "econom", "oddiy"] as const).map(cat => (
                <button key={cat} onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === cat ? "bg-blue-600 text-white shadow-md" : "bg-white dark:bg-slate-800 text-slate-600 border border-slate-200 dark:border-slate-700"}`}>
                  {cat === "all" ? "Barchasi" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as "all" | RoomStatus)}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha holat</SelectItem>
                <SelectItem value="bosh">Bo'sh</SelectItem>
                <SelectItem value="band">Band</SelectItem>
                <SelectItem value="bron">Bron</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            <AnimatePresence>
              {filtered.map((room, i) => {
                const cat = categoryConfig[room.category];
                const status = statusConfig[room.status];
                const CatIcon = cat.icon;
                return (
                  <motion.div key={room.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }} whileHover={{ scale: 1.03 }}>
                    <div className={`border-2 rounded-2xl p-3 cursor-pointer transition-all ${cat.border} ${cat.bg}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">#{room.number}</span>
                        <div className={`w-2 h-2 rounded-full ${status.dot}`} />
                      </div>
                      <CatIcon className={`w-6 h-6 mb-1.5 ${room.category === "lux" ? "text-amber-500" : room.category === "econom" ? "text-blue-500" : "text-slate-500"}`} />
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-300">{cat.label}</p>
                      <p className="text-xs text-slate-400">{room.floor}-qavat</p>
                      <Badge variant={status.badge} className="text-[10px] mt-1.5">{status.label}</Badge>
                      {room.patient && <p className="text-[10px] text-slate-500 mt-1 truncate">{room.patient}</p>}
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">${room.price}/kun</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </TabsContent>

        {/* BRON SO'ROVLARI TAB */}
        <TabsContent value="bronlar">
          <div className="space-y-3">
            {bronRequests.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>Hozircha bron so'rovlari yo'q</p>
              </div>
            ) : (
              bronRequests.map((bron, i) => (
                <motion.div key={bron.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className={`border-l-4 ${bron.status === "kutilmoqda" ? "border-l-amber-500" : bron.status === "tasdiqlandi" ? "border-l-emerald-500" : "border-l-red-500"}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="font-semibold text-slate-800 dark:text-slate-100">{bron.patientName}</p>
                              <Badge variant={bron.status === "kutilmoqda" ? "warning" : bron.status === "tasdiqlandi" ? "success" : "destructive"} className="text-[10px]">
                                {bron.status === "kutilmoqda" ? "Kutilmoqda" : bron.status === "tasdiqlandi" ? "Tasdiqlandi" : "Rad etildi"}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                              <span className="font-medium">{bron.roomCategory} #{bron.roomNumber}</span>
                            </p>
                            <div className="flex flex-wrap gap-3 text-xs text-slate-400 mt-1">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{bron.checkIn} → {bron.checkOut}</span>
                              <span>{bron.nights} kun</span>
                              <span className="font-semibold text-slate-600 dark:text-slate-300">${bron.totalPrice} jami</span>
                              <span>{bron.payment}</span>
                            </div>
                          </div>
                        </div>

                        {bron.status === "kutilmoqda" && (
                          <div className="flex gap-2 flex-shrink-0">
                            <Button size="sm" variant="success" onClick={() => handleApprove(bron)}>
                              <CheckCircle className="w-3.5 h-3.5" /> Tasdiqlash
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleReject(bron.id)}>
                              <X className="w-3.5 h-3.5" /> Rad etish
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
