import type {ReactNode} from "react";
import Menubar from "./Menubar";
import Sidebar from "./Sidebar";

export default function Dashboard({children, activeRoute}: {children: ReactNode; activeRoute: string}) {
    return (
        <>
            <Menubar activeRoute={activeRoute} />
            <div className="flex">
                <div className="max-[1080px]:hidden">
                    <Sidebar activeRoute={activeRoute} />
                </div>

                <div className="grow mx-5">{children}</div>
            </div>
        </>
    );
}
