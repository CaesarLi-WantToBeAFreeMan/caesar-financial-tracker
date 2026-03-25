/*
 * manage setting options
 */

import {createContext, useContext, useState, useCallback, type ReactNode} from "react";
import type {Locale} from "./I18nContext";
import {storage} from "../utilities/storage";
import {
    formatPrice,
    CURRENCY_DISPLAY_OPTIONS,
    CURRENCY_CODES,
    type CurrencyCode,
    type PriceFormatOptions
} from "../utilities/prices";
import {formatDate, type DateFormatToken} from "../utilities/dates";

//re-export for all options & types
export {CURRENCY_DISPLAY_OPTIONS, CURRENCY_CODES};
export type {CurrencyCode, PriceFormatOptions, DateFormatToken};

//comment for now
// export type FontSize = "xs" | "sm" | "md" | "lg" | "xl";
// export type UIStyle = "cyberpunk" | "ondark" | "classic";

export interface AppSettings {
    //currency
    currencyCode: CurrencyCode;
    currencySymbol: string;
    //price
    separatorPlaces: 0 | 1 | 2 | 3 | 4 | 5;
    thousandsSeparator: string;
    thousandthsSeparator: string;
    decimalPlaces: 0 | 1 | 2;
    //date & time
    dateFormat: DateFormatToken;
    timezone: string;
    // uiStyle: UIStyle;
    // fontSize: FontSize;
}

//locale defaults
export function defaultsForLocale(locale: Locale): AppSettings {
    const codeMap: Record<Locale, CurrencyCode> = {"en-US": "USD", "en-UK": "GBP", "zh-TW": "TWD", "zh-CN": "CNY"};

    const fmtMap: Record<Locale, DateFormatToken> = {
        "en-US": "MMM/DD/YYYY",
        "en-UK": "DD/MMM/YYYY",
        "zh-TW": "YYYY/MM/DD",
        "zh-CN": "YYYY/MM/DD"
    };

    return {
        currencyCode: codeMap[locale],
        currencySymbol: CURRENCY_DISPLAY_OPTIONS[codeMap[locale]][0],
        separatorPlaces: locale.slice(0, 2) === "zh" ? 4 : 3,
        thousandsSeparator: ",",
        thousandthsSeparator: ".",
        decimalPlaces: locale === "zh-TW" ? 0 : 2,
        dateFormat: fmtMap[locale],
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        // uiStyle: "cyberpunk",
        // fontSize: "sm"
    };
}

//context type
interface SettingsContextType {
    settings: AppSettings;
    updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
    resetToDefaults: (locale: Locale) => void;
    formatPrice: (price: number | null) => string;
    formatDate: (dateString: string) => string;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

//storage
const STORAGE_KEY = "settings";

function loadSettings(): AppSettings | null {
    try {
        const raw = storage.get(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as AppSettings) : null;
    } catch {
        return null;
    }
}

function saveSettings(settings: AppSettings): void {
    storage.set(STORAGE_KEY, JSON.stringify(settings));
}

//provider
export function SettingsProvider({children}: {children: ReactNode}) {
    const [settings, setSettings] = useState<AppSettings>(() => {
        const stored = loadSettings();
        if (stored) return stored;
        const locale = (storage.get("locale") ?? "en-US") as Locale;
        return defaultsForLocale(locale);
    });

    //font CSS
    // useEffect(() => {
    //     const map: Record<FontSize, string> = {xs: "12px", sm: "14px", md: "16px", lg: "18px", xl: "20px"};
    //     document.documentElement.style.setProperty("--base-font-size", map[settings.fontSize]);
    // }, [settings.fontSize]);

    const updateSetting = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
        setSettings(prev => {
            const next = {...prev, [key]: value};
            saveSettings(next);
            return next;
        });
    }, []);

    const resetToDefaults = useCallback((locale: Locale) => {
        const defaults = defaultsForLocale(locale);
        setSettings(defaults);
        saveSettings(defaults);
    }, []);

    const priceOptions: PriceFormatOptions = {
        currencySymbol: settings.currencySymbol,
        separatorPlaces: settings.separatorPlaces,
        thousandsSeparator: settings.thousandsSeparator,
        decimalPlaces: settings.decimalPlaces,
        decimalSeparator: settings.thousandthsSeparator
    };

    const formatPriceFunction = useCallback(
        (price: number | null) => formatPrice(price, priceOptions),
        [
            settings.currencySymbol,
            settings.separatorPlaces,
            settings.thousandsSeparator,
            settings.decimalPlaces,
            settings.thousandthsSeparator
        ]
    );

    const formatDateFunction = useCallback(
        (dateString: string) => formatDate(dateString, settings.dateFormat, settings.timezone),
        [settings.dateFormat, settings.timezone]
    );

    return (
        <SettingsContext.Provider
            value={{
                settings,
                updateSetting,
                resetToDefaults,
                formatPrice: formatPriceFunction,
                formatDate: formatDateFunction
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}

//hook
export function useSettings(): SettingsContextType {
    const ctx = useContext(SettingsContext);
    if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
    return ctx;
}
