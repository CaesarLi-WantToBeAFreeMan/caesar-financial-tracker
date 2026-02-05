import {Trash} from "lucide-react";
import type {CategoryData} from "../types/CategoryData";

interface Props {
    category: CategoryData;
    onConfirm: (id: number) => void;
    onCancel: () => void;
}

export default function DeleteCategoryConfirm({category, onConfirm, onCancel}: Props) {
    return (
        <div className="space-y-5">
            <div className="flex items-center gap-3 rounded-lg border border-red-400/30 bg-red-500/10 p-4">
                <Trash className="text-red-400" size={22} />
                <p className="text-sm text-red-300">
                    Are you sure to delete {category.name}
                    <span className="block text-red-400 font-semibold">This operation cannot undo</span>
                </p>
            </div>

            {/* Category preview */}
            <div className="rounded-lg border border-cyan-400/20 bg-black/40 p-4">
                <p className="text-cyan-200 font-medium truncate">{category.name}</p>
                <p className="text-xs uppercase tracking-widest mt-1">
                    <span className={category.type === "income" ? "text-[#98c379]" : "text-[#e06c75]"}>
                        {category.type}
                    </span>
                </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
                <button
                    onClick={onCancel}
                    className="rounded-lg px-4 py-2 border border-white/10 text-cyan-300 hover:bg-white/5 hover:cursor-pointer"
                >
                    Cancel
                </button>

                <button
                    onClick={() => onConfirm(category.id!)}
                    className="rounded-lg px-4 py-2 bg-red-500/20 border border-red-400/40 text-red-300 hover:shadow-[0_0_15px_rgba(248,113,113,0.6)] hover:cursor-pointer"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
