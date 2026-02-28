import type {CategoryType} from "./CategoryTypes";

export type RecordOrder =
    | "NAME_ASCENDING"
    | "NAME_DESCENDING"
    | "DATE_ASCENDING"
    | "DATE_DESCENDING"
    | "PRICE_ASCENDING"
    | "PRICE_DESCENDING"
    | "CREATED_ASCENDING"
    | "CREATED_DESCENDING"
    | "UPDATED_ASCENDING"
    | "UPDATED_DESCENDING";

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

export interface RecordData {
    id: number | null;
    name: string;
    type: "income" | "expense";
    icon: string;
    date: string;
    price: number;
    description: string;
    category_id: number | null;
    created_at: string | null;
    updated_at: string | null;
}

export interface RecordPage {
    content: RecordData[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
}
