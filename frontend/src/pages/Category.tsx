import Dashboard from "../components/Dashboard";
import {useUser} from "../hooks/useUser";
import {useI18n} from "../context/I18nContext";
import ItemList from "../components/common/ItemList";
import Pagination from "../components/common/Pagination";
import {useCallback, useEffect, useState} from "react";
import axiosConfig from "../utilities/AxiosUtility";
import {API_ENDPOINTS} from "../utilities/apiEndpoint";
import toast from "react-hot-toast";
import Modal from "../components/common/Modal";
import type {CategoryData, CategoryPage, CategoryFilter} from "../types/CategoryTypes";
import SearchBar from "../components/common/SearchBar";
import {LoaderCircle} from "lucide-react";
import {Create, Update, Delete, Filter, Import} from "../components/Categories";
import HeaderBar from "../components/common/HeaderBar";

export default function Category() {
    useUser();
    const {translation} = useI18n();

    const [page, setPage] = useState<CategoryPage | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [filter, setFilter] = useState<CategoryFilter>({type: "all", order: "CREATED_ASCENDING", size: 30});
    const [index, setIndex] = useState<number>(0);
    const [keyword, setKeyword] = useState<string>("");

    const [openImportModal, setOpenImportModal] = useState<boolean>(false);
    const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
    const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);

    const updateFilter = useCallback(
        <K extends keyof CategoryFilter>(key: K, value: CategoryFilter[K]) =>
            setFilter(prev => ({...prev, [key]: value})),
        []
    );

    const readCategories = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.READ_CATEGORIES, {
                params: {
                    type: filter.type === "all" ? null : filter.type,
                    keyword: keyword.trim() || undefined,
                    order: filter.order,
                    page: index,
                    size: filter.size
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
        } catch (e: any) {
            toast.error(e?.response?.data?.message || translation.category.fetchFailed);
        } finally {
            setLoading(false);
        }
    }, [filter, index, keyword, translation]);

    const createCategory = useCallback(
        async (category: CategoryData) => {
            setOpenCreateModal(false);
            try {
                await axiosConfig.post(API_ENDPOINTS.CREATE_CATEGORY, category);
                toast.success(translation.category.createSuccess);
                readCategories();
            } catch (e: any) {
                toast.error(e?.response?.data?.message || translation.category.createFailed);
            }
        },
        [readCategories, translation]
    );

    const updateCategory = useCallback(
        async (category: CategoryData) => {
            if (!category.id) return;
            try {
                await axiosConfig.put(API_ENDPOINTS.UPDATE_CATEGORY.replace("{id}", String(category.id)), category);
                toast.success(translation.category.updateSuccess);
                readCategories();
            } catch (e: any) {
                toast.error(e?.response?.data?.message || translation.category.updateFailed);
            } finally {
                setOpenUpdateModal(false);
            }
        },
        [readCategories, translation]
    );

    const deleteCategory = useCallback(
        async (id: number) => {
            try {
                await axiosConfig.delete(API_ENDPOINTS.DELETE_CATEGORY.replace("{id}", String(id)));
                toast.success(translation.category.deleteSuccess);
                readCategories();
            } catch (e: any) {
                toast.error(e?.response?.data?.message || translation.category.deleteFailed);
            } finally {
                setOpenDeleteModal(false);
            }
        },
        [readCategories, translation]
    );

    useEffect(() => {
        readCategories();
    }, [filter, index, keyword]);

    return (
        <Dashboard activeRoute={translation.nav.category}>
            <div className="mx-auto my-4 space-y-4">
                <HeaderBar
                    title={translation.category.title}
                    setOpenImportModal={setOpenImportModal}
                    setOpenCreateModal={setOpenCreateModal}
                />

                <Filter filter={filter} onChange={updateFilter} />

                <SearchBar
                    keyword={keyword}
                    setKeyword={setKeyword}
                    placeholder={translation.category.searchPlaceholder}
                />

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <LoaderCircle size={38} className="animate-spin" style={{color: "var(--text-accent)"}} />
                    </div>
                ) : (
                    page && (
                        <>
                            <ItemList
                                title={translation.category.title}
                                items={page.content}
                                totalElements={page.totalElements}
                                onEdit={id => {
                                    const c = page.content.find((c: CategoryData) => c.id === id);
                                    if (c) {
                                        setSelectedCategory(c);
                                        setOpenUpdateModal(true);
                                    }
                                }}
                                onDelete={id => {
                                    const c = page.content.find((c: CategoryData) => c.id === id);
                                    if (c) {
                                        setSelectedCategory(c);
                                        setOpenDeleteModal(true);
                                    }
                                }}
                            />
                            <Pagination page={page.number} totalPages={page.totalPages} onChange={setIndex} />
                        </>
                    )
                )}

                <Modal
                    isOpen={openCreateModal}
                    onClose={() => setOpenCreateModal(false)}
                    title={translation.category.create}
                >
                    <Create onAddCategory={createCategory} />
                </Modal>
                <Modal
                    isOpen={openImportModal}
                    onClose={() => setOpenImportModal(false)}
                    title={translation.category.import}
                >
                    <Import
                        onClose={() => {
                            setOpenImportModal(false);
                            readCategories();
                        }}
                    />
                </Modal>
                {selectedCategory && (
                    <Modal
                        isOpen={openUpdateModal}
                        onClose={() => setOpenUpdateModal(false)}
                        title={translation.category.update}
                    >
                        <Update category={selectedCategory} onUpdateCategory={updateCategory} />
                    </Modal>
                )}
                {selectedCategory && (
                    <Modal
                        isOpen={openDeleteModal}
                        onClose={() => setOpenDeleteModal(false)}
                        title={translation.category.delete}
                    >
                        <Delete
                            category={selectedCategory}
                            onCancel={() => setOpenDeleteModal(false)}
                            onConfirm={deleteCategory}
                        />
                    </Modal>
                )}
            </div>
        </Dashboard>
    );
}
