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
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div key={i} className="absolute rounded-full bg-white/5"
              style={{ width: `${(i + 2) * 80}px`, height: `${(i + 2) * 80}px`, left: `${20 + i * 10}%`, top: `${10 + i * 12}%` }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{t("appName")}</h1>
                <p className="text-blue-200 text-sm">{t("tagline")}</p>
              </div>
            </div>
            <h2 className="text-4xl font-bold leading-tight mb-4">
              {t("welcomeBack")}
            </h2>
            <p className="text-blue-100 text-lg mb-10 leading-relaxed">
              {t("welcomeDesc")}
            </p>
            <div className="grid grid-cols-1 gap-4">
              {[
                { icon: Heart, key: "totalPatients" },
                { icon: Shield, key: "security" },
                { icon: Activity, key: "analytics" },
              ].map(({ icon: Icon, key }) => (
                <div key={key} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                  <Icon className="w-5 h-5 text-cyan-300" />
                  <span className="text-sm text-blue-100">{t(key as never)}</span>
                </div>
              ))}
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
