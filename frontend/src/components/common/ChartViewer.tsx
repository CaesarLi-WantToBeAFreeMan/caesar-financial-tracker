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
import axiosConfig from "../../utilities/AxiosUtility";
import {API_ENDPOINTS} from "../../utilities/apiEndpoint";
import {useI18n} from "../../context/I18nContext";
import {useSettings} from "../../context/SettingsContext";
import type {RecordData} from "../../types/RecordTypes";
import type {ChartMode, DivisionMode} from "../../types/SummaryTypes.ts";
import type {CategoryData} from "../../types/CategoryTypes";

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
    const [loadingCats, setLoadingCats] = useState<boolean>(false);

    const {translation} = useI18n();
    const {formatPrice, formatDate} = useSettings();

    const fetchCategories = useCallback(async (ids: number[]) => {
        if (!ids.length) return;
        setLoadingCats(true);
        try {
            const results = await Promise.all(
                ids.map(id => axiosConfig.get(API_ENDPOINTS.FETCH_CATEGORY.replace("{id}", String(id))))
            );
            const map: Record<number, CategoryData> = {};
            results.forEach(result => {
                if (result.data?.id) map[result.data.id] = result.data;
            });
            setCategories(prev => ({...prev, ...map}));
        } catch {
        } finally {
            setLoadingCats(false);
        }
    }, []);

    useEffect(() => {
        const ids = Array.from(new Set(data.map(r => r.category_id).filter(Boolean))) as number[];
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
            <div
                style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-glow)",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    backdropFilter: "blur(12px)",
                    boxShadow: "var(--glow-cyan)",
                    minWidth: "140px"
                }}
            >
                <p className="text-xs font-bold mb-2 truncate" style={{color: "var(--text-accent)"}}>
                    {label}
                </p>
                {payload.map((p: any) => (
                    <div key={p.dataKey} className="flex items-center justify-between gap-4 text-xs">
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
    if (!loadingCats && !chartData.length)
        return (
            <div
                className="flex flex-col items-center justify-center py-16 rounded-xl"
                style={{border: "2px dashed var(--border)", background: "var(--bg-card)"}}
            >
                <Box size={48} style={{color: "var(--border-glow)", marginBottom: "12px"}} />
                <p className="font-medium" style={{color: "var(--text-accent)"}}>
                    {translation.summary.noData}
                </p>
                <p className="text-xs mt-1" style={{color: "var(--text-muted)"}}>
                    {translation.summary.noDataHint}
                </p>
            </div>
        );

    const axisStyle = {fontSize: 11, fontFamily: "monospace"};
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
            <Tooltip content={<CustomTooltip />} cursor={{fill: "rgba(34,211,238,0.08)"}} />
            <Legend wrapperStyle={{fontSize: "12px", paddingTop: "8px"}} />
        </>
    );

    return (
        <div
            className="w-full cyber-card overflow-hidden"
            style={{height: "clamp(300px, 50vh, 520px)", padding: "16px 8px 8px"}}
        >
            {loadingCats ? (
                <div className="flex h-full items-center justify-center">
                    <LoaderCircle className="animate-spin" size={36} style={{color: "var(--text-accent)"}} />
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
                                outerRadius="80%"
                                paddingAngle={3}
                                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
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
                            <PolarAngleAxis dataKey="name" tick={{fontSize: 11, fill: xColor}} />
                            {valueKeys.map(vk => (
                                <Radar
                                    key={vk.key}
                                    name={vk.name}
                                    dataKey={vk.key}
                                    stroke={vk.color}
                                    fill={vk.color}
                                    fillOpacity={0.25}
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
                                    <linearGradient key={vk.key} id={`grad-${vk.key}`} x1="0" y1="0" x2="0" y2="1">
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
