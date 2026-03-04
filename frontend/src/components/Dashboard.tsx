import {type ReactNode} from "react";
import Menubar from "./Menubar";
import Sidebar from "./Sidebar";
import {useUser} from "../hooks/useUser";

export default function Dashboard({children, activeRoute}: {children: ReactNode; activeRoute: string}) {
    useUser();
    return (
        <div className="min-h-screen flex flex-col" style={{background: "var(--bg-base)"}}>
            <Menubar activeRoute={activeRoute} />
            <div className="flex flex-1 overflow-hidden">
                {/*desktop sidebar*/}
                <div className="shrink-0">
                    <Sidebar activeRoute={activeRoute} />
                </div>
                {/*content*/}
                <main className="flex-1 overflow-y-auto px-4 md:px-6 py-5" style={{color: "var(--text-primary)"}}>
                    {children}
                </main>
            </div>
        </div>
    );
}
