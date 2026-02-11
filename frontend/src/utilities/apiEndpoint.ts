export const BASE_URL = "http://localhost:1989/api/alpha.1.0";

const profile = "/profiles";
const category = "/categories";
const income = "/incomes";
const expense = "/expenses";

export const API_ENDPOINTS = {
    //profiles
    REGISTER: `${profile}/register`,
    LOGIN: `${profile}/login`,
    READ_PROFILE: `${profile}`,

    //categories
    CREATE_CATEGORY: `${category}`,
    READ_CATEGORIES: `${category}`,
    UPDATE_CATEGORY: `${category}/{id}`,
    DELETE_CATEGORY: `${category}/{id}`,
    IMPORT_CATEGORIES: `${category}/import`,
    EXPORT_CATEGORIES: `${category}/export/{type}`,

    //incomes
    CREATE_INCOME: `${income}`,
    READ_INCOMES: `${income}`,
    UPDATE_INCOME: `${income}/{id}`,
    DELETE_INCOME: `${income}/{id}`,
    IMPORT_INCOMES: `${income}/import`,
    EXPORT_INCOMES: `${income}/export/{type}`,

    //expenses
    CREATE_EXPENSE: `${expense}`,
    READ_EXPENSES: `${expense}`,
    UPDATE_EXPENSE: `${expense}/{id}`,
    DELETE_EXPENSE: `${expense}/{id}`,
    IMPORT_EXPENSES: `${expense}/import`,
    EXPORT_EXPENSES: `${expense}/export/{type}`
};
