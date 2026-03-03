import {useContext, useEffect, useRef, useState} from "react";
import {UserContext} from "../context/UserContext";
import {useNavigate} from "react-router-dom";
import {CircleX, Menu, User, LogOut} from "lucide-react";
import logo from "../assets/images/logo.png";
import toast from "react-hot-toast";
import Sidebar from "./Sidebar";

interface PropsType {
    activeRoute: string;
}

export default function Menubar({activeRoute}: PropsType) {
    const [isOpenSideMenu, setIsOpenSideMenu] = useState(false);
    const [isShowDropdown, setIsShowDropdown] = useState(false);
    const dropdown = useRef<HTMLDivElement | null>(null);
    const context = useContext(UserContext);
    const navigate = useNavigate();

    if (!context) return null;
    const {user, clearUser, loading} = context;

    useEffect(() => {
        if (!loading && !user) navigate("/login");
    }, [user, loading, navigate]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdown.current && !dropdown.current.contains(event.target as Node)) setIsShowDropdown(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        clearUser();
        localStorage.removeItem("token");
        toast.success("Logged out successfully.");
        navigate("/login");
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-cyan-600 bg-[#0a001f]/80 backdrop-blur-md p-3">
            <div className="flex items-center justify-between gap-3 max-w-[1920px] mx-auto">
                {/*left side: menu and logo*/}
                <div className="flex items-center gap-3">
                    <button
                        className="lg:hidden text-2xl bg-[#2b005e] border-2 border-[#9900ff] trnasition duration-300 rounded-xl p-3 hover:bg-[#1c1c3d] hover:cursor-pointer"
                        onClick={() => setIsOpenSideMenu(!isOpenSideMenu)}
                    >
                        {isOpenSideMenu ? (
                            <CircleX className="text-red-400" size={21} />
                        ) : (
                            <Menu className="text-cyan-400" size={21} />
                        )}
                    </button>

                    <button
                        className="group flex items-center gap-3 hover:cursor-pointer"
                        onClick={() => navigate("/profile")}
                    >
                        <img
                            src={logo}
                            alt="logo"
                            className="h-12 w-12 rounded-xl border border-cyan-500 group-hover:scale-120 transition duration-300"
                        />
                        <span className="text-lg font-mono font-bold text-cyan-400 truncate">
                            Caesar Financial Tracker
                        </span>
                    </button>
                </div>

                {/*right side: user*/}
                <div className="relative" ref={dropdown}>
                    <button
                        onClick={() => setIsShowDropdown(!isShowDropdown)}
                        className="flex items-center justify-center w-12 h-12 rounded-xl border border-[#ff62e5] bg-[#0a001f] hover:bg-[#1c1c3d] transition duration-300 hover:cursor-pointer"
                    >
                        <User className="text-[#9900ff]" size={21} />
                    </button>

                    {isShowDropdown && (
                        <div className="absolute right-0 mt-3 w-64 z-70 p-3 bg-[#1c1c3d] border border-cyan-400/10 rounded-xl animate-in fade-in zoom-in duration-300">
                            {/*user info*/}
                            <div className="px-5 py-3 border-b border-[#0033ff]">
                                <div className="flex items-center gap-3">
                                    <p className="text-sm font-semibold truncate text-[#0033ff]">{user?.firstName}</p>
                                    <p className="text-xs font-bold truncate text-[#0033ff]">{user?.lastName}</p>
                                </div>
                            </div>

                            <button
                                className="w-full flex items-center gap-3 p-3 mt-3 text-red-400 hover:bg-red-500/10 hover:cursor-pointer rounded-xl transition duration-300"
                                onClick={handleLogout}
                            >
                                <LogOut className="text-[#9900ff]" size={18} />
                                Log out
                            </button>
                        </div>
                    )}
                </div>

                {/*mobile side menu*/}
                {isOpenSideMenu && (
                    <>
                        {/*blur background*/}
                        <div
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-120 lg:hidden"
                            onClick={() => setIsOpenSideMenu(false)}
                        />
                        <div className="fixed inset-y-0 left-0 top-20 w-full sm:w-80 z-120 lg:hidden">
                            <Sidebar setIsOpenSideMenu={setIsOpenSideMenu} activeRoute={activeRoute} isMobile />
                        </div>
                    </>
                )}
            </div>
        </header>
    );
}
