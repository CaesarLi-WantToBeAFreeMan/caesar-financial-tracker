/*
 * left navigation sidebar
 * sticky on desktop/laptop, drawer on mobile/tablet
 */
import {type ReactNode, useMemo} from "react";
import {useUser} from "../context/UserContext";
import {useI18n} from "../context/I18nContext";
import {useNavigate} from "react-router-dom";
import {User, Tag, Banknote, ChartNoAxesCombined, UserCog, Settings} from "lucide-react";

interface Props {
    setIsOpenSideMenu?: React.Dispatch<React.SetStateAction<boolean>>;
    activeRoute: string;
    collaped?: boolean;
}

export default function Sidebar({setIsOpenSideMenu, activeRoute, collaped: collapsed}: Props) {
    const {user} = useUser();
    const {translation} = useI18n();
    const navigate = useNavigate();

    const menuData = useMemo(
        (): {label: string; icon: ReactNode; path: string}[] => [
            {
                label: translation.navigation.profile,
                icon: <UserCog size={20} className="text-(--text-accent)" />,
                path: "/profile"
            },
            {
                label: translation.navigation.category,
                icon: <Tag size={20} className="text-(--text-accent)" />,
                path: "/category"
            },
            {
                label: translation.navigation.record,
                icon: <Banknote size={20} className="text-(--text-accent)" />,
                path: "/record"
            },
            {
                label: translation.navigation.summary,
                icon: <ChartNoAxesCombined size={20} className="text-(--text-accent)" />,
                path: "/summary"
            },
            {
                label: translation.navigation.settings,
                icon: <Settings size={20} className="text-(--text-accent)" />,
                path: "/settings"
            }
        ],
        [translation]
    );

    const handleNavigator = (path: string) => {
        setIsOpenSideMenu?.(false);
        navigate(path);
    };

    return (
        <aside
            className={`flex flex-col w-full h-full p-3 overflow-y-auto ${collapsed ? "w-16 items-center" : "w-72 min-w-72"}`}
        >
            {/*avatar*/}
            {user && !collapsed && (
                <div className="flex flex-col items-center p-4 rounded-2xl mb-4 shrink-0 bg-(--bg-card) border-(--border)">
                    <div className="w-15 h-15 rounded-full flex items-center justify-center mb-3 overflow-hidden border-2 border-(--border-glow)">
                        {user.profileImage ? (
                            <img src={user.profileImage} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                            <User size={28} className="text-(--text-accent)" />
                        )}
                    </div>
                    <p className="font-bold text-base truncate px-1 text-center text-(--text-accent)">
                        {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs truncate font-mono mt-1 text-(--text-muted)">{user.email}</p>
                </div>
            )}

            {/*avatar icon only*/}
            {user && collapsed && (
                <div className="mb-4 shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-2 border-(--border-glow)">
                        {user.profileImage ? (
                            <img src={user.profileImage} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                            <User size={20} className="text-(--text-accent)" />
                        )}
                    </div>
                </div>
            )}

            {/*navigator*/}
            <nav className="sidebar-navigator">
                {menuData.map(item => {
                    const isActive = activeRoute === item.label;
                    return (
                        <button
                            key={item.path}
                            title={item.label}
                            className={`
                                w-full flex items-center gap-3 p-3 rounded-xl transition duration-300 cursor-pointer group 
                                ${collapsed ? "justify-center" : ""}
                                ${isActive ? "bg-(--bg-hover) border-(--border-glow) text-(--text-accent)" : "hover:bg-(--bg-hover) text-(--text-dim)"}
                            `}
                            onClick={() => handleNavigator(item.path)}
                        >
                            {item.icon}
                            {!collapsed && (
                                <>
                                    <span className="font-medium tracking-wide truncate">{item.label}</span>
                                    {isActive && (
                                        <span className="ml-auto w-2 h-2 rounded-full shrink-0 bg-(--text-accent)" />
                                    )}
                                </>
                            )}
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}
