import type {CategoryOrder} from "../types/CategoryOrder";
import type {CategoryType} from "../types/CategoryType";

interface Props {
    type: CategoryType;
    order: CategoryOrder;
    size: number;
    onTypeChange: (v: CategoryType) => void;
    onOrderChange: (v: CategoryOrder) => void;
    onSizeChange: (v: number) => void;
}

export default function CategoryFilterBar({type, order, size, onTypeChange, onOrderChange, onSizeChange}: Props) {
    return (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
                value={type}
                onChange={e => onTypeChange(e.target.value as CategoryType)}
                className="rounded-lg bg-black/40 border border-cyan-400/30 p-2 text-cyan-200"
            >
                <option value="all">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
            </select>

            <select
                value={order}
                onChange={e => onOrderChange(e.target.value as CategoryOrder)}
                className="rounded-lg bg-black/40 border border-cyan-400/30 p-2 text-cyan-200"
            >
                <option value="NAME_ASCENDING">Name ↑</option>
                <option value="NAME_DESCENDING">Name ↓</option>
                <option value="CREATED_ASCENDING">Created ↑</option>
                <option value="CREATED_DESCENDING">Created ↓</option>
                <option value="UPDATED_ASCENDING">Updated ↑</option>
                <option value="UPDATED_DESCENDING">Updated ↓</option>
            </select>

            <select
                value={size}
                onChange={e => onSizeChange(Number(e.target.value))}
                className="rounded-lg bg-black/40 border border-cyan-400/30 p-2 text-cyan-200"
            >
                {[10, 20, 30, 50, 100, 120].map((n: number) => (
                    <option key={n} value={n}>
                        {n} / page
                    </option>
                ))}
            </select>
        </div>
    );
}
