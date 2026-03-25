import {useEffect, useState} from "react";
import IconPicker from "./common/IconPicker";
import type {CategoryData, CategoryFilter} from "../types/CategoryTypes";
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
    ClockArrowDown,
    ClockArrowUp,
    File,
    Trash
} from "lucide-react";
import OptionPicker from "./common/OptionPicker";
import {RenderIcon} from "../utilities/icon";
import type {ImportResponse} from "../types/ImportResponse";
import toast from "react-hot-toast";
import {FilePicker} from "./common/FilePicker";
import ImportErrorModal from "./common/ImportErrorModal";
import {categoryApi} from "../utilities/api";
import type {TranslationType} from "../types/TranslationType";

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

const types = (translation: TranslationType): DataType<CategoryFilter["type"]>[] => [
    {label: translation.common.all, icon: <Banknote />, value: "all"},
    {label: translation.common.income, icon: <BanknoteArrowUp />, value: "income"},
    {label: translation.common.expense, icon: <BanknoteArrowDown />, value: "expense"}
];

const categoryTypes = (translation: TranslationType): DataType<"income" | "expense">[] => [
    {label: translation.common.income, icon: <BanknoteArrowUp />, value: "income"},
    {label: translation.common.expense, icon: <BanknoteArrowDown />, value: "expense"}
];

const orders = (translation: TranslationType): DataType<CategoryFilter["order"]>[] => [
    {label: translation.category.orders.nameAsc, icon: <ArrowUpAz />, value: "NAME_ASCENDING"},
    {label: translation.category.orders.nameDesc, icon: <ArrowDownZa />, value: "NAME_DESCENDING"},
    {label: translation.category.orders.createdAsc, icon: <ClockArrowUp />, value: "CREATED_ASCENDING"},
    {label: translation.category.orders.createdDesc, icon: <ClockArrowDown />, value: "CREATED_DESCENDING"},
    {label: translation.category.orders.updatedAsc, icon: <ArrowUpNarrowWide />, value: "UPDATED_ASCENDING"},
    {label: translation.category.orders.updatedDesc, icon: <ArrowDownNarrowWide />, value: "UPDATED_DESCENDING"}
];

const sizes: DataType<CategoryFilter["size"]>[] = [
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
    csv: `name,type,icon
breakfast,expense,
lunch,expense,https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f371.png
salary,income,$
bonus,income,💰`,
    tsv: `name\ttype\ticon
breakfast\texpense\t
lunch\texpense\thttps://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f371.png
salary\tincome\t$
bonus\tincome\t💰`,
    xlsx: `| name      | type      | icon                                                                          |
| breakfast | expense   |                                                                               |
| lunch     | expense   | https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f371.png    |
| salary    | income    | $                                                                             |
| bonus     | income    | 💰                                                                            |`,
    json: `[
    {"name": "breakfast", "type": "expense", "icon": null},
    {"name": "lunch", "type": "expense", "icon": "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f371.png"},
    {"name": "salary", "type": "income", "icon": "$"},
    {"name": "bonus", "type": "income", "icon": "💰"}
]`
};

export function Filter({filter, onChange}: FilterProps) {
    const {translation} = useI18n();
    const {type, order, size} = filter;

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
        <div className="mb-6 rounded-lg border border-(--border) bg-(--bg-surface) p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-3">
                    <label className="cyber-label">{translation.category.type}</label>
                    <OptionPicker
                        data={types(translation)}
                        index={typeIndex}
                        onChange={(index: number) =>
                            types(translation)[index] && onChange("type", types(translation)[index].value)
                        }
                    />
                </div>

                <div className="flex items-center gap-3">
                    <label className="cyber-label">{translation.category.order}</label>
                    <OptionPicker
                        data={orders(translation)}
                        index={orderIndex}
                        onChange={(index: number) =>
                            orders(translation)[index] && onChange("order", orders(translation)[index].value)
                        }
                    />
                </div>

                <div className="flex items-center gap-3">
                    <label className="cyber-label">{translation.category.size}</label>
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
    const {translation} = useI18n();
    const [category, setCategory] = useState<CategoryData>({
        id: null,
        name: "",
        icon: "",
        type: "income",
        created_at: null,
        updated_at: null
    });
    useEffect(() => setCategory(category), [category]);

    const typeIndex = categoryTypes(translation).findIndex(t => t.value === category.type);

    return (
        <div className="space-y-5 bg-(--bg-surface) p-3 rounded-xl border border-(--border)">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="flex-1 w-full">
                    <label className="cyber-label">{translation.category.name}</label>
                    <input
                        className="cyber-input w-full"
                        value={category.name}
                        placeholder={translation.category.name}
                        onChange={e => setCategory({...category, name: e.target.value})}
                    />
                </div>

                <div className="w-full md:w-40">
                    <label className="cyber-label">{translation.category.type}</label>
                    <OptionPicker
                        data={categoryTypes(translation)}
                        index={typeIndex}
                        onChange={(index: number) =>
                            setCategory(previous => ({...previous, type: categoryTypes(translation)[index].value}))
                        }
                    />
                </div>
            </div>

            <div className="space-y-3">
                <label className="cyber-label">{translation.category.icon}</label>
                <IconPicker
                    icon={category.icon}
                    name={category.name}
                    onChange={v => setCategory({...category, icon: v})}
                />
            </div>

            <div className="flex justify-end pt-3">
                <button onClick={() => onAddCategory(category)} disabled={!category.name} className="cyber-btn">
                    {translation.category.create}
                </button>
            </div>
        </div>
    );
}

export function Update({category, onUpdateCategory}: UpdateProps) {
    const {translation} = useI18n();
    const [form, setForm] = useState<CategoryData>(category);
    useEffect(() => setForm(category), [category]);

    const typeIndex = categoryTypes(translation).findIndex(t => t.value === category.type);

    return (
        <div className="space-y-5 bg-(--bg-surface) p-3 rounded-xl border border-(--border)">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="flex-1 w-full">
                    <label className="cyber-label">{translation.category.name}</label>
                    <input
                        className="cyber-input w-full"
                        value={form.name}
                        onChange={e => setForm({...form, name: e.target.value})}
                    />
                </div>

                <div className="w-full md:w-40">
                    <label className="cyber-label">{translation.category.type}</label>
                    <OptionPicker
                        data={categoryTypes(translation)}
                        index={typeIndex}
                        onChange={(index: number) =>
                            setForm(previous => ({...previous, type: categoryTypes(translation)[index].value}))
                        }
                    />
                </div>
            </div>

            <div className="space-y-3">
                <label className="cyber-label">{translation.category.icon}</label>
                <IconPicker icon={form.icon} name={form.name} onChange={v => setForm({...form, icon: v})} />
            </div>

            <div className="flex justify-end pt-3">
                <button onClick={() => onUpdateCategory(form)} disabled={!category.name} className="cyber-btn">
                    {translation.category.update}
                </button>
            </div>
        </div>
    );
}

export function Delete({category, onConfirm, onCancel}: DeleteProps) {
    const {translation} = useI18n();
    return (
        <div className="space-y-5 bg-(--bg-surface) p-3 rounded-xl border border-(--border)">
            <div className="flex items-center gap-3 rounded-lg border border-(--border) bg-(--bg-hover) p-3">
                <Trash className="text-(--text-wrong)" size={23} />
                <p className="font-bold text-(--text-wrong)">
                    {translation.category.deleteConfirm} {category.name}
                    <span className="block text-(--text-wrong) font-mono font-semibold">
                        {translation.category.cannotUndo}
                    </span>
                </p>
            </div>

            <div className="flex items-center gap-3 group rounded-lg border border-(--border) bg-(--bg-surface) p-3 cursor-pointer transtion duration-300 hover:bg-(--bg-hover) active:bg-(--bg-hover)">
                <RenderIcon
                    icon={category.icon}
                    name={category.name}
                    className="group-hover:animate-bounce group-active:animate-bounce"
                />
                <div
                    className={`flex flex-col items-center gap-1 ${category.type === "income" ? "text-(--text-correct)" : "text-(--text-wrong)"}`}
                >
                    <p className="font-medium truncate transition duration-300 group-hover:text-(--text-accent) group-active:text-(--text-accent)">
                        {category.name}
                    </p>
                    <p className="text-xs uppercase tracking-widest rounded-xl px-2 py-1 border border-(--border)">
                        {category.type === "income" ? translation.common.income : translation.common.expense}
                    </p>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button onClick={onCancel} className="cyber-btn-ghost">
                    {translation.common.cancel}
                </button>

                <button onClick={() => onConfirm(category.id!)} className="cyber-btn">
                    {translation.category.delete}
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
            toast.error(translation.category.chooseFile);
            return;
        }
        const formData = new FormData();
        formData.append("file", file);
        setLoading(true);
        await categoryApi.import(formData, setResult, setShowErrors, onClose, {
            success: `Import $ categories`,
            failed: "Import failed"
        });
        setLoading(false);
    };

    return (
        <div className="space-y-5 bg-(--bg-surface) p-3 rounded-xl border border-(--border)">
            <div>
                <label className="cyber-label">{translation.category.fileType}</label>
                <OptionPicker
                    data={fileTypes}
                    index={fileTypeIndex}
                    onChange={(index: number) => setFileType(fileTypes[index].value)}
                />
            </div>
            <div>
                <p className="cyber-label">{translation.category.exampleFormat}</p>
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
