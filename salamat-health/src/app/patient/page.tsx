"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bed, Crown, Star, Wifi, Tv, Wind, Bath, Coffee, CheckCircle, Send, Clock, Calendar, Bell, ChevronRight } from "lucide-react";
import { db } from "@/firebase/config";
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from "firebase/firestore";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

type RoomCategory = "lux" | "econom" | "oddiy";

interface Room {
  id: string;
  number: string;
  category: RoomCategory;
  floor: number;
  price: number;
  amenities: string[];
  description: string;
}

interface BronRequest {
  id: string;
  roomNumber: string;
  roomCategory: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  price: number;
  payment: string;
  status: "kutilmoqda" | "tasdiqlandi" | "rad etildi";
}

const rooms: Room[] = [
  { id: "1", number: "101", category: "lux", floor: 1, price: 500, amenities: ["WiFi", "TV", "Konditsioner", "Hammom", "Mini-bar"], description: "Hashamatli lux xona, shahar manzarasi" },
  { id: "2", number: "201", category: "lux", floor: 2, price: 600, amenities: ["WiFi", "TV", "Konditsioner", "Hammom", "Mini-bar", "Balkon"], description: "Premium lux xona, balkon bilan" },
  { id: "3", number: "103", category: "econom", floor: 1, price: 200, amenities: ["WiFi", "TV", "Konditsioner"], description: "Qulay econom xona" },
  { id: "4", number: "203", category: "econom", floor: 2, price: 220, amenities: ["WiFi", "TV", "Konditsioner", "Hammom"], description: "Econom xona, hammom bilan" },
  { id: "5", number: "105", category: "oddiy", floor: 1, price: 80, amenities: ["WiFi"], description: "Oddiy xona, asosiy qulayliklar" },
  { id: "6", number: "205", category: "oddiy", floor: 2, price: 90, amenities: ["WiFi", "TV"], description: "Oddiy xona, TV bilan" },
];

const categoryConfig = {
  lux: { label: "Lux", gradient: "from-amber-400 to-yellow-500", bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-200 dark:border-amber-800", icon: Crown, stars: 5 },
  econom: { label: "Econom", gradient: "from-blue-400 to-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-200 dark:border-blue-800", icon: Star, stars: 3 },
  oddiy: { label: "Oddiy", gradient: "from-slate-400 to-slate-500", bg: "bg-slate-50 dark:bg-slate-800", border: "border-slate-200 dark:border-slate-700", icon: Bed, stars: 1 },
};

const amenityIcons: Record<string, React.ElementType> = {
  WiFi: Wifi, TV: Tv, Konditsioner: Wind, Hammom: Bath, "Mini-bar": Coffee, Balkon: Star,
};

const statusConfig = {
  kutilmoqda: { label: "Kutilmoqda", badge: "warning" as const },
  tasdiqlandi: { label: "Tasdiqlandi", badge: "success" as const },
  "rad etildi": { label: "Rad etildi", badge: "destructive" as const },
};

export default function PatientDashboard() {
  const { user, userName } = useAuthStore();
  const [filter, setFilter] = useState<"all" | RoomCategory>("all");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bronOpen, setBronOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [payment, setPayment] = useState("");
  const [myBrons, setMyBrons] = useState<BronRequest[]>([]);

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(collection(db, "room_bookings"), where("patientId", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      setMyBrons(snap.docs.map(d => ({ id: d.id, ...d.data() } as BronRequest)));
    });
    return () => unsub();
  }, [user?.uid]);

  const filtered = rooms.filter(r => filter === "all" || r.category === filter);

  const nights = checkIn && checkOut
    ? Math.max(0, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const handleSubmit = async () => {
    if (!selectedRoom || !checkIn || !checkOut || !payment || !user) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "room_bookings"), {
        patientId: user.uid,
        patientName: userName || "Noma'lum",
        roomId: selectedRoom.id,
        roomNumber: selectedRoom.number,
        roomCategory: selectedRoom.category,
        floor: selectedRoom.floor,
        price: selectedRoom.price,
        totalPrice: nights * selectedRoom.price,
        nights,
        checkIn,
        checkOut,
        payment,
        status: "kutilmoqda",
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
      setTimeout(() => {
        setBronOpen(false);
        setSuccess(false);
        setCheckIn(""); setCheckOut(""); setPayment("");
      }, 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Mening sahifam" subtitle={`Xush kelibsiz, ${userName || "Mehmon"}`}>

      {/* Xush kelibsiz banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-2xl p-6 mb-6 text-white relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10">
          <p className="text-blue-100 text-sm mb-1">Salamat Health</p>
          <h2 className="text-2xl font-bold mb-1">Xush kelibsiz! 👋</h2>
          <p className="text-blue-100 text-sm">Hona bron qiling yoki uchrashuvlaringizni ko'ring</p>
        </div>
      </motion.div>

      {/* Tezkor havolalar */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link href="/patient/rooms">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-amber-400 to-yellow-500 text-white rounded-2xl p-4 flex items-center gap-3 shadow-sm cursor-pointer">
            <Bed className="w-7 h-7" />
            <div>
              <p className="font-semibold">Hona bron</p>
              <p className="text-xs text-white/80">Lux, Econom, Oddiy</p>
            </div>
          </motion.div>
        </Link>
        <Link href="/patient/appointments">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-4 flex items-center gap-3 shadow-sm cursor-pointer">
            <Calendar className="w-7 h-7" />
            <div>
              <p className="font-semibold">Uchrashuvlar</p>
              <p className="text-xs text-white/80">Jadval ko'rish</p>
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Mening bronlarim */}
      {myBrons.length > 0 && (
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" /> Bron so'rovlarim
            </CardTitle>
            <Link href="/patient/rooms">
              <Button variant="ghost" size="sm">Barchasi <ChevronRight className="w-4 h-4" /></Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {myBrons.slice(0, 3).map((b, i) => (
              <motion.div key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <Bed className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">#{b.roomNumber} — {b.roomCategory}</p>
                    <p className="text-xs text-slate-400">{b.checkIn} → {b.checkOut} · ${b.totalPrice}</p>
                  </div>
                </div>
                <Badge variant={statusConfig[b.status]?.badge || "secondary"} className="text-[10px]">
                  {statusConfig[b.status]?.label}
                </Badge>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Honalar */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Honalar</h2>
        <div className="flex gap-2">
          {(["all", "lux", "econom", "oddiy"] as const).map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${filter === cat ? "bg-blue-600 text-white" : "bg-white dark:bg-slate-800 text-slate-600 border border-slate-200 dark:border-slate-700"}`}>
              {cat === "all" ? "Barchasi" : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((room, i) => {
          const cat = categoryConfig[room.category];
          const CatIcon = cat.icon;
          return (
            <motion.div key={room.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} whileHover={{ y: -3 }}>
              <Card className={`overflow-hidden border-2 ${cat.border} hover:shadow-lg transition-all`}>
                <div className={`bg-gradient-to-r ${cat.gradient} p-4 text-white relative overflow-hidden`}>
                  <div className="absolute right-0 top-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CatIcon className="w-5 h-5" />
                        <span className="font-bold text-lg">#{room.number}</span>
                      </div>
                      <p className="text-white/80 text-xs">{cat.label} · {room.floor}-qavat</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">${room.price}</p>
                      <p className="text-white/70 text-xs">/kun</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{room.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {room.amenities.map(a => {
                      const AIcon = amenityIcons[a] || Bed;
                      return (
                        <div key={a} className={`flex items-center gap-1 ${cat.bg} rounded-lg px-1.5 py-0.5`}>
                          <AIcon className="w-3 h-3 text-slate-500" />
                          <span className="text-[10px] text-slate-600 dark:text-slate-300">{a}</span>
                        </div>
                      );
                    })}
                  </div>
                  <Button className="w-full" size="sm" onClick={() => { setSelectedRoom(room); setBronOpen(true); }}>
                    <Send className="w-3.5 h-3.5" /> Bron qilish
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Bron Dialog */}
      <Dialog open={bronOpen} onOpenChange={setBronOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Hona bron qilish — #{selectedRoom?.number}</DialogTitle>
          </DialogHeader>
          {success ? (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-3 py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle className="w-9 h-9 text-emerald-500" />
              </div>
              <p className="font-semibold text-slate-800 dark:text-slate-100 text-lg">Bron so'rovi yuborildi!</p>
              <p className="text-sm text-slate-500 text-center">Qabul bo'limi so'rovingizni ko'rib chiqadi</p>
            </motion.div>
          ) : (
            <div className="space-y-4 mt-2">
              {selectedRoom && (
                <div className={`${categoryConfig[selectedRoom.category].bg} border ${categoryConfig[selectedRoom.category].border} rounded-xl p-3 flex justify-between items-center`}>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">{categoryConfig[selectedRoom.category].label} #{selectedRoom.number}</p>
                    <p className="text-xs text-slate-500">{selectedRoom.floor}-qavat</p>
                  </div>
                  <p className="font-bold text-slate-800 dark:text-slate-100">${selectedRoom.price}/kun</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Kirish sanasi</label>
                  <Input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Chiqish sanasi</label>
                  <Input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
                </div>
              </div>
              {nights > 0 && selectedRoom && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 flex justify-between">
                  <span className="text-sm text-blue-700 dark:text-blue-300">{nights} kun</span>
                  <span className="font-bold text-blue-700 dark:text-blue-300">${nights * selectedRoom.price} jami</span>
                </div>
              )}
              <Select value={payment} onValueChange={setPayment}>
                <SelectTrigger><SelectValue placeholder="To'lov usuli" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Naqd pul</SelectItem>
                  <SelectItem value="card">Karta</SelectItem>
                  <SelectItem value="insurance">Sug'urta</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setBronOpen(false)}>Bekor qilish</Button>
                <Button disabled={!checkIn || !checkOut || !payment || loading} loading={loading} onClick={handleSubmit}>
                  <Send className="w-4 h-4" /> Yuborish
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
