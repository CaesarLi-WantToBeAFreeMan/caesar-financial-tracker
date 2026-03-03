import {useState, useEffect, useRef} from "react";
import {ChevronLeft, ChevronRight, XCircle, LoaderCircle, Box} from "lucide-react";
import axiosConfig from "../../utilities/AxiosUtility";
import {API_ENDPOINTS} from "../../utilities/apiEndpoint";
import {RenderIcon} from "../../utilities/icon";
import type {CategoryType, CategoryPage, CategoryData} from "../../types/CategoryTypes";
import toast from "react-hot-toast";

interface Props {
    selectedId: number | null;
    type: CategoryType;
    onSelect: (id: number | null) => void;
    disableAll?: boolean;
}

export default function CategoryPicker({selectedId, type, onSelect, disableAll}: Props) {
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState<CategoryPage | null>(null);
    const [loading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => !containerRef.current?.contains(e.target as Node) && setOpen(false);
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
        if (!selectedId) {
            setSelectedCategory(null);
            return;
        }
        const found = page?.content.find(c => c.id === selectedId);
        if (found) setSelectedCategory(found);
        else
            axiosConfig
                .get(API_ENDPOINTS.FETCH_CATEGORY.replace("{id}", String(selectedId)))
                .then(res => setSelectedCategory(res.data))
                .catch(() => setSelectedCategory(null));
    }, [selectedId, page?.content]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.READ_CATEGORIES, {
                params: {type: type, page: pageIndex, size: 4}
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

    useEffect(() => {
        if (open) fetchCategories();
    }, [open, pageIndex, type]);

    useEffect(() => setPageIndex(0), [type]);

    return (
        <div className="relative flex-1" ref={containerRef}>
            <button
                onClick={() => setOpen(!open)}
                className="flex w-full items-center gap-3 rounded-lg border border-cyan-400/30 bg-black/40 px-3 py-1 text-cyan-200 text-xs transition hover:border-cyan-400/60 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)] hover:cursor-pointer"
            >
                {selectedId && selectedCategory ? (
                    <RenderIcon
                        icon={selectedCategory.icon}
                        name={selectedCategory.name}
                        imageSize="h-4 w-4"
                        charSize="text-xs"
                        boxSize={12}
                    />
                ) : (
                    <Box size={12} className="text-cyan-400/70" />
                )}
                <span className="truncate text-sm font-medium">
                    {selectedId ? selectedCategory?.name || "Loading..." : "All categories"}
                </span>
            </button>

            {open && (
                <div className="absolute left-1/2 -translate-x-1/2 z-10 mt-3 w-50 rounded-xl border border-cyan-400/30 bg-[#0b0f1a] p-3 shadow-2xl">
                    <div className="flex items-center justify-between mb-1 border-b border-cyan-400/10 pb-1">
                        <span className="text-xs font-mono font-semibold uppercase truncate text-cyan-400/50">
                            Select Category
                        </span>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="text-red-600 hover:text-red-400 transition cursor-pointer"
                        >
                            <XCircle size={15} />
                        </button>
                    </div>

                    <div className="mb-1">
                        {!disableAll && (
                            <button
                                type="button"
                                onClick={() => {
                                    onSelect(null);
                                    setOpen(false);
                                }}
                                className={`flex items-center gap-3 w-full text-left m-1 p-2 rounded-xl text-xs transition duration-300 hover:cursor-pointer text-cyan-600 ${selectedId === null ? "bg-cyan-400/30 font-bold" : "hover:bg-cyan-400/30"}`}
                            >
                                <RenderIcon icon={null} name="all" boxSize={14} />
                                <span>All Categories</span>
                            </button>
                        )}

                        {loading ? (
                            <div className="flex justify-center py-6">
                                <LoaderCircle className="animate-spin text-cyan-400" size={20} />
                            </div>
                        ) : page?.content.length ? (
                            page.content.map(category => (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => {
                                        onSelect(category.id);
                                        setOpen(false);
                                    }}
                                    className={`flex items-center gap-3 w-full text-left m-1 p-2 rounded-xl text-xs transition duration-300 hover:cursor-pointer text-cyan-600 ${selectedId === category.id ? "bg-cyan-400/30 font-bold" : "hover:bg-cyan-400/30"}`}
                                >
                                    <div className="w-5 flex justify-center">
                                        <RenderIcon
                                            icon={category.icon}
                                            name={category.name}
                                            imageSize="h-4 w-4"
                                            charSize="text-sm"
                                            boxSize={14}
                                        />
                                    </div>
                                    <span className="truncate">{category.name}</span>
                                </button>
                            ))
                        ) : (
                            <div className="py-4 text-center text-xs text-cyan-400/50">No categories found</div>
                        )}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-cyan-400/10">
                        <button
                            disabled={!page || page.first || loading}
                            onClick={() => setPageIndex(p => p - 1)}
                            className="text-cyan-400 hover:text-cyan-200 disabled:opacity-10 cursor-pointer"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <span className="text-xs font-mono font-semibold text-cyan-400/50">
                            {page ? page.number + 1 : 1} / {page?.totalPages || 1}
                        </span>
                        <button
                            disabled={!page || page.last || loading}
                            onClick={() => setPageIndex(p => p + 1)}
                            className="text-cyan-400 hover:text-cyan-200 disabled:opacity-10 cursor-pointer"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
