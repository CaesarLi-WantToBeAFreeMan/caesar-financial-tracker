import {useState} from "react";
import type {CategoryData} from "../types/CategoryData";
import EmojiPickerPopup from "./EmojiPickerPopup";

interface Props {
    onAddCategory: (category: CategoryData) => void;
}

export default function AddCategoryForm({onAddCategory}: Props) {
    const [category, setCategory] = useState<CategoryData>({
        id: null,
        name: "",
        icon: "",
        type: "income",
        createdAt: null,
        updatedAt: null
    });

    const handleSubmit = () => {
        onAddCategory(category);
    };

    return (
        <div className="space-y-4">
            <div>
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

            <EmojiPickerPopup icon={category.icon} onSelect={icon => setCategory({...category, icon})} />

            <div className="flex justify-end">
                <button
                    onClick={handleSubmit}
                    className="rounded-lg bg-cyan-500/20 px-4 py-2 text-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.6)]"
                >
                    Add
                </button>
            </div>
        </div>
    );
}
