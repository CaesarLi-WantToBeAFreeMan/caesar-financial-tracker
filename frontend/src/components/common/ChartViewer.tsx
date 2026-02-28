import {useMemo, useState, useEffect} from "react";
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
import {BadgeDollarSign, Banknote, Box, Calendar, LoaderCircle} from "lucide-react";
import axiosConfig from "../../utilities/AxiosUtility";
import {API_ENDPOINTS} from "../../utilities/apiEndpoint";
import {RenderIcon} from "../../utilities/icon";
import type {RecordData} from "../../types/RecordTypes";
import type {ChartMode, DivisionMode} from "../../types/SummaryTypes.ts";
import type {CategoryData} from "../../types/CategoryTypes";
import {parsePrice, priceFormat} from "../../utilities/prices.ts";

interface Props {
    data: RecordData[];
    chartMode: ChartMode;
    divisionMode: DivisionMode;
}

const COLORS = [
    "#8500f3",
    "#ff62e5",
    "#00b3ff",
    "#39ff14",
    "#0033ff",
    "#ff4500",
    "#f5a623",
    "#003c8f",
    "#ff0099",
    "#003c8f"
];

export default function ChartViewer({data, chartMode, divisionMode}: Props) {
    const [categories, setCategories] = useState<Record<number, CategoryData>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            const ids = Array.from(
                new Set(data.map(record => record.category_id).filter(id => id !== null))
            ) as number[];
            if (!ids.length) return;
            setLoading(true);
            try {
                const results = await Promise.all(
                    ids.map(id => axiosConfig.get(API_ENDPOINTS.FETCH_CATEGORY.replace("{id}", String(id))))
                );
                const map: Record<number, CategoryData> = {};
                results.forEach(result => {
                    if (result.data.id) map[result.data.id] = result.data;
                });
                setCategories(prev => ({...prev, ...map}));
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, [data]);

    const chartData = useMemo(() => {
        const groups: Record<string, {value: number; count: number; icon?: string}> = {};

        data.forEach(item => {
            const category = categories[item.category_id || 0];
            let key: string =
                divisionMode === "date"
                    ? item.date
                    : divisionMode === "price"
                      ? item.price
                      : divisionMode === "type"
                        ? item.type
                        : divisionMode === "category"
                          ? category?.name || "Unknown"
                          : "Unknown";
            const icon = category?.icon || <Box />;
            if (!groups[key]) groups[key] = {value: 0, count: 0, icon};
            groups[key].value += item.price;
            groups[key].count += 1;
        });

        return Object.entries(groups)
            .map(([name, stats], index) => ({
                name: divisionMode === "price" ? priceFormat(Number(name)) : name,
                displayValue: divisionMode === "price" ? stats.count : stats.value,
                icon:
                    divisionMode === "date" ? (
                        <Calendar />
                    ) : divisionMode === "price" ? (
                        <BadgeDollarSign />
                    ) : divisionMode === "type" ? (
                        <Banknote />
                    ) : (
                        stats.icon
                    ),
                fill: COLORS[index % COLORS.length]
            }))
            .sort((a, b) =>
                divisionMode === "date"
                    ? new Date(a.name).getTime() - new Date(b.name).getTime()
                    : divisionMode === "price"
                      ? parsePrice(a.name) - parsePrice(b.name)
                      : a.name.localeCompare(b.name)
            );
    }, [data, divisionMode, categories]);

    const label = divisionMode === "price" ? "Record Count" : "Total Amount";

    if (!loading && !chartData.length)
        return (
            <div className="flex flex-col items-center justify-center py-12 border-3 border-dashed border-cyan-500/10 rounded-xl bg-cyan-500/[0.02]">
                <Box size={50} className="text-cyan-500/20 mb-3" />
                <p className="text-cyan-400/50 font-medium">No item found</p>
                <p className="text-xs text-cyan-500/30">Try importing a file or adding an item in record page</p>
            </div>
        );

    const CustomTooltip = ({active, payload}: any) => {
        if (!active || !payload?.length) return null;
        const item = payload[0].payload;
        return (
            <div className="bg-black/50 border border-cyan-600/10 p-3 rounded-lg backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.6)]">
                <div className="flex items-center gap-3 mb-1 border-b border-cyan-500/10 pb-1">
                    <RenderIcon icon={item.icon} name={item.name} />
                    <span className="font-bold text-xs truncate" style={{color: item.fill ?? "#67e8f9"}}>
                        {item.name}
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="text-cyan-600 font-mono text-normal font-bold">
                        {divisionMode === "price" ? `${item.displayValue} Records` : priceFormat(item.displayValue)}
                    </span>
                </div>
            </div>
        );
    };

    const commonAxes = [
        <CartesianGrid key="g" strokeDasharray="3 3" stroke="rgba(34,211,238,0.3)" vertical={false} />,
        <XAxis key="x" dataKey="name" stroke="#ff62e5" fontSize={9} tickLine={false} axisLine={true} />,
        <YAxis key="y" stroke="#39ff14" fontSize={9} tickLine={false} axisLine={false} />,
        <Tooltip key="t" content={<CustomTooltip />} cursor={{fill: "rgba(34,211,238,0.3)"}} />,
        <Legend key="l" wrapperStyle={{paddingTop: "1px", fontSize: "9px"}} verticalAlign="bottom" />
    ];

    return (
        <div className="w-full h-[300px] lg:h-[500px] bg-[#0b0f1a] border border-cyan-400/30 rounded-xl py-3 px-1 shadow-[0_0_7px_rgba(34,211,238,0.6)] relative overflow-hidden">
            {loading ? (
                <div className="flex h-full items-center justify-center">
                    <LoaderCircle className="animate-spin text-cyan-400" size={39} />
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    {chartMode === "pie" ? (
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="displayValue"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius="70%"
                                outerRadius="90%"
                                paddingAngle={3}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                        </PieChart>
                    ) : chartMode === "radar" ? (
                        <RadarChart cx="50%" cy="50%" outerRadius="90%" data={chartData}>
                            <PolarGrid stroke="#ff62e5" />
                            <PolarAngleAxis dataKey="name" stroke="#39ff14" fontSize={9} />
                            <Radar
                                name="Value"
                                dataKey="displayValue"
                                stroke="#ffffff"
                                fill="#00fff7"
                                fillOpacity={0.9}
                            />
                            <Tooltip content={<CustomTooltip />} />
                        </RadarChart>
                    ) : (
                        <ComposedChart data={chartData}>
                            <defs>
                                <linearGradient id="cyberGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="3%" stopColor="#8900ff" stopOpacity={0.7} />
                                    <stop offset="90%" stopColor="#003c8f" stopOpacity={0.7} />
                                </linearGradient>
                            </defs>

                            {commonAxes}

                            {(chartMode === "area" || chartMode === "composed") && (
                                <Area
                                    name={label}
                                    type="monotone"
                                    dataKey="displayValue"
                                    fill="url(#cyberGrad)"
                                    stroke="#22d3ee"
                                    strokeWidth={2}
                                />
                            )}

                            {(chartMode === "bar" || chartMode === "composed") && (
                                <Bar name={label} dataKey="displayValue" barSize={12} radius={[9, 9, 0, 0]}>
                                    {chartData.map((entry, i) => (
                                        <Cell key={i} fill={entry.fill} />
                                    ))}
                                </Bar>
                            )}

                            {(chartMode === "line" || chartMode === "composed") && (
                                <Line
                                    name={label}
                                    type="monotone"
                                    dataKey="displayValue"
                                    stroke="#ff1493"
                                    strokeWidth={1}
                                    dot={{r: 3, fill: "#00b3ff", strokeWidth: 1}}
                                />
                            )}
                        </ComposedChart>
                    )}
                </ResponsiveContainer>
            )}
        </div>
    );
}
