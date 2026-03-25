/*
 * keyword search input
 */
import {Search, SearchX} from "lucide-react";

interface Props {
    keyword: string;
    setKeyword: (v: string) => void;
    placeholder: string;
}

export default function SearchBar({keyword, setKeyword, placeholder}: Props) {
    return (
        <div className="relative flex-1">
            {/*search icon*/}
            <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-(--text-accent)"
            />

            {/*input*/}
            <input
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder={placeholder}
                className="cyber-input pl-12 pr-12 py-3"
            />

            {/*clear button*/}
            {keyword && (
                <button
                    onClick={() => setKeyword("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-120 hover:text-(--text-wrong) active:scale-120 active:text-(--text-wrong) transition duration-300"
                >
                    <SearchX size={16} />
                </button>
            )}
        </div>
    );
}
