import {useMemo, useState, useEffect, useCallback} from "react";
import {
    Area,
    Bar,
    Line,
    ComposedChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    PieChart,
    Pie,
    Cell,
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis
} from "recharts";
import {Box, LoaderCircle} from "lucide-react";
import {useI18n} from "../../context/I18nContext";
import {useSettings} from "../../context/SettingsContext";
import type {RecordData} from "../../types/RecordTypes";
import type {ChartMode, DivisionMode} from "../../types/SummaryTypes.ts";
import type {CategoryData} from "../../types/CategoryTypes";
import {categoryApi} from "../../utilities/api.ts";

interface Props {
    data: RecordData[];
    chartMode: ChartMode;
    divisionMode: DivisionMode;
}

const CYBER_COLORS = [
    "#22d3ee",
    "#a855f7",
    "#ec4899",
    "#10b981",
    "#f59e0b",
    "#3b82f6",
    "#ef4444",
    "#84cc16",
    "#f97316",
    "#06b6d4"
];

export default function ChartViewer({data, chartMode, divisionMode}: Props) {
    const [categories, setCategories] = useState<Record<number, CategoryData>>({});
    const [loadingCategories, setLoadingCategories] = useState<boolean>(false);

    const {translation} = useI18n();
    const {formatPrice, formatDate} = useSettings();

    const fetchCategories = useCallback(async (ids: number[]) => {
        if (!ids.length) return;
        setLoadingCategories(true);
        const map: Record<number, CategoryData> = {};

        await Promise.all(
            ids.map(id =>
                categoryApi.fetch(
                    id,
                    category => {
                        if (category?.id) map[category.id] = category;
                    },
                    translation.category.fetchFailed
                )
            )
        );

        setCategories(previous => ({...previous, ...map}));
        setLoadingCategories(false);
    }, []);

    useEffect(() => {
        const ids = Array.from(new Set(data.map(record => record.category_id).filter(Boolean))) as number[];
        const missing = ids.filter(id => !categories[id]);
        if (missing.length) fetchCategories(missing);
    }, [data]);

    const chartData = useMemo(() => {
        const groups: Record<string, {income: number; expense: number; count: number}> = {};

        data.forEach(item => {
            let key: string;
            switch (divisionMode) {
                case "date":
                    key = item.date;
                    break;
                case "category":
                    key = categories[item.category_id ?? 0]?.name ?? "Unknown";
                    break;
                case "type":
                    key = item.type === "income" ? translation.common.income : translation.common.expense;
                    break;
                case "price":
                    key = formatPrice(item.price);
                    break;
                default:
                    key = item.date;
            }
            if (!groups[key]) groups[key] = {income: 0, expense: 0, count: 0};
            if (item.type === "income") groups[key].income += item.price;
            else groups[key].expense += item.price;
            groups[key].count += 1;
        });

        return Object.entries(groups)
            .map(([name, stats], index) => ({
                name,
                income: Math.round(stats.income * 100) / 100,
                expense: Math.round(stats.expense * 100) / 100,
                net: Math.round((stats.income - stats.expense) * 100) / 100,
                count: stats.count,
                fill: CYBER_COLORS[index % CYBER_COLORS.length]
            }))
            .sort((a, b) => (divisionMode === "date" ? a.name.localeCompare(b.name) : 0));
    }, [data, divisionMode, categories, translation, formatPrice]);

    const isPrice = divisionMode !== "price";
    const valueKeys: Array<{key: string; color: string; name: string}> = isPrice
        ? [
              {key: "income", color: "#22d3ee", name: translation.common.income},
              {key: "expense", color: "#ec4899", name: translation.common.expense}
          ]
        : [{key: "count", color: "#a855f7", name: translation.summary.recordCount}];

    //tool tip
    const CustomTooltip = ({active, payload, label}: any) => {
        if (!active || !payload?.length) return null;
        return (
            <div className="rounded-xl bg-(--bg-surface) border border-(--border-glow) px-2 py-3 backdrop-blur-md shadow-(--glow-cyan) min-w-30">
                <div className="font-bold mb-3 pb-1 truncate text-(--text-accent) border-b border-(--border)">
                    {label}
                </div>
                {payload.map((p: any) => (
                    <div key={p.dataKey} className="flex items-center justify-between gap-3 text-sm">
                        <span style={{color: p.color}}>{p.name}</span>
                        <span className="font-mono font-bold" style={{color: p.color}}>
                            {p.dataKey === "count" ? p.value : formatPrice(p.value)}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    //formatters
    const yFormatter = (value: number) => {
        if (divisionMode === "price") return String(value);
        if (Math.abs(value) >= 1_000_000_000_000) return formatPrice(value / 1_000_000_000_000) + "T";
        if (Math.abs(value) >= 1_000_000_000) return formatPrice(value / 1_000_000_000) + "B";
        if (Math.abs(value) >= 1_000_000) return formatPrice(value / 1_000_000) + "M";
        if (Math.abs(value) >= 1_000) return formatPrice(value / 1_000) + "K";
        return formatPrice(value);
    };

    const xFormatter = (value: string) => {
        if (divisionMode === "date") return formatDate(value);
        return value.length > 10 ? value.slice(0, 10) + "…" : value;
    };

    //empty
    if (!loadingCategories && !chartData.length)
        return (
            <div className="flex flex-col items-center justify-center py-12 rounded-xl border-2 border-dashed border-(--border) bg-(--bg-card)">
                <Box size={50} className="text-(--text-accent) mb-3" />
                <p className="text-(--text-accent) font-bold">{translation.summary.noData}</p>
                <p className="mt-1 text-(--text-muted) opacity-50">{translation.summary.noDataHint}</p>
            </div>
        );

    const axisStyle = {fontSize: 12, fontFamily: "monospace"};
    const gridStroke = "var(--border)";
    const xColor = "var(--text-muted)";
    const yColor = "var(--text-muted)";

    const commonChart = (
        <>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
            <XAxis
                dataKey="name"
                stroke={xColor}
                tick={{...axisStyle, fill: xColor}}
                tickLine={false}
                tickFormatter={xFormatter}
                interval="preserveStartEnd"
            />
            <YAxis
                stroke={yColor}
                tick={{...axisStyle, fill: yColor}}
                tickLine={false}
                axisLine={false}
                tickFormatter={yFormatter}
                width={70}
            />
            <Tooltip content={<CustomTooltip />} cursor={{fill: "rgb(from var(--text-accent) r g b / 0.1)"}} />
            <Legend wrapperStyle={{fontSize: "12px", paddingTop: "8px"}} />
        </>
    );

    return (
        <div className="w-full cyber-card overflow-hidden h-[clamp(300px,50vh,520px)] pt-4 px-2 pb-2">
            {loadingCategories ? (
                <div className="flex h-full items-center justify-center">
                    <LoaderCircle className="animate-spin text-(--text-accent)" size={39} />
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    {/*pie chart*/}
                    {chartMode === "pie" ? (
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="income"
                                nameKey="name"
                                cx="50%"
                                cy="45%"
                                innerRadius="55%"
                                outerRadius="70%"
                                paddingAngle={3}
                                label={({name, percent}) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                                labelLine={{stroke: "var(--border-glow)"}}
                            >
                                {chartData.map((_, i) => (
                                    <Cell key={i} fill={CYBER_COLORS[i % CYBER_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{fontSize: "12px"}} />
                        </PieChart>
                    ) : /*radar chart*/
                    chartMode === "radar" ? (
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                            <PolarGrid stroke={gridStroke} />
                            <PolarAngleAxis dataKey="name" tick={{fontSize: 12, fill: xColor}} />
                            {valueKeys.map(vk => (
                                <Radar
                                    key={vk.key}
                                    name={vk.name}
                                    dataKey={vk.key}
                                    stroke={vk.color}
                                    fill={vk.color}
                                    fillOpacity={0.3}
                                />
                            ))}
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{fontSize: "12px"}} />
                        </RadarChart>
                    ) : (
                        /*composed chart*/
                        <ComposedChart data={chartData}>
                            <defs>
                                {valueKeys.map(vk => (
                                    <linearGradient key={vk.key} id={`grad-${vk.key}`} x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="5%" stopColor={vk.color} stopOpacity={0.6} />
                                        <stop offset="95%" stopColor={vk.color} stopOpacity={0.05} />
                                    </linearGradient>
                                ))}
                            </defs>
                            {commonChart}

                            {(chartMode === "area" || chartMode === "composed") &&
                                valueKeys.map(vk => (
                                    <Area
                                        key={vk.key}
                                        name={vk.name}
                                        type="monotone"
                                        dataKey={vk.key}
                                        fill={`url(#grad-${vk.key})`}
                                        stroke={vk.color}
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{r: 5, fill: vk.color}}
                                    />
                                ))}

                            {(chartMode === "bar" || chartMode === "composed") &&
                                valueKeys.map(vk => (
                                    <Bar
                                        key={vk.key}
                                        name={vk.name}
                                        dataKey={vk.key}
                                        fill={vk.color}
                                        barSize={14}
                                        radius={[6, 6, 0, 0]}
                                        opacity={0.85}
                                    />
                                ))}

                            {(chartMode === "line" || chartMode === "composed") &&
                                valueKeys.map(vk => (
                                    <Line
                                        key={vk.key}
                                        name={vk.name}
                                        type="monotone"
                                        dataKey={vk.key}
                                        stroke={vk.color}
                                        strokeWidth={2}
                                        dot={{r: 3, fill: vk.color, strokeWidth: 1}}
                                        activeDot={{r: 6}}
                                    />
                                ))}
                        </ComposedChart>
                    )}
                </ResponsiveContainer>
            )}
        </div>
    );
}
