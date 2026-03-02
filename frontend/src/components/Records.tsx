import DatePicker from "./common/DatePicker";
import type {RecordData, RecordFilter} from "../types/RecordTypes";
import PricePicker from "./common/PricePicker";
import CategoryPicker from "./common/CategoryPicker";
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
    CalendarArrowDown,
    CalendarArrowUp,
    ClockArrowDown,
    ClockArrowUp,
    Trash
} from "lucide-react";
import OptionPicker from "./common/OptionPicker";
import {useEffect, useState} from "react";
import {getDate} from "../utilities/dates";
import IconPicker from "./common/IconPicker";
import type {CategoryData} from "../types/CategoryTypes";
import axiosConfig from "../utilities/AxiosUtility";
import {API_ENDPOINTS} from "../utilities/apiEndpoint";
import toast from "react-hot-toast";
import {RenderIcon} from "../utilities/icon";
import {priceFormat} from "../utilities/prices";
import type {ImportResponse} from "../types/ImportResponse";
import {FilePicker} from "./common/FilePicker";
import ImportErrorModal from "./common/ImportErrorModal";

interface FilterProps {
    filter: RecordFilter;
    onChange: <K extends keyof RecordFilter>(key: K, value: RecordFilter[K]) => void;
}

interface CreateProps {
    onAddRecord: (record: RecordData) => void;
}

interface UpdateProps {
    record: RecordData;
    onUpdateRecord: (record: RecordData) => void;
}

interface DeleteProps {
    record: RecordData;
    onConfirm: (id: number) => void;
    onCancel: () => void;
}

interface ImportProps {
    onClose: () => void;
}

const types: DataType<RecordFilter["type"]>[] = [
    {label: "All", icon: <Banknote />, value: "all"},
    {label: "Income", icon: <BanknoteArrowUp />, value: "income"},
    {label: "Expense", icon: <BanknoteArrowDown />, value: "expense"}
];

const orders: DataType<RecordFilter["order"]>[] = [
    {label: "Name ↑", icon: <ArrowUpAz />, value: "NAME_ASCENDING"},
    {label: "Name ↓", icon: <ArrowDownZa />, value: "NAME_DESCENDING"},
    {label: "Date ↑", icon: <CalendarArrowUp />, value: "DATE_ASCENDING"},
    {label: "Date ↓", icon: <CalendarArrowDown />, value: "DATE_DESCENDING"},
    {label: "Price ↑", icon: <BanknoteArrowUp />, value: "PRICE_ASCENDING"},
    {label: "Price ↓", icon: <BanknoteArrowDown />, value: "PRICE_DESCENDING"},
    {label: "Created ↑", icon: <ClockArrowUp />, value: "CREATED_ASCENDING"},
    {label: "Created ↓", icon: <ClockArrowDown />, value: "CREATED_DESCENDING"},
    {label: "Updated ↑", icon: <ArrowUpNarrowWide />, value: "UPDATED_ASCENDING"},
    {label: "Updated ↓", icon: <ArrowDownNarrowWide />, value: "UPDATED_DESCENDING"}
];

const sizes: DataType<RecordFilter["size"]>[] = [
    {label: "10", icon: <Box />, value: 10},
    {label: "30", icon: <Box />, value: 30},
    {label: "50", icon: <Box />, value: 50},
    {label: "100", icon: <Box />, value: 100},
    {label: "120", icon: <Box />, value: 120}
];

type FileType = "csv" | "tsv" | "xlsx" | "json";
const EXAMPLES: Record<FileType, String> = {
    csv: `
name,type,date,price,category,icon,description
january salary,income,2026-01-01,1989.64,salary,https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f45c.png,
burger,expense,jan-01-2026,3.99,food,🍔,big mac,
coffee,expense,jan/01/2026,5.99,drink,coffee,americano,
doughnut,expense,01/01/2026,5.99,food,,,`,
    tsv: `
name\ttype\tdate\tprice\tcategory\ticon\tdescription
january salary\tincome\t2026-01-01\t1989.64\tsalary\thttps://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f45c.png\t
burger\texpense\tjan-01-2026\t3.99\tfood\t🍔\tbig mac\t
coffee\texpense\tjan/01/2026\t5.99\tdrink\tcoffee\tamericano\t
doughnut\texpense\t01/01/2026\t5.99\tfood\t\t\t`,
    xlsx: `
| name              | type      | date          | price     | category  | icon                                                                          | descriptiin   |
| january salary    | income    | 2026-01-01    | 1989.64   | salary    | https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f45c.png    |               |
| burger            | expense   | jan-01-2026   | 3.99      | food      | 🍔                                                                            | big mac       |
| coffee            | expense   | jan/01/2026   | 5.99      | drink     | coffee                                                                        | americano     |
| doughnut          | expense   | 01/01/2026    | 5.99      | food      |                                                                               |               |`,
    json: `
[
    {
        "name": "january salary",
        "type": "income",
        "date": "2026-01-01",
        "price": 1989.64,
        "category": "salary",
        "icon": "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f45c.png",
        "description": null
    },
    {
        "name": "burger",
        "type": "expense",
        "date": "jan-01-2026",
        "price": 3.99,
        "category": "food",
        "icon": "🍔",
        "description": "big mac"
    },
    {
        "name": "coffee",
        "type": "expense",
        "date": "jan/01/2026",
        "price": 5.99,
        "category": "drink",
        "icon": "coffee",
        "description": "americano"
    },
    {
        "name": "doughnut",
        "type": "expense",
        "date": "01/01/2026",
        "price": 5.99,
        "category": "food",
        "icon": null,
        "description": null
    }
]`
};

export function Filter({filter, onChange}: FilterProps) {
    const {type, order, size, dateStart, dateEnd, priceLow, priceHigh, categoryId} = filter;
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
        <div className="mb-6 rounded-xl border border-cyan-400/20 bg-black/40 p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-3">
                    <label className="text-cyan-400">Type:</label>
                    <OptionPicker
                        data={types}
                        index={typeIndex}
                        onChange={(index: number) => types[index] && onChange("type", types[index].value)}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <label className="text-cyan-400">Type:</label>
                    <OptionPicker
                        data={orders}
                        index={orderIndex}
                        onChange={(index: number) => orders[index] && onChange("order", orders[index].value)}
                    ></OptionPicker>
                </div>

                <div className="flex items-center gap-3">
                    <label className="text-cyan-400">Size:</label>
                    <OptionPicker
                        data={sizes}
                        index={sizeIndex}
                        onChange={(index: number) => orders[index] && onChange("size", sizes[index].value)}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <label className="text-cyan-400">Category:</label>
                    <CategoryPicker selectedId={categoryId} type={type} onSelect={ids => onChange("categoryId", ids)} />
                </div>

                <div className="flex justify-between items-center gap-3">
                    <div className="flex items-center gap-3">
                        <label className="text-cyan-400">Date Start:</label>
                        <DatePicker value={dateStart} onChange={v => onChange("dateStart", v)} maxDate={dateEnd} />
                    </div>
                    <span className="text-cyan-400">-</span>
                    <div className="flex items-center gap-3">
                        <label className="text-cyan-400">Date End:</label>
                        <DatePicker value={dateEnd} onChange={v => onChange("dateEnd", v)} minDate={dateStart} />
                    </div>
                </div>

                <div className="flex justify-between items-center gap-3">
                    <div className="flex items-center gap-3">
                        <label className="text-cyan-400">Price Low:</label>
                        <PricePicker
                            value={priceLow}
                            onChange={v => onChange("priceLow", v || 0)}
                            maxPrice={priceHigh}
                        />
                    </div>
                    <span className="text-cyan-400">-</span>
                    <div className="flex items-center gap-3">
                        <label className="text-cyan-400">Price Low:</label>
                        <PricePicker value={priceHigh} onChange={v => onChange("priceHigh", v)} minPrice={priceLow} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function Create({onAddRecord}: CreateProps) {
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

export function Update({record, onUpdateRecord}: UpdateProps) {
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
export function Delete({record, onConfirm, onCancel}: DeleteProps) {
    const [category, setCategory] = useState<CategoryData | null>(null);

    useEffect(() => {
        if (!record.category_id) return;
        axiosConfig
            .get(API_ENDPOINTS.FETCH_CATEGORY.replace("{id}", String(record.category_id)))
            .then(response => setCategory(response.data))
            .catch((error: any) => toast.error(error?.response?.data?.message || "Fetch category failed"));
    }, [record.category_id]);

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-3 rounded-lg border border-red-400/30 bg-red-500/10 p-4">
                <Trash className="text-red-400" size={22} />
                <p className="text-sm text-red-300">
                    Are you sure to delete {record.name}
                    <span className="block text-red-400 font-semibold">This operation cannot undo</span>
                </p>
            </div>

            <div className="flex items-center gap-3 group rounded-lg border border-cyan-400/20 bg-black/40 p-3 transtion duration-300 hover:bg-cyan-400/5 hover:cursor-pointer">
                <RenderIcon icon={record.icon} name={record.name} className="group-hover:animate-bounce" />
                <div
                    className={`flex flex-col items-center gap-1 ${record.type === "income" ? "text-green-400" : "text-red-400"}`}
                >
                    <div className="flex items-center gap-3">
                        <p className="font-medium truncate transition duration-300 group-hover:text-cyan-400">
                            {record.name}
                        </p>
                        <p className="text-cyan-400">•</p>
                        <p className="text-sm font-semiold truncate transition duration-300 group-hover:text-cyan-400">
                            {record.date}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <p className="font-bold uppercase tracking-tighter">{category?.name || "Loading..."}</p>
                        <p className="text-cyan-400">•</p>
                        <p className="font-mono font-bold transition duration-300 group-hover:text-cyan-400">
                            {record.type === "income" ? "+" : "-"}
                            {priceFormat(record.price)}
                        </p>
                    </div>
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
                    onClick={() => onConfirm(record.id!)}
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
            const response = await axiosConfig.post<ImportResponse>(API_ENDPOINTS.IMPORT_RECORDS, formData, {
                headers: {"Content-Type": "multipart/form-data"}
            });
            setResult(response.data);
            if (response.data.failed > 0) setShowErrors(true);
            else {
                toast.success(`Import ${response.data.success} records`);
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
                    className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.18)] hover:cursor-pointer"
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
