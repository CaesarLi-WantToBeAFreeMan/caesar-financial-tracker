import {Upload, X} from "lucide-react";
import {useRef} from "react";

interface Props {
    file: File | null;
    onChange: (file: File | null) => void;
    onClear: (e: any) => void;
}

export function FilePicker({file, onChange, onClear}: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null);

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
                className="group flex items-center justify-between rounded-xl border border-cyan-400/20 bg-black/40 py-1 px-3 transition hover:border-cyan-400/60 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:cursor-pointer"
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <Upload className="text-cyan-400 group-hover:scale-120 transition duration-300" size={18} />
                    <span className="text-sm text-cyan-300 truncate">{file ? file.name : "Upload Image"}</span>
                </div>

                {file && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="text-red-400 hover:text-red-300 hover:cursor-pointer transition duration-300"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>
        </div>
    );
}
