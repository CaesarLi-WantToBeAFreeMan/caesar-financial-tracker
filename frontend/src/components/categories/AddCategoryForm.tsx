import {useState} from "react";
import type {CategoryData} from "../../types/CategoryData";
import IconPicker from "../common/IconPicker";

interface Props {
    onAddCategory: (category: CategoryData) => void;
}

export default function AddCategoryForm({onAddCategory}: Props) {
    const [category, setCategory] = useState<CategoryData>({
        id: null,
        name: "",
        icon: "",
        type: "income",
        created_at: null,
        updated_at: null
    });

    return (
        <div className="space-y-5">
            <div className="flex justify-between gap-3">
                <div className="w-full">
                    <label className="text-cyan-300">Name</label>
                    <input
                        className="mt-1 w-full rounded-lg bg-black/40 border border-cyan-400/20 p-2 text-cyan-100"
                        value={category.name}
                        onChange={e => setCategory({...category, name: e.target.value})}
                    />
                </div>
                <div>
                    <label className="text-cyan-300">Type</label>
                    <select
                        className="mt-1 w-full rounded-lg bg-black/40 border border-cyan-400/20 p-2 text-cyan-100"
                        value={category.type}
                        onChange={e => setCategory({...category, type: e.target.value as "income" | "expense"})}
                    >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>
            </div>
            <div className="space-y-3">
                <label className="text-cyan-300">Icon</label>
                <IconPicker
                    icon={category.icon}
                    name={category.name}
                    onChange={v => setCategory({...category, icon: v})}
                />
            </div>
            <div className="flex justify-end pt-3">
                <button
                    onClick={() => onAddCategory(category)}
                    className="rounded-lg bg-cyan-500/20 px-4 py-2 text-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] hover:cursor-pointer"
                >
                    Add
                </button>
            </div>
        </div>
    );
}
