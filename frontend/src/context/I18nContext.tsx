import {createContext, useContext, useState, type ReactNode} from "react";
import {enUS} from "../i18n/en-US";
import {enUK} from "../i18n/en-UK";
import {zhTW} from "../i18n/zh-TW";
import {zhCN} from "../i18n/zh-CN";

//types
export type Locale = "en-US" | "en-UK" | "zh-TW" | "zh-CN";
export type Translations = typeof enUS;

export interface LocaleOption {
    value: Locale;
    label: string;
    flag: string;
}

//locales
export const LOCALE_OPTIONS: LocaleOption[] = [
    {value: "en-US", label: "English (US)", flag: "🇺🇸"},
    {value: "en-UK", label: "English (UK)", flag: "🇬🇧"},
    {value: "zh-TW", label: "中文（台灣）", flag: "🇹🇼"},
    {value: "zh-CN", label: "中文（中国）", flag: "🇨🇳"}
];

const locales: Record<Locale, Translations> = {"en-US": enUS, "en-UK": enUK, "zh-TW": zhTW, "zh-CN": zhCN};

//contexts
interface I18nContextType {
    locale: Locale;
    translation: Translations;
    setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

//provider
export function I18nProvider({children}: {children: ReactNode}) {
    const [locale, setLocaleState] = useState<Locale>(() => {
        const stored = localStorage.getItem("locale") as Locale | null;
        return stored && locales[stored] ? stored : "en-US";
    });

    const setLocale = (next: Locale) => {
        localStorage.setItem("locale", next);
        setLocaleState(next);
    };

    return (
        <I18nContext.Provider value={{locale, translation: locales[locale], setLocale}}>
            {children}
        </I18nContext.Provider>
    );
}

//hook
export function useI18n(): I18nContextType {
    const context = useContext(I18nContext);
    if (!context) throw new Error("useI18n must be used within I18nProvider");
    return context;
}
