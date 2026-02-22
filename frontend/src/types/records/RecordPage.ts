import type {RecordData} from "./RecordData";

export interface RecordPage {
    content: RecordData[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
}
