import React, {useContext, type ReactNode} from "react";
import {UserContext} from "../context/UserContext";
import {Gauge, User, Tag, BanknoteArrowUp, BanknoteArrowDown, Settings, Funnel} from "lucide-react";
import {useNavigate} from "react-router-dom";

interface MenuDataType {
    label: string;
    icon: ReactNode;
    path: string;
}

interface SidebarPropsType {
    setIsOpenSideMenu?: React.Dispatch<React.SetStateAction<boolean>>;
    activeRoute: string;
}

const menuData: MenuDataType[] = [
    {label: "Dashboard", icon: <Gauge />, path: "/dashboard"},
    {label: "Category", icon: <Tag />, path: "/category"},
    {label: "Income", icon: <BanknoteArrowUp />, path: "/income"},
    {label: "Expense", icon: <BanknoteArrowDown />, path: "/expense"},
    {label: "Filters", icon: <Funnel />, path: "/filter"},
    {label: "Settings", icon: <Settings />, path: "/settings"}
];

export default function Sidebar({setIsOpenSideMenu, activeRoute}: SidebarPropsType) {
    const context = useContext(UserContext);
    if (!context) return null;
    const {user} = context;
    const navigate = useNavigate();

    return (
        <aside className="fixed top-23 w-full lg:w-72 h-[calc(100vh-100px)] bg-[#1c1c3d] border-r-2 border-[#00b3ff] rounded-xl p-5 min-[1080px]:static">
            {/*user icon and name*/}
            {user && (
                <div className="flex flex-col items-center mb-5">
                    <User className="w-18 h-18 text-[#9900ff]" />
                    <p className="mt-3 text-[#0033ff] font-semibold">
                        {user.firstName} {user.lastName}
                    </p>
                </div>
            )}

            {/*menu*/}
            {menuData.map((item: MenuDataType, index: number) => (
                <>
                    <button
                        key={index}
                        className="w-full flex items-center justify-start gap-3 py-1.5 px-3 text-left hover:bg-[#8500f3] cursor-pointer rounded-xl transition"
                        onClick={() => {
                            if (innerWidth) setIsOpenSideMenu?.(false);
                            navigate(item.path);
                        }}
                    >
                        <div className="w-9 h-9 text-[#00b3ff] flex items-center justify-start">{item.icon}</div>
                        <p
                            className={`w-full text-base text-slate-200 truncate px-3 rounded-xl transition ${activeRoute === item.label ? "bg-[#00b3ff]" : ""}`}
                        >
                            {item.label}
                        </p>
                    </button>
                    <hr className="mx-3 my-1 text-[#0a001f]" />
                </>
            ))}
        </aside>
    );
}
