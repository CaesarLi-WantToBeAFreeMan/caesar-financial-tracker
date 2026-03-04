import {createContext, useContext, useState, useCallback, useMemo, type ReactNode} from "react";
import type {Locale} from "./I18nContext";

//types
export type FontSize = "xs" | "sm" | "md" | "lg" | "xl";
export type UIStyle = "cyberpunk" | "ondark" | "classic";
export type CurrencyDisplay = "symbol" | "code" | "symbolCode";
export type DateFormatToken =
    | "MMM/DD/YYYY"
    | "MM/DD/YYYY"
    | "DD/MMM/YYYY"
    | "DD/MM/YYYY"
    | "YYYY/MM/DD"
    | "MMMM/DD/YYYY"
    | "DD/MMMM/YYYY"
    | "MMM-DD-YYYY"
    | "MM-DD-YYYY"
    | "DD-MMM-YYYY"
    | "DD-MM-YYYY"
    | "YYYY-MM-DD"
    | "MM/DD"
    | "DD/MM"
    | "MM-DD"
    | "DD-MM";

export interface AppSettings {
    thousandsSeparator: string; //"," default
    thousandthsSeparator: string; //" " default
    separatorNumber: 3 | 4; //3 for english, 4 for chinese
    currencySymbol: string; //"$"
    currencyDisplay: CurrencyDisplay;
    floatPlaces: 0 | 1 | 2;
    dateFormat: DateFormatToken;
    timezone: string; //IANA tz string, e.g. "Asia/Taipei"
    uiStyle: UIStyle;
    fontSize: FontSize;
}

//locale defaults
export function defaultsForLocale(locale: Locale): AppSettings {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const defaultValues: AppSettings = {
        thousandsSeparator: ",",
        thousandthsSeparator: " ",
        separatorNumber: locale === "en-UK" || locale === "en-US" ? 3 : 4,
        currencySymbol: locale === "en-UK" ? "£" : locale === "zh-CN" ? "¥" : "$",
        currencyDisplay: "symbol",
        floatPlaces: locale === "zh-TW" ? 0 : 2,
        dateFormat: locale === "en-UK" ? "DD/MMM/YYYY" : locale === "en-US" ? "MMM/DD/YYYY" : "YYYY/MM/DD",
        timezone: timeZone,
        uiStyle: "cyberpunk",
        fontSize: "sm"
    };
    return defaultValues;
}

//currency options per locale
export const CURRENCY_OPTIONS: Record<Locale, {symbol: string; code: string; symbolCode: string}[]> = {
    "en-US": [{symbol: "$", code: "USD", symbolCode: "US$"}],
    "en-UK": [{symbol: "£", code: "GBP", symbolCode: "GB£"}],
    "zh-TW": [{symbol: "$", code: "NTD", symbolCode: "NT$"}],
    "zh-CN": [{symbol: "¥", code: "CNY", symbolCode: "CN¥"}]
};

export const DATE_FORMAT_OPTIONS: DateFormatToken[] = [
    "MMM/DD/YYYY",
    "MMMM/DD/YYYY",
    "MM/DD/YYYY",
    "DD/MMM/YYYY",
    "DD/MMMM/YYYY",
    "DD/MM/YYYY",
    "YYYY/MM/DD",
    "MMM-DD-YYYY",
    "MM-DD-YYYY",
    "DD-MMM-YYYY",
    "DD-MM-YYYY",
    "YYYY-MM-DD",
    "MM/DD",
    "DD/MM",
    "MM-DD",
    "DD-MM"
];

//format helpers
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_LONG = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

export function formatDate(dateString: string, format: DateFormatToken, timeZone?: string): string {
    try {
        const date = new Date(dateString + "T12:00:00");
        if (isNaN(date.getTime())) return dateString;
        const options: Intl.DateTimeFormatOptions = timeZone ? {timeZone: timeZone} : {};
        const [year, month, day] = [
            new Intl.DateTimeFormat("en", {year: "numeric", ...options}).format(date),
            date.getMonth(),
            new Intl.DateTimeFormat("en", {day: "2-digit", ...options}).format(date)
        ];
        const MM = String(month + 1).padStart(2, "0");
        const DD = day.padStart(2, "0");
        const MMM = MONTH_SHORT[month];
        const MMMM = MONTH_LONG[month];
        const YYYY = year;
        return format
            .replace("MMMM", MMMM)
            .replace("MMM", MMM)
            .replace("MM", MM)
            .replace("DD", DD)
            .replace("YYYY", YYYY);
    } catch {
        return dateString;
    }
}

export function formatPrice(
    price: number | null,
    settings: Pick<
        AppSettings,
        | "thousandsSeparator"
        | "thousandthsSeparator"
        | "separatorNumber"
        | "currencySymbol"
        | "currencyDisplay"
        | "floatPlaces"
    >
): string {
    if (price == null) return "∞";
    const {thousandsSeparator, thousandthsSeparator, separatorNumber, currencySymbol, currencyDisplay, floatPlaces} =
        settings;
    let [integer, fractional] = Math.abs(price).toFixed(floatPlaces).split(".");
    integer = integer.replace(new RegExp(`\\d(?=(\\d{${separatorNumber}})+$)`, "g"), `$&${thousandsSeparator}`);
    if (floatPlaces > 0 && fractional)
        fractional =
            "." + fractional.replace(new RegExp(`(\\d{${separatorNumber}})(?=\\d)`, "g"), `$1${thousandthsSeparator}`);
    const symbol = currencyDisplay === "symbol" ? currencySymbol : currencyDisplay === "code" ? "" : currencySymbol;
    return `${symbol}${price < 0 ? "-" : ""}${integer}${fractional}`;
}

//context
interface SettingsContextType {
    settings: AppSettings;
    updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
    resetToDefaults: (locale: Locale) => void;
    formatPrice: (price: number | null) => string;
    formatDate: (dateStr: string) => string;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

//provider
const KEY = "app-settings";

function loadSettings(): AppSettings | null {
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? (JSON.parse(raw) as AppSettings) : null;
    } catch {
        return null;
    }
}

function saveSettings(setting: AppSettings) {
    try {
        localStorage.setItem(KEY, JSON.stringify(setting));
    } catch {}
}

export function SettingsProvider({children}: {children: ReactNode}) {
    const [settings, setSettings] = useState<AppSettings>(() => {
        return loadSettings() ?? defaultsForLocale((localStorage.getItem("locale") as Locale | null) ?? "en-US");
    });

    useMemo(() => {
        const map: Record<FontSize, string> = {xs: "12px", sm: "14px", md: "16px", lg: "18px", xl: "20px"};
        document.documentElement.style.setProperty("--base-font-size", map[settings.fontSize]);
    }, [settings.fontSize]);

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

    const formatPriceFunc = useCallback((price: number | null) => formatPrice(price, settings), [settings]);

    const formatDateFunc = useCallback(
        (dateStr: string) => formatDate(dateStr, settings.dateFormat, settings.timezone),
        [settings.dateFormat, settings.timezone]
    );

    return (
        <SettingsContext.Provider
            value={{settings, updateSetting, resetToDefaults, formatPrice: formatPriceFunc, formatDate: formatDateFunc}}
        >
            {children}
        </SettingsContext.Provider>
    );
}

//hook
export function useSettings(): SettingsContextType {
    const context = useContext(SettingsContext);
    if (!context) throw new Error("useSettings must be used within SettingsProvider");
    return context;
}
