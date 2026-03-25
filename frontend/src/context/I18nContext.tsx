/*
 * manage languages, and display corresponding translations
 */
import {createContext, useContext, useState, type ReactNode} from "react";
import {enUS} from "../i18n/en-US";
import {enUK} from "../i18n/en-UK";
import {zhTW} from "../i18n/zh-TW";
import {zhCN} from "../i18n/zh-CN";
import type {TranslationType} from "../types/TranslationType";
import {storage} from "../utilities/storage";

//type
export type Locale = "en-US" | "en-UK" | "zh-TW" | "zh-CN";

export interface LocaleOption {
    value: Locale;
    label: string;
    flag: string;
}

//locales
export const LOCALE_OPTIONS: LocaleOption[] = [
    {value: "en-US", label: "English (US)", flag: "us"},
    {value: "en-UK", label: "English (UK)", flag: "gb"},
    {value: "zh-TW", label: "中文（台灣）", flag: "tw"},
    {value: "zh-CN", label: "中文（中国）", flag: "cn"}
];

const LOCALES: Record<Locale, TranslationType> = {
    "en-US": enUS as unknown as TranslationType,
    "en-UK": enUK as unknown as TranslationType,
    "zh-TW": zhTW as unknown as TranslationType,
    "zh-CN": zhCN as unknown as TranslationType
};

//context type
interface I18nContextType {
    locale: Locale;
    translation: TranslationType;
    setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

//context provider
export function I18nProvider({children}: {children: ReactNode}) {
    const [locale, setLocaleState] = useState<Locale>(() => {
        const stored = storage.get("locale") as Locale | null;
        return stored && LOCALES[stored] ? stored : "en-US";
    });

    const setLocale = (locale: Locale) => {
        setLocaleState(locale);
        storage.set("locale", locale);
    };

    return (
        <I18nContext.Provider value={{locale, translation: LOCALES[locale], setLocale}}>
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
