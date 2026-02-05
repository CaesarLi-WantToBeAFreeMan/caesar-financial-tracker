interface Props {
    page: number;
    totalPages: number;
    onChange: (p: number) => void;
}

export default function Page({page, totalPages, onChange}: Props) {
    return (
        <div className="mt-5 flex items-center justify-center gap-3">
            <button
                disabled={page === 0}
                onClick={() => onChange(page - 1)}
                className="rounded-lg bg-cyan-500/20 px-4 py-2 text-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] hover:cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
                Prev
            </button>

            <span className="text-cyan-300 text-sm tracking-wide">
                {page + 1} / {totalPages}
            </span>

            <button
                disabled={page + 1 >= totalPages}
                onClick={() => onChange(page + 1)}
                className="rounded-lg bg-cyan-500/20 px-4 py-2 text-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] hover:cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
                Next
            </button>
        </div>
    );
}
