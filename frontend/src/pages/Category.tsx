import {Download, LoaderCircle, Plus, Search, SearchX, Upload} from "lucide-react";
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

    const categories = useCategory();
    const [page, setPage] = useState<CategoryPage | null>(null);
    const [loading, setLoading] = useState(false);

    //search
    const [keyword, setKeyword] = useState("");

    //export
    const [openExportMenu, setOpenExportMenu] = useState(false);
    const [exporting, setExporting] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    //modals
    const [openImportModal, setOpenImportModal] = useState(false);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);

    //apis
    const createCategory = async (category: CategoryData) => {
        setOpenCreateModal(false);
        try {
            await axiosConfig.post(API_ENDPOINTS.CREATE_CATEGORY, category);
            toast.success("Category Created");
            readCategories();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Created failed");
        }
    };

    const readCategories = async () => {
        setLoading(true);
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.READ_CATEGORIES, {
                params: {
                    type: categories.type,
                    name: keyword.trim() || undefined,
                    order: categories.order,
                    page: categories.page,
                    size: categories.size
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
            toast.error(error?.response?.data?.message || "Fetch categories failed");
        } finally {
            setLoading(false);
        }
    };

    const updateCategory = async (category: CategoryData) => {
        if (!category.id) return;
        try {
            await axiosConfig.put(API_ENDPOINTS.UPDATE_CATEGORY.replace("{id}", String(category.id)), category);
            toast.success("Updated successfully");
            readCategories();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Update failed");
        } finally {
            setOpenUpdateModal(false);
        }
    };

    const deleteCategory = async (id: number) => {
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_CATEGORY.replace("{id}", String(id)));
            toast.success("Category deleted");
            readCategories();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Deleted failed");
        } finally {
            setOpenDeleteModal(false);
        }
    };

    const handleExport = async (type: "csv" | "tsv" | "xlsx" | "json") => {
        setExporting(true);
        setOpenExportMenu(false);
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.EXPORT_CATEGORIES.replace("{type}", type), {
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
        readCategories();
    }, [categories.type, categories.order, categories.page, categories.size, keyword]);

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
                    <h2 className="text-2xl font-semibold text-cyan-300">All Categories</h2>

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
                            onClick={() => setOpenCreateModal(true)}
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

                <div className="mt-3-flex items-center gap-3 mb-3">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
                        <input
                            value={keyword}
                            onChange={k => setKeyword(k.target.value)}
                            onKeyDown={k => k.key === "Enter" && triggerSearch()}
                            placeholder="Search categories..."
                            className="w-full rounded-lg bg-slate-900 border border-cyan-400/30 py-3 pl-10 pr-10 text-cyan-200 placeholder-cyan-400/40 focus:ring-2 focus:ring-cyan-400/40"
                        />
                        {keyword && (
                            <button
                                onClick={() => setKeyword("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 hover:cursor-pointer"
                            >
                                <SearchX size={18} />
                            </button>
                        )}
                    </div>
                </div>

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
                                    setOpenUpdateModal(true);
                                }}
                                onDeleteCategory={(id: number) => {
                                    const category = page?.content.find((c: CategoryData) => c.id === id);
                                    if (!category) return;
                                    setSelectedCategory(category);
                                    setOpenDeleteModal(true);
                                }}
                            />
                            <Pagination page={page.number} totalPages={page.totalPages} onChange={categories.setPage} />
                        </>
                    )
                )}

                <Modal isOpen={openCreateModal} onClose={() => setOpenCreateModal(false)} title="Add Category">
                    <AddCategoryForm onAddCategory={createCategory} />
                </Modal>

                <Modal isOpen={openImportModal} onClose={() => setOpenImportModal(false)} title="Import Categories">
                    <CategoryImportModal
                        onClose={() => {
                            setOpenImportModal(false);
                            readCategories();
                        }}
                    />
                </Modal>

                {selectedCategory && (
                    <Modal isOpen={openUpdateModal} onClose={() => setOpenUpdateModal(false)} title="Update Category">
                        <EditCategoryForm category={selectedCategory} onUpdateCategory={updateCategory} />
                    </Modal>
                )}

                {selectedCategory && (
                    <Modal isOpen={openDeleteModal} onClose={() => setOpenDeleteModal(false)} title="Delete Category">
                        <DeleteCategoryConfirm
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
