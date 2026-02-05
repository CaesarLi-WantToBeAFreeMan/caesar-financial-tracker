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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-2xl p-4">
                <div className="rounded-xl bg-[#0b0f1a] border border-cyan-400/30 shadow-[0_0_30px_rgba(34,211,238,0.25)]">
                    <div className="flex items-center justify-between border-b border-cyan-400/20 p-5">
                        <h2 className="text-lg font-semibold text-cyan-300">{title}</h2>

                        <button onClick={onClose} className="rounded-md p-2 hover:bg-red-400/10">
                            <CircleX size={20} className="text-[#e06c75]" />
                        </button>
                    </div>

                    <div className="p-6 text-cyan-100">{children}</div>
                </div>
            </div>
        </div>
    );
}
