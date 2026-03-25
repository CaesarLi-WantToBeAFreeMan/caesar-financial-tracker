import {Bug, CircleCheckBig, CircleX, ShieldX, XCircle} from "lucide-react";
import {useI18n} from "../../context/I18nContext";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    success: number;
    failed: number;
    errors: string[];
}

export default function ImportErrorModal({isOpen, onClose, success, failed, errors}: Props) {
    if (!isOpen) return null;
    const {translation} = useI18n();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-(--bg-card) backdrop-blur-sm">
            <div className="w-full max-w-2xl p-3">
                <div className="rounded-xl bg-(--bg-card) border border-(--border) shadow-[0_0_21px_var(--text-wrong)]">
                    <div className="flex items-center justify-between border-b-2 border-(--border) p-3">
                        <div className="flex items-center gap-3">
                            <ShieldX className="text-(--text-wrong)" />
                            <h2 className="text-xl font-bold text-(--text-wrong)">{translation.common.importError}</h2>
                        </div>

                        <button
                            onClick={onClose}
                            className="text-(--text-wrong) hover:text-(--text-accent) cursor-pointer hover:scale-120 active:scale-120 transition duration-300"
                        >
                            <XCircle size={21} />
                        </button>
                    </div>

                    <div className="p-3 space-y-3">
                        <div className="flex gap-6">
                            <div className="flex items-center gap-3 text-(--text-correct)">
                                <CircleCheckBig size={18} />
                                {translation.common.success}: <b>{success}</b>
                            </div>
                            <div className="flex items-center gap-3 text-(--text-wrong)">
                                <CircleX size={18} />
                                {translation.common.failed}: <b>{failed}</b>
                            </div>
                        </div>

                        <div className="max-h-70 overflow-y-auto rounded-xl border border-(--border) bg-(--bg-card) p-3">
                            <ul className="space-y-3 text-(--text-wrong)">
                                {errors.map((error: string, index: number) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-3 border-b border-(--border) py-1 px-3"
                                    >
                                        <Bug size={18} className="shrink-0" />
                                        <span className="text-(--text-muted) font-mono shrink-0">#{index + 1}</span>
                                        {error}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex justify-end pt-3">
                            <button onClick={onClose} className="cyber-btn-ghost text-(--text-wrong)">
                                {translation.common.close}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
