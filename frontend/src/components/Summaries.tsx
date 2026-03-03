import {
    Banknote,
    BanknoteArrowDown,
    BanknoteArrowUp,
    Box,
    CalendarDays,
    ChartArea,
    ChartBar,
    ChartCandlestick,
    ChartLine,
    ChartPie,
    CircleDollarSign,
    Radar
} from "lucide-react";
import type {SummaryFilter} from "../types/SummaryTypes.ts";
import CategoryPicker from "./common/CategoryPicker.tsx";
import DatePicker from "./common/DatePicker.tsx";
import OptionPicker, {type DataType} from "./common/OptionPicker.tsx";
import PricePicker from "./common/PricePicker.tsx";

interface FilterProps {
    filter: SummaryFilter;
    onChange: <K extends keyof SummaryFilter>(key: K, value: SummaryFilter[K]) => void;
}

const types: DataType<SummaryFilter["type"]>[] = [
    {label: "All", icon: <Banknote />, value: "all"},
    {label: "Income", icon: <BanknoteArrowUp />, value: "income"},
    {label: "Expense", icon: <BanknoteArrowDown />, value: "expense"}
];

const charts: DataType<SummaryFilter["chartMode"]>[] = [
    {label: "Area", icon: <ChartArea />, value: "area"},
    {label: "Bar", icon: <ChartBar />, value: "bar"},
    {label: "Line", icon: <ChartLine />, value: "line"},
    {label: "Composed", icon: <ChartCandlestick />, value: "composed"},
    {label: "Pie", icon: <ChartPie />, value: "pie"},
    {label: "Radar", icon: <Radar />, value: "radar"}
];

const orders: DataType<SummaryFilter["divisionMode"]>[] = [
    {label: "Date", icon: <CalendarDays />, value: "date"},
    {label: "Price", icon: <CircleDollarSign />, value: "price"},
    {label: "Type", icon: <Banknote />, value: "type"},
    {label: "Category", icon: <Box />, value: "category"}
];

export function Filter({filter, onChange}: FilterProps) {
    const {type, dateStart, dateEnd, priceLow, priceHigh, category, chartMode, divisionMode} = filter;
    const typeIndex = Math.max(
        0,
        types.findIndex(t => t.value === type)
    );
    const chartIndex = Math.max(
        0,
        charts.findIndex(c => c.value === chartMode)
    );
    const orderIndex = Math.max(
        0,
        orders.findIndex(o => o.value === divisionMode)
    );

    return (
        <div className="mb-6 rounded-xl border border-cyan-400/20 bg-black/40 p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-3">
                    <label className="text-cyan-400">Type:</label>
                    <OptionPicker
                        data={types}
                        index={typeIndex}
                        onChange={(index: number) => types[index] && onChange("type", types[index].value)}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <label className="text-cyan-400">Type:</label>
                    <OptionPicker
                        data={charts}
                        index={chartIndex}
                        onChange={(index: number) => charts[index] && onChange("chartMode", charts[index].value)}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <label className="text-cyan-400">Order:</label>
                    <OptionPicker
                        data={orders}
                        index={orderIndex}
                        onChange={(index: number) => orders[index] && onChange("divisionMode", orders[index].value)}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <label className="text-cyan-400">Category:</label>
                    <CategoryPicker selectedId={category} type={type} onSelect={id => onChange("category", id)} />
                </div>

                <div className="flex justify-between items-center gap-3">
                    <div className="flex items-center gap-3">
                        <label className="text-cyan-400">Date Start:</label>
                        <DatePicker value={dateStart} onChange={v => onChange("dateStart", v)} maxDate={dateEnd} />
                    </div>
                    <span className="text-cyan-400">-</span>
                    <div className="flex items-center gap-3">
                        <label className="text-cyan-400">Date End:</label>
                        <DatePicker value={dateEnd} onChange={v => onChange("dateEnd", v)} minDate={dateStart} />
                    </div>
                </div>

                <div className="flex justify-between items-center gap-3">
                    <div className="flex items-center gap-3">
                        <label className="text-cyan-400">Price Low:</label>
                        <PricePicker
                            value={priceLow}
                            onChange={v => onChange("priceLow", v || 0)}
                            maxPrice={priceHigh}
                        />
                    </div>
                    <span className="text-cyan-400">-</span>
                    <div className="flex items-center gap-3">
                        <label className="text-cyan-400">Price Low:</label>
                        <PricePicker value={priceHigh} onChange={v => onChange("priceHigh", v)} minPrice={priceLow} />
                    </div>
                </div>
            </div>
        </div>
    );
}
