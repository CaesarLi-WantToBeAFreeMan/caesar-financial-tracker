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
    const isPrevDisabled =
        (month.getFullYear() <= 1970 && month.getMonth() <= 0) || (minDate && toISO(month) < minDate);
    const isNextDisabled = toISO(new Date(month.getFullYear(), month.getMonth() + 1, 1)) > today;
    const isFutureMonth = (m: number, y: number) => {
        const now = new Date();
        return new Date(y, m, 1) > new Date(now.getFullYear(), now.getMonth(), 1);
    };

    const handleDateSelect = (day: number) => {
        onChange(toISO(new Date(month.getFullYear(), month.getMonth(), day)));
        setOpen(false);
    };

    const years = Array.from({length: new Date().getFullYear() - 1970 + 1}, (_, i) => 1970 + i).reverse();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-3 rounded-lg border border-cyan-400/30 bg-black/40 px-3 py-1 text-cyan-200 text-xs hover:border-cyan-400/60 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)] hover:cursor-pointer"
            >
                {value}
                <Calendar size={12} />
            </button>

            {open && (
                <div className="absolute left-1/2 -translate-x-1/2 z-10 mt-3 w-50 rounded-xl border border-cyan-400/30 bg-[#0b0f1a] p-3 shadow-[0_0_20px_rgba(0,0,0,0.8)] text-cyan-200">
                    <div className="flex items-center justify-between mb-3 border-b border-cyan-400/10 pb-1">
                        <button
                            disabled={isPrevDisabled || view === "years"}
                            onClick={() =>
                                view === "days"
                                    ? setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
                                    : setMonth(new Date(month.getFullYear() - 1, 0, 1))
                            }
                            className="hover:text-cyan-400 hover:cursor-pointer transition disabled:opacity-10 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <div className="flex gap-3 text-xs font-mono font-semibold truncate">
                            <button
                                className="hover:text-cyan-400 hover:cursor-pointer transition"
                                onClick={() => setView("months")}
                            >
                                {monthNames[month.getMonth()]}
                            </button>
                            <button
                                className="hover:text-cyan-400 hover:cursor-pointer transition"
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
                                className="hover:text-cyan-400 hover:cursor-pointer transition"
                            >
                                <AlarmClock size={18} />
                            </button>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                disabled={isNextDisabled || view === "years"}
                                onClick={() =>
                                    view === "days"
                                        ? setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
                                        : setMonth(new Date(month.getFullYear() + 1, 0, 1))
                                }
                                className="hover:text-cyan-400 hover:cursor-pointer transition disabled:opacity-10 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={18} />
                            </button>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-red-600 hover:text-red-400 hover:cursor-pointer transition"
                            >
                                <XCircle size={18} />
                            </button>
                        </div>
                    </div>

                    {view === "days" && (
                        <div className="grid grid-cols-7 gap-1 text-center text-xs">
                            {["S", "M", "T", "W", "T", "F", "S"].map(dayOfWeekName => (
                                <div key={dayOfWeekName} className="text-cyan-400 font-sans font-semibold">
                                    {dayOfWeekName}
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
                                        className={`rounded-xl p-1 bg-cyan-400/10 text-cyan-600 font-mono font-light ${toISO(new Date(month.getFullYear(), month.getMonth(), i + 2)) === value ? "bg-cyan-400/30" : "hover:bg-cyan-400/30"} hover:cursor-pointer disabled:opacity-10 disabled:cursor-not-allowed transition`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                        </div>
                    )}

                    {view === "months" && (
                        <div className="grid grid-cols-3 gap-1">
                            {monthNames.map((m, i) => (
                                <button
                                    key={m}
                                    disabled={isFutureMonth(i, month.getFullYear())}
                                    onClick={() => {
                                        setMonth(new Date(month.getFullYear(), i, 1));
                                        setView("days");
                                    }}
                                    className={`p-1 text-xs rounded-xl bg-cyan-400/10 text-cyan-600 ${monthNames[month.getMonth()] === m ? "bg-cyan-400/30" : "hover:bg-cyan-400/30"} hover:cursor-pointer disabled:opacity-10 disabled:cursor-not-allowed`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    )}

                    {view === "years" && (
                        <div className="grid grid-cols-3 gap-1 max-h-39 overflow-y-scroll custom-scrollbar animate-in fade-in zoom-in duration-200 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-cyan-400/10 [&::-webkit-scrollbar-trumb]:bg-cyan-400 [&::-webkit-scrollbar-trumb]:shadow-[0_0_10px_rgba(34,211,238,0.2)] hover:[&::-webkit-scrollbar-thumb]:bg-cyan-400/30">
                            {years.map(y => (
                                <button
                                    key={y}
                                    onClick={() => {
                                        setMonth(new Date(y, month.getMonth(), 1));
                                        setView("days");
                                    }}
                                    className={`mb-1 p-1 text-xs rounded-xl font-mono font-light bg-cyan-400/10 text-cyan-600 ${month.getFullYear() === y ? "bg-cyan-400/30" : "hover:bg-cyan-400/30"} hover:cursor-pointer`}
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
