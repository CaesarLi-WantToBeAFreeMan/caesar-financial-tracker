import {useRef, useState} from "react";
import type {CategoryData} from "../../types/CategoryData";
import EmojiPickerPopup from "../common/EmojiPickerPopup";
import {getFirstChar, isIconImage} from "../../utilities/icon";
import {Box} from "lucide-react";

interface Props {
    onAddCategory: (category: CategoryData) => void;
}

export default function AddCategoryForm({onAddCategory}: Props) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [category, setCategory] = useState<CategoryData>({
        id: null,
        name: "",
        icon: "",
        type: "income",
        createdAt: null,
        updatedAt: null
    });

    const handleFileUpload = (file: File) => {
        const render = new FileReader();
        render.onload = () => setCategory({...category, icon: render.result as string});
        render.readAsDataURL(file);
    };

    return (
        <div className="space-y-5">
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
            <div className="space-y-3">
                <label className="text-cyan-300">Icon</label>
                <div className="flex items-center mt-1 gap-5">
                    <div
                        className="h-12 w-12 flex items-center justify-center rounded-full
                        bg-cyan-500/10 border border-cyan-400/30"
                    >
                        {category.icon ? (
                            isIconImage(category.icon) ? (
                                <img src={category.icon} alt={category.name} className="h-5 w-5 object-contain" />
                            ) : (
                                <span className="text-lg font-semibold leading-none">
                                    {getFirstChar(category.icon)}
                                </span>
                            )
                        ) : (
                            <Box size={23} />
                        )}
                    </div>
                    <input
                        placeholder="Emoji, text, or image URL"
                        className="w-full rounded-lg bg-black/40 border border-cyan-400/20 p-2 text-cyan-100"
                        value={category.icon}
                        onChange={e => setCategory({...category, icon: e.target.value})}
                    />
                </div>
                <div className="flex items-center justify-between gap-5">
                    <EmojiPickerPopup icon={category.icon} onSelect={icon => setCategory({...category, icon})} />
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
