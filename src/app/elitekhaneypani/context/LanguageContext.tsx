"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import translations, { EliteLanguage } from "../i18n/translations";

const STORAGE_KEY = "elite-lang";

type TranslationDict = (typeof translations)["en"];

const getNested = (obj: unknown, path: string[]): string | undefined => {
    return path.reduce<unknown>((acc, key) => {
        if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
            return (acc as Record<string, unknown>)[key];
        }
        return undefined;
    }, obj) as string | undefined;
};

interface LanguageContextValue {
    lang: EliteLanguage;
    setLang: (lang: EliteLanguage) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
    lang: "en",
    setLang: () => { },
    t: (key: string) => key,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [lang, setLangState] = useState<EliteLanguage>("en");

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY) as EliteLanguage | null;
        if (stored === "en" || stored === "np") setLangState(stored);
    }, []);

    const setLang = (next: EliteLanguage) => {
        localStorage.setItem(STORAGE_KEY, next);
        setLangState(next);
    };

    const t = (key: string) => {
        const path = key.split(".");
        return (
            getNested(translations[lang] as TranslationDict, path) ??
            getNested(translations.en, path) ??
            key
        );
    };

    return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
