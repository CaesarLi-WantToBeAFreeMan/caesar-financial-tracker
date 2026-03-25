/*
 * 2 settings
 * 1. currency
 *  * currency display format: {usd, csd, gbp, eur, twd, jpy, cny}
 *  * group size: [0, 5]
 *  * decimal places: [0, 2]
 *  * thousands separator: (,)
 *  * decimal separator: (.)
 * 2. date
 *  * date format
 *  * time zone
 */
import {useState, useRef, useEffect, useMemo} from "react";
import {Info, Check, Calendar} from "lucide-react";
import toast from "react-hot-toast";

import {useSettings, CURRENCY_DISPLAY_OPTIONS, CURRENCY_CODES} from "../context/SettingsContext";
import {useI18n} from "../context/I18nContext";
import {useHoverSupport} from "../hooks/useHoverSupport";
import {useClickOutside} from "../hooks/useClickOutside";
import {CURRENCY_FLAGS} from "../utilities/prices";
import {formatDate, getDate} from "../utilities/dates";
import Dashboard from "../components/Dashboard";
import type {CurrencyCode, AppSettings, DateFormatToken} from "../context/SettingsContext";
import OptionPicker, {type DataType} from "../components/common/OptionPicker";

//sub components
//show a info tooltip on hover (desktop/laptop) or on tap (mobile/tablet)
function HintIcon({text}: {text: string}) {
    const canHover = useHoverSupport();
    const [open, setOpen] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null);
    useClickOutside(ref, () => setOpen(false), open && !canHover);

    return (
        <div className="relative inline-flex" ref={ref}>
            <button
                onClick={() => !canHover && setOpen(p => !p)}
                className="cursor-pointer text-(--text-muted) hover:text-(--text-accent) transition"
            >
                <Info size={12} />
            </button>
            {(open || canHover) && (
                <div
                    className={`absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 px-3 py-2 rounded-xl text-xs shadow-xl pointer-events-none bg-(--bg-surface) border border-(--border) text-(--text-dim)
                        ${canHover ? "opacity-0 group-hover:opacity-100 peer-hover:opacity-100" : ""}
                        ${!canHover && !open ? "hidden" : ""}`}
                >
                    {text}
                </div>
            )}
        </div>
    );
}

//section title + bottom border
function SectionTitle({label}: {label: string}) {
    return <h3 className="text-xl text-center cyber-section mb-3">{label}</h3>;
}

//label + hint
function FieldLabel({label, hint}: {label: string; hint?: string}) {
    return (
        <div className="flex justify-center items-center gap-3 mb-3">
            <span className="text-sm cyber-label mb-0">{label}</span>
            {hint && <HintIcon text={hint} />}
        </div>
    );
}

//single character input
function CharInput({
    value,
    onChange,
    placeholder = ""
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
}) {
    return (
        <input
            maxLength={2}
            value={value}
            placeholder={placeholder}
            onChange={e => onChange(e.target.value.slice(-1) || " ")}
            className="cyber-input w-18 text-center text-(--text-dim) font-mono text-base py-1"
        />
    );
}

//horizontal segment picker
function SegmentPicker<T extends string | number>({
    options,
    value,
    onChange
}: {
    options: T[];
    value: T;
    onChange: (v: T) => void;
}) {
    return (
        <div className="inline-flex rounded-xl border border-(--border) overflow-hidden">
            {options.map(option => {
                const active = option === value;
                return (
                    <button
                        key={String(option)}
                        onClick={() => onChange(option)}
                        className={`p-3 font-mono transition duration-300 cursor-pointer active:shadow-[0_0_8px_var(--text-accent)] border-r border-(--border) ${active ? "bg-(--text-accent) text-(--text-btn) font-bold" : "bg-(--bg-card) text-(--text-dim)"}`}
                    >
                        {option}
                    </button>
                );
            })}
        </div>
    );
}

export default function Settings() {
    const {settings, updateSetting, resetToDefaults, formatPrice, formatDate: formatDateSetting} = useSettings();
    const {translation, locale} = useI18n();

    const PREVIEW_PRICE = 1234567.89;

    const dateFormats: DataType<DateFormatToken>[] = [
        {label: formatDate(getDate(), "MM/DD/YYYY"), icon: <Calendar />, value: "MM/DD/YYYY"},
        {label: formatDate(getDate(), "MM/DD/YY"), icon: <Calendar />, value: "MM/DD/YY"},
        {label: formatDate(getDate(), "MMM/DD/YYYY"), icon: <Calendar />, value: "MMM/DD/YYYY"},
        {label: formatDate(getDate(), "MMM/DD/YY"), icon: <Calendar />, value: "MMM/DD/YY"},
        {label: formatDate(getDate(), "DD/MM/YYYY"), icon: <Calendar />, value: "DD/MM/YYYY"},
        {label: formatDate(getDate(), "DD/MM/YY"), icon: <Calendar />, value: "DD/MM/YY"},
        {label: formatDate(getDate(), "DD/MMM/YYYY"), icon: <Calendar />, value: "DD/MMM/YYYY"},
        {label: formatDate(getDate(), "DD/MMM/YY"), icon: <Calendar />, value: "DD/MMM/YY"},
        {label: formatDate(getDate(), "YYYY/MM/DD"), icon: <Calendar />, value: "YYYY/MM/DD"},
        {label: formatDate(getDate(), "YY/MM/DD"), icon: <Calendar />, value: "YY/MM/DD"},
        {label: formatDate(getDate(), "YYYY/MMM/DD"), icon: <Calendar />, value: "YYYY/MMM/DD"},
        {label: formatDate(getDate(), "YY/MMM/DD"), icon: <Calendar />, value: "YY/MMM/DD"},
        {label: formatDate(getDate(), "MM-DD-YYYY"), icon: <Calendar />, value: "MM-DD-YYYY"},
        {label: formatDate(getDate(), "MM-DD-YY"), icon: <Calendar />, value: "MM-DD-YY"},
        {label: formatDate(getDate(), "MMM-DD-YYYY"), icon: <Calendar />, value: "MMM-DD-YYYY"},
        {label: formatDate(getDate(), "MMM-DD-YY"), icon: <Calendar />, value: "MMM-DD-YY"},
        {label: formatDate(getDate(), "DD-MM-YYYY"), icon: <Calendar />, value: "DD-MM-YYYY"},
        {label: formatDate(getDate(), "DD-MM-YY"), icon: <Calendar />, value: "DD-MM-YY"},
        {label: formatDate(getDate(), "DD-MMM-YYYY"), icon: <Calendar />, value: "DD-MMM-YYYY"},
        {label: formatDate(getDate(), "DD-MMM-YY"), icon: <Calendar />, value: "DD-MMM-YY"},
        {label: formatDate(getDate(), "YYYY-MM-DD"), icon: <Calendar />, value: "YYYY-MM-DD"},
        {label: formatDate(getDate(), "YY-MM-DD"), icon: <Calendar />, value: "YY-MM-DD"},
        {label: formatDate(getDate(), "YYYY-MMM-DD"), icon: <Calendar />, value: "YYYY-MMM-DD"},
        {label: formatDate(getDate(), "YY-MMM-DD"), icon: <Calendar />, value: "YY-MMM-DD"}
    ];

    const dateFormatIndex = Math.max(
        0,
        dateFormats.findIndex(df => df.value === settings.dateFormat)
    );

    //live clock
    const [nowString, setNowString] = useState<string>("");
    useEffect(() => {
        const tick = () => {
            try {
                setNowString(
                    new Intl.DateTimeFormat(locale, {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        timeZone: settings.timezone
                    }).format(new Date())
                );
            } catch {
                setNowString(new Date().toLocaleTimeString());
            }
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [settings.timezone, locale]);

    //timezone list
    const allTimezones = useMemo(() => {
        try {
            return (Intl as any).supportedValuesOf("timeZone") as string[];
        } catch {
            return [
                "UTC",
                "America/New_York",
                "America/Los_Angeles",
                "Europe/London",
                "Europe/Berlin",
                "Asia/Tokyo",
                "Asia/Taipei",
                "Asia/Shanghai"
            ];
        }
    }, []);

    const [timezoneSearch, setTimezoneSearch] = useState<string>("");
    const filteredTimezone = timezoneSearch.trim()
        ? allTimezones.filter(timezone => timezone.toLowerCase().includes(timezoneSearch.toLowerCase()))
        : allTimezones;

    //auto save
    const save = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
        updateSetting(key, value);
        toast.success(translation.settings.saved);
    };

    return (
        <Dashboard activeRoute={translation.navigation.settings}>
            <div className="w-full mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-(--text-accent)">{translation.settings.title}</h1>
                    {/*reset to locale default*/}
                    <button
                        onClick={() => {
                            resetToDefaults(locale);
                            toast.success(translation.settings.saved);
                        }}
                        className="cyber-btn-ghost px-3 py-2 active:shadow-[0_0_8px_var(--text-accent)]"
                    >
                        {translation.settings.reset}
                    </button>
                </div>

                {/*currency*/}
                <section className="cyber-card p-3 md:p-6 mb-9">
                    <SectionTitle label={translation.settings.sections.currency} />

                    {/*currency code picker*/}
                    <FieldLabel
                        label={translation.settings.currencyCode}
                        hint={translation.settings.currencyCodeHint}
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-7">
                        {CURRENCY_CODES.map((code: string) => {
                            const active = settings.currencyCode === code;
                            return (
                                <button
                                    key={code}
                                    onClick={() => {
                                        save("currencyCode", code as CurrencyCode);
                                        save("currencySymbol", CURRENCY_DISPLAY_OPTIONS[code as CurrencyCode][0]);
                                    }}
                                    className={`group flex items-center gap-5 p-3 rounded-xl border text-left transition duration-300 cursor-pointer active:shadow-[0_0_8px_var(--text-accent)] ${active ? "bg-(--bg-hover) border-(--border-glow) shadow-(--glow-cyan) text-(--text-accent)" : "bg-(--bg-card) border-(--border) text-(--text-dim)"}`}
                                >
                                    <span
                                        className={`fi fi-${CURRENCY_FLAGS[code as CurrencyCode]} translation duration-120 group-hover:scale-120 group-active:scale-120`}
                                    />
                                    <div>
                                        <div
                                            className={`font-bold font-mono text-(--text-accent) ${active ? "scale-120" : ""}`}
                                        >
                                            {code}
                                        </div>
                                        <div className="truncate text-sm text-(--text-muted)">
                                            {translation.settings.currencyNames[code as CurrencyCode]}
                                        </div>
                                    </div>
                                    {active && <Check size={18} className="ml-auto shrink-0 text-(--text-accent)" />}
                                </button>
                            );
                        })}
                    </div>

                    {/*currency symbol*/}
                    <FieldLabel
                        label={translation.settings.currencyDisplay}
                        hint={translation.settings.currencyDisplayHint}
                    />
                    <div className="flex flex-wrap gap-3">
                        {CURRENCY_DISPLAY_OPTIONS[settings.currencyCode].map((symbol: string) => {
                            const active = symbol === settings.currencySymbol;
                            return (
                                <button
                                    key={symbol}
                                    onClick={() => save("currencySymbol", symbol)}
                                    className={`px-3 py-2 w-21 rounded-full font-mono font-bold border transition duration-120 cursor-pointer active:shadow-[0_0_8px_var(--text-accent)] ${active ? "bg-(--text-accent) border-(--text-accent) text-(--text-btn)" : "bg-(--bg-card) border-(--border) text-(--text-accent)"}`}
                                >
                                    {symbol}
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/*price format*/}
                <section className="cyber-card p-5 md:p-6 mb-5">
                    <SectionTitle label={translation.settings.sections.number} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/*separator places*/}
                        <div>
                            <FieldLabel
                                label={translation.settings.separatorPlaces}
                                hint={translation.settings.separatorPlacesHint}
                            />
                            <SegmentPicker
                                options={[0, 1, 2, 3, 4, 5] as (0 | 1 | 2 | 3 | 4 | 5)[]}
                                value={settings.separatorPlaces}
                                onChange={v => save("separatorPlaces", v)}
                            />
                        </div>

                        {/*decimal places*/}
                        <div>
                            <FieldLabel
                                label={translation.settings.decimalPlaces}
                                hint={translation.settings.decimalPlacesHint}
                            />
                            <SegmentPicker
                                options={[0, 1, 2] as (0 | 1 | 2)[]}
                                value={settings.decimalPlaces}
                                onChange={v => save("decimalPlaces", v)}
                            />
                        </div>

                        {/*thousands separator*/}
                        <div>
                            <FieldLabel
                                label={translation.settings.thousandsSeparator}
                                hint={translation.settings.thousandsSeparatorHint}
                            />
                            <CharInput
                                value={settings.thousandsSeparator}
                                onChange={v => save("thousandsSeparator", v)}
                                placeholder=","
                            />
                        </div>

                        {/*decimal separator*/}
                        <div>
                            <FieldLabel
                                label={translation.settings.thousandthsSeparator}
                                hint={translation.settings.thousandthsSeparatorHint}
                            />
                            <CharInput
                                value={settings.thousandthsSeparator}
                                onChange={v => save("thousandthsSeparator", v)}
                                placeholder="."
                            />
                        </div>
                    </div>

                    {/*live price preview*/}
                    <div className="mt-9 flex items-center justify-between p-3 rounded-xl bg-(--bg-card) border border-(--border)">
                        <span className="text-(--text-muted)">{translation.settings.pricePreview}</span>
                        <span className="font-mono font-bold text-(--text-accent)">{formatPrice(PREVIEW_PRICE)}</span>
                    </div>
                </section>

                {/*date & time*/}
                <section className="cyber-card p-5 md:p-7">
                    <SectionTitle label={translation.settings.sections.date} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/*date format*/}
                        <div className="sm:col-span-2">
                            <FieldLabel
                                label={translation.settings.dateFormat}
                                hint={translation.settings.dateFormatHint}
                            />
                            <OptionPicker
                                data={dateFormats}
                                index={dateFormatIndex}
                                onChange={(index: number) => save("dateFormat", dateFormats[index].value)}
                            />
                        </div>

                        {/*timezone*/}
                        <div className="sm:col-span-2">
                            <FieldLabel
                                label={translation.settings.timezone}
                                hint={translation.settings.timezoneHint}
                            />
                            <input
                                placeholder={settings.timezone}
                                value={timezoneSearch}
                                onChange={e => setTimezoneSearch(e.target.value)}
                                className="cyber-input mb-1"
                            />
                            {timezoneSearch && (
                                <div className="max-h-36 overflow-y-auto rounded-xl shadow-xl bg-(--bg-surface) border border-(--border)">
                                    {filteredTimezone.slice(0, 60).map(timezone => (
                                        <button
                                            key={timezone}
                                            onClick={() => {
                                                save("timezone", timezone);
                                                setTimezoneSearch("");
                                            }}
                                            className="w-full text-left p-3 font-sm font-mono transition cursor-pointer active:shadow-[0_0_8px_var(--text-accent)] hover:bg-(--bg-hover) text-(--text-accent)"
                                        >
                                            {timezone}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/*live clock*/}
                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/*unformatted current time*/}
                        <div className="flex items-center justify-between p-3 rounded-xl bg-(--bg-card) border border-(--border)">
                            <span className="text-(--text-muted)">{translation.settings.currentTime}</span>
                            <span className="font-mono font-bold text-(--text-accent)">{nowString}</span>
                        </div>

                        {/*preview formatted current time*/}
                        <div className="flex items-center justify-between p-3 rounded-xl bg-(--bg-card) border border-(--border)">
                            <span className="text-(--text-muted)">{translation.settings.datePreview}</span>
                            <span className="font-mono font-bold text-(--text-accent)">
                                {formatDateSetting(getDate())}
                            </span>
                        </div>
                    </div>
                </section>
            </div>
        </Dashboard>
    );
}
