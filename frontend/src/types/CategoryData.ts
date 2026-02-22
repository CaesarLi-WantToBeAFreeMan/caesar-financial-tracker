export interface CategoryData {
    id: number | null;
    name: string;
    icon: string;
    type: "income" | "expense";
    created_at: string | null;
    updated_at: string | null;
}
