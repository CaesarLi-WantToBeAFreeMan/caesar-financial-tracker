export const BASE_URL = "http://localhost:1989/api/alpha.1.0";

const profile = "/profiles";
const category = "/categories";
const record = "/records";

export const API_ENDPOINTS = {
    //profiles
    REGISTER: `${profile}/register`,
    LOGIN: `${profile}/login`,
    READ_PROFILE: `${profile}`,

    //categories
    CREATE_CATEGORY: `${category}`,
    READ_CATEGORIES: `${category}`,
    FETCH_CATEGORY: `${category}/{id}`,
    UPDATE_CATEGORY: `${category}/{id}`,
    DELETE_CATEGORY: `${category}/{id}`,
    IMPORT_CATEGORIES: `${category}/import`,
    EXPORT_CATEGORIES: `${category}/export/{type}`,

    //records
    CREATE_RECORD: `${record}`,
    READ_RECORDS: `${record}`,
    UPDATE_RECORD: `${record}/{id}`,
    DELETE_RECORD: `${record}/{id}`,
    IMPORT_RECORDS: `${record}/import`,
    EXPORT_RECORDS: `${record}/export/{type}`
};
