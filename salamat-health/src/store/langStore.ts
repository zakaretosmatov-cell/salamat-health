import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Locale, translations, TranslationKey } from "@/lib/i18n";

interface LangState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

export const useLangStore = create<LangState>()(
  persist(
    (set, get) => ({
      locale: "uz",
      setLocale: (locale) => set({ locale }),
      t: (key) => {
        const { locale } = get();
        return (translations[locale] as Record<string, string>)[key] || (translations.uz as Record<string, string>)[key] || key;
      },
    }),
    { name: "lang-storage" }
  )
);
