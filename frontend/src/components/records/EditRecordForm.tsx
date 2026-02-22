import {useEffect, useState} from "react";
import type {RecordData} from "../../types/records/RecordData";
import DatePicker from "../common/DatePicker";
import PricePicker from "../common/PricePicker";
import CategoryPicker from "../common/CategoryPicker";
import IconPicker from "../common/IconPicker";

interface Props {
    record: RecordData;
    onUpdateRecord: (record: RecordData) => void;
}

export default function EditCategoryForm({record, onUpdateRecord}: Props) {
    const [form, setForm] = useState<RecordData>(record);
    useEffect(() => setForm(record), [record]);

    return (
        <div className="space-y-3">
            <div className="flex justify-between gap-3">
                <div className="w-full">
                    <label className="text-cyan-300">Name</label>
                    <input
                        className="mt-1 w-full rounded-lg bg-black/40 border border-cyan-400/20 p-1 text-cyan-100 placeholder:text-cyan-400"
                        value={form.name}
                        onChange={e => setForm({...form, name: e.target.value})}
                        placeholder="Name"
                    />
                </div>

                <div className="w-full">
                    <label className="text-cyan-300">Type</label>
                    <select
                        className="mt-1 w-full rounded-lg bg-black/40 border border-cyan-400/20 p-1 text-cyan-100"
                        value={form.type}
                        onChange={e => setForm({...form, type: e.target.value as "income" | "expense"})}
                    >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-center pt-1">
                <div className="w-full">
                    <label className="text-cyan-300">Date</label>
                    <DatePicker value={form.date} onChange={(date: string) => setForm({...form, date: date})} />
                </div>
                <div className="w-full">
                    <label className="text-cyan-300">Price</label>
                    <PricePicker
                        value={form.price}
                        onChange={(price: number | null) => price && setForm({...form, price: price})}
                    />
                </div>
                <div className="w-full">
                    <label className="text-cyan-300">Category</label>
                    <CategoryPicker
                        selectedId={form.category_id}
                        type={form.type}
                        onSelect={id => setForm({...form, category_id: id})}
                        disableAll
                    />
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-cyan-300">Icon</label>
                <IconPicker icon={form.icon} name={form.name} onChange={v => setForm({...form, icon: v})} />
            </div>

            <div>
                <label className="text-cyan-300">Description</label>
                <textarea
                    className="w-full rounded-lg bg-black/40 border border-cyan-400/20 p-1 text-cyan-100 placeholder:text-cyan-400"
                    value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})}
                    placeholder="description"
                />
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={() => onUpdateRecord(form)}
                    disabled={!form.name || !form.category_id}
                    className="rounded-lg px-4 py-2 bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] hover:cursor-pointer disabled:opacity-10 disabled:cursor-not-allowed"
                >
                    Update
                </button>
            </div>
        </div>
    );
}
