import {useState, useRef, useEffect} from "react";
import {XCircle, Check, CircleDollarSign} from "lucide-react";
import {isValidPriceRange, priceFormat} from "../../utilities/prices";

interface Props {
    value: number | null;
    onChange: (v: number | null) => void;
    minPrice?: number;
    maxPrice?: number | null;
}

export default function PricePicker({value, onChange, minPrice = 0, maxPrice = null}: Props) {
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<string>("");
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const getNumericPreview = () => (preview === "" ? null : parseFloat(preview));
    const currentNum = getNumericPreview();
    const isInvalid = currentNum !== null && (!isValidPriceRange(currentNum, maxPrice) || currentNum < minPrice);

    const handleKey = (key: string) => {
        if (key === "inf") {
            setPreview("");
            onChange(null);
            setOpen(false);
            return;
        }
        let next = preview + key;
        if (key === "." && preview.includes(".")) return;
        if (next.includes(".") && next.split(".")[1].length > 2) return;
        setPreview(next);
    };

    const confirm = () => {
        if (isInvalid) return;
        onChange(preview === "" ? (value === null ? null : minPrice) : parseFloat(preview));
        setOpen(false);
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => {
                    setOpen(true);
                    setPreview(value?.toString() || "");
                }}
                className="flex items-center gap-3 rounded-lg border border-cyan-400/30 bg-black/40 px-3 py-2 text-cyan-200 transition hover:border-cyan-400/60 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)] hover:cursor-pointer"
            >
                <span className="font-mono text-sm">{priceFormat(value!)}</span>
                <CircleDollarSign size={18} className="text-cyan-400/50" />
            </button>

            {open && (
                <div className="absolute right-0 z-50 mt-4 w-39 rounded-xl border border-cyan-400/30 bg-[#0b0f1a] p-3 shadow-2xl">
                    <div className="flex justify-between items-center mb-2">
                        <div className="w-4" />
                        <div className={`text-sm font-mono font-bold ${isInvalid ? "text-red-500" : "text-cyan-400"}`}>
                            {priceFormat(currentNum!)}
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-red-600 hover:text-red-400 cursor-pointer transition"
                        >
                            <XCircle size={18} />
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 mb-2">
                        {[7, 8, 9, 4, 5, 6, 3, 2, 1, ".", 0, "00"].map(k => (
                            <button
                                key={k}
                                onClick={() => handleKey(k.toString())}
                                className="h-10 rounded bg-cyan-400/10 text-cyan-600 font-mono hover:bg-cyan-400/20 transition hover:cursor-pointer"
                            >
                                {k}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-1">
                        <button
                            onClick={() => setPreview("")}
                            className="flex-1 py-1 text-[10px] border border-red-500/30 text-red-500 hover:bg-red-500/10 cursor-pointer rounded transition-all"
                        >
                            CLEAR
                        </button>
                        {maxPrice === null && (
                            <button
                                onClick={() => handleKey("inf")}
                                className="flex-1 rounded bg-cyan-400/10 text-cyan-600 text-mono hover:bg-cyan-400/20 hover:cursor-pointer "
                            >
                                ∞
                            </button>
                        )}
                        <button
                            onClick={confirm}
                            disabled={isInvalid}
                            className="flex-1 flex justify-center items-center rounded transition  bg-cyan-500/20 text-cyan-400 border border-cyan-400/40 hover:bg-cyan-500 hover:text-black hover:cursor-pointer disabled:opacity-20 disabled:bg-gray-700"
                        >
                            <Check size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
