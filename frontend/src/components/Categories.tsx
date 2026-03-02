import {useEffect, useState} from "react";
import IconPicker from "./common/IconPicker";
import type {CategoryData, CategoryFilter} from "../types/CategoryTypes";
import type {DataType} from "./common/OptionPicker";
import {
    ArrowDownNarrowWide,
    ArrowDownZa,
    ArrowUpAz,
    ArrowUpNarrowWide,
    Banknote,
    BanknoteArrowDown,
    BanknoteArrowUp,
    Box,
    ClockArrowDown,
    ClockArrowUp,
    Trash
} from "lucide-react";
import OptionPicker from "./common/OptionPicker";
import {RenderIcon} from "../utilities/icon";
import type {ImportResponse} from "../types/ImportResponse";
import toast from "react-hot-toast";
import axiosConfig from "../utilities/AxiosUtility";
import {API_ENDPOINTS} from "../utilities/apiEndpoint";
import {FilePicker} from "./common/FilePicker";
import ImportErrorModal from "./common/ImportErrorModal";

interface FilterProps {
    filter: CategoryFilter;
    onChange: <K extends keyof CategoryFilter>(key: K, value: CategoryFilter[K]) => void;
}

interface CreateProps {
    onAddCategory: (category: CategoryData) => void;
}

interface UpdateProps {
    category: CategoryData;
    onUpdateCategory: (category: CategoryData) => void;
}

interface DeleteProps {
    category: CategoryData;
    onConfirm: (id: number) => void;
    onCancel: () => void;
}

interface ImportProps {
    onClose: () => void;
}

const types: DataType<CategoryFilter["type"]>[] = [
    {label: "All", icon: <Banknote />, value: "all"},
    {label: "Income", icon: <BanknoteArrowUp />, value: "income"},
    {label: "Expense", icon: <BanknoteArrowDown />, value: "expense"}
];

const orders: DataType<CategoryFilter["order"]>[] = [
    {label: "Name ↑", icon: <ArrowUpAz />, value: "NAME_ASCENDING"},
    {label: "Name ↓", icon: <ArrowDownZa />, value: "NAME_DESCENDING"},
    {label: "Created ↑", icon: <ClockArrowUp />, value: "CREATED_ASCENDING"},
    {label: "Created ↓", icon: <ClockArrowDown />, value: "CREATED_DESCENDING"},
    {label: "Updated ↑", icon: <ArrowUpNarrowWide />, value: "UPDATED_ASCENDING"},
    {label: "Updated ↓", icon: <ArrowDownNarrowWide />, value: "UPDATED_DESCENDING"}
];

const sizes: DataType<CategoryFilter["size"]>[] = [
    {label: "10", icon: <Box />, value: 10},
    {label: "30", icon: <Box />, value: 30},
    {label: "50", icon: <Box />, value: 50},
    {label: "100", icon: <Box />, value: 100},
    {label: "120", icon: <Box />, value: 120}
];

type FileType = "csv" | "tsv" | "xlsx" | "json";
const EXAMPLES: Record<FileType, String> = {
    csv: `
name,type,icon
breakfast,expense,
lunch,expense,https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f371.png
salary,income,$
bonus,income,💰`,
    tsv: `
name\ttype\ticon
breakfast\texpense\t
lunch\texpense\thttps://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f371.png
salary\tincome\t$
bonus\tincome\t💰`,
    xlsx: `
| name      | type      | icon                                                                          |
| breakfast | expense   |                                                                               |
| lunch     | expense   | https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f371.png    |
| salary    | income    | $                                                                             |
| bonus     | income    | 💰                                                                            |`,
    json: `
[
    {"name": "breakfast", "type": "expense", "icon": null},
    {"name": "lunch", "type": "expense", "icon": "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f371.png"},
    {"name": "salary", "type": "income", "icon": "$"},
    {"name": "bonus", "type": "income", "icon": "💰"}
]`
};

export function Filter({filter, onChange}: FilterProps) {
    const {type, order, size} = filter;

    const typeIndex = Math.max(
        0,
        types.findIndex(t => t.value === type)
    );
    const orderIndex = Math.max(
        0,
        orders.findIndex(o => o.value === order)
    );
    const sizeIndex = Math.max(
        0,
        sizes.findIndex(s => s.value === size)
    );

    return (
        <div className="mb-6 rounded-lg border border-cyan-400/20 bg-black/40 p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-3">
                    <label className="text-cyan-400">Type:</label>
                    <OptionPicker
                        data={types}
                        index={typeIndex}
                        onChange={(index: number) => types[index] && onChange("type", types[index].value)}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <label className="text-cyan-400">Order:</label>
                    <OptionPicker
                        data={orders}
                        index={orderIndex}
                        onChange={(index: number) => orders[index] && onChange("order", orders[index].value)}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <label className="text-cyan-400">Size:</label>
                    <OptionPicker
                        data={sizes}
                        index={sizeIndex}
                        onChange={(index: number) => sizes[index] && onChange("size", sizes[index].value)}
                    />
                </div>
            </div>
        </div>
    );
}

export function Create({onAddCategory}: CreateProps) {
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

export function Update({category, onUpdateCategory}: UpdateProps) {
    const [form, setForm] = useState<CategoryData>(category);
    useEffect(() => setForm(category), [category]);

    return (
        <div className="space-y-5">
            <div className="flex justify-between gap-3">
                <div className="w-full">
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
            </div>

            <div className="space-y-3">
                <label className="text-cyan-300">Icon</label>
                <IconPicker icon={form.icon} name={form.name} onChange={v => setForm({...form, icon: v})} />
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

export function Delete({category, onConfirm, onCancel}: DeleteProps) {
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

export function Import({onClose}: ImportProps) {
    const [fileType, setFileType] = useState<FileType>("csv");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ImportResponse | null>(null);
    const [showErrors, setShowErrors] = useState(false);

    const handleImport = async () => {
        if (!file) {
            toast.error("Please choose a file");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);
        setLoading(true);
        try {
            const response = await axiosConfig.post<ImportResponse>(API_ENDPOINTS.IMPORT_CATEGORIES, formData, {
                headers: {"Content-Type": "multipart/form-data"}
            });
            setResult(response.data);
            if (response.data.failed > 0) setShowErrors(true);
            else {
                toast.success(`Import ${response.data.success} categories`);
                onClose();
            }
        } catch (e: any) {
            toast.error(e?.response?.data?.message || "Import failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-5">
            <div>
                <label className="text-cyan-300 text-sm">File type</label>
                <select
                    value={fileType}
                    onChange={e => setFileType(e.target.value as FileType)}
                    className="mt-1 w-full rounded-lg bg-black/40 border border-cyan-400/30 p-3 text-cyan-300"
                >
                    <option value="csv">CSV</option>
                    <option value="tsv">TSV</option>
                    <option value="xlsx">Excel</option>
                    <option value="json">JSON</option>
                </select>
            </div>
            <div>
                <p className="text-xs text-cyan-400 mb-1">Example format</p>
                <pre className="rounded-lg bg-black/60 p-3 text-xs text-cyan-300 border border-emerald-400/20 overflow-auto max-h-40">
                    {EXAMPLES[fileType]}
                </pre>
            </div>
            <FilePicker
                file={file}
                onChange={setFile}
                onClear={e => {
                    e.stopPropagation();
                    setFile(null);
                }}
            />
            <div className="flex justify-end gap-3">
                <button
                    onClick={onClose}
                    className="p-3 rounded-lg border border-white/10 text-cyan-300 hover:cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    onClick={handleImport}
                    disabled={loading}
                    className="p-3 rounded-lg bg-purple-500/20 border border-purple-400/40 text-purple-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.6)] hover:cursor-pointer"
                >
                    {loading ? "Importing..." : "Import"}
                </button>
            </div>
            {result && (
                <ImportErrorModal
                    isOpen={showErrors}
                    success={result.success}
                    failed={result.failed}
                    errors={result.errors}
                    onClose={() => {
                        setShowErrors(false);
                        onClose();
                    }}
                />
            )}
        </div>
    );
}
