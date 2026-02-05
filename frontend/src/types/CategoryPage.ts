import type {CategoryData} from "./CategoryData";

export interface CategoryPage {
    content: CategoryData[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
}
