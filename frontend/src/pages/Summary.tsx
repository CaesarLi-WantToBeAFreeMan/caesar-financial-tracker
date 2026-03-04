import {useCallback, useEffect, useState} from "react";
import Dashboard from "../components/Dashboard";
import {useUser} from "../hooks/useUser";
import {useI18n} from "../context/I18nContext";
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
    const {translation} = useI18n();

    const today = getDate();

    const [records, setRecords] = useState<RecordData[]>([]);
    const [filter, setFilter] = useState<SummaryFilter>({
        type: "all",
        dateStart: today,
        dateEnd: today,
        priceLow: 0,
        priceHigh: null,
        category: null,
        chartMode: "bar",
        divisionMode: "date"
    });
    const [keyword, setKeyword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const updateFilter = useCallback(
        <K extends keyof SummaryFilter>(key: K, value: SummaryFilter[K]) =>
            setFilter(prev => ({...prev, [key]: value})),
        []
    );

    const readAllRecords = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.READ_ALL_RECORDS, {
                params: {
                    type: filter.type === "all" ? null : filter.type,
                    dateStart: filter.dateStart,
                    dateEnd: filter.dateEnd,
                    priceLow: filter.priceLow,
                    priceHigh: filter.priceHigh,
                    categories: filter.category,
                    keyword: keyword || null
                }
            });
            setRecords(response.data);
        } catch (e: any) {
            toast.error(e?.response?.data?.message || translation.summary.fetchFailed);
        } finally {
            setLoading(false);
        }
    }, [filter, keyword, translation]);

    useEffect(() => {
        readAllRecords();
    }, [filter, keyword]);

    return (
        <Dashboard activeRoute={translation.nav.summary}>
            <div className="mx-auto my-4 space-y-4">
                <h1 className="text-xl font-bold" style={{color: "var(--text-accent)"}}>
                    {translation.summary.title}
                </h1>

                <Filter filter={filter} onChange={updateFilter} />

                <SearchBar
                    keyword={keyword}
                    setKeyword={setKeyword}
                    placeholder={translation.summary.searchPlaceholder}
                />

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <LoaderCircle size={38} className="animate-spin" style={{color: "var(--text-accent)"}} />
                    </div>
                ) : (
                    <ChartViewer data={records} chartMode={filter.chartMode} divisionMode={filter.divisionMode} />
                )}
            </div>
        </Dashboard>
    );
}
