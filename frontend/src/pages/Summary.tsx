import {useEffect, useState} from "react";
import Dashboard from "../components/Dashboard";
import {useUser} from "../hooks/useUser";
import {getDate} from "../utilities/dates";
import type {RecordData} from "../types/RecordTypes";
import type {SummaryFilter} from "../types/SummaryTypes.ts";
import axiosConfig from "../utilities/AxiosUtility.ts";
import {API_ENDPOINTS} from "../utilities/apiEndpoint.ts";
import toast from "react-hot-toast";
import SearchBar from "../components/common/SearchBar.tsx";
import ChartViewer from "../components/common/ChartViewer.tsx";
import {Filter} from "../components/Summaries.tsx";
import {LoaderCircle} from "lucide-react";

export default function Summary() {
    useUser();

    const today = getDate();
    const updateFilter = <K extends keyof SummaryFilter>(key: K, value: SummaryFilter[K]) =>
        setFilter(previous => ({...previous, [key]: value}));

    const [records, setRecords] = useState<RecordData[]>([]);
    const [filter, setFilter] = useState<SummaryFilter>({
        type: "all",
        dateStart: today,
        dateEnd: today,
        priceLow: 0,
        priceHigh: null,
        categories: null,
        chartMode: "line",
        divisionMode: "date"
    });
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);

    const readAllRecords = async () => {
        setLoading(true);
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.READ_ALL_RECORDS, {
                params: {
                    type: filter.type === "all" ? null : filter.type,
                    dateStart: filter.dateStart,
                    dateEnd: filter.dateEnd,
                    priceLow: filter.priceLow,
                    priceHigh: filter.priceHigh,
                    categories: filter.categories,
                    keyword: keyword || null
                }
            });
            setRecords(response.data);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Fetch records failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        readAllRecords();
        console.log(records);
    }, [filter, keyword]);

    return (
        <Dashboard activeRoute="Summary">
            <div className="mx-auto my-6">
                <Filter filter={filter} onChange={updateFilter} />

                <SearchBar keyword={keyword} setKeyword={setKeyword} placeholder="Search Records..." />

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <LoaderCircle size={39} className="animate-spin text-cyan-400" />
                    </div>
                ) : (
                    <ChartViewer data={records} chartMode={filter.chartMode} divisionMode={filter.divisionMode} />
                )}
            </div>
        </Dashboard>
    );
}
