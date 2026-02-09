import {Download, LoaderCircle, Plus, Upload} from "lucide-react";
import Dashboard from "../components/Dashboard";
import {useUser} from "../hooks/useUser";
import CategoryList from "../components/categories/CategoryList";
import Pagination from "../components/common/Pagination";
import {useEffect, useRef, useState} from "react";
import axiosConfig from "../utilities/AxiosUtility";
import {API_ENDPOINTS} from "../utilities/apiEndpoint";
import toast from "react-hot-toast";
import Modal from "../components/common/Modal";
import AddCategoryForm from "../components/categories/AddCategoryForm";
import type {CategoryData} from "../types/CategoryData";
import EditCategoryForm from "../components/categories/EditCategoryForm";
import DeleteCategoryConfirm from "../components/categories/DeleteCategoryConfirm";
import {useCategory} from "../hooks/useCategory";
import CategoryFilterBar from "../components/categories/CategoryFilterBar";
import type {CategoryPage} from "../types/CategoryPage";
import CategoryImportModal from "../components/categories/CategoryImportModal";

export default function Category() {
    useUser();

    const [loading, setLoading] = useState(false);
    const categories = useCategory();
    const [page, setPage] = useState<CategoryPage | null>(null);
    const [openImportModal, setOpenImportModal] = useState(false);
    const [openExportMenu, setOpenExportMenu] = useState(false);
    const [exporting, setExporting] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
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

    const handleExport = async (type: "csv" | "tsv" | "xlsx" | "json") => {
        setExporting(true);
        setOpenExportMenu(false);
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_EXPORT.replace("{type}", type), {
                responseType: "blob"
            });
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
        fetchCategories();
    }, [categories.type, categories.order, categories.page, categories.size]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setOpenExportMenu(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <Dashboard activeRoute="Category">
            <div className="mx-auto my-6">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold tracking-wide text-cyan-300">All Categories</h2>

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
                                {exporting ? (
                                    <LoaderCircle size={18} className="animate-spin" />
                                ) : (
                                    <Download size={18} />
                                )}
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
                                            className="w-full text-left px-4 py-3 text-sm text-cyan-200 hover:bg-cyan-500/10 hover:cursor-pointer"
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setOpenAddCategoryModal(true)}
                            className="flex items-center justify-center gap-3 rounded-lg p-3 bg-cyan-500/10 text-cyan-300 border border-cyan-400/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] hover:cursor-pointer"
                        >
                            <Plus size={18} /> Add
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
