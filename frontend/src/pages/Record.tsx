import {useEffect, useState} from "react";
import Dashboard from "../components/Dashboard";
import {useUser} from "../hooks/useUser";
import HeaderBar from "../components/common/HeaderBar";
import RecordFilterBar from "../components/records/RecordFilterBar";
import type {RecordFilter} from "../types/records/RecordFilter";
import SearchBar from "../components/common/SearchBar";
import {LoaderCircle} from "lucide-react";
import type {RecordPage} from "../types/records/RecordPage";
import type {RecordData} from "../types/records/RecordData";
import Pagination from "../components/common/Pagination";
import ItemList from "../components/common/ItemList";
import axiosConfig from "../utilities/AxiosUtility";
import {API_ENDPOINTS} from "../utilities/apiEndpoint";
import toast from "react-hot-toast";
import Modal from "../components/common/Modal";
import AddRecordForm from "../components/records/AddRecordForm";
import EditRecordForm from "../components/records/EditRecordForm";
import DeleteRecordConfirm from "../components/records/DeleteRecordConfirm";
import ImportRecordForm from "../components/records/ImportRecordForm";

export default function Record() {
    useUser();

    const [filter, setFilter] = useState<RecordFilter>({
        type: "all",
        order: "CREATED_DESCENDING",
        size: 30,
        dateStart: new Date().toISOString().split("T")[0],
        dateEnd: new Date().toISOString().split("T")[0],
        categoryId: null,
        priceLow: 0,
        priceHigh: null
    });
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState<RecordPage | null>(null);
    const [index, setIndex] = useState<number>(0);
    const [keyword, setKeyword] = useState("");

    const updateFilter = <K extends keyof RecordFilter>(key: K, value: RecordFilter[K]) => {
        setFilter(previous => ({...previous, [key]: value}));
        setIndex(0);
    };

    // //modals
    const [openImportModal, setOpenImportModal] = useState(false);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<RecordData | null>(null);

    //record apis
    const createRecord = async (record: RecordData) => {
        try {
            console.log(record);
            await axiosConfig.post(API_ENDPOINTS.CREATE_RECORD, {
                name: record.name,
                type: record.type,
                icon: record.icon,
                date: record.date,
                price: record.price,
                description: record.description || record.name,
                category_id: record.category_id
            });
            toast.success("Record created");
            setOpenCreateModal(false);
            readRecords();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Created failed");
        }
    };

    const readRecords = async () => {
        setLoading(true);
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.READ_RECORDS, {
                params: {
                    type: filter.type === "all" ? null : filter.type,
                    order: filter.order,
                    size: filter.size,
                    dateStart: filter.dateStart,
                    dateEnd: filter.dateEnd,
                    priceLow: filter.priceLow,
                    priceHigh: filter.priceHigh,
                    keyword: keyword || null,
                    categoryId: filter.categoryId,
                    page: index
                }
            });
            setPage({
                content: response.data.content,
                totalElements: response.data.total_elements,
                totalPages: response.data.total_pages,
                number: response.data.number,
                size: response.data.size,
                first: response.data.first,
                last: response.data.last
            });
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Fetch records failed");
        } finally {
            setLoading(false);
        }
    };

    const updateRecord = async (record: RecordData) => {
        if (!record.id) return;
        try {
            await axiosConfig.put(API_ENDPOINTS.UPDATE_RECORD.replace("{id}", String(record.id)), record);
            toast.success("Updated successfully");
            readRecords();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Updated failed");
        } finally {
            setOpenUpdateModal(false);
        }
    };

    const deleteRecord = async (id: number) => {
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_RECORD.replace("{id}", String(id)));
            toast.success("Record deleted");
            readRecords();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Deleted failed");
        } finally {
            setOpenDeleteModal(false);
        }
    };

    useEffect(() => {
        readRecords();
    }, [filter, index, keyword]);

    return (
        <Dashboard activeRoute="Record">
            <div className="mx-auto my-6">
                <HeaderBar
                    title="All Records"
                    setOpenImportModal={setOpenImportModal}
                    setOpenCreateModal={setOpenCreateModal}
                />

                <RecordFilterBar filter={filter} onChange={updateFilter} />

                <SearchBar keyword={keyword} setKeyword={setKeyword} placeholder="Search Records..." />

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <LoaderCircle size={39} className="animate-spin text-cyan-400" />
                    </div>
                ) : (
                    page && (
                        <>
                            <ItemList
                                title="Records Source"
                                items={page.content}
                                totalElements={page.totalElements}
                                onEdit={(id: number) => {
                                    const record = page.content.find((r: RecordData) => r.id === id);
                                    if (!record) return;
                                    setSelectedRecord(record);
                                    setOpenUpdateModal(true);
                                }}
                                onDelete={(id: number) => {
                                    const record = page.content.find((r: RecordData) => r.id === id);
                                    if (!record) return;
                                    setSelectedRecord(record);
                                    setOpenDeleteModal(true);
                                }}
                                isRecord
                            />
                            <Pagination page={page.number} totalPages={page.totalPages} onChange={setIndex} />
                        </>
                    )
                )}

                <Modal isOpen={openCreateModal} onClose={() => setOpenCreateModal(false)} title="Add Record">
                    <AddRecordForm onAddRecord={createRecord} />
                </Modal>

                <Modal isOpen={openUpdateModal} onClose={() => setOpenUpdateModal(false)} title="Update Record">
                    <EditRecordForm record={selectedRecord!} onUpdateRecord={updateRecord} />
                </Modal>

                <Modal isOpen={openDeleteModal} onClose={() => setOpenDeleteModal(false)} title="Delete Record">
                    <DeleteRecordConfirm
                        record={selectedRecord!}
                        onConfirm={deleteRecord}
                        onCancel={() => setOpenDeleteModal(false)}
                    />
                </Modal>

                <Modal isOpen={openImportModal} onClose={() => setOpenImportModal(false)} title="Import Record">
                    <ImportRecordForm
                        onClose={() => {
                            setOpenImportModal(false);
                            readRecords();
                        }}
                    />
                </Modal>
            </div>
        </Dashboard>
    );
}
