/*
 * common header for category and record pages
 */
import {useState, useRef} from "react";
import {Download, LoaderCircle, Plus, Upload} from "lucide-react";
import axiosConfig from "../../utilities/AxiosUtility";
import {API_ENDPOINTS} from "../../utilities/apiEndpoint";
import {storage} from "../../utilities/storage";
import {useClickOutside} from "../../hooks/useClickOutside";
import {useI18n} from "../../context/I18nContext";
import toast from "react-hot-toast";
import type {ExportTypes} from "../../types/commonTypes";

interface Props {
    title: string;
    setOpenImportModal: (v: boolean) => void;
    setOpenCreateModal: (v: boolean) => void;
}

const cyberpunkButtonStyles =
    "flex justify-between items-center gap-3 p-3 cyber-btn-ghost hover:scale-120 active:scale-120";

export default function HeaderBar({title, setOpenImportModal, setOpenCreateModal}: Props) {
    const {translation} = useI18n();
    const [openExportMenu, setOpenExportMenu] = useState<boolean>(false);
    const [exporting, setExporting] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useClickOutside(dropdownRef, () => setOpenExportMenu(false), openExportMenu);

    //export handler function
    const handleExport = async (type: ExportTypes) => {
        setExporting(true);
        setOpenExportMenu(false);

        const apiUrl = title.toLowerCase().includes("categor")
            ? API_ENDPOINTS.EXPORT_CATEGORIES
            : API_ENDPOINTS.EXPORT_RECORDS;

        try {
            const response = await axiosConfig.get(apiUrl.replace("{type}", type), {responseType: "blob"});
            storage.saveFile(window.URL.createObjectURL(new Blob([response.data])), "export", type);

            toast.success(`${translation.common.export}: ${type.toUpperCase()}`);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || translation.common.exportFailed);
        } finally {
            setExporting(false);
        }
    };

    const EXPORT_TYPES: {label: string; type: ExportTypes}[] = [
        {label: "CSV", type: "csv"},
        {label: "TSV", type: "tsv"},
        {label: "Excel", type: "xlsx"},
        {label: "JSON", type: "json"}
    ];

    return (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            {/*title*/}
            <h2 className="text-xl font-mono font-bold text-(--text-accent)">{title}</h2>

            <div className="flex items-center gap-3">
                {/*import button*/}
                <button onClick={() => setOpenImportModal(true)} className={cyberpunkButtonStyles}>
                    <Upload size={18} />
                    <span className="hidden md:inline">{translation.common.import}</span>
                </button>

                {/*export dropdown list*/}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setOpenExportMenu(v => !v)}
                        disabled={exporting}
                        className={cyberpunkButtonStyles}
                    >
                        {exporting ? <LoaderCircle size={18} className="animate-spin" /> : <Download size={18} />}
                        <span className="hidden md:inline">{translation.common.export}</span>
                    </button>

                    {openExportMenu && (
                        <div className="absolute left-1/2 -translate-x-1/2 z-50 mt-3 w-21 rounded-xl overflow-hidden shadow-xl bg-(--bg-base) border border-(--border)">
                            {EXPORT_TYPES.map(({label, type}) => (
                                <button
                                    key={type}
                                    onClick={() => handleExport(type)}
                                    className="w-full text-center px-3 py-2 transition duration-300 cursor-pointer text-(--text-dim) hover:bg-(--bg-hover) hover:text-(--text-accent) hover:scale-120 active:bg-(--bg-hover) active:text-(--text-accent) active:scale-120"
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/*add button*/}
                <button onClick={() => setOpenCreateModal(true)} className={cyberpunkButtonStyles}>
                    <Plus size={18} />
                    <span className="hidden md:inline">{translation.common.create}</span>
                </button>
            </div>
        </div>
    );
}
