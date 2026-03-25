import DatePicker from "./common/DatePicker";
import type {RecordData, RecordFilter} from "../types/RecordTypes";
import PricePicker from "./common/PricePicker";
import CategoryPicker from "./common/CategoryPicker";
import type {DataType} from "./common/OptionPicker";
import {useI18n} from "../context/I18nContext";
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
    File,
    Trash
} from "lucide-react";
import OptionPicker from "./common/OptionPicker";
import {useEffect, useState} from "react";
import {getDate} from "../utilities/dates";
import IconPicker from "./common/IconPicker";
import type {CategoryData} from "../types/CategoryTypes";
import {RenderIcon} from "../utilities/icon";
import {useSettings} from "../context/SettingsContext";
import type {ImportResponse} from "../types/ImportResponse";
import {FilePicker} from "./common/FilePicker";
import ImportErrorModal from "./common/ImportErrorModal";
import {categoryApi, recordApi} from "../utilities/api";
import toast from "react-hot-toast";
import type {TranslationType} from "../types/TranslationType";

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

const types = (translation: TranslationType): DataType<RecordFilter["type"]>[] => [
    {label: translation.common.all, icon: <Banknote />, value: "all"},
    {label: translation.common.income, icon: <BanknoteArrowUp />, value: "income"},
    {label: translation.common.expense, icon: <BanknoteArrowDown />, value: "expense"}
];

const recordTypes = (translation: TranslationType): DataType<"income" | "expense">[] => [
    {label: translation.common.income, icon: <BanknoteArrowUp />, value: "income"},
    {label: translation.common.expense, icon: <BanknoteArrowDown />, value: "expense"}
];

const orders = (translation: TranslationType): DataType<RecordFilter["order"]>[] => [
    {label: translation.record.orders.nameAsc, icon: <ArrowUpAz />, value: "NAME_ASCENDING"},
    {label: translation.record.orders.nameDesc, icon: <ArrowDownZa />, value: "NAME_DESCENDING"},
    {label: translation.record.orders.dateAsc, icon: <CalendarArrowUp />, value: "DATE_ASCENDING"},
    {label: translation.record.orders.dateDesc, icon: <CalendarArrowDown />, value: "DATE_DESCENDING"},
    {label: translation.record.orders.priceAsc, icon: <BanknoteArrowUp />, value: "PRICE_ASCENDING"},
    {label: translation.record.orders.priceDesc, icon: <BanknoteArrowDown />, value: "PRICE_DESCENDING"},
    {label: translation.record.orders.createdAsc, icon: <ClockArrowUp />, value: "CREATED_ASCENDING"},
    {label: translation.record.orders.createdDesc, icon: <ClockArrowDown />, value: "CREATED_DESCENDING"},
    {label: translation.record.orders.updatedAsc, icon: <ArrowUpNarrowWide />, value: "UPDATED_ASCENDING"},
    {label: translation.record.orders.updatedDesc, icon: <ArrowDownNarrowWide />, value: "UPDATED_DESCENDING"}
];

const sizes: DataType<RecordFilter["size"]>[] = [
    {label: "10", icon: <Box />, value: 10},
    {label: "30", icon: <Box />, value: 30},
    {label: "50", icon: <Box />, value: 50},
    {label: "100", icon: <Box />, value: 100},
    {label: "120", icon: <Box />, value: 120}
];

type FileType = "csv" | "tsv" | "xlsx" | "json";
const fileTypes: DataType<FileType>[] = [
    {label: "CSV", icon: <File />, value: "csv"},
    {label: "TSV", icon: <File />, value: "tsv"},
    {label: "Excel", icon: <File />, value: "xlsx"},
    {label: "JSON", icon: <File />, value: "json"}
];
const EXAMPLES: Record<FileType, String> = {
    csv: `name,type,date,price,category,icon,description
january salary,income,2026-01-01,1989.64,salary,https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f45c.png,
burger,expense,jan-01-2026,3.99,food,🍔,big mac,
coffee,expense,jan/01/2026,5.99,drink,coffee,americano,
doughnut,expense,01/01/2026,5.99,food,,,`,
    tsv: `name\ttype\tdate\tprice\tcategory\ticon\tdescription
january salary\tincome\t2026-01-01\t1989.64\tsalary\thttps://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f45c.png\t
burger\texpense\tjan-01-2026\t3.99\tfood\t🍔\tbig mac\t
coffee\texpense\tjan/01/2026\t5.99\tdrink\tcoffee\tamericano\t
doughnut\texpense\t01/01/2026\t5.99\tfood\t\t\t`,
    xlsx: `| name              | type      | date          | price     | category  | icon                                                                          | descriptiin   |
| january salary    | income    | 2026-01-01    | 1989.64   | salary    | https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f45c.png    |               |
| burger            | expense   | jan-01-2026   | 3.99      | food      | 🍔                                                                            | big mac       |
| coffee            | expense   | jan/01/2026   | 5.99      | drink     | coffee                                                                        | americano     |
| doughnut          | expense   | 01/01/2026    | 5.99      | food      |                                                                               |               |`,
    json: `[
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
    const {translation} = useI18n();
    const {type, order, size, dateStart, dateEnd, priceLow, priceHigh, categoryId} = filter;
    const typeIndex = Math.max(
        0,
        types(translation).findIndex(t => t.value === type)
    );
    const orderIndex = Math.max(
        0,
        orders(translation).findIndex(o => o.value === order)
    );
    const sizeIndex = Math.max(
        0,
        sizes.findIndex(s => s.value === size)
    );

    return (
        <div className="mb-6 rounded-xl border border-(--border) bg-(--bg-surface) p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-3">
                    <label className="cyber-label">{translation.record.type}</label>
                    <OptionPicker
                        data={types(translation)}
                        index={typeIndex}
                        onChange={(index: number) =>
                            types(translation)[index] && onChange("type", types(translation)[index].value)
                        }
                    />
                </div>

                <div className="flex items-center gap-3">
                    <label className="cyber-label">{translation.record.order}</label>
                    <OptionPicker
                        data={orders(translation)}
                        index={orderIndex}
                        onChange={(index: number) =>
                            orders(translation)[index] && onChange("order", orders(translation)[index].value)
                        }
                    />
                </div>

                <div className="flex items-center gap-3">
                    <label className="cyber-label">{translation.record.size}</label>
                    <OptionPicker
                        data={sizes}
                        index={sizeIndex}
                        onChange={(index: number) => sizes[index] && onChange("size", sizes[index].value)}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <label className="cyber-label">{translation.record.category}</label>
                    <CategoryPicker selectedId={categoryId} type={type} onSelect={ids => onChange("categoryId", ids)} />
                </div>

                <div className="flex justify-between items-center gap-3 md:col-span-2">
                    <div className="flex items-center gap-3">
                        <label className="cyber-label">{translation.record.dateStart}</label>
                        <DatePicker value={dateStart} onChange={v => onChange("dateStart", v)} maxDate={dateEnd} />
                    </div>
                    <span className="cyber-label">-</span>
                    <div className="flex items-center gap-3">
                        <label className="cyber-label">{translation.record.dateEnd}</label>
                        <DatePicker
                            value={dateEnd}
                            onChange={v => onChange("dateEnd", v)}
                            minDate={dateStart}
                            isRight
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center gap-3 md:col-span-2">
                    <div className="flex items-center gap-3">
                        <label className="cyber-label">{translation.record.priceLow}</label>
                        <PricePicker
                            value={priceLow}
                            onChange={v => onChange("priceLow", v || 0)}
                            maxPrice={priceHigh}
                        />
                    </div>
                    <span className="cyber-label">-</span>
                    <div className="flex items-center gap-3">
                        <label className="cyber-label">{translation.record.priceHigh}</label>
                        <PricePicker
                            value={priceHigh}
                            onChange={v => onChange("priceHigh", v)}
                            minPrice={priceLow}
                            isRight
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function Create({onAddRecord}: CreateProps) {
    const {translation} = useI18n();
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
    const typeIndex = recordTypes(translation).findIndex(t => t.value === record.type);

    return (
        <div className="space-y-5 bg-(--bg-surface) p-3 rounded-xl border border-(--border)">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="flex-1 w-full">
                    <label className="cyber-label">{translation.record.name}</label>
                    <input
                        className="cyber-input w-full"
                        value={record.name}
                        placeholder={translation.record.name}
                        onChange={e => setRecord({...record, name: e.target.value})}
                    />
                </div>

                <div className="w-full md:w-40">
                    <label className="cyber-label">{translation.record.type}</label>
                    <OptionPicker
                        data={recordTypes(translation)}
                        index={typeIndex}
                        onChange={(index: number) =>
                            setRecord(previous => ({...previous, type: recordTypes(translation)[index].value}))
                        }
                    />
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center pt-1">
                <div className="w-full">
                    <label className="cyber-label">{translation.record.date}</label>
                    <DatePicker value={record.date} onChange={(date: string) => setRecord({...record, date: date})} />
                </div>
                <div className="w-full">
                    <label className="cyber-label">{translation.record.price}</label>
                    <PricePicker
                        value={record.price}
                        onChange={(price: number | null) => price && setRecord({...record, price: price})}
                    />
                </div>
                <div className="w-full">
                    <label className="cyber-label">{translation.record.category}</label>
                    <CategoryPicker
                        selectedId={record.category_id}
                        type={record.type}
                        onSelect={id => setRecord({...record, category_id: id})}
                        disableAll
                    />
                </div>
            </div>
            <div className="space-y-3">
                <label className="cyber-label">{translation.record.icon}</label>
                <IconPicker icon={record.icon} name={record.name} onChange={v => setRecord({...record, icon: v})} />
            </div>
            <div>
                <label className="cyber-label">{translation.record.description}</label>
                <textarea
                    className="w-full rounded-lg bg-(--bg-surface) border border-(--border) p-1 text-(--text-primary) placeholder:text-(--text-muted)"
                    value={record.description}
                    placeholder={translation.record.description}
                    onChange={e => setRecord({...record, description: e.target.value})}
                />
            </div>
            <div className="flex justify-end pt-3">
                <button
                    onClick={() => onAddRecord(record)}
                    disabled={!record.name || !record.category_id || !record.price}
                    className="cyber-btn"
                >
                    {translation.record.create}
                </button>
            </div>
        </div>
    );
}

export function Update({record, onUpdateRecord}: UpdateProps) {
    const {translation} = useI18n();
    const [form, setForm] = useState<RecordData>(record);
    useEffect(() => setForm(record), [record]);

    const typeIndex = recordTypes(translation).findIndex(t => t.value === form.type);

    return (
        <div className="space-y-5 bg-(--bg-surface) p-3 rounded-xl border border-(--border)">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="flex-1 w-full">
                    <label className="cyber-label">{translation.record.name}</label>
                    <input
                        className="cyber-input w-full"
                        value={form.name}
                        onChange={e => setForm({...form, name: e.target.value})}
                        placeholder="Name"
                    />
                </div>

                <div className="w-full md:w-40">
                    <label className="cyber-label">{translation.record.type}</label>
                    <OptionPicker
                        data={recordTypes(translation)}
                        index={typeIndex}
                        onChange={(index: number) =>
                            setForm(previous => ({...previous, type: recordTypes(translation)[index].value}))
                        }
                    />
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-center pt-1">
                <div className="w-full">
                    <label className="cyber-label">{translation.record.date}</label>
                    <DatePicker value={form.date} onChange={(date: string) => setForm({...form, date: date})} />
                </div>
                <div className="w-full">
                    <label className="cyber-label">{translation.record.price}</label>
                    <PricePicker
                        value={form.price}
                        onChange={(price: number | null) => price && setForm({...form, price: price})}
                    />
                </div>
                <div className="w-full">
                    <label className="cyber-label">{translation.record.category}</label>
                    <CategoryPicker
                        selectedId={form.category_id}
                        type={form.type}
                        onSelect={id => setForm({...form, category_id: id})}
                        disableAll
                    />
                </div>
            </div>

            <div className="space-y-3">
                <label className="cyber-label">{translation.record.icon}</label>
                <IconPicker icon={form.icon} name={form.name} onChange={v => setForm({...form, icon: v})} />
            </div>

            <div>
                <label className="cyber-label">{translation.record.description}</label>
                <textarea
                    className="w-full rounded-lg bg-(--bg-surface) border border-(--border) p-1 text-(--text-primary) placeholder:text-(--text-muted)"
                    value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})}
                    placeholder="description"
                />
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={() => onUpdateRecord(form)}
                    disabled={!form.name || !form.category_id}
                    className="cyber-btn"
                >
                    {translation.record.update}
                </button>
            </div>
        </div>
    );
}
export function Delete({record, onConfirm, onCancel}: DeleteProps) {
    const {translation} = useI18n();
    const [category, setCategory] = useState<CategoryData | null>(null);
    const {formatPrice} = useSettings();

    useEffect(() => {
        if (!record.category_id) return;
        const fetchRecords = async () =>
            await categoryApi.fetch(record.category_id, setCategory, translation.category.fetchFailed);
        fetchRecords();
    }, [record.category_id]);

    return (
        <div className="space-y-5 bg-(--bg-surface) p-3 rounded-xl border border-(--border)">
            <div className="flex items-center gap-3 rounded-lg border border-(--border) bg-(--bg-hover) p-3">
                <Trash className="text-(--text-wrong)" size={23} />
                <p className="font-bold text-(--text-wrong)">
                    {translation.record.deleteConfirm} {record.name}
                    <span className="block text-(--text-wrong) font-mono font-semibold">
                        {translation.record.cannotUndo}
                    </span>
                </p>
            </div>

            <div className="flex items-center gap-3 group rounded-lg border border-(--border) bg-(--bg-surface) p-3 cursor-pointer transtion duration-300 hover:bg-(--bg-hover) active:bg-(--bg-hover)">
                <RenderIcon
                    icon={record.icon}
                    name={record.name}
                    className="group-hover:animate-bounce group-active:animate-bounce"
                />
                <div
                    className={`flex flex-col items-center gap-1 ${record.type === "income" ? "text-(--text-correct)" : "text-(--text-wrong)"}`}
                >
                    <div className="flex items-center gap-3">
                        <p className="font-medium truncate transition duration-300 group-hover:text-(--text-accent) group-active:text-(--text-accent)">
                            {record.name}
                        </p>
                        <p className="text-(--text-primary)">•</p>
                        <p className="text-sm font-semiold truncate transition duration-300 group-hover:text-(--text-primary)">
                            {record.date}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <p className="font-bold uppercase tracking-tighter">{category?.name || "Loading..."}</p>
                        <p className="text-(--text-primary)">•</p>
                        <p className="font-mono font-bold transition duration-300 group-hover:text-(--text-accent) group-active:text-(--text-accent)">
                            {record.type === "income" ? "+" : "-"}
                            {formatPrice(record.price)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button onClick={onCancel} className="cyber-btn-ghost">
                    {translation.common.cancel}
                </button>

                <button onClick={() => onConfirm(record.id!)} className="cyber-btn">
                    {translation.record.delete}
                </button>
            </div>
        </div>
    );
}

export function Import({onClose}: ImportProps) {
    const {translation} = useI18n();
    const [fileType, setFileType] = useState<FileType>("csv");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [result, setResult] = useState<ImportResponse | null>(null);
    const [showErrors, setShowErrors] = useState<boolean>(false);

    const fileTypeIndex = fileTypes.findIndex(ft => ft.value === fileType);

    const handleImport = async () => {
        if (!file) {
            toast.error(translation.record.chooseFile);
            return;
        }
        const formData = new FormData();
        formData.append("file", file);
        setLoading(true);
        await recordApi.import(formData, setResult, setShowErrors, onClose, {
            success: "Import $ records",
            failed: "Import failed"
        });
        setLoading(false);
    };

    return (
        <div className="space-y-5 bg-(--bg-surface) p-3 rounded-xl border border-(--border)">
            <div>
                <label className="cyber-label">{translation.record.fileType}</label>
                <OptionPicker
                    data={fileTypes}
                    index={fileTypeIndex}
                    onChange={(index: number) => setFileType(fileTypes[index].value)}
                />
            </div>
            <div>
                <p className="cyber-label">{translation.record.exampleFormat}</p>
                <pre className="rounded-lg bg-(--bg-surface) p-3 text-xs text-(--text-primary) border border-(--border) overflow-auto max-h-40">
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
                <button onClick={onClose} className="cyber-btn-ghost">
                    {translation.common.cancel}
                </button>
                <button onClick={handleImport} disabled={loading} className="cyber-btn">
                    {loading ? translation.common.importing : translation.common.import}
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
