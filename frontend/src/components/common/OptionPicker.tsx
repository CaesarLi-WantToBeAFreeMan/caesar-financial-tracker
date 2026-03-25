/**
 * generic single-select dropdown list
 */
import {useRef, useState} from "react";
import {RenderIcon} from "../../utilities/icon";
import {useClickOutside} from "../../hooks/useClickOutside";

export interface DataType<T = string> {
    icon: React.ReactNode;
    label: string;
    value: T;
}

interface Props<T> {
    data: DataType<T>[];
    index: number;
    onChange: (index: number) => void;
    label?: string;
}

export default function OptionPicker<T>({data, index, onChange, label}: Props<T>) {
    const [open, setOpen] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useClickOutside(containerRef, () => setOpen(false), open);

    const selected = data[index] ?? data[0];
    if (!selected) return null;

    return (
        <div className="relative flex-1 flex items-center gap-3" ref={containerRef}>
            {label && <span className="font-bold shrink-0 text-(--text-accent)">{label}</span>}
            <div className="relative flex-1">
                <button
                    onClick={() => setOpen(p => !p)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 border border-(--border) transition duration-300 cursor-pointer md:hover:scale-120 md:active:scale-120 bg-(--bg-surface) text-(--text-accent)"
                >
                    <RenderIcon icon={selected.icon} name={selected.label} boxSize={16} />
                    <span className="truncate font-bold">{selected.label}</span>
                </button>

                {/*dropdown list*/}
                {open && (
                    <div className="absolute left-1/2 -translate-x-1/2 z-50 mt-3 min-w-full rounded-xl p-3 cyber-dropdown max-h-45 overflow-y-scroll bg-(--bg-base)">
                        {data.map((item, index: number) => {
                            const isSelected = String(selected.value) === String(item.value);
                            return (
                                <button
                                    key={index}
                                    onClick={() => {
                                        onChange(index);
                                        setOpen(false);
                                    }}
                                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl transition duration-300 cursor-pointer md:hover:scale-110 hover:text-(--text-accent) active:text-(--text-accent) hover:bg-(--bg-hover) active:bg-(--bg-hover) md:active:scale-110
                                        ${
                                            isSelected
                                                ? "font-bold bg-(--bg-hover) text-(--text-accent)"
                                                : "text-(--text-dim)"
                                        }
                                    `}
                                >
                                    <RenderIcon icon={item.icon} name={item.label} boxSize={14} />
                                    <span className="truncate">{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
