import {Plus} from "lucide-react";
import Dashboard from "../components/Dashboard";
import {useUser} from "../hooks/useUser";
import CategoryList from "../components/CategoryList";
import {useEffect, useState} from "react";
import axiosConfig from "../utilities/AxiosUtility";
import {API_ENDPOINTS} from "../utilities/apiEndpoint";
import toast from "react-hot-toast";
import Modal from "../components/Modal";
import AddCategoryForm from "../components/AddCategoryForm";
import type {CategoryType} from "../types/CategoryType";
import EditCategoryForm from "../components/EditCategoryForm";
import DeleteCategoryConfirm from "../components/DeleteCategoryConfirm";

export default function Category() {
    useUser();

    const [loading, setLoading] = useState(false);
    const [categoryData, setCategoryData] = useState<CategoryType[]>([]);
    const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
    const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false);
    const [openDeleteCategoryModal, setOpenDeleteCategoryModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);

    const fetchCategories = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_CATEGORIES);
            if (response.status === 200) setCategoryData(response.data);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Fetch categories failed");
        } finally {
            setLoading(false);
        }
    };

    const addCategory = async (category: CategoryType) => {
        setOpenAddCategoryModal(false);
        try {
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORY, {
                name: category.name,
                type: category.type,
                icon: category.icon
            });
            toast.success(response?.data?.message || "Created successfully");
            fetchCategories();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Created failed");
        }
    };

    const changeCategory = async (category: CategoryType) => {
        if (!category.id) {
            toast.error("Invalid category ID");
            return;
        }
        try {
            const response = await axiosConfig.put(API_ENDPOINTS.UPDATE_CATEGORY.replace("{id}", String(category.id)), {
                name: category.name,
                type: category.type,
                icon: category.icon
            });
            toast.success(response?.data?.message || "Updated successfully");
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
            const response = await axiosConfig.delete(API_ENDPOINTS.DELETE_CATEGORY.replace("{id}", String(id)));
            toast.success(response?.data?.message || "Deleted successfully");
            fetchCategories();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Deleted failed");
        } finally {
            setOpenDeleteCategoryModal(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <Dashboard activeRoute="Category">
            <div className="mx-auto my-6">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold tracking-wide text-cyan-300">All Categories</h2>

                    <button
                        onClick={() => setOpenAddCategoryModal(true)}
                        className="flex items-center gap-2 rounded-lg px-4 py-2 bg-cyan-500/10 text-cyan-300 border border-cyan-400/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.6)]"
                    >
                        <Plus size={18} />
                        Add Category
                    </button>
                </div>

                <CategoryList
                    categories={categoryData}
                    onEditCategory={(id: number) => {
                        const category = categoryData.find(c => c.id === id);
                        if (!category) return;
                        setSelectedCategory(category);
                        setOpenEditCategoryModal(true);
                    }}
                    onDeleteCategory={(id: number) => {
                        const category = categoryData.find(c => c.id === id);
                        if (!category) return;
                        setSelectedCategory(category);
                        setOpenDeleteCategoryModal(true);
                    }}
                />

                <Modal
                    isOpen={openAddCategoryModal}
                    onClose={() => setOpenAddCategoryModal(false)}
                    title="Add Category"
                >
                    <AddCategoryForm onAddCategory={addCategory} />
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
