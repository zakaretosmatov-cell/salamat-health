"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bed, Crown, Star, Wifi, Tv, Wind, Bath, Coffee, CheckCircle, Send, Clock, Calendar, ChevronRight } from "lucide-react";
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
  lux: {
    label: "Lux",
    gradient: "from-amber-400 to-yellow-500",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
    activeBg: "bg-amber-500",
    icon: Crown,
    stars: 5,
    desc: "Hashamatli xonalar, barcha qulayliklar",
  },
  econom: {
    label: "Econom",
    gradient: "from-blue-400 to-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    activeBg: "bg-blue-500",
    icon: Star,
    stars: 3,
    desc: "Qulay xonalar, asosiy qulayliklar",
  },
  oddiy: {
    label: "Oddiy",
    gradient: "from-slate-400 to-slate-500",
    bg: "bg-slate-50 dark:bg-slate-800",
    border: "border-slate-200 dark:border-slate-700",
    activeBg: "bg-slate-500",
    icon: Bed,
    stars: 1,
    desc: "Sodda va arzon xonalar",
  },
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
  const [activeCategory, setActiveCategory] = useState<RoomCategory | null>(null);
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

  const filteredRooms = activeCategory ? rooms.filter(r => r.category === activeCategory) : [];

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

      {/* Premium Hero Banner bilan Rasm */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl mb-8 overflow-hidden shadow-2xl h-72 sm:h-80 flex items-end p-6 sm:p-8"
      >
        {/* Orqa fon rasmi - Foydalanuvchi rasmni public papkaga joylashi kerak */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: "url('/salamat-building.jpg')" }} 
        />
        
        {/* Qoraytirilgan gradient (Overlay) - matn aniq o'qilishi uchun */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 via-transparent to-transparent" />
        
        <div className="relative z-10 w-full flex flex-col sm:flex-row justify-between items-end gap-4">
          <div className="max-w-xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold mb-4 shadow-sm"
            >
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              Premium Klinika
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight drop-shadow-md"
            >
              Salamat Health ga Xush Kelibsiz!
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-blue-50 text-sm sm:text-base font-medium opacity-90 drop-shadow-sm"
            >
              Sog'lig'ingiz o'z qo'lingizda. Zamonaviy xonalarni bron qiling, uchrashuvlarni rejalashtiring va sifatli tibbiy xizmatdan bahramand bo'ling.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="hidden sm:flex"
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center shadow-xl">
              <p className="text-white text-xs font-medium mb-1 opacity-80">Ish vaqti</p>
              <p className="text-white font-bold text-lg">24/7</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Kategoriya tugmalari — TEPADA */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {(Object.entries(categoryConfig) as [RoomCategory, typeof categoryConfig.lux][]).map(([key, cat], i) => {
          const CatIcon = cat.icon;
          const isActive = activeCategory === key;
          return (
            <motion.button
              key={key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveCategory(isActive ? null : key)}
              className={`relative rounded-2xl p-4 text-left transition-all shadow-sm ${
                isActive
                  ? `bg-gradient-to-br ${cat.gradient} text-white shadow-lg`
                  : `bg-white dark:bg-slate-900 border-2 ${cat.border} hover:shadow-md`
              }`}
            >
              <CatIcon className={`w-7 h-7 mb-2 ${isActive ? "text-white" : key === "lux" ? "text-amber-500" : key === "econom" ? "text-blue-500" : "text-slate-500"}`} />
              <p className={`font-bold text-lg ${isActive ? "text-white" : "text-slate-800 dark:text-slate-100"}`}>{cat.label}</p>
              <p className={`text-xs mt-0.5 ${isActive ? "text-white/80" : "text-slate-400"}`}>{cat.desc}</p>
              <div className="flex gap-0.5 mt-2">
                {Array.from({ length: cat.stars }).map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${isActive ? "text-white fill-white" : "text-amber-400 fill-amber-400"}`} />
                ))}
              </div>
              {isActive && (
                <motion.div
                  layoutId="activeCat"
                  className="absolute inset-0 rounded-2xl ring-2 ring-white/40"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Honalar — faqat tanlangan kategoriya */}
      <AnimatePresence mode="wait">
        {activeCategory ? (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {React.createElement(categoryConfig[activeCategory].icon, {
                  className: `w-5 h-5 ${activeCategory === "lux" ? "text-amber-500" : activeCategory === "econom" ? "text-blue-500" : "text-slate-500"}`
                })}
                {categoryConfig[activeCategory].label} honalar
              </h2>
              <button onClick={() => setActiveCategory(null)} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
                Yopish ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRooms.map((room, i) => {
                const cat = categoryConfig[room.category];
                const CatIcon = cat.icon;
                return (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ y: -3 }}
                  >
                    <Card className={`overflow-hidden border-2 ${cat.border} hover:shadow-lg transition-all`}>
                      <div className={`bg-gradient-to-r ${cat.gradient} p-4 text-white relative overflow-hidden`}>
                        <div className="absolute right-0 top-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <CatIcon className="w-5 h-5" />
                              <span className="font-bold text-xl">#{room.number}</span>
                            </div>
                            <p className="text-white/80 text-xs">{cat.label} · {room.floor}-qavat</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">${room.price}</p>
                            <p className="text-white/70 text-xs">/kun</p>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{room.description}</p>
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
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-10 text-slate-400"
          >
            <Bed className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Hona turini tanlang</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mening bronlarim */}
      {myBrons.length > 0 && (
        <Card className="mt-6">
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

      {/* Uchrashuvlar havola */}
      <Link href="/patient/appointments">
        <motion.div whileHover={{ scale: 1.01 }} className="mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-4 flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6" />
            <div>
              <p className="font-semibold">Uchrashuvlar</p>
              <p className="text-xs text-blue-100">Jadval ko'rish</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-blue-200" />
        </motion.div>
      </Link>

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
