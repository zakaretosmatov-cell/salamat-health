"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock, Eye, EyeOff, Heart, Shield, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { loginUser } from "@/firebase/auth";
import { UserRole } from "@/types";
import LanguageSwitcher from "@/components/ui/language-switcher";
import { useLangStore } from "@/store/langStore";

const schema = z.object({
  email: z.string().email("Noto'g'ri email"),
  password: z.string().min(6, "Kamida 6 ta belgi"),
});
type FormData = z.infer<typeof schema>;

const roleRedirects: Record<UserRole, string> = {
  admin: "/admin",
  receptionist: "/reception",
  doctor: "/login",
  patient: "/patient",
};

const demoAccounts = [
  { role: "Admin", email: "admin@salamat.health", password: "admin123", color: "from-violet-500 to-purple-600" },
  { role: "Reception", email: "reception@salamat.health", password: "recep123", color: "from-blue-500 to-cyan-500" },
  { role: "Patient", email: "patient@salamat.health", password: "patient123", color: "from-rose-500 to-pink-500" },
];

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const { t } = useLangStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError("");
    try {
      const { firebaseUser, userData } = await loginUser(data.email, data.password);
      setUser(firebaseUser, userData.role as UserRole, userData.name);
      router.push(roleRedirects[userData.role as UserRole] || "/");
    } catch {
      const demo = demoAccounts.find(d => d.email === data.email);
      if (demo) {
        const roleMap: Record<string, UserRole> = { Admin: "admin", Reception: "receptionist", Patient: "patient" };
        const role = roleMap[demo.role];
        setUser({ uid: "demo-" + role, email: data.email } as never, role, demo.role + " User");
        router.push(roleRedirects[role]);
      } else {
        setError(t("invalidCredentials"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Chap panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-700 via-blue-800 to-cyan-700 overflow-hidden">
        {/* Animatsiyali doiralar */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <motion.div key={i} className="absolute rounded-full bg-white/5"
              style={{ width: `${(i + 2) * 100}px`, height: `${(i + 2) * 100}px`, left: `${10 + i * 15}%`, top: `${5 + i * 15}%` }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.7 }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col justify-between h-full px-10 py-10 text-white">
          {/* Logo */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Salamat Med Center</h1>
                <p className="text-blue-200 text-xs">Ош шаары · Kyrgyzstan</p>
              </div>
            </div>
          </motion.div>

          {/* Asosiy kontent */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <h2 className="text-4xl font-bold leading-tight mb-3">
              Заманбап<br />диагностика<br />жана дарылоо
            </h2>
            <p className="text-blue-100 text-base mb-8 leading-relaxed">
              Эс алуу жана дарылоо бир жерде.<br />
              Комплекстүү саламаттыкты чыңдоо.
            </p>

            {/* Statistika */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { value: "25.2K", label: "Подписчики" },
                { value: "761", label: "Публикации" },
                { value: "10+", label: "Йиллик тажрибе" },
              ].map((s) => (
                <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-blue-200 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Xizmatlar */}
            <div className="space-y-2">
              {[
                { icon: Heart, text: "Заманбап диагностика жана дарылоо" },
                { icon: Shield, text: "Массаж · Бассейн · Wellness" },
                { icon: Activity, text: "Check-up · Конференция залы" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5">
                  <Icon className="w-4 h-4 text-cyan-300 flex-shrink-0" />
                  <span className="text-sm text-blue-100">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pastki qism — kontakt */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.502-5.18-1.38l-.37-.22-3.84.914.977-3.748-.242-.386A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
              </div>
              <div>
                <p className="text-xs text-blue-200">WhatsApp</p>
                <p className="text-sm font-semibold">+996 554 030 030</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* O'ng panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">

          {/* Til tanlash */}
          <div className="flex justify-end mb-6">
            <LanguageSwitcher />
          </div>

          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white">{t("appName")}</span>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{t("welcomeBack")}</h2>
          <p className="text-slate-500 mb-8">{t("welcomeDesc")}</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">{t("email")}</label>
              <Input {...register("email")} type="email" placeholder={t("emailPlaceholder")} icon={<Mail className="w-4 h-4" />} error={errors.email?.message} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">{t("password")}</label>
              <div className="relative">
                <Input {...register("password")} type={showPassword ? "text" : "password"} placeholder={t("passwordPlaceholder")} icon={<Lock className="w-4 h-4" />} error={errors.password?.message} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-2">
                {error}
              </motion.p>
            )}

            <Button type="submit" className="w-full h-12 text-base" loading={isLoading}>
              {t("signIn")}
            </Button>
          </form>

          {/* Demo */}
          <div className="mt-8">
            <p className="text-xs text-slate-400 text-center mb-3 font-medium uppercase tracking-wider">{t("quickDemo")}</p>
            <div className="grid grid-cols-3 gap-2">
              {demoAccounts.map((acc) => (
                <motion.button key={acc.role} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { setValue("email", acc.email); setValue("password", acc.password); }}
                  className={`bg-gradient-to-r ${acc.color} text-white rounded-xl px-3 py-2.5 text-sm font-medium shadow-sm hover:shadow-md transition-shadow`}>
                  {acc.role}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
