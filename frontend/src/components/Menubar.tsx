import {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {UserContext} from "../context/UserContext";
import {useTheme} from "../context/ThemeContext";
import {useI18n, LOCALE_OPTIONS, type Locale} from "../context/I18nContext";
import {useNavigate} from "react-router-dom";
import {CircleX, Menu, User, LogOut, Settings, Sun, Moon, ChevronDown} from "lucide-react";
import logo from "../assets/images/logo.png";
import toast from "react-hot-toast";
import Sidebar from "./Sidebar";

interface Props {
    activeRoute: string;
}

export default function Menubar({activeRoute}: Props) {
    const [isOpenSideMenu, setIsOpenSideMenu] = useState<boolean>(false);
    const [isShowUserMenu, setIsShowUserMenu] = useState<boolean>(false);
    const [isShowLangMenu, setIsShowLangMenu] = useState<boolean>(false);

    const userDropdown = useRef<HTMLDivElement>(null);
    const langDropdown = useRef<HTMLDivElement>(null);

    const context = useContext(UserContext);
    const {isDark, toggleTheme} = useTheme();
    const {locale, setLocale, translation: t} = useI18n();
    const navigate = useNavigate();

    if (!context) return null;
    const {user, clearUser, loading} = context;

    useEffect(() => {
        if (!loading && !user) navigate("/login");
    }, [user, loading, navigate]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (userDropdown.current && !userDropdown.current.contains(e.target as Node)) setIsShowUserMenu(false);
            if (langDropdown.current && !langDropdown.current.contains(e.target as Node)) setIsShowLangMenu(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = useCallback(() => {
        clearUser();
        localStorage.removeItem("token");
        toast.success(t.auth.logoutSuccess);
        navigate("/login");
    }, [clearUser, navigate, t]);

    const handleLangSelect = useCallback(
        (locale: Locale) => {
            setLocale(locale);
            setIsShowLangMenu(false);
        },
        [setLocale]
    );

    const currentLocale = useMemo(() => LOCALE_OPTIONS.find(o => o.value === locale)!, [locale]);

    const navigatorButtonBase =
        "flex items-center justify-center w-10 h-10 rounded-xl border transition cursor-pointer";
    const navigatorButtonStyle = "border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)]";

    return (
        <header
            className="sticky top-0 z-50 w-full p-3"
            style={{
                borderBottom: "1px solid var(--border)",
                background: "color-mix(in srgb, var(--bg-surface) 85%, transparent)",
                backdropFilter: "blur(12px)"
            }}
        >
            <div className="flex items-center justify-between gap-3 max-w-[1920px] mx-auto">
                {/*left*/}
                <div className="flex items-center gap-2">
                    {/*mobile*/}
                    <button
                        className="lg:hidden rounded-xl p-2.5 transition cursor-pointer"
                        style={{background: "var(--bg-card)", border: "1px solid var(--border)"}}
                        onClick={() => setIsOpenSideMenu(p => !p)}
                    >
                        {isOpenSideMenu ? (
                            <CircleX size={20} style={{color: "#f87171"}} />
                        ) : (
                            <Menu size={20} style={{color: "var(--text-accent)"}} />
                        )}
                    </button>

                    {/*logo and name*/}
                    <button
                        className="group flex items-center gap-2.5 cursor-pointer"
                        onClick={() => navigate("/home")}
                    >
                        <img
                            src={logo}
                            alt="logo"
                            className="h-11 w-11 rounded-xl group-hover:scale-110 transition duration-300"
                            style={{border: "1px solid var(--border)"}}
                        />
                        {/*name handler*/}
                        <span
                            className="font-mono font-bold text-base hidden xs:block sm:hidden"
                            style={{color: "var(--text-accent)"}}
                        >
                            {t.nav.appShort}
                        </span>
                        <span
                            className="font-mono font-bold text-base hidden sm:block"
                            style={{color: "var(--text-accent)"}}
                        >
                            {t.nav.appName}
                        </span>
                    </button>
                </div>

                {/*right*/}
                <div className="flex items-center gap-2">
                    {/*theme toggle*/}
                    <button
                        onClick={toggleTheme}
                        title={isDark ? t.theme.light : t.theme.dark}
                        className={`${navigatorButtonBase} ${navigatorButtonStyle}`}
                    >
                        {isDark ? (
                            <Sun size={17} className="text-yellow-400" />
                        ) : (
                            <Moon size={17} style={{color: "var(--text-accent)"}} />
                        )}
                    </button>

                    {/*language dropdown*/}
                    <div className="relative" ref={langDropdown}>
                        <button
                            onClick={() => setIsShowLangMenu(p => !p)}
                            className="flex items-center gap-1.5 px-2.5 h-10 rounded-xl border transition cursor-pointer text-sm font-medium"
                            style={{
                                background: "var(--bg-surface)",
                                borderColor: "var(--border)",
                                color: "var(--text-accent)"
                            }}
                        >
                            <span>{currentLocale.flag}</span>
                            <span className="hidden md:block text-xs">{currentLocale.label}</span>
                            <ChevronDown
                                size={13}
                                className={`transition-transform duration-200 ${isShowLangMenu ? "rotate-180" : ""}`}
                            />
                        </button>
                        {isShowLangMenu && (
                            <div
                                className="absolute right-0 mt-2 w-48 rounded-xl overflow-hidden shadow-xl z-50"
                                style={{background: "var(--bg-surface)", border: "1px solid var(--border)"}}
                            >
                                {LOCALE_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => handleLangSelect(opt.value)}
                                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition cursor-pointer"
                                        style={{
                                            background: locale === opt.value ? "var(--bg-hover)" : "transparent",
                                            color: locale === opt.value ? "var(--text-accent)" : "var(--text-dim)"
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                                        onMouseLeave={e =>
                                            (e.currentTarget.style.background =
                                                locale === opt.value ? "var(--bg-hover)" : "transparent")
                                        }
                                    >
                                        <span className="text-base">{opt.flag}</span>
                                        <span>{opt.label}</span>
                                        {locale === opt.value && (
                                            <span
                                                className="ml-auto w-1.5 h-1.5 rounded-full"
                                                style={{background: "var(--text-accent)"}}
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/*user dropdown*/}
                    <div className="relative" ref={userDropdown}>
                        <button
                            onClick={() => setIsShowUserMenu(p => !p)}
                            className="flex items-center gap-2 px-2.5 h-10 rounded-xl border transition cursor-pointer"
                            style={{background: "var(--bg-surface)", borderColor: "var(--border)"}}
                        >
                            {user?.profileImage ? (
                                <img
                                    src={user.profileImage}
                                    alt="avatar"
                                    className="w-6 h-6 rounded-full object-cover"
                                />
                            ) : (
                                <User size={17} style={{color: "#9900ff"}} />
                            )}
                            <span
                                className="text-xs font-medium hidden sm:block max-w-[100px] truncate"
                                style={{color: "var(--text-accent)"}}
                            >
                                {user?.firstName}
                            </span>
                            <ChevronDown
                                size={13}
                                style={{color: "var(--text-muted)"}}
                                className={`transition-transform duration-200 ${isShowUserMenu ? "rotate-180" : ""}`}
                            />
                        </button>

                        {isShowUserMenu && (
                            <div
                                className="absolute right-0 mt-3 w-64 rounded-xl shadow-xl z-50"
                                style={{background: "var(--bg-surface)", border: "1px solid var(--border)"}}
                            >
                                {/* User info */}
                                <div className="px-4 py-3" style={{borderBottom: "1px solid var(--border)"}}>
                                    <p className="text-sm font-bold truncate" style={{color: "var(--text-accent)"}}>
                                        {user?.firstName} {user?.lastName}
                                    </p>
                                    <p className="text-xs truncate mt-0.5" style={{color: "var(--text-muted)"}}>
                                        {user?.email}
                                    </p>
                                </div>
                                {/*settings*/}
                                <button
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition cursor-pointer"
                                    style={{color: "var(--text-dim)"}}
                                    onClick={() => {
                                        setIsShowUserMenu(false);
                                        navigate("/settings");
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                >
                                    <Settings size={16} />
                                    {t.nav.settings}
                                </button>
                                {/*logout*/}
                                <button
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition cursor-pointer rounded-b-xl"
                                    style={{color: "#f87171"}}
                                    onClick={handleLogout}
                                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(248,113,113,0.08)")}
                                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                >
                                    <LogOut size={16} />
                                    {t.nav.logout}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile overlay + sidebar */}
            {isOpenSideMenu && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setIsOpenSideMenu(false)}
                    />
                    <div className="fixed inset-y-0 left-0 top-[68px] w-72 z-50 lg:hidden">
                        <Sidebar setIsOpenSideMenu={setIsOpenSideMenu} activeRoute={activeRoute} isMobile />
                    </div>
                </>
            )}
        </header>
    );
}
