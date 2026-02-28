export type CategoryType = "all" | "income" | "expense";

export type CategoryOrder =
    | "NAME_ASCENDING"
    | "NAME_DESCENDING"
    | "CREATED_ASCENDING"
    | "CREATED_DESCENDING"
    | "UPDATED_ASCENDING"
    | "UPDATED_DESCENDING";

export interface CategoryFilter {
    type: CategoryType;
    order: CategoryOrder;
    size: number;
}

export interface CategoryData {
    id: number | null;
    name: string;
    icon: string;
    type: "income" | "expense";
    created_at: string | null;
    updated_at: string | null;
}

export interface CategoryPage {
    content: CategoryData[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
}
