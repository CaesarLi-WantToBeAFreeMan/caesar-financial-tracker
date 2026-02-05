import {useEffect, useState} from "react";
import type {CategoryData} from "../types/CategoryData";
import EmojiPickerPopup from "./EmojiPickerPopup";

interface Props {
    category: CategoryData;
    onUpdateCategory: (category: CategoryData) => void;
}

export default function EditCategoryForm({category, onUpdateCategory}: Props) {
    const [form, setForm] = useState<CategoryData>(category);
    useEffect(() => setForm(category), [category]);

    const handleSubmit = () => onUpdateCategory(form);

    return (
        <div className="space-y-4">
            <div>
                <label className="text-cyan-300">Name</label>
                <input
                    className="mt-1 w-full rounded-lg bg-black/40 border border-cyan-400/20 p-2 text-cyan-100 focus:border-cyan-400 focus:outline-none"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                />
            </div>

            <div>
                <label className="text-cyan-300">Type</label>
                <select
                    className="mt-1 w-full rounded-lg bg-black/40 border border-cyan-400/20 p-2 text-cyan-100"
                    value={form.type}
                    onChange={e => setForm({...form, type: e.target.value as "income" | "expense"})}
                >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
            </div>

            <EmojiPickerPopup icon={form.icon} onSelect={icon => setForm({...form, icon})} />

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSubmit}
                    className="rounded-lg px-4 py-2 bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] hover:cursor-pointer"
                >
                    Update
                </button>
            </div>
        </div>
    );
}
