import {ChevronLeft, ChevronRight, Calendar, XCircle, AlarmClock} from "lucide-react";
import {useState, useRef, useEffect} from "react";
import {fromISO, toISO, getDate} from "../../utilities/dates";

interface Props {
    value: string;
    onChange: (v: string) => void;
    minDate?: string;
    maxDate?: string;
}

export default function DatePicker({value, onChange, minDate, maxDate}: Props) {
    const today = getDate();
    const containerRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [view, setView] = useState<"days" | "months" | "years">("days");

    const selectedDate = fromISO(value);
    const [month, setMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!containerRef.current?.contains(e.target as Node)) {
                setOpen(false);
                setView("days");
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const isDisabled = (iso: string) => iso > today || (minDate && iso < minDate) || (maxDate && iso > maxDate);
    const isPrevDisabled = month.getFullYear() <= 1970 && month.getMonth() <= 0;
    const isNextDisabled = toISO(new Date(month.getFullYear(), month.getMonth() + 1, 1)) > today;
    const isFutureMonth = (m: number, y: number) => {
        const d = new Date(y, m, 1);
        const now = new Date();
        return d > new Date(now.getFullYear(), now.getMonth(), 1);
    };

    const handleDateSelect = (dayNum: number) => {
        const d = new Date(month.getFullYear(), month.getMonth(), dayNum);
        onChange(toISO(d));
        setOpen(false);
    };

    const years = Array.from({length: new Date().getFullYear() - 1970 + 1}, (_, i) => 1970 + i).reverse();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-3 rounded-lg border border-cyan-400/30 bg-black/40 px-3 py-2 text-cyan-200 hover:border-cyan-400/60 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)] hover:cursor-pointer transition-all"
            >
                {value} <Calendar size={18} />
            </button>

            {open && (
                <div className="absolute z-50 mt-3 w-50 rounded-xl border border-cyan-400/30 bg-[#0b0f1a] p-3 shadow-[0_0_20px_rgba(0,0,0,0.8)] text-cyan-200">
                    <div className="flex items-center justify-between mb-4 border-b border-cyan-400/10 pb-2">
                        <button
                            disabled={isPrevDisabled}
                            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                            className="hover:text-cyan-400 hover:cursor-pointer transition disabled:opacity-10 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <div className="flex gap-2 text-xs font-bold tracking-widest">
                            <button
                                className="cursor-pointer hover:text-cyan-400 transition-colors"
                                onClick={() => setView("months")}
                            >
                                {months[month.getMonth()]}
                            </button>
                            <button
                                className="cursor-pointer hover:text-cyan-400 transition-colors"
                                onClick={() => setView("years")}
                            >
                                {month.getFullYear()}
                            </button>
                            <button
                                onClick={() => {
                                    setMonth(new Date());
                                    onChange(today);
                                    setOpen(false);
                                }}
                                title="Today"
                                className="hover:text-cyan-400 transition cursor-pointer"
                            >
                                <AlarmClock size={18} />
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                disabled={isNextDisabled}
                                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                                className="hover:text-cyan-400 hover:cursor-pointer transition disabled:opacity-10 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={18} />
                            </button>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-red-600 hover:text-red-400 cursor-pointer transition"
                            >
                                <XCircle size={18} />
                            </button>
                        </div>
                    </div>

                    {view === "days" && (
                        <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
                            {["S", "M", "T", "W", "T", "F", "S"].map(d => (
                                <div key={d} className="text-cyan-400/30 font-bold">
                                    {d}
                                </div>
                            ))}
                            {Array(month.getDay())
                                .fill(0)
                                .map((_, i) => (
                                    <div key={i} />
                                ))}
                            {Array(new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate())
                                .fill(0)
                                .map((_, i) => (
                                    <button
                                        key={i}
                                        disabled={isDisabled(
                                            toISO(new Date(month.getFullYear(), month.getMonth(), i + 2))
                                        )}
                                        onClick={() => handleDateSelect(i + 2)}
                                        className="rounded p-1.5 transition bg-cyan-400/10 text-cyan-600 font-bold hover:bg-cyan-400/20 hover:cursor-pointer disabled:opacity-10 disabled:cursor-not-allowed"
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                        </div>
                    )}

                    {view === "months" && (
                        <div className="grid grid-cols-3 gap-1 animate-in fade-in zoom-in duration-200">
                            {months.map((m, i) => (
                                <button
                                    key={m}
                                    disabled={isFutureMonth(i, month.getFullYear())}
                                    onClick={() => {
                                        setMonth(new Date(month.getFullYear(), i, 1));
                                        setView("days");
                                    }}
                                    className="p-2 text-[10px] rounded border border-cyan-400/10 transition hover:bg-cyan-400/20 hover:border-cyan-400/40 hover:cursor-pointer disabled:opacity-10 disabled:cursor-not-allowed"
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    )}

                    {view === "years" && (
                        <div className="grid grid-cols-3 gap-1 max-h-40 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in duration-200">
                            {years.map(y => (
                                <button
                                    key={y}
                                    onClick={() => {
                                        setMonth(new Date(y, month.getMonth(), 1));
                                        setView("days");
                                    }}
                                    className="p-2 text-[10px] rounded border border-cyan-400/10 hover:bg-cyan-400/20 hover:border-cyan-400/40 transition hover:cursor-pointer"
                                >
                                    {y}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
