import {useMemo} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useI18n, LOCALE_OPTIONS, type Locale} from "../context/I18nContext";
import {useTheme} from "../context/ThemeContext";
import {Banknote, ChartBar, FileText, Globe, Moon, ShieldCheck, Sun, ChevronDown, LogIn, UserPlus} from "lucide-react";
import logo from "../assets/images/logo.png";
import {useState} from "react";

const TECH_STACK = [
    {label: "Spring Boot 4", color: "#22d3ee"},
    {label: "React 19", color: "#a855f7"},
    {label: "TypeScript 5", color: "#3b82f6"},
    {label: "Tailwind 4", color: "#10b981"},
    {label: "PostgreSQL", color: "#f59e0b"},
    {label: "MySQL", color: "#ec4899"},
    {label: "JWT Auth", color: "#f97316"},
    {label: "Recharts", color: "#84cc16"},
    {label: "Vite 7", color: "#06b6d4"},
    {label: "Apache POI", color: "#ef4444"}
];

const FEATURE_ICONS = [Banknote, ChartBar, FileText, Globe, Moon, ShieldCheck];

export default function Home() {
    const {translation, locale, setLocale} = useI18n();
    const {isDark, toggleTheme} = useTheme();
    const navigate = useNavigate();
    const [showLang, setShowLang] = useState<boolean>(false);

    const currentLocale = useMemo(() => LOCALE_OPTIONS.find(option => option.value === locale)!, [locale]);
    const isLoggedIn = !!localStorage.getItem("token");

    const features = useMemo(
        () => [
            translation.home.features.track,
            translation.home.features.charts,
            translation.home.features.import,
            translation.home.features.i18n,
            translation.home.features.theme,
            translation.home.features.secure
        ],
        [translation]
    );

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{background: "var(--bg-base)", color: "var(--text-primary)"}}
        >
            {/*navigator*/}
            <nav
                className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 py-3"
                style={{
                    background: "color-mix(in srgb, var(--bg-surface) 85%, transparent)",
                    borderBottom: "1px solid var(--border)",
                    backdropFilter: "blur(12px)"
                }}
            >
                {/*logo*/}
                <button onClick={() => navigate("/home")} className="group flex items-center gap-2.5 cursor-pointer">
                    <img
                        src={logo}
                        alt="logo"
                        className="h-10 w-10 rounded-xl group-hover:scale-120 transition"
                        style={{border: "1px solid var(--border)"}}
                    />
                    <span className="font-mono font-bold text-sm hidden sm:block" style={{color: "var(--text-accent)"}}>
                        {translation.nav.appName}
                    </span>
                </button>

                {/*right controls*/}
                <div className="flex items-center gap-3">
                    {/*theme*/}
                    <button
                        onClick={toggleTheme}
                        className="flex items-center justify-center w-9 h-9 rounded-xl transition cursor-pointer"
                        style={{background: "var(--bg-card)", border: "1px solid var(--border)"}}
                    >
                        {isDark ? (
                            <Sun size={16} className="text-yellow-400" />
                        ) : (
                            <Moon size={16} style={{color: "var(--text-accent)"}} />
                        )}
                    </button>
                    {/*language*/}
                    <div className="relative">
                        <button
                            onClick={() => setShowLang(p => !p)}
                            className="flex items-center gap-1.5 px-2.5 h-9 rounded-xl text-sm transition cursor-pointer"
                            style={{
                                background: "var(--bg-card)",
                                border: "1px solid var(--border)",
                                color: "var(--text-accent)"
                            }}
                        >
                            <span>{currentLocale.flag}</span>
                            <span className="hidden md:block text-xs">{currentLocale.label}</span>
                            <ChevronDown size={12} className={`transition-transform ${showLang ? "rotate-180" : ""}`} />
                        </button>
                        {showLang && (
                            <div
                                className="absolute right-0 mt-2 w-44 rounded-xl overflow-hidden shadow-xl z-50"
                                style={{background: "var(--bg-surface)", border: "1px solid var(--border)"}}
                            >
                                {LOCALE_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => {
                                            setLocale(opt.value as Locale);
                                            setShowLang(false);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm cursor-pointer transition"
                                        style={{
                                            color: locale === opt.value ? "var(--text-accent)" : "var(--text-dim)",
                                            background: locale === opt.value ? "var(--bg-hover)" : "transparent"
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                                        onMouseLeave={e =>
                                            (e.currentTarget.style.background =
                                                locale === opt.value ? "var(--bg-hover)" : "transparent")
                                        }
                                    >
                                        <span>{opt.flag}</span>
                                        <span>{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    {/*auth buttons*/}
                    {isLoggedIn ? (
                        <button
                            onClick={() => navigate("/profile")}
                            className="cyber-btn flex items-center gap-1.5 text-sm px-4 py-2"
                        >
                            <LogIn size={15} /> Dashboard
                        </button>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="cyber-btn-ghost flex items-center gap-1.5 text-sm px-4 py-2 hidden sm:flex"
                            >
                                <LogIn size={15} /> {translation.auth.login}
                            </Link>
                            <Link to="/signup" className="cyber-btn flex items-center gap-1.5 text-sm px-4 py-2">
                                <UserPlus size={15} /> {translation.auth.signup}
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/*hero*/}
            <section className="flex flex-col items-center justify-center text-center px-4 py-20 md:py-32">
                <div className="mb-6">
                    <img
                        src={logo}
                        alt="logo"
                        className="h-20 w-20 md:h-28 md:w-28 rounded-2xl mx-auto"
                        style={{border: "2px solid var(--border-glow)", boxShadow: "var(--glow-cyan)"}}
                    />
                </div>
                <h1
                    className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight"
                    style={{color: "var(--text-accent)", fontFamily: "var(--font-mono)"}}
                >
                    {translation.home.hero}
                </h1>
                <p className="text-lg md:text-xl max-w-xl mb-10" style={{color: "var(--text-dim)"}}>
                    {translation.home.heroSub}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                    <Link to={isLoggedIn ? "/profile" : "/signup"} className="cyber-btn px-8 py-3 text-base">
                        {translation.home.getStarted}
                    </Link>
                    <a href="#features" className="cyber-btn-ghost px-8 py-3 text-base">
                        {translation.home.learnMore}
                    </a>
                </div>
            </section>

            {/*features*/}
            <section id="features" className="px-4 md:px-8 py-16 max-w-6xl mx-auto w-full">
                <h2
                    className="text-2xl md:text-3xl font-bold text-center mb-10"
                    style={{color: "var(--text-primary)", fontFamily: "var(--font-mono)"}}
                >
                    {translation.home.featuresTitle}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((feature, index) => {
                        const Icon = FEATURE_ICONS[index];
                        const color = TECH_STACK[index]?.color ?? "var(--text-accent)";
                        return (
                            <div key={index} className="cyber-card p-5 flex gap-4 items-start">
                                <div
                                    className="mt-0.5 p-2.5 rounded-xl shrink-0"
                                    style={{background: `${color}22`, border: `1px solid ${color}55`}}
                                >
                                    <Icon size={20} style={{color}} />
                                </div>
                                <div>
                                    <p className="font-bold mb-1" style={{color: "var(--text-primary)"}}>
                                        {feature.title}
                                    </p>
                                    <p className="text-sm leading-relaxed" style={{color: "var(--text-muted)"}}>
                                        {feature.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/*tech stack*/}
            <section className="px-4 md:px-8 py-16 max-w-4xl mx-auto w-full">
                <h2
                    className="text-2xl font-bold text-center mb-8"
                    style={{color: "var(--text-primary)", fontFamily: "var(--font-mono)"}}
                >
                    {translation.home.techTitle}
                </h2>
                <div className="flex flex-wrap justify-center gap-3">
                    {TECH_STACK.map(tech => (
                        <span
                            key={tech.label}
                            className="px-4 py-2 rounded-full text-sm font-mono font-bold"
                            style={{
                                background: `${tech.color}22`,
                                border: `1px solid ${tech.color}66`,
                                color: tech.color
                            }}
                        >
                            {tech.label}
                        </span>
                    ))}
                </div>
            </section>

            {/*footer*/}
            <footer
                className="mt-auto py-8 text-center"
                style={{borderTop: "1px solid var(--border)", color: "var(--text-muted)"}}
            >
                <p className="text-sm">{translation.home.footerNote}</p>
                <div className="flex justify-center gap-6 mt-3 text-xs">
                    <Link to="/login" style={{color: "var(--text-accent)"}}>
                        {translation.auth.login}
                    </Link>
                    <Link to="/signup" style={{color: "var(--text-accent)"}}>
                        {translation.auth.signup}
                    </Link>
                </div>
            </footer>
        </div>
    );
}
