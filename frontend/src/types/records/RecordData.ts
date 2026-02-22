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
