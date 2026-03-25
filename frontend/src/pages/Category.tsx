import Dashboard from "../components/Dashboard";
import {useI18n} from "../context/I18nContext";
import ItemList from "../components/common/ItemList";
import Pagination from "../components/common/Pagination";
import {useCallback, useEffect, useState} from "react";
import Modal from "../components/common/Modal";
import type {CategoryData, CategoryPage, CategoryFilter} from "../types/CategoryTypes";
import SearchBar from "../components/common/SearchBar";
import {LoaderCircle} from "lucide-react";
import {Create, Update, Delete, Filter, Import} from "../components/Categories";
import HeaderBar from "../components/common/HeaderBar";
import {useUser} from "../context/UserContext";
import {categoryApi} from "../utilities/api";

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
            setFilter(previous => ({...previous, [key]: value})),
        []
    );

    const readCategories = useCallback(async () => {
        setLoading(true);
        await categoryApi.read(filter, keyword, index, setPage, translation.category.fetchFailed);
        setLoading(false);
    }, [filter, index, keyword, translation]);

    const createCategory = useCallback(
        async (category: CategoryData) => {
            await categoryApi.create(category, {
                success: translation.category.createSuccess,
                failed: translation.category.createFailed
            });
            setOpenCreateModal(false);
            readCategories();
        },
        [readCategories, translation]
    );

    const updateCategory = useCallback(
        async (category: CategoryData) => {
            if (!category.id) return;
            categoryApi.update(category, {
                success: translation.category.updateSuccess,
                failed: translation.category.updateFailed
            });
            setOpenUpdateModal(false);
            readCategories();
        },
        [readCategories, translation]
    );

    const deleteCategory = useCallback(
        async (id: number) => {
            await categoryApi.delete(id, {
                success: translation.category.deleteSuccess,
                failed: translation.category.deleteFailed
            });
            setOpenDeleteModal(false);
            readCategories();
        },
        [readCategories, translation]
    );

    useEffect(() => {
        readCategories();
    }, [filter, index, keyword]);

    return (
        <Dashboard activeRoute={translation.navigation.category}>
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
                        <LoaderCircle size={39} className="animate-spin text-(--text-accent)" />
                    </div>
                ) : (
                    page && (
                        <>
                            <ItemList
                                title={translation.category.title}
                                items={page.content}
                                totalElements={page.totalElements}
                                onEdit={(id: number) => {
                                    const category = page.content.find((category: CategoryData) => category.id === id);
                                    if (category) {
                                        setSelectedCategory(category);
                                        setOpenUpdateModal(true);
                                    }
                                }}
                                onDelete={(id: number) => {
                                    const category = page.content.find((category: CategoryData) => category.id === id);
                                    if (category) {
                                        setSelectedCategory(category);
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
