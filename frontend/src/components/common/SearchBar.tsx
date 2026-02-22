import {Search, SearchX} from "lucide-react";

interface Props {
    keyword: string;
    setKeyword: (keyword: string) => void;
    placeholder: string;
}

export default function SearchBar({keyword, setKeyword, placeholder}: Props) {
    return (
        <div className="mt-3-flex items-center gap-3 mb-3">
            <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
                <input
                    value={keyword}
                    onChange={k => setKeyword(k.target.value)}
                    placeholder={placeholder}
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
    );
}
