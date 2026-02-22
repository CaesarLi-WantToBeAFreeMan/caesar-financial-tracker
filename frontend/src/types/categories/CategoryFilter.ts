import type {CategoryOrder} from "../CategoryOrder";
import type {CategoryType} from "../CategoryType";

export interface CategoryFilter {
    type: CategoryType;
    order: CategoryOrder;
    size: number;
}
