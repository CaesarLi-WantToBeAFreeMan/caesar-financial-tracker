import {LoaderCircle, Plus} from "lucide-react";
import Dashboard from "../components/Dashboard";
import {useUser} from "../hooks/useUser";
import CategoryList from "../components/CategoryList";
import Pagination from "../components/Pagination";
import {useEffect, useState} from "react";
import axiosConfig from "../utilities/AxiosUtility";
import {API_ENDPOINTS} from "../utilities/apiEndpoint";
import toast from "react-hot-toast";
import Modal from "../components/Modal";
import AddCategoryForm from "../components/AddCategoryForm";
import type {CategoryData} from "../types/CategoryData";
import EditCategoryForm from "../components/EditCategoryForm";
import DeleteCategoryConfirm from "../components/DeleteCategoryConfirm";
import {useCategory} from "../hooks/useCategory";
import CategoryFilterBar from "../components/CategoryFilterBar";
import type {CategoryPage} from "../types/CategoryPage";
import CategoryImportModal from "../components/CategoryImportModal";

export default function Category() {
    useUser();

    const [loading, setLoading] = useState(false);
    const categories = useCategory();
    const [page, setPage] = useState<CategoryPage | null>(null);
    const [openImportModal, setOpenImportModal] = useState(false);
    const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
    const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false);
    const [openDeleteCategoryModal, setOpenDeleteCategoryModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_CATEGORIES, {
                params: {type: categories.type, order: categories.order, page: categories.page, size: categories.size}
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
            toast.error(error?.response?.data?.message || "Fetch categories failed");
        } finally {
            setLoading(false);
        }
    };

    const addCategory = async (category: CategoryData) => {
        setOpenAddCategoryModal(false);
        try {
            await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORY, {
                name: category.name,
                type: category.type,
                icon: category.icon
            });
            toast.success("Created successfully");
            fetchCategories();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Created failed");
        }
    };

    const changeCategory = async (category: CategoryData) => {
        if (!category.id) {
            toast.error("Invalid category ID");
            return;
        }
        try {
            await axiosConfig.put(API_ENDPOINTS.UPDATE_CATEGORY.replace("{id}", String(category.id)), {
                name: category.name,
                type: category.type,
                icon: category.icon
            });
            toast.success("Updated successfully");
            fetchCategories();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Updated failed");
        } finally {
            setOpenEditCategoryModal(false);
        }
    };

    const deleteCategory = async (id: number) => {
        if (!id) {
            toast.error("Invalid category ID");
            return;
        }
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_CATEGORY.replace("{id}", String(id)));
            toast.success("Deleted successfully");
            fetchCategories();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Deleted failed");
        } finally {
            setOpenDeleteCategoryModal(false);
        }
    };

    const handleExport = () => {
        console.log("export");
    };

    useEffect(() => {
        fetchCategories();
    }, [categories.type, categories.order, categories.page, categories.size]);

    return (
        <Dashboard activeRoute="Category">
            <div className="mx-auto my-6">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold tracking-wide text-cyan-300">All Categories</h2>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setOpenImportModal(true)}
                            className="rounded-lg p-3 border border-purple-400 text-purple-300 bg-purple-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.6)] hover:cursor-pointer"
                        >
                            Import
                        </button>
                        <button
                            onClick={() => handleExport()}
                            className="rounded-lg p-3 border border-emerald-400 text-emerald-300 bg-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.6)] hover:cursor-pointer"
                        >
                            Export
                        </button>
                        <button
                            onClick={() => setOpenAddCategoryModal(true)}
                            className="flex items-center gap-2 rounded-lg px-4 py-2 bg-cyan-500/10 text-cyan-300 border border-cyan-400/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] hover:cursor-pointer"
                        >
                            <Plus size={18} />
                            Add Category
                        </button>
                    </div>
                </div>

                <CategoryFilterBar
                    type={categories.type}
                    order={categories.order}
                    size={categories.size}
                    onTypeChange={t => {
                        categories.setType(t);
                        categories.setPage(0);
                    }}
                    onOrderChange={o => {
                        categories.setOrder(o);
                        categories.setPage(0);
                    }}
                    onSizeChange={s => {
                        categories.setSize(s);
                        categories.setPage(0);
                    }}
                />

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <LoaderCircle size={39} className="animate-spin text-cyan-400" />
                    </div>
                ) : (
                    page && (
                        <>
                            <CategoryList
                                categories={page.content}
                                totalElements={page.totalElements}
                                onEditCategory={(id: number) => {
                                    const category = page?.content.find((c: CategoryData) => c.id === id);
                                    if (!category) return;
                                    setSelectedCategory(category);
                                    setOpenEditCategoryModal(true);
                                }}
                                onDeleteCategory={(id: number) => {
                                    const category = page?.content.find((c: CategoryData) => c.id === id);
                                    if (!category) return;
                                    setSelectedCategory(category);
                                    setOpenDeleteCategoryModal(true);
                                }}
                            />
                            <Pagination page={page.number} totalPages={page.totalPages} onChange={categories.setPage} />
                        </>
                    )
                )}

                <Modal
                    isOpen={openAddCategoryModal}
                    onClose={() => setOpenAddCategoryModal(false)}
                    title="Add Category"
                >
                    <AddCategoryForm onAddCategory={addCategory} />
                </Modal>

                <Modal isOpen={openImportModal} onClose={() => setOpenImportModal(false)} title="Import Categories">
                    <CategoryImportModal
                        onClose={() => {
                            setOpenImportModal(false);
                            fetchCategories();
                        }}
                    />
                </Modal>

                {selectedCategory && (
                    <Modal
                        isOpen={openEditCategoryModal}
                        onClose={() => setOpenEditCategoryModal(false)}
                        title="Update Category"
                    >
                        <EditCategoryForm category={selectedCategory} onUpdateCategory={changeCategory} />
                    </Modal>
                )}

                {selectedCategory && (
                    <Modal
                        isOpen={openDeleteCategoryModal}
                        onClose={() => setOpenDeleteCategoryModal(false)}
                        title="Delete Category"
                    >
                        <DeleteCategoryConfirm
                            category={selectedCategory}
                            onCancel={() => setOpenDeleteCategoryModal(false)}
                            onConfirm={deleteCategory}
                        />
                    </Modal>
                )}
            </div>
        </Dashboard>
    );
}
