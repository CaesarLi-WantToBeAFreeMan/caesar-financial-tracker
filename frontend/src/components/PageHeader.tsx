import {useNavigate} from "react-router-dom";
import {LOCALE_OPTIONS, useI18n, type Locale} from "../context/I18nContext";
import {useCallback, useRef, useState} from "react";
import logo from "../assets/images/logo.png";
import {ChevronDown, Moon, Sun} from "lucide-react";
import {useTheme} from "../context/ThemeContext";
import {useSettings} from "../context/SettingsContext";
import {useClickOutside} from "../hooks/useClickOutside";

interface Props {
    left?: React.ReactNode;
    right?: React.ReactNode;
}

export default function PageHeader({left, right}: Props) {
    const {locale, setLocale, translation} = useI18n();
    const navigate = useNavigate();
    const {isDark, toggleTheme} = useTheme();
    const {resetToDefaults} = useSettings();
    const [langMenuOpen, setLangMenuOpen] = useState<boolean>(false);

    const langDropdownRef = useRef<HTMLDivElement>(null);

    useClickOutside(langDropdownRef, () => setLangMenuOpen(false), langMenuOpen);

    const currentLocale = LOCALE_OPTIONS.find(option => option.value === locale)!;

    const handleLangSelect = useCallback(
        (locale: Locale) => {
            setLocale(locale);
            setLangMenuOpen(false);
            resetToDefaults(locale);
        },
        [setLocale]
    );

    return (
        <header className="sticky top-0 z-50 w-full p-3 rounded-xl border-b-3 border-(--border) backdrop-blur-md bg-[color-mix(in_srgb,var(--bg-surface)_85%,transparent)]">
            <div className="flex items-center justify-between gap-3 max-w-screen-2xl ma-auto">
                {/*left side*/}
                <div className="flex items-center gap-3">
                    {/*custom left side*/}
                    {left}

                    {/*left: logo + name*/}
                    <button
                        onClick={() => navigate("/home")}
                        className="group flex items-center gap-3 cursor-pointer transition"
                    >
                        {/*logo*/}
                        <img
                            src={logo}
                            alt="logo"
                            className="h-10 w-10 rounded-xl border border-(--border) group-hover:scale-120 transition"
                        />
                        {/*name*/}
                        <span className="font-mono font-bold xs:block sm:hidden text-sm text-(--text-accent)">
                            {translation.navigation.appAbbr}
                        </span>
                        <span className="font-mono font-bold hidden sm:block text-sm text-(--text-accent)">
                            {translation.navigation.appName}
                        </span>
                    </button>
                </div>

                {/*right side*/}
                <div className="flex items-center gap-3">
                    {/*right: language picker + theme toggle*/}
                    <div className="flex items-center gap-2">
                        {/*language dropdown list*/}
                        <div className="relative" ref={langDropdownRef}>
                            <button
                                onClick={() => setLangMenuOpen(p => !p)}
                                className="flex items-center gap-2 px-3 h-10 rounded-xl border border-(--border) bg-(--bg-card) text-(--text-accent) cursor-pointer text-sm font-medium"
                            >
                                <span className={`fi fi-${currentLocale.flag}`} />
                                <span className="hidden md:block text-xs">{currentLocale.label}</span>
                                <ChevronDown
                                    size={12}
                                    className={`transition duration-300 ${langMenuOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {langMenuOpen && (
                                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 rounded-xl overflow-hidden shadow-xl z-50 cyber-dropdown">
                                    {LOCALE_OPTIONS.map(option => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleLangSelect(option.value)}
                                            className={`group w-full flex items-center gap-3 px-4 py-3 text-sm cursor-pointer transition duration-300 hover:bg-(--bg-hover)
                                        ${locale === option.value ? "text-(--text-accent) bg-(--bg-hover)" : ""}`}
                                        >
                                            <span
                                                className={`fi fi-${option.flag} text-base transition duration-300 group-hover:scale-120`}
                                            />
                                            <span>{option.label}</span>
                                            {locale === option.value && (
                                                <span className="ml-auto w-2 h-2 rounded-full bg-(--text-accent)" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/*theme toggle*/}
                        <button
                            onClick={toggleTheme}
                            className="flex items-center gap-2 px-3 h-10 rounded-xl border border-(--border) bg-(--bg-surface) text-(--text-accent) transition cursor-pointer active:shadow-[0_0_12px_var(--text-accent)] text-sm font-medium"
                        >
                            {isDark ? (
                                <Moon size={16} className="text-(--cp-dark-blue)" />
                            ) : (
                                <Sun size={16} className="text-(--cp-light-orange)" />
                            )}
                            <span className="hidden md:block text-xs">
                                {isDark ? translation.theme.dark : translation.theme.light}
                            </span>
                        </button>

                        {/*custom right side*/}
                        {right}
                    </div>
                </div>
            </div>
        </header>
    );
}
