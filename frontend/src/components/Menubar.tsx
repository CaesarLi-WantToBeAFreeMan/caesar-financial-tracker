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
    const {user, clearUser} = context;
    useEffect(() => {
        if (!user) navigate("/login");
    }, [context, navigate]);

    const handleLogout = () => {
        setIsShowDropdown(false);
        clearUser();
        localStorage.removeItem("token");
        toast.success("Logout successfully. Please login to use again.");
        navigate("/login");
    };

    useEffect(() => {
        if (!isShowDropdown) return;
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            const target = event.target as Node | null;
            if (!target) return;
            if (dropdown.current && !dropdown.current.contains(target)) setIsShowDropdown(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [isShowDropdown]);

    return (
        <>
            <header className="flex h-16 items-center justify-between gap-5 px-3 md:px-7 m-1 sticky top-0 z-70">
                {/*left side: menu button and title*/}
                <div className="flex items-center gap-5">
                    <button
                        className="block lg:hidden text-2xl bg-[#2b005e] border-2 border-[#9900ff] hover:bg-[#1c1c3d] hover:cursor trnasition rounded-xl p-1 cursor-pointer"
                        onClick={() => setIsOpenSideMenu(!isOpenSideMenu)}
                    >
                        {isOpenSideMenu ? (
                            <CircleX className="text-2xl text-[#ff4500]" />
                        ) : (
                            <Menu className="text-[#0033ff]" />
                        )}
                    </button>

                    <div className="flex items-center gap-3">
                        <img src={logo} alt="logo" className="h-10 w-10 rounded-xl" />
                        <span className="text-lg font-medium text-[#00b3ff] truncate">Caesar Financial Tracker</span>
                    </div>
                </div>

                {/*right side: avatar photo*/}
                <div className="relative" ref={dropdown}>
                    <button
                        onClick={() => setIsShowDropdown(!isShowDropdown)}
                        className="flex items-center justify-center w-10 h-10 bg-[#0a001f] hover:bg-[#1c1c3d] transition-colors duration-300 cursor-pointer border-2 border-[#ff62e5] rounded-xl"
                    >
                        <User className="text-[#9900ff]" />
                    </button>

                    {/*dropdown menu*/}
                    {isShowDropdown && (
                        <div className="absolute right-0 mt-3 w-50 bg-[#1c1c3d] rounded-xl z-70">
                            {/*user info*/}
                            <div className="px-5 py-3 border-[#0033ff]">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-7 h-7 bg-[#1c1c3d] rounded-xl">
                                        <User className="w-5 h-5 text-[#9900ff]" />
                                    </div>
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="grid grid-cols-2 gap-3">
                                            <p className="text-sm font-medium truncate text-[#0033ff]">
                                                {user?.firstName}
                                            </p>
                                            <p className="text-sm font-bold truncate text-[#0033ff]">
                                                {user?.lastName}
                                            </p>
                                        </div>
                                        <p className="text-xs truncate">{user?.email}</p>
                                    </div>
                                </div>
                            </div>

                            <hr className="m3 text-[#ff62e5]" />
                            {/*lag out*/}
                            <div className="m-3 rounded-xl hover:bg-[#2b005e] transition-colors duration-300">
                                <button
                                    className="flex justify-center items-center gap-3 m-3 cursor-pointer"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="text-[#9900ff]" />
                                    <p>Log out</p>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/*mobile side menu*/}
                {isOpenSideMenu && (
                    <div className="fixed left-0 right-0 bg-[#2b005e] border border-[#0033ff] lg:hidden z-70 top-0">
                        <Sidebar setIsOpenSideMenu={setIsOpenSideMenu} activeRoute={activeRoute} />
                    </div>
                )}
            </header>
            <hr className="m-3 text-[#fe62e5]" />
        </>
    );
}
