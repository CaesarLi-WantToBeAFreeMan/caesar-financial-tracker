import {Box, Pen, Trash} from "lucide-react";
import type {CategoryData} from "../../types/CategoryData";
import {RenderIcon} from "../../utilities/icon";
import {useEffect, useState} from "react";
import type {RecordData} from "../../types/records/RecordData";
import axiosConfig from "../../utilities/AxiosUtility";
import {API_ENDPOINTS} from "../../utilities/apiEndpoint";
import toast from "react-hot-toast";
import {priceFormat} from "../../utilities/prices";

interface Props {
    title: string;
    items: CategoryData[] | RecordData[];
    totalElements: number;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    isRecord?: boolean;
}

export default function ItemList({title, items, totalElements, onEdit, onDelete, isRecord = false}: Props) {
    const isIncome = (type?: string) => type === "income";
    const [categories, setCategories] = useState<Record<number, CategoryData>>({});

    useEffect(() => {
        if (!isRecord || items.length === 0) return;
        const records = items as RecordData[];
        const categoryIds = Array.from(new Set(records.map(record => record.category_id).filter(Boolean))) as number[];
        if (categoryIds.length === 0) return;
        Promise.all(
            categoryIds.map(categoryId =>
                axiosConfig
                    .get(API_ENDPOINTS.FETCH_CATEGORY.replace("{id}", String(categoryId)))
                    .then(response => response.data)
            )
        )
            .then((result: CategoryData[]) => {
                const map: Record<number, CategoryData> = {};
                result.forEach(category => (map[category.id] = category));
                setCategories(prev => ({...prev, ...map}));
            })
            .catch((error: any) => toast.error(error?.response?.data?.message || "Fetch categories failed"));
    }, [items, isRecord]);

    return (
        <div className="rounded-xl bg-[#0b0f1a] border border-cyan-500/20 p-6 shadow-[0_0_40px_rgba(34,211,238,0.08)]">
            <div className="mb-5 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-cyan-400 animate-pulse group-hover:animate-bounce" />
                    <h2 className="text-lg font-semibold tracking-wide text-cyan-300">{title}</h2>
                </div>
                <span className="text-sm text-cyan-400/80 bg-cyan-400/5 p-3 rounded-full border border-cyan-400/10">
                    Total: <span className="text-cyan-300 font-bold ml-1">{totalElements}</span>
                </span>
            </div>

            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-cyan-500/10 rounded-xl bg-cyan-500/[0.02]">
                    <Box size={50} className="text-cyan-500/20 mb-3" />
                    <p className="text-sm text-cyan-400/50 font-medium">No items found</p>
                    <p className="text-xs text-cyan-500/30">Try importing a file or adding an item</p>
                </div>
            ) : (
                <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
                    {(items as (CategoryData | RecordData)[]).map(item => {
                        const category = isRecord ? categories[(item as RecordData).category_id!] : null;
                        return (
                            <div
                                key={item.id}
                                className="group relative flex items-center gap-3 rounded-lg p-3 bg-[#111827]/80 backdrop-blur border border-white/5 transition duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.18)] hover:bg-cyan-400/10 hover:cursor-pointer"
                            >
                                <div
                                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                                        isIncome(item.type) ? "bg-green-400/20" : "bg-red-400/20"
                                    } border border-cyan-400/30 text-cyan-300 transition duration-300 group-hover:shadow-[0_0_18px_rgba(34,211,238,0.5)]`}
                                >
                                    <RenderIcon
                                        icon={item.icon}
                                        name={item.name}
                                        className="group-hover:animate-bounce"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-cols gap-1 justify-start items-center">
                                        <p
                                            className={`text-sm font-semibold ${
                                                isIncome(item.type) ? "text-green-400" : "text-red-400"
                                            } truncate transition group-hover:text-cyan-400`}
                                            title={item.name}
                                        >
                                            {item.name}
                                        </p>
                                        {isRecord && (
                                            <>
                                                <p className="text-cyan-400">•</p>
                                                <p className="text-[9px] text-white-400">{item.date}</p>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        {isRecord && category ? (
                                            <div className="flex flex-cols gap-1 justify-start items-center">
                                                <span
                                                    className={`text-[10px] px-2 py-0.5 rounded-sm font-bold uppercase tracking-tighter border ${
                                                        category && isIncome(category.type)
                                                            ? "text-green-400 border-green-400/20 bg-green-400/5"
                                                            : "text-red-400 border-red-400/20 bg-red-400/5"
                                                    }`}
                                                >
                                                    {category?.name || "Loading..."}
                                                </span>
                                                <p className="text-cyan-400">•</p>
                                                <p
                                                    className={`text-sm font-mono font-bold ${isIncome(category.type) ? "text-green-400" : "text-red-400"}`}
                                                >
                                                    {isIncome(category.type) ? "+" : "-"}{" "}
                                                    {priceFormat((item as RecordData).price)}
                                                </p>
                                            </div>
                                        ) : (
                                            <span
                                                className={`text-[10px] px-2 py-0.5 rounded-sm font-bold uppercase tracking-tighter border ${
                                                    isIncome(item.type)
                                                        ? "text-green-400 border-green-400/20 bg-green-400/5"
                                                        : "text-red-400 border-red-400/20 bg-red-400/5"
                                                }`}
                                            >
                                                {item.type}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 translate-x-2 transition duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                                    <button
                                        onClick={() => item.id && onEdit(item.id)}
                                        className="rounded-md p-2 text-yellow-400/80 transition hover:text-yellow-300 hover:bg-yellow-400/10 hover:cursor-pointer"
                                    >
                                        <Pen size={18} />
                                    </button>
                                    <button
                                        onClick={() => item.id && onDelete(item.id)}
                                        className="rounded-md p-2 text-red-400/80 transition hover:text-red-300 hover:bg-red-400/10 hover:cursor-pointer"
                                    >
                                        <Trash size={18} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
