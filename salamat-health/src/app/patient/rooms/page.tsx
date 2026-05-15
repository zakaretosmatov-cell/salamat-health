"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wifi, Tv, Wind, Bath, Coffee, Star, Crown, Bed, CheckCircle, Send, Clock } from "lucide-react";
import { db } from "@/firebase/config";
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from "firebase/firestore";
import { useAuthStore } from "@/store/authStore";

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
  payment: string;
  status: "kutilmoqda" | "tasdiqlandi" | "rad etildi";
  createdAt: Date;
  price: number;
}

const rooms: Room[] = [
  { id: "1", number: "101", category: "lux", floor: 1, price: 500, amenities: ["WiFi", "TV", "Konditsioner", "Hammom", "Mini-bar"], description: "Hashamatli lux xona, shahar manzarasi, keng yotoq" },
  { id: "2", number: "201", category: "lux", floor: 2, price: 600, amenities: ["WiFi", "TV", "Konditsioner", "Hammom", "Mini-bar", "Balkon"], description: "Premium lux xona, balkon va panorama ko'rinish" },
  { id: "3", number: "103", category: "econom", floor: 1, price: 200, amenities: ["WiFi", "TV", "Konditsioner"], description: "Qulay econom xona, barcha asosiy qulayliklar bilan" },
  { id: "4", number: "203", category: "econom", floor: 2, price: 220, amenities: ["WiFi", "TV", "Konditsioner", "Hammom"], description: "Econom xona, shaxsiy hammom bilan" },
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

export default function PatientRoomsPage() {
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

  // Foydalanuvchining bron so'rovlarini real-time kuzatish
  useEffect(() => {
    if (!user?.uid) return;
    const q = query(collection(db, "room_bookings"), where("patientId", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as BronRequest));
      setMyBrons(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
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
        setCheckIn("");
        setCheckOut("");
        setPayment("");
      }, 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Honalar" subtitle="Hona tanlang va bron qiling">

      {/* Mening bronlarim */}
      {myBrons.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Mening bron so'rovlarim</h2>
          <div className="space-y-2">
            {myBrons.map((b) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <Bed className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                      #{b.roomNumber} — {b.roomCategory}
                    </p>
                    <p className="text-xs text-slate-400">{b.checkIn} → {b.checkOut} · ${b.price}/kun</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {b.status === "kutilmoqda" && <Clock className="w-4 h-4 text-amber-500" />}
                  <Badge variant={statusConfig[b.status]?.badge || "secondary"}>
                    {statusConfig[b.status]?.label || b.status}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Category filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["all", "lux", "econom", "oddiy"] as const).map(cat => (
          <motion.button
            key={cat}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              filter === cat
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            }`}
          >
            {cat === "all" ? "Barchasi" : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Rooms grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((room, i) => {
          const cat = categoryConfig[room.category];
          const CatIcon = cat.icon;
          return (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4 }}
            >
              <Card className={`overflow-hidden border-2 ${cat.border} hover:shadow-xl transition-all`}>
                <div className={`bg-gradient-to-r ${cat.gradient} p-5 text-white relative overflow-hidden`}>
                  <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CatIcon className="w-6 h-6" />
                        <span className="font-bold text-xl">#{room.number}</span>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: cat.stars }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-white text-white" />
                        ))}
                      </div>
                    </div>
                    <p className="text-white/80 text-sm">{cat.label} · {room.floor}-qavat</p>
                    <p className="text-2xl font-bold mt-1">${room.price}<span className="text-white/70 text-sm font-normal">/kun</span></p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{room.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {room.amenities.map(a => {
                      const AIcon = amenityIcons[a] || Bed;
                      return (
                        <div key={a} className={`flex items-center gap-1 ${cat.bg} rounded-lg px-2 py-1`}>
                          <AIcon className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-xs text-slate-600 dark:text-slate-300">{a}</span>
                        </div>
                      );
                    })}
                  </div>
                  <Button className="w-full" onClick={() => { setSelectedRoom(room); setBronOpen(true); }}>
                    <Send className="w-4 h-4" /> Bron qilish
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
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-3 py-8"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle className="w-9 h-9 text-emerald-500" />
              </div>
              <p className="font-semibold text-slate-800 dark:text-slate-100 text-lg">Bron so'rovi yuborildi!</p>
              <p className="text-sm text-slate-500 text-center">Qabul bo'limi so'rovingizni ko'rib chiqadi</p>
            </motion.div>
          ) : (
            <div className="space-y-4 mt-2">
              {selectedRoom && (
                <div className={`${categoryConfig[selectedRoom.category].bg} border ${categoryConfig[selectedRoom.category].border} rounded-xl p-3`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-100">
                        {categoryConfig[selectedRoom.category].label} #{selectedRoom.number}
                      </p>
                      <p className="text-xs text-slate-500">{selectedRoom.floor}-qavat</p>
                    </div>
                    <p className="font-bold text-slate-800 dark:text-slate-100">${selectedRoom.price}/kun</p>
                  </div>
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
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 flex justify-between items-center">
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

              <p className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                So'rovingiz qabul bo'limiga yuboriladi. Ular tasdiqlasa, hona sizga ajratiladi.
              </p>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setBronOpen(false)}>Bekor qilish</Button>
                <Button
                  disabled={!checkIn || !checkOut || !payment || loading}
                  loading={loading}
                  onClick={handleSubmit}
                >
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
