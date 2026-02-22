import {Trash} from "lucide-react";
import {RenderIcon} from "../../utilities/icon";
import type {RecordData} from "../../types/records/RecordData";
import {priceFormat} from "../../utilities/prices";
import {useEffect, useState} from "react";
import type {CategoryData} from "../../types/CategoryData";
import axiosConfig from "../../utilities/AxiosUtility";
import {API_ENDPOINTS} from "../../utilities/apiEndpoint";
import toast from "react-hot-toast";

interface Props {
    record: RecordData;
    onConfirm: (id: number) => void;
    onCancel: () => void;
}

export default function DeleteRecordConfirm({record, onConfirm, onCancel}: Props) {
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
