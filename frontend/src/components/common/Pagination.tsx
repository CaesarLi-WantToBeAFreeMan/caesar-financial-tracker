/*
 * display previous and next buttons and page indicator
 */
interface Props {
    page: number;
    totalPages: number;
    onChange: (p: number) => void;
    prevLabel?: string;
    nextLabel?: string;
}

export default function Pagination({page, totalPages, onChange, prevLabel = "Prev", nextLabel = "Next"}: Props) {
    const btnBase = `px-3 py-2 rounded-xl font-bold transition duration-300 cursor-pointer hover:scale-120 active:scale-120 border border-(--border) bg-(--bg-surface) text-(--text-accent) hover:border-(--border-glow) hover:shadow-(--glow-cyan) disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:scale-100`;

    return (
        <div className="mt-5 flex items-center justify-center gap-3">
            <button disabled={page === 0} onClick={() => onChange(page - 1)} className={btnBase}>
                {prevLabel}
            </button>

            <span className="font-mono text-(--text-dim)">
                {totalPages === 0 ? 0 : page + 1} / {totalPages}
            </span>

            <button disabled={page + 1 >= totalPages} onClick={() => onChange(page + 1)} className={btnBase}>
                {nextLabel}
            </button>
        </div>
    );
}
