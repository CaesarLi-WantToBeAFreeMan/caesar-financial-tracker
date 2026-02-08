import {Upload} from "lucide-react";
import {useRef} from "react";

interface Props {
    file: File | null;
    onFileChange: (file: File | null) => void;
}

export function FilePicker({file, onFileChange}: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    return (
        <div className="space-y-3">
            <label className="text-cyan-300 text-sm">Choose file</label>
            <div className="flex items-center gap-3">
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    onChange={e => onFileChange(e.target.files?.[0] ?? null)}
                />
                <button
                    onClick={() => inputRef.current?.click()}
                    className="flex items-center gap-3 rounded-lg p-3 bg-cyan-500/10 text-cyan-300 border border-cyan-400/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] hover:cursor-pointer"
                >
                    <Upload size={18} className="text-cyan-300" />
                    Choose File
                </button>
                <span className="text-sm text-cyan-400 truncate max-w-[250px]">
                    {file ? file.name : "No file chosen"}
                </span>
            </div>
        </div>
    );
}
