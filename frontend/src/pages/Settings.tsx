import {useCallback, useEffect, useMemo, useState} from "react";
import Dashboard from "../components/Dashboard";
import {useUser} from "../hooks/useUser";
import {useI18n} from "../context/I18nContext";
import {
    useSettings,
    CURRENCY_OPTIONS,
    DATE_FORMAT_OPTIONS,
    formatPrice,
    formatDate,
    type FontSize,
    type AppSettings
} from "../context/SettingsContext";
import {RotateCcw, Check} from "lucide-react";
import toast from "react-hot-toast";

//helpers
function Row({label, hint, children}: {label: string; hint?: string; children: React.ReactNode}) {
    return (
        <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 items-start py-3"
            style={{borderBottom: "1px solid var(--border)"}}
        >
            <div>
                <p className="text-sm font-medium" style={{color: "var(--text-primary)"}}>
                    {label}
                </p>
                {hint && (
                    <p className="text-xs mt-0.5" style={{color: "var(--text-muted)"}}>
                        {hint}
                    </p>
                )}
            </div>
            <div>{children}</div>
        </div>
    );
}

function SepInput({value, onChange}: {value: string; onChange: (v: string) => void}) {
    return (
        <input
            value={value}
            maxLength={3}
            onChange={e => onChange(e.target.value)}
            className="cyber-input max-w-[80px] text-center font-mono text-lg"
        />
    );
}

function SegmentPicker<T extends string>({
    options,
    value,
    onChange,
    disabled
}: {
    options: {value: T; label: string}[];
    value: T;
    onChange: (v: T) => void;
    disabled?: T[];
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map(option => {
                const isActive = option.value === value;
                const isDisabled = disabled?.includes(option.value);
                return (
                    <button
                        key={option.value}
                        onClick={() => !isDisabled && onChange(option.value)}
                        disabled={!!isDisabled}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer"
                        style={{
                            background: isActive ? "var(--text-accent)" : "var(--bg-card)",
                            color: isActive ? "#0a001f" : isDisabled ? "var(--text-muted)" : "var(--text-dim)",
                            border: `1px solid ${isActive ? "var(--text-accent)" : "var(--border)"}`,
                            opacity: isDisabled ? 0.45 : 1,
                            cursor: isDisabled ? "not-allowed" : "pointer"
                        }}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}

export default function Settings() {
    useUser();
    const {translation, locale} = useI18n();
    const {settings, updateSetting, resetToDefaults} = useSettings();
    const translationSettings = translation.settings;

    //local draft to preview
    const [draft, setDraft] = useState<AppSettings>(settings);
    useEffect(() => {
        setDraft(settings);
    }, [settings]);

    const update = useCallback(
        <K extends keyof AppSettings>(key: K, val: AppSettings[K]) => {
            updateSetting(key, val);
        },
        [updateSetting]
    );

    //live preview
    const samplePrice = 1234567.89;
    const sampleDate = new Date().toISOString().split("T")[0];
    const previewPrice = useMemo(() => formatPrice(samplePrice, settings), [settings]);
    const previewDate = useMemo(() => formatDate(sampleDate, settings.dateFormat, settings.timezone), [settings]);

    //time zones
    const allTimezones = useMemo(() => Intl.supportedValuesOf?.("timeZone") ?? [], []);
    const [timeZoneSearch, setTimeZoneSearch] = useState<string>("");
    const filteredTimeZone = useMemo(
        () =>
            timeZoneSearch.trim()
                ? allTimezones.filter(zone => zone.toLowerCase().includes(timeZoneSearch.toLowerCase())).slice(0, 20)
                : allTimezones.slice(0, 20),
        [timeZoneSearch, allTimezones]
    );

    //current local time
    const [currentTime, setCurrentTime] = useState<string>("");
    useEffect(() => {
        const tick = () => {
            try {
                setCurrentTime(
                    new Intl.DateTimeFormat(locale, {
                        timeZone: settings.timezone,
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false
                    }).format(new Date())
                );
            } catch {
                setCurrentTime("");
            }
        };
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [settings.timezone, locale]);

    const currencyOptions = useMemo(() => CURRENCY_OPTIONS[locale] ?? CURRENCY_OPTIONS["en-US"], [locale]);

    const fontSizeOptions: {value: FontSize; label: string}[] = [
        {value: "xs", label: translationSettings.fontSizes.xs},
        {value: "sm", label: translationSettings.fontSizes.sm},
        {value: "md", label: translationSettings.fontSizes.md},
        {value: "lg", label: translationSettings.fontSizes.lg},
        {value: "xl", label: translationSettings.fontSizes.xl}
    ];

    const sectionHdr = (label: string) => <h3 className="cyber-section mt-6 first:mt-0">{label}</h3>;

    return (
        <Dashboard activeRoute={translation.nav.settings}>
            <div className="max-w-3xl mx-auto">
                {/*header*/}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold" style={{color: "var(--text-accent)"}}>
                        {translationSettings.title}
                    </h1>
                    <button
                        onClick={() => {
                            resetToDefaults(locale);
                            toast.success(translationSettings.saved);
                        }}
                        className="cyber-btn-ghost flex items-center gap-2 text-sm px-4 py-2"
                    >
                        <RotateCcw size={15} /> {translationSettings.reset}
                    </button>
                </div>

                {/*preview*/}
                <div className="cyber-card p-4 mb-6 flex flex-wrap gap-6">
                    <div>
                        <p className="text-xs mb-1" style={{color: "var(--text-muted)"}}>
                            Price preview
                        </p>
                        <p className="font-mono font-bold text-lg" style={{color: "var(--text-accent)"}}>
                            {previewPrice}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs mb-1" style={{color: "var(--text-muted)"}}>
                            Date preview
                        </p>
                        <p className="font-mono font-bold text-lg" style={{color: "var(--text-accent)"}}>
                            {previewDate}
                        </p>
                    </div>
                </div>

                {/*number format*/}
                {sectionHdr(translationSettings.sections.number)}

                <Row label={translationSettings.thousandsSep} hint={translationSettings.thousandsSepHint}>
                    <SepInput value={settings.thousandsSep} onChange={v => update("thousandsSep", v)} />
                </Row>
                <Row label={translationSettings.thousandthsSep} hint={translationSettings.thousandthsSepHint}>
                    <SepInput value={settings.thousandthsSep} onChange={v => update("thousandthsSep", v)} />
                </Row>
                <Row label={translationSettings.separatorNum} hint={translationSettings.separatorNumHint}>
                    <SegmentPicker
                        options={[
                            {value: 3 as any, label: "3"},
                            {value: 4 as any, label: "4"}
                        ]}
                        value={settings.separatorNum as any}
                        onChange={v => update("separatorNum", Number(v) as 3 | 4)}
                    />
                </Row>

                {/*currency*/}
                {sectionHdr(translationSettings.sections.currency)}

                <Row label={translationSettings.currencySymbol}>
                    <div className="flex flex-wrap gap-2">
                        {currencyOptions.map(opt => (
                            <button
                                key={opt.symbol}
                                onClick={() => update("currencySymbol", opt.symbol)}
                                className="px-3 py-1.5 rounded-lg text-sm font-mono font-bold transition cursor-pointer"
                                style={{
                                    background:
                                        settings.currencySymbol === opt.symbol
                                            ? "var(--text-accent)"
                                            : "var(--bg-card)",
                                    color: settings.currencySymbol === opt.symbol ? "#0a001f" : "var(--text-dim)",
                                    border: `1px solid ${settings.currencySymbol === opt.symbol ? "var(--text-accent)" : "var(--border)"}`
                                }}
                            >
                                {opt.symbol}
                            </button>
                        ))}
                        <input
                            value={settings.currencySymbol}
                            maxLength={5}
                            onChange={e => update("currencySymbol", e.target.value)}
                            className="cyber-input max-w-[70px] text-center font-mono"
                            placeholder="$"
                        />
                    </div>
                </Row>

                <Row label={translationSettings.floatPlaces} hint={translationSettings.floatPlacesHint}>
                    <SegmentPicker
                        options={[0, 1, 2].map(n => ({value: n as any, label: String(n)}))}
                        value={settings.floatPlaces as any}
                        onChange={v => update("floatPlaces", Number(v) as 0 | 1 | 2)}
                    />
                </Row>

                {/*date and time*/}
                {sectionHdr(translationSettings.sections.date)}

                <Row label={translationSettings.dateFormat} hint={translationSettings.dateFormatHint}>
                    <select
                        value={settings.dateFormat}
                        onChange={e => update("dateFormat", e.target.value as any)}
                        className="cyber-input max-w-xs text-sm"
                    >
                        {DATE_FORMAT_OPTIONS.map(f => (
                            <option key={f} value={f}>
                                {f}
                            </option>
                        ))}
                    </select>
                </Row>

                <Row label={translationSettings.timezone} hint={translationSettings.timezoneHint}>
                    <div className="space-y-2">
                        <input
                            value={timeZoneSearch}
                            onChange={e => setTimeZoneSearch(e.target.value)}
                            placeholder="Search timezone..."
                            className="cyber-input text-sm"
                        />
                        <select
                            value={settings.timezone}
                            onChange={e => update("timezone", e.target.value)}
                            className="cyber-input text-sm"
                            size={4}
                        >
                            {filteredTimeZone.map(tz => (
                                <option key={tz} value={tz}>
                                    {tz}
                                </option>
                            ))}
                        </select>
                    </div>
                </Row>

                <Row label={translationSettings.currentTime}>
                    <p className="font-mono text-sm" style={{color: "var(--text-accent)"}}>
                        {currentTime}
                    </p>
                </Row>

                {/*display*/}
                {sectionHdr(translationSettings.sections.display)}

                <Row label={translationSettings.fontSize}>
                    <SegmentPicker
                        options={fontSizeOptions}
                        value={settings.fontSize}
                        onChange={v => update("fontSize", v)}
                    />
                </Row>

                {/*interface*/}
                {sectionHdr(translationSettings.sections.ui)}

                <Row label={translationSettings.uiStyle}>
                    <SegmentPicker
                        options={[
                            {value: "cyberpunk" as any, label: translationSettings.cyberpunk},
                            {value: "ondark" as any, label: translationSettings.ondark},
                            {value: "classic" as any, label: translationSettings.classic}
                        ]}
                        value={settings.uiStyle as any}
                        onChange={v => update("uiStyle", v as any)}
                        disabled={["ondark", "classic"] as any}
                    />
                </Row>

                {/*ad area*/}
                {sectionHdr(translationSettings.sections.advanced)}

                <div
                    className="mt-4 rounded-xl p-4 flex items-center justify-center"
                    style={{border: "2px dashed var(--border)", minHeight: "100px"}}
                >
                    <div className="text-center">
                        <p className="text-sm font-bold mb-1" style={{color: "var(--text-muted)"}}>
                            {translationSettings.adArea}
                        </p>
                        <p className="text-xs" style={{color: "var(--border)"}}>
                            {translationSettings.adAreaHint}
                        </p>
                    </div>
                </div>

                {/*save button*/}
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => toast.success(translationSettings.saved)}
                        className="cyber-btn flex items-center gap-2 px-8"
                    >
                        <Check size={16} /> {translation.common.save}
                    </button>
                </div>
            </div>
        </Dashboard>
    );
}
