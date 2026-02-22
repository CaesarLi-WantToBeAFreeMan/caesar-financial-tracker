import {useState} from "react";
import type {RecordData} from "../../types/records/RecordData";
import DatePicker from "../common/DatePicker";
import PricePicker from "../common/PricePicker";
import {getDate} from "../../utilities/dates";
import CategoryPicker from "../common/CategoryPicker";
import IconPicker from "../common/IconPicker";

interface Props {
    onAddRecord: (record: RecordData) => void;
}

export default function AddRecordForm({onAddRecord}: Props) {
    const [record, setRecord] = useState<RecordData>({
        id: null,
        name: "",
        type: "income",
        icon: "",
        date: getDate(),
        price: 0,
        description: "",
        category_id: null,
        created_at: null,
        updated_at: null
    });

    return (
        <div className="space-y-3">
            <div className="flex justify-between gap-3">
                <div className="w-full">
                    <label className="text-cyan-300">Name</label>
                    <input
                        className="mt-1 w-full rounded-lg bg-black/40 border border-cyan-400/20 p-1 text-cyan-100 placeholder:text-cyan-400"
                        value={record.name}
                        onChange={e => setRecord({...record, name: e.target.value})}
                        placeholder="Name"
                    />
                </div>
                <div className="w-full">
                    <label className="text-cyan-300">Type</label>
                    <select
                        className="mt-1 w-full rounded-lg bg-black/40 border border-cyan-400/20 p-1 text-cyan-100"
                        value={record.type}
                        onChange={e => setRecord({...record, type: e.target.value as "income" | "expense"})}
                    >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>
            </div>
            <div className="flex justify-center pt-1">
                <div className="w-full">
                    <label className="text-cyan-300">Date</label>
                    <DatePicker value={record.date} onChange={(date: string) => setRecord({...record, date: date})} />
                </div>
                <div className="w-full">
                    <label className="text-cyan-300">Price</label>
                    <PricePicker
                        value={record.price}
                        onChange={(price: number | null) => price && setRecord({...record, price: price})}
                    />
                </div>
                <div className="w-full">
                    <label className="text-cyan-300">Category</label>
                    <CategoryPicker
                        selectedId={record.category_id}
                        type={record.type}
                        onSelect={id => setRecord({...record, category_id: id})}
                        disableAll
                    />
                </div>
            </div>
            <div className="space-y-3">
                <label className="text-cyan-300">Icon</label>
                <IconPicker icon={record.icon} name={record.name} onChange={v => setRecord({...record, icon: v})} />
            </div>
            <div>
                <label className="text-cyan-300">Description</label>
                <textarea
                    className="w-full rounded-lg bg-black/40 border border-cyan-400/20 p-1 text-cyan-100 placeholder:text-cyan-400"
                    value={record.description}
                    onChange={e => setRecord({...record, description: e.target.value})}
                    placeholder="description"
                />
            </div>
            <div className="flex justify-end pt-3">
                <button
                    onClick={() => onAddRecord(record)}
                    disabled={!record.name || !record.category_id}
                    className="rounded-lg bg-cyan-500/20 px-4 py-2 text-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] hover:cursor-pointer disabled:opacity-10 disabled:cursor-not-allowed"
                >
                    Add
                </button>
            </div>
        </div>
    );
}
