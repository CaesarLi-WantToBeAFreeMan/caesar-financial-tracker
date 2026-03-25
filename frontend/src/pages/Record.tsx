import {useCallback, useEffect, useState} from "react";
import Dashboard from "../components/Dashboard";
import HeaderBar from "../components/common/HeaderBar";
import type {RecordFilter, RecordPage, RecordData} from "../types/RecordTypes";
import SearchBar from "../components/common/SearchBar";
import {LoaderCircle} from "lucide-react";
import Pagination from "../components/common/Pagination";
import ItemList from "../components/common/ItemList";
import Modal from "../components/common/Modal";
import {Create, Update, Delete, Filter, Import} from "../components/Records";
import {useUser} from "../context/UserContext";
import {getDate} from "../utilities/dates";
import {recordApi} from "../utilities/api";
import {useI18n} from "../context/I18nContext";

export default function Record() {
    useUser();
    const {translation} = useI18n();

    const today = getDate();

    const [filter, setFilter] = useState<RecordFilter>({
        type: "all",
        order: "CREATED_DESCENDING",
        size: 30,
        dateStart: today,
        dateEnd: today,
        categoryId: null,
        priceLow: 0,
        priceHigh: null
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<RecordPage | null>(null);
    const [index, setIndex] = useState<number>(0);
    const [keyword, setKeyword] = useState<string>("");

    const updateFilter = useCallback(
        <K extends keyof RecordFilter>(key: K, value: RecordFilter[K]) =>
            setFilter(previous => ({...previous, [key]: value})),
        []
    );

    //modals
    const [openImportModal, setOpenImportModal] = useState<boolean>(false);
    const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
    const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
    const [selectedRecord, setSelectedRecord] = useState<RecordData | null>(null);

    //record apis
    const readRecords = useCallback(async () => {
        setLoading(true);
        await recordApi.read(filter, keyword, index, setPage, translation.record.fetchFailed);
        setLoading(false);
    }, [filter, keyword, index, translation]);

    const createRecord = useCallback(
        async (record: RecordData) => {
            await recordApi.create(record, {
                success: translation.record.createSuccess,
                failed: translation.record.createFailed
            });
            setOpenCreateModal(false);
            readRecords();
        },
        [readRecords, translation]
    );

    const updateRecord = useCallback(
        async (record: RecordData) => {
            if (!record.id) return;
            await recordApi.update(record, {
                success: translation.record.updateSuccess,
                failed: translation.record.updateFailed
            });
            readRecords();
            setOpenUpdateModal(false);
        },
        [readRecords, translation]
    );

    const deleteRecord = useCallback(
        async (id: number) => {
            await recordApi.delete(id, {
                success: translation.record.deleteSuccess,
                failed: translation.record.deleteFailed
            });
            readRecords();
            setOpenDeleteModal(false);
        },
        [readRecords, translation]
    );

    useEffect(() => {
        readRecords();
    }, [filter, index, keyword]);

    return (
        <Dashboard activeRoute={translation.navigation.record}>
            <div className="mx-auto my-4 space-y-4">
                <HeaderBar
                    title={translation.record.title}
                    setOpenImportModal={setOpenImportModal}
                    setOpenCreateModal={setOpenCreateModal}
                />

                <Filter filter={filter} onChange={updateFilter} />

                <SearchBar
                    keyword={keyword}
                    setKeyword={setKeyword}
                    placeholder={translation.record.searchPlaceholder}
                />

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <LoaderCircle size={39} className="animate-spin text-(--text-accent)" />
                    </div>
                ) : (
                    page && (
                        <>
                            <ItemList
                                title={translation.record.title}
                                items={page.content}
                                totalElements={page.totalElements}
                                onEdit={(id: number) => {
                                    const record = page.content.find((r: RecordData) => r.id === id);
                                    if (record) {
                                        setSelectedRecord(record);
                                        setOpenUpdateModal(true);
                                    }
                                }}
                                onDelete={(id: number) => {
                                    const record = page.content.find((r: RecordData) => r.id === id);
                                    if (record) {
                                        setSelectedRecord(record);
                                        setOpenDeleteModal(true);
                                    }
                                }}
                                isRecord
                            />
                            <Pagination page={page.number} totalPages={page.totalPages} onChange={setIndex} />
                        </>
                    )
                )}

                <Modal
                    isOpen={openCreateModal}
                    onClose={() => setOpenCreateModal(false)}
                    title={translation.record.create}
                >
                    <Create onAddRecord={createRecord} />
                </Modal>

                <Modal
                    isOpen={openImportModal}
                    onClose={() => setOpenImportModal(false)}
                    title={translation.record.import}
                >
                    <Import
                        onClose={() => {
                            setOpenImportModal(false);
                            readRecords();
                        }}
                    />
                </Modal>

                {selectedRecord && (
                    <Modal
                        isOpen={openUpdateModal}
                        onClose={() => setOpenUpdateModal(false)}
                        title={translation.record.update}
                    >
                        <Update record={selectedRecord} onUpdateRecord={updateRecord} />
                    </Modal>
                )}

                {selectedRecord && (
                    <Modal
                        isOpen={openDeleteModal}
                        onClose={() => setOpenDeleteModal(false)}
                        title={translation.record.delete}
                    >
                        <Delete
                            record={selectedRecord}
                            onConfirm={deleteRecord}
                            onCancel={() => setOpenDeleteModal(false)}
                        />
                    </Modal>
                )}
            </div>
        </Dashboard>
    );
}
