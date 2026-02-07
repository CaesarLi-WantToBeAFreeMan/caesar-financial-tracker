import {Box, Pen, Trash} from "lucide-react";
import type {CategoryData} from "../types/CategoryData";

interface Props {
    categories: CategoryData[];
    totalElements: number;
    onEditCategory: (id: number) => void;
    onDeleteCategory: (id: number) => void;
}

export default function CategoryList({categories, totalElements, onEditCategory, onDeleteCategory}: Props) {
    const isImageSource = (icon: string | null | undefined) =>
        !icon ? false : icon.startsWith("http") || icon.startsWith("https") || icon.startsWith("data:image");
    return (
        <div className="rounded-xl bg-[#0b0f1a] border border-cyan-500/20 p-6 shadow-[0_0_40px_rgba(34,211,238,0.08)]">
            <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                    <h2 className="text-lg font-semibold tracking-wide text-cyan-300">Category Sources</h2>
                </div>
                <span className="text-sm text-cyan-400/80 bg-cyan-400/5 p-3 rounded-full border border-cyan-400/10">
                    Total: <span className="text-cyan-300 font-bold ml-1">{totalElements}</span>
                </span>
            </div>
            {categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-cyan-500/10 rounded-xl bg-cyan-500/[0.02]">
                    <Box size={48} className="text-cyan-500/20 mb-3" />
                    <p className="text-sm text-cyan-400/50 font-medium">No category records found.</p>
                    <p className="text-xs text-cyan-500/30">Try importing a file or adding a manual entry.</p>
                </div>
            ) : (
                <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
                    {categories.map(category => (
                        <div
                            key={category.id}
                            className="group relative flex items-center gap-4 rounded-lg p-4 bg-[#111827]/80 backdrop-blur border border-white/5 transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.18)]"
                        >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 transition-all duration-300 group-hover:shadow-[0_0_18px_rgba(34,211,238,0.5)] group-hover:border-cyan-400/60">
                                {!category.icon ? (
                                    <Box size={22} />
                                ) : isImageSource(category.icon) ? (
                                    <img
                                        src={category.icon}
                                        alt={category.name}
                                        className="h-6 w-6 object-contain filter brightness-110"
                                    />
                                ) : (
                                    <img
                                        src={`https://placehold.co/100x100/111827/22d3ee?text=${encodeURIComponent(category.icon)}&font=raleway`}
                                        className="h-6 w-6 rounded-sm"
                                        alt="category icon"
                                    />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p
                                    className="text-sm font-semibold text-cyan-100 truncate group-hover:text-white transition-colors"
                                    title={category.name}
                                >
                                    {category.name}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span
                                        className={`text-[10px] px-2 py-0.5 rounded-sm font-bold uppercase tracking-tighter border ${
                                            category.type === "income"
                                                ? "text-[#98c379] border-[#98c379]/20 bg-[#98c379]/5"
                                                : "text-[#e06c75] border-[#e06c75]/20 bg-[#e06c75]/5"
                                        }`}
                                    >
                                        {category.type}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                                <button
                                    onClick={() => onEditCategory(category.id)}
                                    className="rounded-md p-2 text-yellow-400/80 hover:text-yellow-300 hover:bg-yellow-400/10 hover:shadow-[0_0_15px_rgba(250,204,21,0.3)] cursor-pointer transition-all"
                                    aria-label="Edit category"
                                >
                                    <Pen size={16} />
                                </button>
                                <button
                                    onClick={() => onDeleteCategory(category.id)}
                                    className="rounded-md p-2 text-red-400/80 hover:text-red-300 hover:bg-red-400/10 hover:shadow-[0_0_15px_rgba(248,113,113,0.3)] cursor-pointer transition-all"
                                    aria-label="Delete category"
                                >
                                    <Trash size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
