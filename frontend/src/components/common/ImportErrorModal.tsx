import {AlertTriangle, Bug, CircleX} from "lucide-react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    success: number;
    failed: number;
    errors: string[];
}

export default function ImportErrorModal({isOpen, onClose, success, failed, errors}: Props) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-2xl p-3">
                <div className="rounded-xl bg-[#0b0f1a] border border-red-500/40 shadow-[0_0_40px_rgba(248,113,113,0.35)]">
                    <div className="flex items-center justify-between border-b border-red-400/20 p-5">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="text-red-400" />
                            <h2 className="text-lg font-semibold text-red-300">Import Completed With Errors</h2>
                        </div>

                        <button onClick={onClose} className="rounded-md p-2 hover:bg-red-400/10 hover:cursor-pointer">
                            <CircleX size={20} className="text-red-400" />
                        </button>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="flex gap-6 text-sm">
                            <span className="text-emerald-400">
                                ✅ Success: <b>{success}</b>
                            </span>
                            <span className="text-red-400">
                                ❌ Failed: <b>{failed}</b>
                            </span>
                        </div>

                        <div className="max-h-70 overflow-auto rounded-lg border border-red-400/20 bg-black/40 p-3">
                            <ul className="space-y-3 text-sm text-red-300">
                                {errors.map((error: string, index: number) => (
                                    <li key={index} className="flex items-center justify-base gap-3">
                                        <Bug size={18} className="text-red-500" />
                                        <span>{error}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex justify-end pt-3">
                            <button
                                onClick={onClose}
                                className="rounded-lg p-3 border border-red-400/40 text-red-300 hover:shadow-[0_0_15px_rgba(248,113,113,0.5)] hover:cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
