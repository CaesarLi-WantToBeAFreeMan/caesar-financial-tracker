/*
 * calendar date picker
 */
import {useState, useRef, useEffect} from "react";
import {ChevronLeft, ChevronRight, Calendar, XCircle, AlarmClock} from "lucide-react";
import {fromISO, toISO, getDate} from "../../utilities/dates";
import {useClickOutside} from "../../hooks/useClickOutside";
import {useSettings} from "../../context/SettingsContext";
import {useI18n} from "../../context/I18nContext";

interface Props {
    value: string;
    onChange: (v: string) => void;
    minDate?: string;
    maxDate?: string;
    isRight?: boolean;
}

export default function DatePicker({value, onChange, minDate, maxDate, isRight}: Props) {
    const today = getDate();
    const {formatDate} = useSettings();
    const {translation} = useI18n();

    const containerRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [view, setView] = useState<"days" | "months" | "years">("days");

    const [month, setMonth] = useState(() => {
        const date = fromISO(value);
        return new Date(date.getFullYear(), date.getMonth(), 1);
    });

    const MONTH_NAMES = [
        translation.months.jan,
        translation.months.feb,
        translation.months.mar,
        translation.months.apr,
        translation.months.may,
        translation.months.jun,
        translation.months.jul,
        translation.months.aug,
        translation.months.sep,
        translation.months.oct,
        translation.months.nov,
        translation.months.dec
    ];
    const DAY_LABELS = [
        translation.dayOfWeeks.sun,
        translation.dayOfWeeks.mon,
        translation.dayOfWeeks.tue,
        translation.dayOfWeeks.wed,
        translation.dayOfWeeks.thu,
        translation.dayOfWeeks.fri,
        translation.dayOfWeeks.sat
    ];

    useEffect(() => {
        const date = fromISO(value);
        setMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    }, [value]);

    useClickOutside(
        containerRef,
        () => {
            setOpen(false);
            setView("days");
        },
        open
    );

    //disable helper functions
    const isDisabled = (iso: string) => iso > today || !!(minDate && iso < minDate) || !!(maxDate && iso > maxDate);
    const isPrevDisabled =
        (month.getFullYear() <= 1970 && month.getMonth() <= 0) || !!(minDate && toISO(month) < minDate);
    const isNextDisabled = toISO(new Date(month.getFullYear(), month.getMonth() + 1, 1)) > today;
    const isFutureMonth = (month: number, year: number) => {
        const now = new Date();
        return new Date(year, month, 1) > new Date(now.getFullYear(), now.getMonth(), 1);
    };

    const handleDateSelect = (day: number) => {
        onChange(toISO(new Date(month.getFullYear(), month.getMonth(), day)));
        setOpen(false);
    };

    const years = Array.from({length: new Date().getFullYear() - 1970 + 1}, (_, i) => 1970 + i).reverse();

    const viewSelectedStyles = (selected: boolean) =>
        `p-1 rounded-lg transition duration-300 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed
            ${
                selected
                    ? "bg-(--text-accent) text-(--text-dim) font-bold shadow-[0_0_8px_var(--text-accent)]"
                    : "bg-(--bg-hover) text-(--text-accent) hover:bg-(--border-glow)"
            }`;

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setOpen(!open)}
                className="group flex w-39 items-center justify-between gap-3 rounded-xl p-3 border transition duration-300 cursor-pointer active:shadow-[0_0_8px_var(--text-accent)] border-(--border) bg-(--bg-card) hover:border-(--border-glow) text md:hover:scale-120 md:active:scale-120"
            >
                {/*formatted date*/}
                <span className="font-mono text-(--text-accent)">{formatDate(value)}</span>
                <Calendar
                    size={15}
                    className="group-hover:scale-120 group-hover:text-(--text-accent) group-active:scale-120"
                />
            </button>

            {/*dropdown calendar*/}
            {open && (
                <div
                    className={`absolute ${isRight ? "right-0" : "left-1/2 -translate-x-1/2"} z-20 mt-3 w-72 rounded-xl p-3 cyber-dropdown bg-(--bg-base)`}
                >
                    {/*header row*/}
                    <div className="flex items-center justify-between mb-3 pb-1 border-b border-(--border)">
                        <button
                            disabled={isPrevDisabled || view === "years"}
                            onClick={() =>
                                setMonth(
                                    new Date(
                                        view === "days" ? month.getFullYear() : month.getFullYear() - 1,
                                        view === "days" ? month.getMonth() - 1 : 0,
                                        1
                                    )
                                )
                            }
                            className="text-(--text-accent) cursor-pointer transition duration-300 hover:scale-120 active:scale-120 active:shadow-[0_0_8px_var(--text-accent)] disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        {/*view switcher and today buttons*/}
                        <div className="flex items-center gap-3 font-mono font-semibold">
                            <button
                                onClick={() => setView("months")}
                                className="cursor-pointer text-(--text-accent) hover:scale-120 active:scale-120 active:shadow-[0_0_8px_var(--text-accent)] transition duration-300"
                            >
                                {MONTH_NAMES[month.getMonth()]}
                            </button>
                            <button
                                onClick={() => setView("years")}
                                className="cursor-pointer text-(--text-accent) hover:scale-120 active:scale-120 active:shadow-[0_0_8px_var(--text-accent)] transition duration-300"
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
                                className="cursor-pointer text-(--text-accent) hover:scale-120 active:scale-120 active:shadow-[0_0_8px_var(--text-accent)] transition duration-300"
                            >
                                <AlarmClock size={18} />
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                disabled={isNextDisabled || view === "years"}
                                onClick={() =>
                                    setMonth(
                                        new Date(
                                            view === "days" ? month.getFullYear() : month.getFullYear() + 1,
                                            view === "days" ? month.getMonth() + 1 : 0,
                                            1
                                        )
                                    )
                                }
                                className="text-(--text-accent) hover:scale-120 active:scale-120 cursor-pointer active:shadow-[0_0_8px_var(--text-accent)] transition duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={18} />
                            </button>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-(--text-dim) hover:text-(--text-accent) hover:scale-120 active:scale-120 cursor-pointer active:shadow-[0_0_8px_var(--text-accent)] transition duration-300"
                            >
                                <XCircle size={18} />
                            </button>
                        </div>
                    </div>

                    {/*day grid*/}
                    {view === "days" && (
                        <div className="grid grid-cols-7 gap-2 text-center">
                            {DAY_LABELS.map((dayOfWeek: string, index: number) => (
                                <div key={index} className="font-bold text-(--text-accent)">
                                    {dayOfWeek.slice(0, 2)}
                                </div>
                            ))}
                            {/*empty cells before the first day*/}
                            {Array(month.getDay())
                                .fill(null)
                                .map((_, index: number) => (
                                    <div key={`${index}`} />
                                ))}
                            {/*day buttons*/}
                            {Array(new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate())
                                .fill(null)
                                .map((_, index: number) => {
                                    const dayIso = toISO(new Date(month.getFullYear(), month.getMonth(), index + 1));
                                    return (
                                        <button
                                            key={index}
                                            disabled={isDisabled(dayIso)}
                                            onClick={() => handleDateSelect(index + 1)}
                                            className={`${viewSelectedStyles(dayIso === value)} hover:scale-120 active:scale-120`}
                                        >
                                            {index + 1}
                                        </button>
                                    );
                                })}
                        </div>
                    )}

                    {/*month grid*/}
                    {view === "months" && (
                        <div className="grid grid-cols-3 gap-1">
                            {MONTH_NAMES.map((monthName: string, index: number) => (
                                <button
                                    key={index}
                                    disabled={isFutureMonth(index, month.getFullYear())}
                                    onClick={() => {
                                        setMonth(new Date(month.getFullYear(), index, 1));
                                        setView("days");
                                    }}
                                    className={`${viewSelectedStyles(month.getMonth() === index)} hover:scale-120 active:scale-120`}
                                >
                                    {monthName}
                                </button>
                            ))}
                        </div>
                    )}

                    {/*year grid*/}
                    {view === "years" && (
                        <div className="grid grid-cols-3 gap-1 max-h-36 overflow-y-auto">
                            {years.map((year: number) => (
                                <button
                                    key={year}
                                    onClick={() => {
                                        setMonth(new Date(year, month.getMonth(), 1));
                                        setView("days");
                                    }}
                                    className={`${viewSelectedStyles(month.getFullYear() === year)} hover:scale-120 active:scale-120`}
                                >
                                    {year}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
