import {FileType} from "lucide-react";
import {useState} from "react";
import toast from "react-hot-toast";
import axiosConfig from "../../utilities/AxiosUtility";
import {API_ENDPOINTS} from "../../utilities/apiEndpoint";
import {FilePicker} from "../common/FilePicker";
import type {ImportResponse} from "../../types/ImportResponse";
import ImportErrorModal from "./ImportErrorModal";

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
interface Props {
    onClose: () => void;
}

export default function CategoryImportModal({onClose}: Props) {
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
