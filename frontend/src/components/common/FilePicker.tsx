import {Upload, X} from "lucide-react";
import {useRef} from "react";
import {useI18n} from "../../context/I18nContext";

interface Props {
    file: File | null;
    onChange: (file: File | null) => void;
    onClear: (e: any) => void;
}

export function FilePicker({file, onChange, onClear}: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const {translation} = useI18n();

    return (
        <div className="w-full">
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={e => onChange(e.target.files?.[0] ?? null)}
            />

            <div
                onClick={() => inputRef.current?.click()}
                className="group flex items-center justify-between rounded-xl border border-(--border) bg-(--bg-surface) p-3 transition duration-300 cursor-pointer md:hover:scale-120 md:active:scale-120"
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <Upload
                        className="text-(--text-primary) group-hover:text-(--text-accent) group-active:text-(--text-accent) transition duration-300"
                        size={18}
                    />
                    <span className="text-(--parimary) truncate group-hover:text-(--text-accent) group-active:text-(--text-accent)">
                        {file ? file.name : translation.common.uploadFile}
                    </span>
                </div>

                {file && (
                    <button
                        type="button"
                        onClick={e => {
                            e.stopPropagation();
                            onClear(e);
                        }}
                        className="text-(--text-wrong) cursor-pointer hover:scale-120 active:scale-120 transition duration-300"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>
        </div>
    );
}
