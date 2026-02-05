import {useState} from "react";
import type {CategoryType} from "../types/CategoryType";
import type {CategoryOrder} from "../types/CategoryOrder";

export function useCategory() {
    const [type, setType] = useState<CategoryType>("all");
    const [order, setOrder] = useState<CategoryOrder>("CREATED_DESCENDING");
    const [page, setPage] = useState<number>(0);
    const [size, setSize] = useState<number>(30);

    return {type, setType, order, setOrder, page, setPage, size, setSize};
}
