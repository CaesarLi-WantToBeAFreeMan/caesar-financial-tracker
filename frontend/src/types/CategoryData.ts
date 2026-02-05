export interface CategoryData {
    id: number | null;
    name: string;
    icon: string;
    type: "income" | "expense";
    createdAt: string | null;
    updatedAt: string | null;
}
