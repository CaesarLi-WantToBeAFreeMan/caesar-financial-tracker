import type {ReactNode} from "react";
import {useContext, useMemo} from "react";
import {UserContext} from "../context/UserContext";
import {useI18n} from "../context/I18nContext";
import {useNavigate} from "react-router-dom";
import {User, Tag, Banknote, ChartNoAxesCombined, UserCog} from "lucide-react";

interface Props {
    setIsOpenSideMenu?: React.Dispatch<React.SetStateAction<boolean>>;
    activeRoute: string;
    isMobile?: boolean;
}

export default function Sidebar({setIsOpenSideMenu, activeRoute, isMobile}: Props) {
    const context = useContext(UserContext);
    const {translation} = useI18n();
    const navigate = useNavigate();

    if (!context) return null;
    const {user} = context;

    const menuData = useMemo(
        (): {label: string; icon: ReactNode; path: string}[] => [
            {label: translation.nav.profile, icon: <UserCog size={20} />, path: "/profile"},
            {label: translation.nav.category, icon: <Tag size={20} />, path: "/category"},
            {label: translation.nav.record, icon: <Banknote size={20} />, path: "/record"},
            {label: translation.nav.summary, icon: <ChartNoAxesCombined size={20} />, path: "/summary"}
            // {label: translation.nav.settings, icon: <Settings size={20} />, path: "/settings"}
        ],
        [translation]
    );

    const handleNavigator = (path: string) => {
        setIsOpenSideMenu?.(false);
        navigate(path);
    };

    const baseClass = isMobile
        ? "fixed inset-y-0 left-0 w-72 h-screen flex flex-col z-50"
        : "hidden lg:flex flex-col w-64 sticky top-[68px] h-[calc(100vh-68px)]";

    return (
        <aside
            className={`${baseClass} p-3 overflow-hidden`}
            style={{background: "var(--bg-surface)", borderRight: "1px solid var(--border)"}}
        >
            {/*avatar*/}
            {user && (
                <div
                    className="flex flex-col items-center p-4 rounded-2xl mb-4 shrink-0"
                    style={{background: "var(--bg-card)", border: "1px solid var(--border)"}}
                >
                    <div
                        className="w-16 h-16 rounded-full flex items-center justify-center mb-3 overflow-hidden"
                        style={{border: "2px solid var(--border-glow)"}}
                    >
                        {user.profileImage ? (
                            <img src={user.profileImage} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                            <User size={28} style={{color: "var(--text-accent)"}} />
                        )}
                    </div>
                    <p className="font-bold text-base truncate px-1 text-center" style={{color: "var(--text-accent)"}}>
                        {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs truncate font-mono mt-0.5" style={{color: "var(--text-muted)"}}>
                        {user.email}
                    </p>
                </div>
            )}

            {/*navigator*/}
            <nav className="sidebar-nav">
                {menuData.map(item => {
                    const isActive = activeRoute === item.label;
                    return (
                        <button
                            key={item.path}
                            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 cursor-pointer group"
                            style={{
                                background: isActive ? "var(--bg-hover)" : "transparent",
                                border: `1px solid ${isActive ? "var(--border-glow)" : "transparent"}`,
                                boxShadow: isActive ? "var(--glow-cyan)" : "none",
                                color: isActive ? "var(--text-accent)" : "var(--text-dim)"
                            }}
                            onMouseEnter={e => {
                                if (!isActive) e.currentTarget.style.background = "var(--bg-hover)";
                            }}
                            onMouseLeave={e => {
                                if (!isActive) e.currentTarget.style.background = "transparent";
                            }}
                            onClick={() => handleNavigator(item.path)}
                        >
                            <span style={{color: isActive ? "var(--text-accent)" : "var(--text-muted)"}}>
                                {item.icon}
                            </span>
                            <span className="text-sm font-medium tracking-wide truncate">{item.label}</span>
                            {isActive && (
                                <span
                                    className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                                    style={{background: "var(--text-accent)", boxShadow: "0 0 8px var(--text-accent)"}}
                                />
                            )}
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}
