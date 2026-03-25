/*
 * numpad-style price input
 */
import {useState, useRef} from "react";
import {Check, CircleDollarSign, CircleX} from "lucide-react";
import {isValidPriceRange} from "../../utilities/prices";
import {useClickOutside} from "../../hooks/useClickOutside";
import {useSettings} from "../../context/SettingsContext";

interface Props {
    value: number | null;
    onChange: (v: number | null) => void;
    minPrice?: number;
    maxPrice?: number | null;
    isRight?: boolean;
}

export default function PricePicker({value, onChange, minPrice = 0, maxPrice = null, isRight}: Props) {
    const {formatPrice} = useSettings();

    const [open, setOpen] = useState<boolean>(false);
    const [preview, setPreview] = useState<string>("");
    const containerRef = useRef<HTMLDivElement>(null);

    useClickOutside(containerRef, () => setOpen(false), open);

    //helper functions
    const currentNumber = preview === "" ? null : parseFloat(preview);
    const isInvalid =
        currentNumber !== null && (!isValidPriceRange(currentNumber, maxPrice) || currentNumber < minPrice);

    const handleKey = (key: string) => {
        if (key === "inf") {
            setPreview("");
            onChange(null);
            setOpen(false);
            return;
        }
        if (key === "BS") {
            setPreview(p => p.slice(0, -1));
            return;
        }
        if (key === "." && preview.includes(".")) return;
        const next = preview + key;
        if (next.includes(".") && next.split(".")[1].length > 2) return;
        setPreview(next);
    };

    const confirm = () => {
        if (isInvalid) return;
        onChange(preview === "" ? (value === null ? null : minPrice) : parseFloat(preview));
        setOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!open) return;
        if (e.key >= "0" && e.key <= "9") {
            e.preventDefault();
            handleKey(e.key);
        } else if (e.key === ".") {
            e.preventDefault();
            handleKey(".");
        } else if (e.key === "Backspace") {
            e.preventDefault();
            handleKey("BS");
        } else if (e.key === "Enter") {
            e.preventDefault();
            handleKey("BS");
        } else if (e.key === "Delete") {
            e.preventDefault();
            setPreview("");
        } else if (e.key === "Escape") {
            e.preventDefault();
            setOpen(false);
        }
    };

    const KEYS: (number | string)[] = [7, 8, 9, 4, 5, 6, 3, 2, 1, ".", 0, "BS"];

    const keyBtnStyles =
        "h-9 w-9 rounded-full font-mono transition duration-300 cursor-pointer bg-(--bg-hover) text-(--text-accent) hover:bg-(--text-accent) active:bg-(--text-accent) hover:text-(--text-dim) active:text-(--text-dim) hover:shadow-[0_0_8px_var(--text-accent)] active:shadow-[0_0_8px_var(--text-accent)] hover:scale-120 active:scale-120";

    return (
        <div className="relative" ref={containerRef} tabIndex={open ? 0 : -1} onKeyDown={handleKeyDown}>
            <button
                onClick={() => {
                    setOpen(true);
                    setPreview(value?.toString() ?? "");
                }}
                className="flex items-center gap-3 rounded-lg px-3 py-2 border transition duration-300 cursor-pointer active:shadow-[0_0_8px_var(--text-accent)] border-(--border) bg-(--bg-card) text-(--text-accent) hover:border-(--border-glow) hover:text-(--text-accent) md:hover:scale-120 md:active:scale-120"
            >
                <span className="font-mono">{formatPrice(value)}</span>
                <CircleDollarSign size={15} className="text-(--text-dim)" />
            </button>

            {open && (
                <div
                    className={`absolute ${isRight ? "right-0" : "left-1/2 -translate-x-1/2"} z-50 mt-2 w-52 rounded-xl p-3 cyber-dropdown bg-(--bg-base)`}
                >
                    {/*preview + close button*/}
                    <div className="flex items-center justify-between mb-3 pb-1 border-b border-(--border)">
                        <div
                            className={`${isInvalid ? "text-(--text-wrong)" : "text-(--text-accent)"} font-mono font-bold transtion duration-300`}
                        >
                            {formatPrice(currentNumber)}
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-(--text-wrong) hover:text-(--text-accent) cursor-pointer hover:scale-120 active:scale-120 transition duration-300"
                        >
                            <CircleX size={18} />
                        </button>
                    </div>

                    {/*numpad grid*/}
                    <div className="grid grid-cols-3 gap-3 mb-3">
                        {KEYS.map((key: number | string, index: number) => (
                            <button key={index} onClick={() => handleKey(String(key))} className={keyBtnStyles}>
                                {key}
                            </button>
                        ))}

                        {/*clear + infinity(optional) + confirm buttons*/}
                        <button onClick={() => setPreview("")} className={keyBtnStyles}>
                            CL
                        </button>
                        {maxPrice === null && (
                            <button onClick={() => handleKey("inf")} className={keyBtnStyles}>
                                ∞
                            </button>
                        )}
                        <button
                            onClick={confirm}
                            disabled={isInvalid}
                            className="flex items-center h-9 w-9 p-1 rounded-full font-mono transition duration-300 cursor-pointer text-(--text-accent) border border-(--border) hover:shadow-[0_0_8px_var(--text-accent)] active:shadow-[0_0_8px_var(--text-accent)] hover:scale-120 active:scale-120 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100 disabled:hover:shadow-none disabled:active:shadow-none"
                        >
                            <Check />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
