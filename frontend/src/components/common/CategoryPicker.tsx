import {useState, useEffect, useRef} from "react";
import {ChevronLeft, ChevronRight, XCircle, LoaderCircle, Box} from "lucide-react";
import axiosConfig from "../../utilities/AxiosUtility";
import {API_ENDPOINTS} from "../../utilities/apiEndpoint";
import {RenderIcon} from "../../utilities/icon";
import type {CategoryType} from "../../types/CategoryType";
import type {CategoryPage} from "../../types/CategoryPage";
import type {CategoryData} from "../../types/CategoryData";
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

    // Fetch the specific category details to display Name/Icon correctly
    useEffect(() => {
        if (!selectedId) {
            setSelectedCategory(null);
            return;
        }
        // Check if it's already in the current loaded page
        const found = page?.content.find(c => c.id === selectedId);
        if (found) {
            setSelectedCategory(found);
        } else {
            // Fetch from API if not in current list
            axiosConfig
                .get(API_ENDPOINTS.FETCH_CATEGORY.replace("{id}", String(selectedId)))
                .then(res => setSelectedCategory(res.data))
                .catch(() => setSelectedCategory(null));
        }
    }, [selectedId, page?.content]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.READ_CATEGORIES, {
                params: {type: type, page: pageIndex, size: 5}
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
                type="button"
                onClick={() => setOpen(!open)}
                className="flex h-full w-full items-center gap-3 rounded-lg border border-cyan-400/30 bg-black/40 px-3 py-2 text-cyan-200 transition hover:border-cyan-400/60 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)] hover:cursor-pointer"
            >
                <div className="flex items-center justify-center w-5">
                    {selectedId && selectedCategory ? (
                        <RenderIcon
                            icon={selectedCategory.icon}
                            name={selectedCategory.name}
                            imageSize="h-4 w-4"
                            charSize="text-xs"
                            boxSize={18}
                        />
                    ) : (
                        <Box size={18} className="text-cyan-400/70" />
                    )}
                </div>
                <span className="truncate text-sm font-medium">
                    {selectedId ? selectedCategory?.name || "Loading..." : "All categories"}
                </span>
            </button>

            {open && (
                <div className="absolute left-0 z-50 mt-2 w-60 rounded-xl border border-cyan-400/30 bg-[#0b0f1a] p-3 shadow-2xl">
                    <div className="flex items-center justify-between mb-2 border-b border-cyan-400/10 pb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400/50">
                            Select Category
                        </span>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="text-red-600 hover:text-red-400 transition cursor-pointer"
                        >
                            <XCircle size={18} />
                        </button>
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-1 mb-3 pr-1">
                        {!disableAll && (
                            <button
                                type="button"
                                onClick={() => {
                                    onSelect(null);
                                    setOpen(false);
                                }}
                                className={`flex items-center gap-3 w-full text-left p-2 rounded text-xs transition border ${selectedId === null ? "bg-cyan-500/20 text-cyan-100 border-cyan-400/40" : "hover:bg-cyan-400/10 text-cyan-400/70 border-transparent cursor-pointer"}`}
                            >
                                <Box size={14} /> All Categories
                            </button>
                        )}

                        {loading ? (
                            <div className="flex justify-center py-6">
                                <LoaderCircle className="animate-spin text-cyan-400" size={20} />
                            </div>
                        ) : page?.content.length ? (
                            page.content.map(cat => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => {
                                        onSelect(cat.id);
                                        setOpen(false);
                                    }}
                                    className={`flex items-center gap-3 w-full text-left p-2 rounded text-xs transition cursor-pointer ${selectedId === cat.id ? "bg-cyan-500 text-black font-bold" : "hover:bg-cyan-400/10 text-cyan-200"}`}
                                >
                                    <div className="w-5 flex justify-center">
                                        <RenderIcon
                                            icon={cat.icon}
                                            name={cat.name}
                                            imageSize="h-4 w-4"
                                            charSize="text-[10px]"
                                            boxSize={14}
                                        />
                                    </div>
                                    <span className="truncate">{cat.name}</span>
                                </button>
                            ))
                        ) : (
                            <div className="py-4 text-center text-xs text-cyan-400/50">No categories found</div>
                        )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-cyan-400/10">
                        <button
                            disabled={!page || page.first || loading}
                            onClick={() => setPageIndex(p => p - 1)}
                            className="text-cyan-400 hover:text-cyan-200 disabled:opacity-10 cursor-pointer"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <span className="text-[10px] font-mono text-cyan-400/50">
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
