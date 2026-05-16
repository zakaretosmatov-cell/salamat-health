"use client";
import React from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Trees, MapPin, Clock, Info } from "lucide-react";

export default function ZooparkPage() {
  const animals = [
    {
      id: 1,
      name: "Tovus (Peacock)",
      desc: "Go'zal va rang-barang patlarga ega tovuslarimiz.",
      image: "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Pushti Flamingolar",
      desc: "Klinikamiz hovlisidagi kichik ko'lda suzib yuruvchi nafis flamingolar.",
      image: "https://images.unsplash.com/photo-1497206365907-f5e630693df0?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "Ohu bolasi (Deer)",
      desc: "Bolalar uchun sevimli bo'lgan yovvoyi tabiatning bir qismi.",
      image: "https://images.unsplash.com/photo-1484406593171-81f90fe1726a?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: 4,
      name: "Oqqushlar ko'li",
      desc: "Tinchlantiruvchi va asablarni orom oldiruvchi oqqushlar manzarasi.",
      image: "https://images.unsplash.com/photo-1549471013-3364d7320bd5?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: 5,
      name: "Olmoxon (Squirrel)",
      desc: "Daraxtlar orasida sakrab yuruvchi quvnoq olmoxonlar.",
      image: "https://images.unsplash.com/photo-1507666405895-422eee7d517f?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: 6,
      name: "To'tiqushlar",
      desc: "Tropik qushlar bilan to'la maxsus qafaslar.",
      image: "https://images.unsplash.com/photo-1552728089-571ebd6a45cb?q=80&w=1000&auto=format&fit=crop",
    },
  ];

  return (
    <DashboardLayout title="Salamat Zoopark" subtitle="Klinikamizdagi yashil tabiat va hayvonot olami">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl mb-8 overflow-hidden shadow-2xl h-64 sm:h-72 flex items-end p-6 sm:p-8"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1564769625905-50e93615e769?q=80&w=2000&auto=format&fit=crop')" }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-emerald-900/40 to-transparent" />
        
        <div className="relative z-10 w-full flex flex-col sm:flex-row justify-between items-end gap-4">
          <div className="max-w-xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold mb-4 shadow-sm"
            >
              <Trees className="w-3.5 h-3.5 text-emerald-400" />
              Ekologik Hudud
            </motion.div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight drop-shadow-md">
              Salamat Zoopark
            </h2>
            <p className="text-emerald-50 text-sm sm:text-base font-medium opacity-90 drop-shadow-sm">
              Shifoxonamiz hovlisidagi maxsus tabiat burchagi. Bemorlar va ularning yaqinlari uchun ruhiy yengillik bag'ishlaydigan maskan.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Ish vaqti</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Har kuni: 08:00 - 19:00</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Manzil</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Bino orqa hovlisi, bog' tomoni</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                <Info className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Qoidalar</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Hayvonlarni ovqatlantirish mumkin emas</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Gallery */}
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <Trees className="w-6 h-6 text-emerald-500" /> Bizning Jonivorlar
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {animals.map((animal, i) => (
          <motion.div
            key={animal.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="relative h-48 overflow-hidden group">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: "url('" + animal.image + "')" }}
                />
              </div>
              <CardContent className="p-5 bg-white dark:bg-slate-900">
                <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{animal.name}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{animal.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

    </DashboardLayout>
  );
}
