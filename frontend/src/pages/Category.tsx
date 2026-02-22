import {LoaderCircle} from "lucide-react";
import Dashboard from "../components/Dashboard";
import {useUser} from "../hooks/useUser";
import ItemList from "../components/common/ItemList";
import Pagination from "../components/common/Pagination";
import {useEffect, useState} from "react";
import axiosConfig from "../utilities/AxiosUtility";
import {API_ENDPOINTS} from "../utilities/apiEndpoint";
import toast from "react-hot-toast";
import Modal from "../components/common/Modal";
import AddCategoryForm from "../components/categories/AddCategoryForm";
import type {CategoryData} from "../types/CategoryData";
import EditCategoryForm from "../components/categories/EditCategoryForm";
import DeleteCategoryConfirm from "../components/categories/DeleteCategoryConfirm";
import CategoryFilterBar from "../components/categories/CategoryFilterBar";
import type {CategoryPage} from "../types/CategoryPage";
import CategoryImportModal from "../components/categories/CategoryImportModal";
import HeaderBar from "../components/common/HeaderBar";
import SearchBar from "../components/common/SearchBar";
import type {CategoryType} from "../types/CategoryType";
import type {CategoryOrder} from "../types/CategoryOrder";

export default function Category() {
    useUser();

    const [page, setPage] = useState<CategoryPage | null>(null);
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState<CategoryType>("all");
    const [order, setOrder] = useState<CategoryOrder>("CREATED_DESCENDING");
    const [index, setIndex] = useState<number>(0);
    const [size, setSize] = useState<number>(30);

    //search
    const [keyword, setKeyword] = useState("");

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
                params: {type: type, name: keyword.trim() || undefined, order: order, page: index, size: size}
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

    useEffect(() => {
        readCategories();
    }, [type, order, index, size, keyword]);

    return (
        <Dashboard activeRoute="Category">
            <div className="mx-auto my-6">
                <HeaderBar
                    title="All Categories"
                    setOpenImportModal={setOpenImportModal}
                    setOpenCreateModal={setOpenCreateModal}
                />

                <CategoryFilterBar
                    type={type}
                    order={order}
                    size={size}
                    onTypeChange={t => {
                        setType(t);
                        setIndex(0);
                    }}
                    onOrderChange={o => {
                        setOrder(o);
                        setIndex(0);
                    }}
                    onSizeChange={s => {
                        setSize(s);
                        setIndex(0);
                    }}
                />

                <SearchBar keyword={keyword} setKeyword={setKeyword} placeholder="Search categories..." />

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <LoaderCircle size={39} className="animate-spin text-cyan-400" />
                    </div>
                ) : (
                    page && (
                        <>
                            <ItemList
                                title="Categories Source"
                                items={page.content}
                                totalElements={page.totalElements}
                                onEdit={(id: number) => {
                                    const category = page?.content.find((c: CategoryData) => c.id === id);
                                    if (!category) return;
                                    setSelectedCategory(category);
                                    setOpenUpdateModal(true);
                                }}
                                onDelete={(id: number) => {
                                    const category = page?.content.find((c: CategoryData) => c.id === id);
                                    if (!category) return;
                                    setSelectedCategory(category);
                                    setOpenDeleteModal(true);
                                }}
                            />
                            <Pagination page={page.number} totalPages={page.totalPages} onChange={setIndex} />
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
                            record={selectedCategory}
                            onCancel={() => setOpenDeleteModal(false)}
                            onConfirm={deleteCategory}
                        />
                    </Modal>
                )}
            </div>
        </Dashboard>
    );
}
