import React, {useContext, type ReactNode} from "react";
import {UserContext} from "../context/UserContext";
import {User, Tag, Banknote, ChartNoAxesCombined, UserCog} from "lucide-react";
import {useNavigate} from "react-router-dom";

interface MenuDataType {
    label: string;
    icon: ReactNode;
    path: string;
}

interface SidebarPropsType {
    setIsOpenSideMenu?: React.Dispatch<React.SetStateAction<boolean>>;
    activeRoute: string;
    isMobile?: boolean;
}

const menuData: MenuDataType[] = [
    {label: "Profile", icon: <UserCog size={21} />, path: "/profile"},
    {label: "Category", icon: <Tag size={21} />, path: "/category"},
    {label: "Record", icon: <Banknote size={21} />, path: "/record"},
    {label: "Summary", icon: <ChartNoAxesCombined size={21} />, path: "/summary"}
];

export default function Sidebar({setIsOpenSideMenu, activeRoute, isMobile}: SidebarPropsType) {
    const context = useContext(UserContext);
    const navigate = useNavigate();

    if (!context) return null;
    const {user} = context;

    return (
        <aside
            className={`${isMobile ? "fixed inset-y-0 left-0 w-full bg-[#0a001f] h-screen flex flex-col z-120" : "hidden lg:flex flex-col w-64 sticky top-20"} p-3 transition duration-300`}
        >
            {user && (
                <div className="flex flex-col items-center p-5 bg-black/40 rounded-2xl mb-8 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                    <div className="w-20 h-20 rounded-full bg-cyan-950 flex items-center justify-center border-2 border-magenta-500/50 mb-4 overflow-hidden shadow-[0_0_10px_rgba(255,98,229,0.3)]">
                        {user.profileImage ? (
                            <img src={user.profileImage} alt="profile" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-10 h-10 text-magenta-400" />
                        )}
                    </div>

                    <div className="w-full min-w-0 text-center">
                        <p className="text-cyan-400 font-bold text-lg truncate px-2">
                            {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-slate-500 truncate font-mono">{user.email}</p>
                    </div>
                </div>
            )}

            <nav className="flex-1 space-y-3">
                {menuData.map((item: MenuDataType) => {
                    const isActive = activeRoute === item.label;
                    return (
                        <button
                            key={item.path}
                            className={`
                                w-full flex items-center gap-4 p-3.5 rounded-xl transition-all duration-300 group cursor-pointer ${isActive ? "bg-cyan-500/20 text-cyan-400 border border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]" : "text-slate-400 hover:bg-white/5 hover:text-cyan-300 border border-transparent"}`}
                            onClick={() => {
                                setIsOpenSideMenu?.(false);
                                navigate(item.path);
                            }}
                        >
                            <div
                                className={`transition-transform duration-300 group-hover:scale-120 ${isActive ? "text-cyan-400" : "text-cyan-600"}`}
                            >
                                {item.icon}
                            </div>

                            <span
                                className={`text-sm font-medium tracking-wide transition-colors ${isActive ? "text-cyan-300 font-bold" : "group-hover:text-cyan-200"}`}
                            >
                                {item.label}
                            </span>

                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                            )}
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}
