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
import {useI18n} from "../context/I18nContext";
import type {TranslationType} from "../types/TranslationType.ts";

interface FilterProps {
    filter: SummaryFilter;
    onChange: <K extends keyof SummaryFilter>(key: K, value: SummaryFilter[K]) => void;
}

const types = (translation: TranslationType): DataType<SummaryFilter["type"]>[] => [
    {label: translation.common.all, icon: <Banknote />, value: "all"},
    {label: translation.common.income, icon: <BanknoteArrowUp />, value: "income"},
    {label: translation.common.expense, icon: <BanknoteArrowDown />, value: "expense"}
];

const charts = (translation: TranslationType): DataType<SummaryFilter["chartMode"]>[] => [
    {label: translation.summary.charts.area, icon: <ChartArea />, value: "area"},
    {label: translation.summary.charts.bar, icon: <ChartBar />, value: "bar"},
    {label: translation.summary.charts.line, icon: <ChartLine />, value: "line"},
    {label: translation.summary.charts.composed, icon: <ChartCandlestick />, value: "composed"},
    {label: translation.summary.charts.pie, icon: <ChartPie />, value: "pie"},
    {label: translation.summary.charts.radar, icon: <Radar />, value: "radar"}
];

const orders = (translation: TranslationType): DataType<SummaryFilter["divisionMode"]>[] => [
    {label: translation.summary.orders.date, icon: <CalendarDays />, value: "date"},
    {label: translation.summary.orders.price, icon: <CircleDollarSign />, value: "price"},
    {label: translation.summary.orders.type, icon: <Banknote />, value: "type"},
    {label: translation.summary.orders.category, icon: <Box />, value: "category"}
];

export function Filter({filter, onChange}: FilterProps) {
    const {translation} = useI18n();
    const {type, dateStart, dateEnd, priceLow, priceHigh, category, chartMode, divisionMode} = filter;
    const typeIndex = Math.max(
        0,
        types(translation).findIndex(t => t.value === type)
    );
    const chartIndex = Math.max(
        0,
        charts(translation).findIndex(c => c.value === chartMode)
    );
    const orderIndex = Math.max(
        0,
        orders(translation).findIndex(o => o.value === divisionMode)
    );

    return (
        <div className="mb-6 rounded-lg border border-(--border) bg-(--bg-surface) p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-3">
                    <label className="cyber-label">{translation.summary.type}</label>
                    <OptionPicker
                        data={types(translation)}
                        index={typeIndex}
                        onChange={(index: number) =>
                            types(translation)[index] && onChange("type", types(translation)[index].value)
                        }
                    />
                </div>

                <div className="flex items-center gap-3">
                    <label className="cyber-label">{translation.summary.chart}</label>
                    <OptionPicker
                        data={charts(translation)}
                        index={chartIndex}
                        onChange={(index: number) =>
                            charts(translation)[index] && onChange("chartMode", charts(translation)[index].value)
                        }
                    />
                </div>

                <div className="flex items-center gap-3">
                    <label className="cyber-label">{translation.summary.order}</label>
                    <OptionPicker
                        data={orders(translation)}
                        index={orderIndex}
                        onChange={(index: number) =>
                            orders(translation)[index] && onChange("divisionMode", orders(translation)[index].value)
                        }
                    />
                </div>

                <div className="flex items-center gap-3">
                    <label className="cyber-label">{translation.summary.category}</label>
                    <CategoryPicker selectedId={category} type={type} onSelect={id => onChange("category", id)} />
                </div>

                <div className="flex justify-between items-center gap-3 md:col-span-2">
                    <div className="flex items-center gap-3">
                        <label className="cyber-label">{translation.summary.dateStart}</label>
                        <DatePicker value={dateStart} onChange={v => onChange("dateStart", v)} maxDate={dateEnd} />
                    </div>
                    <span className="cyber-label">-</span>
                    <div className="flex items-center gap-3">
                        <label className="cyber-label">{translation.summary.dateEnd}</label>
                        <DatePicker
                            value={dateEnd}
                            onChange={v => onChange("dateEnd", v)}
                            minDate={dateStart}
                            isRight
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center gap-3 md:col-span-2">
                    <div className="flex items-center gap-3">
                        <label className="cyber-label">{translation.summary.priceLow}</label>
                        <PricePicker
                            value={priceLow}
                            onChange={v => onChange("priceLow", v || 0)}
                            maxPrice={priceHigh}
                        />
                    </div>
                    <span className="cyber-label">-</span>
                    <div className="flex items-center gap-3">
                        <label className="cyber-label">{translation.summary.priceHigh}</label>
                        <PricePicker
                            value={priceHigh}
                            onChange={v => onChange("priceHigh", v)}
                            minPrice={priceLow}
                            isRight
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
