import {useMemo} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useI18n} from "../context/I18nContext";
import {Banknote, ChartBar, FileText, Globe, Moon, ShieldCheck, LogIn, UserPlus, Gauge} from "lucide-react";
import logo from "../assets/images/logo.png";
import PageHeader from "../components/PageHeader";
import {storage} from "../utilities/storage";

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
    const {translation} = useI18n();
    const navigate = useNavigate();

    const isLoggedIn = !!storage.get("token");

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
        <div className="min-h-screen flex flex-col bg-(--bg-base) text-(--text-primary)">
            <PageHeader
                right={
                    <>
                        {isLoggedIn ? (
                            <button
                                onClick={() => navigate("/profile")}
                                className="cyber-btn flex items-center gap-2 text-sm px-4 py-2"
                            >
                                <Gauge size={15} />
                                Dashboard
                            </button>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="cyber-btn hidden sm:flex items-center gap-2 text-sm px-4 py-2"
                                >
                                    <LogIn size={15} />
                                    {translation.authentication.login}
                                </Link>
                                <Link to="/signup" className="cyber-btn flex items-center gap-2 text-sm px-4 py-2">
                                    <UserPlus size={15} />
                                    {translation.authentication.signup}
                                </Link>
                            </>
                        )}
                    </>
                }
            />

            {/*hero*/}
            <section className="flex flex-col items-center justify-center text-center px-4 py-20 md:py-32">
                <div className="mb-6">
                    <img
                        src={logo}
                        alt="logo"
                        className="h-20 w-20 md:h-28 md:w-28 rounded-2xl mx-auto border-2 border-(--border-glow) shadow-(--glow-cyan)"
                    />
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight text-(--text-accent) font-mono">
                    {translation.home.hero}
                </h1>
                <p className="text-lg md:text-xl max-w-xl mb-10 text-(--text-dim)">{translation.home.heroSub}</p>
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
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-(--text-dim) font-mono">
                    {translation.home.featuresTitle}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 cursor-pointer">
                    {features.map((feature, index) => {
                        const Icon = FEATURE_ICONS[index];
                        const color = TECH_STACK[index]?.color ?? "var(--text-accent)";
                        return (
                            <div key={index} className="cyber-card p-5 flex gap-4 items-start">
                                <div
                                    className="mt-1 p-3 rounded-xl shrink-0 border"
                                    style={{color, borderColor: color}}
                                >
                                    <Icon size={20} style={{color}} />
                                </div>
                                <div>
                                    <p className="font-mono font-bold mb-1 text-(--text-heading)">{feature.title}</p>
                                    <p className="text-sm leading-relaxed" style={{color}}>
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/*tech stack*/}
            <section className="px-4 md:px-8 py-16 max-w-4xl mx-auto w-full">
                <h2 className="text-2xl font-bold text-center mb-8 text-(--text-dim) font-mono">
                    {translation.home.techTitle}
                </h2>
                <div className="flex flex-wrap justify-center gap-3 cursor-pointer">
                    {TECH_STACK.map(tech => (
                        <span
                            key={tech.label}
                            className="px-4 py-2 rounded-full text-sm font-mono font-bold transition duration-300 hover:scale-120 text-(--text-primary)"
                            style={{background: `${tech.color}`, border: `1px solid ${tech.color}`}}
                        >
                            {tech.label}
                        </span>
                    ))}
                </div>
            </section>

            {/*footer*/}
            <footer className="mt-auto py-8 text-center border-t border-(--border) text-(--text-muted)">
                <p className="text-sm">{translation.home.footerNote}</p>
                <div className="flex justify-center gap-6 mt-3 text-xs">
                    <Link to="/login" className="text-(--text-accent)">
                        {translation.authentication.login}
                    </Link>
                    <Link to="/signup" className="text-(--text-accent)">
                        {translation.authentication.signup}
                    </Link>
                </div>
                <p className="m-1 text-sm">v.alpha.1.1</p>
            </footer>
        </div>
    );
}
