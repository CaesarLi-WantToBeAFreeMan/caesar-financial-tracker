import {useEffect, useRef, useState} from "react";
import {RenderIcon} from "../../utilities/icon";

export interface DataType<T = string> {
    icon: React.ReactNode;
    label: string;
    value: T;
}

interface Props<T> {
    data: DataType<T>[];
    index: number;
    onChange: (index: number) => void;
}

export default function OptionPicker<T>({data, index, onChange}: Props<T>) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) =>
            !containerRef.current?.contains(e.target as Node) && setOpen(false);
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selected = data[index] ?? data[0];
    if (!selected) return null;

    return (
        <div className="relative flex-1" ref={containerRef}>
            <button
                onClick={() => setOpen(prev => !prev)}
                className="flex w-full items-center gap-3 rounded-lg border border-cyan-400/30 bg-black/40 px-3 py-1 text-cyan-200 text-xs transition hover:border-cyan-400/60 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)] hover:cursor-pointer"
            >
                <RenderIcon icon={selected.icon} name={selected.label} boxSize={12} />
                <span className="truncate font-medium">{selected.label}</span>
            </button>

            {open && (
                <div className="absolute left-1/2 -translate-x-1/2 z-10 mt-3 rounded-xl border border-cyan-400/30 bg-[#0b0f1a] p-3 shadow-2xl">
                    {data.map((d, i) => {
                        const isSelected = String(selected.value) === String(d.value);
                        return (
                            <button
                                key={String(d.value)}
                                className={`flex items-center gap-3 w-full text-left m-1 p-2 rounded-xl text-xs transition duration-300 hover:cursor-pointer text-cyan-600 ${isSelected ? "bg-cyan-400/30 font-bold" : "hover:bg-cyan-400/30"}`}
                                onClick={() => {
                                    onChange(i);
                                    setOpen(false);
                                }}
                            >
                                <div className="group w-full flex items-center gap-3">
                                    <RenderIcon icon={d.icon} name={d.label} className="group-hover:animate-bounce" />
                                    <span className="truncate">{d.label}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
