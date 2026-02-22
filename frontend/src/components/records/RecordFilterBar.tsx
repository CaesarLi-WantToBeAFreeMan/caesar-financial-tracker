import DatePicker from "../common/DatePicker";
import type {RecordFilter} from "../../types/records/RecordFilter";
import type {CategoryType} from "../../types/CategoryType";
import type {RecordOrder} from "../../types/records/RecordOrder";
import PricePicker from "../common/PricePicker";
import CategoryPicker from "../common/CategoryPicker";

interface Props {
    filter: RecordFilter;
    onChange: <K extends keyof RecordFilter>(key: K, value: RecordFilter[K]) => void;
}

export default function RecordFilterBar({filter, onChange}: Props) {
    const {type, order, size, dateStart, dateEnd, priceLow, priceHigh, categoryId} = filter;

    return (
        <div className="mb-6 rounded-xl border border-cyan-400/20 bg-black/40 p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <select
                    value={type}
                    onChange={e => onChange("type", e.target.value as CategoryType)}
                    className="rounded-lg bg-black/40 border border-cyan-400/30 p-3 text-cyan-200"
                >
                    <option value="all">All</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>

                <select
                    value={order}
                    onChange={e => onChange("order", e.target.value as RecordOrder)}
                    className="rounded-lg bg-black/40 border border-cyan-400/30 p-3 text-cyan-200"
                >
                    <option value="NAME_ASCENDING">Name ↑</option>
                    <option value="NAME_DESCENDING">Name ↓</option>
                    <option value="DATE_ASCENDING">Date ↑</option>
                    <option value="DATE_DESCENDING">Date ↓</option>
                    <option value="PRICE_ASCENDING">Price ↑</option>
                    <option value="PRICE_DESCENDING">Price ↓</option>
                    <option value="CREATED_ASCENDING">Created ↑</option>
                    <option value="CREATED_DESCENDING">Created ↓</option>
                    <option value="UPDATED_ASCENDING">Updated ↑</option>
                    <option value="UPDATED_DESCENDING">Updated ↓</option>
                </select>

                <select
                    value={size}
                    onChange={e => onChange("size", Number(e.target.value))}
                    className="rounded-lg bg-black/40 border border-cyan-400/30 p-3 text-cyan-200"
                >
                    {[10, 20, 30, 50, 100].map(n => (
                        <option key={n} value={n}>
                            {n} / page
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col md:flex-row items-stretch gap-3">
                <div className="flex items-center gap-3">
                    <DatePicker value={dateStart} onChange={v => onChange("dateStart", v)} maxDate={dateEnd} />
                    <span className="text-cyan-400/60">–</span>
                    <DatePicker value={dateEnd} onChange={v => onChange("dateEnd", v)} minDate={dateStart} />
                </div>

                <CategoryPicker selectedId={categoryId} type={type} onSelect={id => onChange("categoryId", id)} />

                <div className="flex items-center gap-3">
                    <PricePicker value={priceLow} onChange={v => onChange("priceLow", v || 0)} maxPrice={priceHigh} />
                    <span className="text-cyan-400/60">–</span>
                    <PricePicker value={priceHigh} onChange={v => onChange("priceHigh", v)} minPrice={priceLow} />
                </div>
            </div>
        </div>
    );
}
