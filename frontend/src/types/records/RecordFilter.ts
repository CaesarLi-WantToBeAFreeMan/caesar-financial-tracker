import type {CategoryType} from "../CategoryType";
import type {RecordOrder} from "./RecordOrder";

export interface RecordFilter {
    type: CategoryType;
    order: RecordOrder;
    size: number;
    dateStart: string;
    dateEnd: string;
    priceLow: number;
    priceHigh: number | null;
    categoryId: number | null;
}
