import {useState, type ReactNode} from "react";
import Menubar from "./Menubar";
import Sidebar from "./Sidebar";
import AdBanner from "./AdBanner";

export default function Dashboard({children, activeRoute}: {children: ReactNode; activeRoute: string}) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => window.innerWidth >= 768);

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <Menubar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(p => !p)} />{" "}
            <div className="flex flex-1 overflow-hidden relative">
                {/*desktop sidebar*/}
                <div className="hidden md:flex shrink-0 border-r-3 border-(--border) bg-(--bg-input) transition duration-300">
                    <Sidebar activeRoute={activeRoute} collaped={!sidebarOpen} />
                </div>

                {/*mobile sidebar*/}
                {sidebarOpen && (
                    <div className="md:hidden absolute inset-0 z-50 bg-(--bg-base)">
                        <Sidebar activeRoute={activeRoute} setIsOpenSideMenu={setSidebarOpen} />
                    </div>
                )}
                {/*content*/}
                <main className="flex-1 overflow-y-auto flex flex-col">
                    <div className="flex-1 px-3 md:px-6 py-5">{children}</div>

                    {/*advertisement area*/}
                    <div className="sticky bottom-0 skrink-0 px-3 md:px-6 py-3 border-t border-(--border) bg-(--bg-base)">
                        <AdBanner />
                    </div>
                </main>
            </div>
        </div>
    );
}
