import {FileType} from "lucide-react";
import {useState} from "react";
import toast from "react-hot-toast";
import axiosConfig from "../../utilities/AxiosUtility";
import {API_ENDPOINTS} from "../../utilities/apiEndpoint";
import {FilePicker} from "../common/FilePicker";
import type {ImportResponse} from "../../types/ImportResponse";
import ImportErrorModal from "../common/ImportErrorModal";

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

interface Props {
    onClose: () => void;
}

export default function ImportRecordForm({onClose}: Props) {
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
            <FilePicker file={file} onFileChange={setFile} />
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
