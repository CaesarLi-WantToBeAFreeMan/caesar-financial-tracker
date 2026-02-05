import {Box, Pen, Trash} from "lucide-react";
import type {CategoryData} from "../types/CategoryData";

interface Props {
    categories: CategoryData[];
    totalElements: number;
    onEditCategory: (id: number) => void;
    onDeleteCategory: (id: number) => void;
}

export default function CategoryList({categories, totalElements, onEditCategory, onDeleteCategory}: Props) {
    return (
        <div className="rounded-xl bg-[#0b0f1a] border border-cyan-500/20 p-6 shadow-[0_0_40px_rgba(34,211,238,0.08)]">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-wide text-cyan-300">Category Sources</h2>
                <span className="text-sm text-cyan-400/80">
                    Total:
                    <span className="text-cyan-300 font-semibold">{totalElements}</span>
                </span>
            </div>

            {categories.length === 0 ? (
                <p className="text-sm text-cyan-400/70">No category records. Please add something.</p>
            ) : (
                <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
                    {categories.map(category => (
                        <div
                            key={category.id}
                            className="group relative flex items-center gap-4 rounded-lg p-4 bg-[#111827]/80 backdrop-blur border border-white/5 transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.18)]"
                        >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 transition-all duration-300 group-hover:shadow-[0_0_18px_rgba(34,211,238,0.7)]">
                                {category.icon ? (
                                    <img src={category.icon} alt={category.name} className="h-6 w-6" />
                                ) : (
                                    <Box size={22} />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-cyan-200 truncate" title={category.name}>
                                    {category.name}
                                </p>

                                <p
                                    className={`mt-1 text-xs font-semibold uppercase tracking-widest ${category.type === "income" ? "text-[#98c379]" : "text-[#e06c75]"}`}
                                >
                                    {category.type}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                                <button
                                    onClick={() => onEditCategory(category.id)}
                                    className="rounded-md p-2 text-yellow-400 hover:bg-yellow-400/10 hover:shadow-[0_0_12px_rgba(250,204,21,0.6)]"
                                >
                                    <Pen size={18} />
                                </button>

                                <button
                                    onClick={() => onDeleteCategory(category.id)}
                                    className="rounded-md p-2 text-red-400 hover:bg-red-400/10 hover:shadow-[0_0_12px_rgba(248,113,113,0.6)]"
                                >
                                    <Trash size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
