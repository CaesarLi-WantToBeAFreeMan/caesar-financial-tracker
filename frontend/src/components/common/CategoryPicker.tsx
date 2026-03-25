/*
 * dropdown list to select a single category
 */
import {useState, useEffect, useRef} from "react";
import {ChevronLeft, ChevronRight, XCircle, LoaderCircle, Box} from "lucide-react";
import {RenderIcon} from "../../utilities/icon";
import {useClickOutside} from "../../hooks/useClickOutside";
import {useI18n} from "../../context/I18nContext";
import type {CategoryType, CategoryPage, CategoryData} from "../../types/CategoryTypes";
import {categoryApi} from "../../utilities/api";

interface Props {
    selectedId: number | null;
    type: CategoryType;
    onSelect: (id: number | null) => void;
    disableAll?: boolean;
}

const PAGE_SIZE = 4;

export default function CategoryPicker({selectedId, type, onSelect, disableAll}: Props) {
    const {translation} = useI18n();

    const [open, setOpen] = useState<boolean>(false);
    const [page, setPage] = useState<CategoryPage | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [pageIndex, setPageIndex] = useState<number>(0);
    const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    useClickOutside(containerRef, () => setOpen(false), open);

    //render selected category when selected changes
    useEffect(() => {
        if (!selectedId) {
            setSelectedCategory(null);
            return;
        }
        const found = page?.content.find(category => category.id === selectedId);
        if (found) {
            setSelectedCategory(found);
            return;
        }
        //fetch the specific category if it isn't in the current page
        const fetch = async () =>
            await categoryApi.fetch(selectedId, setSelectedCategory, translation.category.fetchFailed);
        fetch();
    }, [selectedId, page?.content]);

    //fetch pages
    useEffect(() => {
        if (!open) return;
        const fetch = async () =>
            await categoryApi.read(
                {type: "all", order: "UPDATED_DESCENDING", size: PAGE_SIZE},
                "",
                pageIndex,
                setPage,
                translation.category.fetchFailed
            );
        setLoading(false);
        fetch();
    }, [open, pageIndex, type]);

    //reset page when type changes
    useEffect(() => setPageIndex(0), [type]);

    const categorySelectedStyles = (selected: boolean): string =>
        `flex items-center gap-3 w-full p-3 text-sm rounded-lg transition duration-300 cursor-pointer md:hover:scale-120 md:active:scale-120
         ${
             selected
                 ? "bg-(--bg-hover) text-(--text-accent) font-bold"
                 : "hover:bg-(--bg-hover) hover:text-(--text-accent)"
         }`;

    return (
        <div className="relative flex-1" ref={containerRef}>
            <button
                onClick={() => setOpen(p => !p)}
                className="flex w-full items-center gap-3 rounded-xl p-3 border transition duration-300 cursor-pointer md:hover:scale-120 md:active:scale-120 border-(--border) bg-(--bg-card) text-(--text-accent)"
            >
                {selectedId && selectedCategory ? (
                    <RenderIcon
                        icon={selectedCategory.icon}
                        name={selectedCategory.name}
                        imageSize="h-5 w-5"
                        charSize="text-lg"
                        boxSize={15}
                    />
                ) : (
                    <Box size={15} className="text-(--text-muted)" />
                )}
                <span className="truncate font-bold">
                    {selectedId
                        ? selectedCategory?.name || translation.common.loading
                        : translation.common.allCategories}
                </span>
            </button>

            {/*dropdown list*/}
            {open && (
                <div className="absolute left-1/2 -translate-x-1/2 z-20 mt-3 w-52 rounded-xl p-3 bg-(--bg-base) border border-(--border) cyber-dropdown">
                    <div className="flex items-center justify-between mb-3 pb-1 border-b border-(--border)">
                        <span className="uppercase tracking-widest font-bold text-(--text-accent)">
                            {translation.record.category}
                        </span>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-(--text-wrong) hover:text-(--text-accent) cursor-pointer hover:scale-120 active:scale-120 transition duration-300"
                        >
                            <XCircle size={15} />
                        </button>
                    </div>

                    {/*all categories button*/}
                    {!disableAll && (
                        <button
                            onClick={() => {
                                onSelect(null);
                                setOpen(false);
                            }}
                            className={`group ${categorySelectedStyles(selectedId === null)}`}
                        >
                            <Box
                                size={15}
                                className={`group-hover:scale-120 group-hover:text-(--text-accent) group-active:scale-120 group-active:text-(--text-accent) transition duration-300 ${selectedId === null ? "text-(--text-accent)" : "text-(--text-primary)"}`}
                            />
                            <span>{translation.common.allCategories}</span>
                        </button>
                    )}

                    {/*categories list*/}
                    {loading ? (
                        <div className="flex justify-center py-3">
                            <LoaderCircle className="animate-spin text-(--text-accent)" size={18} />
                        </div>
                    ) : page?.content.length ? (
                        page.content.map(category => (
                            <button
                                key={category.id}
                                onClick={() => {
                                    onSelect(category.id);
                                    setOpen(false);
                                }}
                                className={categorySelectedStyles(selectedId === category.id)}
                            >
                                <div className="group w-5 flex justify-center">
                                    <RenderIcon
                                        icon={category.icon}
                                        name={category.name}
                                        imageSize="h-5 w-5"
                                        charSize="text-lg"
                                        boxSize={15}
                                        // className={`group-hover:scale-120 group-active:scale-120 ${selectedId ? "text-(--text-accent)" : "text-(--text-primary)"}`}
                                    />
                                </div>
                                <span className="truncate">{category.name}</span>
                            </button>
                        ))
                    ) : (
                        <div className="py-3 text-center text-(--text-accent)">{translation.common.noItems}</div>
                    )}

                    {/*pagination*/}
                    <div className="flex items-center justify-between mt-3 pt-1 border-t border-(--border)">
                        <button
                            disabled={!page || page.first || loading}
                            onClick={() => setPageIndex(p => p - 1)}
                            className="cursor-pointer active:scale-120 hover:scale-120 text-(--text-accent) transition duration-120 disabled:opacity-30 disabled:cursor-not-allowed disabled:text-(--text-muted)"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <span className="font-mono text-(--text-muted)">
                            {(page?.number ?? 0) + 1} / {page?.totalPages || 1}
                        </span>
                        <button
                            disabled={!page || page.last || loading}
                            onClick={() => setPageIndex(p => p + 1)}
                            className="cursor-pointer active:scale-120 hover:scale-120 text-(--text-accent) transition duration-120 disabled:opacity-30 disabled:cursor-not-allowed disabled:text-(--text-muted)"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
