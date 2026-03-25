/*
 * display responsive grid for categories/records
 */
import {useEffect, useState} from "react";
import {Box, Pen, Trash} from "lucide-react";
import {RenderIcon} from "../../utilities/icon";
import {useSettings} from "../../context/SettingsContext";
import {useI18n} from "../../context/I18nContext";
import type {CategoryData} from "../../types/CategoryTypes";
import type {RecordData} from "../../types/RecordTypes";
import {categoryApi} from "../../utilities/api";

interface Props {
    title: string;
    items: CategoryData[] | RecordData[];
    totalElements: number;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    isRecord?: boolean;
}

export default function ItemList({title, items, totalElements, onEdit, onDelete, isRecord = false}: Props) {
    const {formatPrice, formatDate} = useSettings();
    const {translation} = useI18n();

    //category cache for records
    const [categories, setCategories] = useState<Record<number, CategoryData>>({});

    //fetch categories
    useEffect(() => {
        if (!isRecord || !items.length) return;

        const records = items as RecordData[];
        const uniqueIds = Array.from(new Set(records.map(record => record.category_id).filter(Boolean))) as number[];

        if (!uniqueIds.length) return;

        const fetch = async () => {
            const map: Record<number, CategoryData> = {};

            await Promise.all(
                uniqueIds.map((id: number) =>
                    categoryApi.fetch(
                        id,
                        category => {
                            if (category && category.id) map[category.id] = category;
                        },
                        translation.category.fetchFailed
                    )
                )
            );

            setCategories(previous => ({...previous, ...map}));
        };
        fetch();
    }, [items, isRecord]);

    const isIncome = (type?: string) => type === "income";

    return (
        <div className="cyber-card p-3 md:p-6">
            {/*header row*/}
            <div className="flex items-center justify-between mb-3 group">
                <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full animate-pulse group-hover:animate-bounce group-active:animate-bounce bg-(--text-accent)" />
                    <h2 className="text-xl font-bold tracking-wide text-(--text-accent)">{title}</h2>
                </div>
                <span className="px-3 py-2 rounded-full border border-(--border) text-(--text-dim) bg-(--bg-card)">
                    {translation.common.total}: <strong className="text-(--text-accent)">{totalElements}</strong>
                </span>
            </div>

            {/*empty*/}
            {!items.length ? (
                <div className="flex flex-col items-center justify-center py-12 rounded-xl border-2 border-dashed border-(--border) bg-(--bg-card)">
                    <Box size={50} className="text-(--text-accent) mb-3" />
                    <p className="text-(--text-accent) font-bold">{translation.common.noItems}</p>
                    <p className="mt-1 text-(--text-muted) opacity-50">{translation.common.noItemsHint}</p>
                </div>
            ) : (
                /*1 column on mobile, 2+ for pc*/
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                    {(items as (CategoryData | RecordData)[]).map(item => {
                        const category = isRecord ? categories[(item as RecordData).category_id!] : null;
                        const income = isRecord ? isIncome(category?.type) : isIncome(item.type);

                        return (
                            <div
                                key={item.id}
                                className={`group relative flex items-center gap-3 rounded-xl p-3 transition duration-300 cursor-pointer border ${income ? "border-(--text-correct)" : "border-(--text-wrong)"} bg-(--bg-base) hover:border-(--border-glow) hover:shadow-(--glow-cyan) md:hover:scale-105 md:active:scale-105 active:border-(--border-glow) active:shadow-(--glow-cyan)`}
                            >
                                {/*icon*/}
                                <div
                                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition duration-300 border border-(--border) group-hover:shadow-(--glow-cyan)`}
                                    style={{
                                        background: `rgb(from var(--${income ? "text-correct" : "text-wrong"}) r g b / 0.1)`
                                    }}
                                >
                                    <RenderIcon
                                        icon={item.icon}
                                        name={item.name}
                                        className="group-hover:animate-bounce"
                                    />
                                </div>

                                {/*content*/}
                                <div className="flex-1 min-w-0">
                                    {/*name + type(record only)*/}
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <p
                                            className={`font-bold truncate transition duration-300 group-hover:text-(--text-accent) group-active:text-(--text-accent) ${income ? "text-(--text-correct)" : "text-(--text-wrong)"}`}
                                        >
                                            {item.name}
                                        </p>
                                        {isRecord && (
                                            <>
                                                <span className="text-(--text-accent) text-xl">•</span>
                                                <span className="text-(--text-muted) font-mono">
                                                    {formatDate((item as RecordData).date)}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {/*type + price*/}
                                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                                        {isRecord && category ? (
                                            <>
                                                <span
                                                    className={`px-3 py-2 rounded-full font-bold uppercase tracking-tighter border
                                                        ${income ? "text-(--text-correct)" : "text-(--text-wrong)"}`}
                                                    style={{
                                                        borderColor: `rgb(from var(--${income ? "text-correct" : "text-wrong"}) r g b / 0.1)`,
                                                        backgroundColor: `rgb(from var(--${income ? "text-correct" : "text-wrong"}) r g b / 0.1)`
                                                    }}
                                                >
                                                    {category.name}
                                                </span>
                                                <span className="text-(--text-accent) text-xl">•</span>
                                                <span
                                                    className={`font-mono font-bold"
                                                        ${income ? "text-(--text-correct)" : "text-(--text-wrong)"}`}
                                                >
                                                    {income ? "+" : "-"} {formatPrice((item as RecordData).price)}
                                                </span>
                                            </>
                                        ) : (
                                            <span
                                                className={`px-3 py-2 rounded-xl font-bold uppercase tracking-tighter border"
                                                    ${isIncome(item.type) ? "text-(--text-correct)" : "text-(--text-wrong)"}`}
                                                style={{
                                                    borderColor: `rgb(from var(--${income ? "text-correct" : "text-wrong"}) r g b / 0.1)`,
                                                    backgroundColor: `rgb(from var(--${income ? "text-correct" : "text-wrong"}) r g b / 0.1)`
                                                }}
                                            >
                                                {item.type}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/*edit & delete buttons*/}
                                <div className="flex items-center gap-3 opacity-0 translate-x-2 transition duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-focus-within:opacity-100 group-focus-within:translate-x-0">
                                    <button
                                        onClick={() => item.id && onEdit(item.id)}
                                        className="rounded-xl p-3 transition opacity-50 duration-300 cursor-pointer md:hover:scale-120 md:active:scale-120 text-(--text-warning) hover:text-(--text-accent) hover:bg-(--text-warning) hover:opacity-90 active:text-(--text-accent) active:bg-(--text-warning) active:opacity-90"
                                    >
                                        <Pen size={15} />
                                    </button>
                                    <button
                                        onClick={() => item.id && onDelete(item.id)}
                                        className="rounded-xl p-3 transition opacity-50 duration-300 cursor-pointer md:hover:scale-120 md:active:scale-120 text-(--text-wrong) hover:text-(--text-accent) hover:bg-(--text-wrong) hover:opacity-90 active:text-(--text-accent) active:bg-(--text-wrong) active:opacity-90"
                                    >
                                        <Trash size={15} />
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
