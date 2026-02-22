import {Trash} from "lucide-react";
import type {CategoryData} from "../../types/CategoryData";
import {RenderIcon} from "../../utilities/icon";

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

            <div className="flex items-center gap-3 group rounded-lg border border-cyan-400/20 bg-black/40 p-3 transtion duration-300 hover:bg-cyan-400/5 hover:cursor-pointer">
                <RenderIcon icon={category.icon} name={category.name} className="group-hover:animate-bounce" />
                <div
                    className={`flex flex-col items-center gap-1 ${category.type === "income" ? "text-green-400" : "text-red-400"}`}
                >
                    <p className="font-medium truncate transition duration-300 group-hover:text-cyan-400">
                        {category.name}
                    </p>
                    <p className="text-xs uppercase tracking-widest">{category.type}</p>
                </div>
            </div>

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
