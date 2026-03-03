import type {CategoryType} from "./CategoryTypes";

export type ChartMode = "area" | "bar" | "line" | "composed" | "pie" | "radar";

export type DivisionMode = "date" | "price" | "category" | "type";

export interface SummaryFilter {
    type: CategoryType;
    dateStart: string;
    dateEnd: string;
    priceLow: number;
    priceHigh: number | null;
    category: number | null;
    chartMode: ChartMode;
    divisionMode: DivisionMode;
}
