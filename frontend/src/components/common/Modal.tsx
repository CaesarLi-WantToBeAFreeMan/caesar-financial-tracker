/*
 * generic dialog overlay
 */
import {CircleX} from "lucide-react";
import type {ReactNode} from "react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title: string;
}

export default function Modal({isOpen, onClose, children, title}: Props) {
    if (!isOpen) return null;

    return (
        /*backdrop*/
        <div className="fixed h-full inset-0 z-50 flex items-center justify-center bg-(--bg-card) backdrop-blur-sm p-3">
            <div className="w-full max-w-3xl max-h-full flex flex-col min-h-0">
                {/*panel*/}
                <div className="rounded-xl bg-(--bg-base) border border-(--border) shadow-(--glow-cyan) flex flex-col min-h-0">
                    {/*header*/}
                    <div className="flex items-center justify-between p-3 border-b-3 border-(--border) shrink-0">
                        <h2 className="text-xl font-bold text-(--text-accent)">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-3 text-(--text-wrong) hover:text-(--text-accent) cursor-pointer hover:scale-120 active:scale-120 transition duration-300"
                        >
                            <CircleX size={18} />
                        </button>
                    </div>

                    {/*body*/}
                    <div className="overflow-y-auto flex-1 p-3 md:p-6">{children}</div>
                </div>
            </div>
        </div>
    );
}
