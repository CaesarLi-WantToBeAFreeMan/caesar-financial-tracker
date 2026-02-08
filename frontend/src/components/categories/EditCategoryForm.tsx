import {useEffect, useRef, useState} from "react";
import type {CategoryData} from "../../types/CategoryData";
import EmojiPickerPopup from "../common/EmojiPickerPopup";
import {getFirstChar, isIconImage} from "../../utilities/icon";
import {Box} from "lucide-react";

interface Props {
    category: CategoryData;
    onUpdateCategory: (category: CategoryData) => void;
}

export default function EditCategoryForm({category, onUpdateCategory}: Props) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [form, setForm] = useState<CategoryData>(category);
    useEffect(() => setForm(category), [category]);

    const handleFileUpload = (file: File) => {
        const render = new FileReader();
        render.onload = () => setForm({...form, icon: render.result as string});
        render.readAsDataURL(file);
    };

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

            <div className="space-y-3">
                <label className="text-cyan-300">Icon</label>
                <div className="flex items-center mt-1 gap-5">
                    <div
                        className="h-12 w-12 flex items-center justify-center rounded-full
                        bg-cyan-500/10 border border-cyan-400/30"
                    >
                        {form.icon ? (
                            isIconImage(form.icon) ? (
                                <img src={form.icon} alt={form.name} className="h-5 w-5 object-contain" />
                            ) : (
                                <span className="text-lg font-semibold leading-none">{getFirstChar(form.icon)}</span>
                            )
                        ) : (
                            <Box size={23} />
                        )}
                    </div>
                    <input
                        placeholder="Emoji, text, or image URL"
                        className="w-full rounded-lg bg-black/40 border border-cyan-400/20 p-2 text-cyan-100"
                        value={form.icon}
                        onChange={e => setForm({...form, icon: e.target.value})}
                    />
                </div>
                <div className="flex items-center justify-between gap-5">
                    <EmojiPickerPopup icon={form.icon} onSelect={icon => setForm({...form, icon})} />
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            className="rounded-lg px-4 py-2 bg-cyan-500/20 text-cyan-300 hover:cursor-pointer"
                        >
                            Upload Image
                        </button>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(file);
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={() => onUpdateCategory(form)}
                    className="rounded-lg px-4 py-2 bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] hover:cursor-pointer"
                >
                    Update
                </button>
            </div>
        </div>
    );
}
