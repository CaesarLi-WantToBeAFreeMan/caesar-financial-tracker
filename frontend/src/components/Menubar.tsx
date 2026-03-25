/*
 * top navigation bar
 */
import {useCallback, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {CircleX, Menu, User, LogOut, Settings, ChevronDown, PanelRightOpen, PanelLeftOpen} from "lucide-react";
import toast from "react-hot-toast";

import {useUser} from "../context/UserContext";
import {useI18n} from "../context/I18nContext";
import {storage} from "../utilities/storage";
import {useClickOutside} from "../hooks/useClickOutside";
import PageHeader from "./PageHeader";

interface Props {
    sidebarOpen?: boolean;
    onToggleSidebar?: () => void;
}

export default function Menubar({sidebarOpen, onToggleSidebar}: Props) {
    const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(sidebarOpen ?? false);
    const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
    const [langMenuOpen, setLangMenuOpen] = useState<boolean>(false);

    const userDropdownRef = useRef<HTMLDivElement>(null);
    const langDropdownRef = useRef<HTMLDivElement>(null);

    const {user, clearUser} = useUser();
    const {translation} = useI18n();
    const navigate = useNavigate();

    //close dropdown list when the user clicking/tapping outside
    useClickOutside(userDropdownRef, () => setUserMenuOpen(false), userMenuOpen);
    useClickOutside(langDropdownRef, () => setLangMenuOpen(false), langMenuOpen);

    const handleLogout = useCallback(() => {
        clearUser();
        storage.remove("token");
        toast.success(translation.authentication.logoutSuccess);
        navigate("/login");
    }, [clearUser, navigate, translation]);

    return (
        <PageHeader
            left={
                <button
                    className="flex items-center rounded-xl p-2 cursor-pointer bg-(--bg-card) border border-(--border) transition duration-300 md:hover:scale-120"
                    onClick={() => {
                        onToggleSidebar && onToggleSidebar();
                        setSideMenuOpen(p => !p);
                    }}
                >
                    {/*desktop*/}
                    <span className="hidden md:flex">
                        {sideMenuOpen ? (
                            <PanelRightOpen size={16} className="text-(--text-wrong)" />
                        ) : (
                            <PanelLeftOpen size={16} className="text-(--text-accent)" />
                        )}
                    </span>

                    {/*mobile*/}
                    <span className="flex md:hidden">
                        {sideMenuOpen ? (
                            <CircleX size={16} className="text-(--text-wrong)" />
                        ) : (
                            <Menu size={16} className="text-(--text-accent)" />
                        )}
                    </span>
                </button>
            }
            right={
                <div className="relative" ref={userDropdownRef}>
                    <button
                        onClick={() => setUserMenuOpen(p => !p)}
                        className="group flex items-center gap-2 px-3 h-10 rounded-xl cursor-pointer bg-(--bg-surface) border border-(--border)"
                    >
                        {user?.profileImage ? (
                            <img
                                src={user.profileImage}
                                alt="avatar"
                                className="w-6 h-6 rounded-full object-cover transition duration-300 group-hover:scale-120"
                            />
                        ) : (
                            <User size={16} className="text-(--text-accent)" />
                        )}
                        <span className="text-xs font-medium hidden sm:block max-w-23 truncate text-(--text-accent)">
                            {user?.firstName}
                        </span>
                        <ChevronDown
                            size={12}
                            className={`text-(--text-accent) transition duration-300 ${userMenuOpen ? "rotate-180" : ""}`}
                        />
                    </button>

                    {userMenuOpen && (
                        <div className="absolute right-0 mt-3 w-60 rounded-xl z-50 overflow-hidden cyber-dropdown">
                            {/*user info*/}
                            <div className="px-4 py-3 border-b-2 border-(--border)">
                                <p className="flex items-center justify-between gap-3 text-sm font-bold truncate text-(--text-accent)">
                                    {user?.firstName}
                                    <span className="font-bold">{user?.lastName}</span>
                                </p>
                                <p className="text-xs mt-1 truncate text-(--text-muted)">{user?.email}</p>
                            </div>

                            {/*settings button*/}
                            <button
                                onClick={() => {
                                    setUserMenuOpen(false);
                                    navigate("/settings");
                                }}
                                className="group w-full flex items-center gap-3 px-4 py-3 text-sm cursor-pointer transition duration-300 hover:bg-(--bg-hover)"
                            >
                                <Settings size={16} className="transition duration-300 group-hover:scale-120" />{" "}
                                {translation.navigation.settings}
                            </button>

                            {/*logout button*/}
                            <button
                                onClick={handleLogout}
                                className="group w-full flex items-center gap-3 px-4 py-3 text-sm cursor-pointer transition duration-300 hover:bg-(--bg-hover)"
                            >
                                <LogOut size={16} className="transition duration-300 group-hover:scale-120" />{" "}
                                {translation.navigation.logout}
                            </button>
                        </div>
                    )}
                </div>
            }
        />
    );
}
