import {Download, LoaderCircle, Plus, Upload} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import axiosConfig from "../../utilities/AxiosUtility";
import {API_ENDPOINTS} from "../../utilities/apiEndpoint";
import toast from "react-hot-toast";

interface Props {
    title: string;
    setOpenImportModal: (value: boolean) => void;
    setOpenCreateModal: (value: boolean) => void;
}

export default function HeaderBar({title, setOpenImportModal, setOpenCreateModal}: Props) {
    const [openExportMenu, setOpenExportMenu] = useState(false);
    const [exporting, setExporting] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    //api
    const handleExport = async (type: "csv" | "tsv" | "xlsx" | "json") => {
        setExporting(true);
        setOpenExportMenu(false);
        const apiUrl = title === "All Categories" ? API_ENDPOINTS.EXPORT_CATEGORIES : API_ENDPOINTS.EXPORT_RECORDS;
        try {
            const response = await axiosConfig.get(apiUrl.replace("{type}", type), {responseType: "blob"});
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `categories.${type}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success(`Downloading ${type.toUpperCase()} file`);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Export failed");
        } finally {
            setExporting(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setOpenExportMenu(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-cyan-300">{title}</h2>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setOpenImportModal(true)}
                    className="flex items-center justify-center gap-3 rounded-lg p-3 bg-cyan-500/10 text-cyan-300 border border-cyan-400/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] hover:cursor-pointer"
                >
                    <Upload size={18} /> Import
                </button>
                <div className="relative inline-block" ref={dropdownRef}>
                    <button
                        onClick={() => setOpenExportMenu(value => !value)}
                        disabled={exporting}
                        className="inline-flex justify-center gap-3 w-full p-3 text-sm font-medium rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-400/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] hover:cursor-pointer"
                    >
                        {exporting ? <LoaderCircle size={18} className="animate-spin" /> : <Download size={18} />}
                        Export
                    </button>
                    {openExportMenu && (
                        <div className="absolute right-0 z-50 mt-3 w-39 origin-top-right rounded-lg border border-cyan-400/30 bg-slate-900 shadow-xl">
                            {[
                                {label: "Download CSV file", type: "csv"},
                                {label: "Download TSV file", type: "tsv"},
                                {label: "Download Excel file", type: "xlsx"},
                                {label: "Download JSON file", type: "json"}
                            ].map(item => (
                                <button
                                    key={item.type}
                                    onClick={() => handleExport(item.type)}
                                    className="w-full text-left p-3 text-sm text-cyan-200 hover:bg-cyan-500/10 hover:cursor-pointer"
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <button
                    onClick={() => setOpenCreateModal(true)}
                    className="flex items-center justify-center gap-3 rounded-lg p-3 bg-cyan-500/10 text-cyan-300 border border-cyan-400/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] hover:cursor-pointer"
                >
                    <Plus size={18} /> Add
                </button>
            </div>
        </div>
    );
}
