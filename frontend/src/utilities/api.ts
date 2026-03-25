/*
 * axios request + toast error handling
 */

import axiosConfig from "./AxiosUtility";
import {API_ENDPOINTS} from "./apiEndpoint";
import type {CategoryData, CategoryFilter, CategoryPage} from "../types/CategoryTypes";
import type {RecordData, RecordFilter, RecordPage} from "../types/RecordTypes";
import toast from "react-hot-toast";
import {storage} from "./storage";
import type {NavigateFunction} from "react-router-dom";
import type {User} from "../context/UserContext";
import type {SummaryFilter} from "../types/SummaryTypes.ts";
import type {ImportResponse} from "../types/ImportResponse.tsx";

//types
//authentication
type NavigateUserType = {navigate: NavigateFunction; setUser: (user: User) => void};
type NavigateType = {navigate: NavigateFunction};

//apis
//authentication
export const authentication = {
    login: async (
        email: string,
        password: string,
        {navigate, setUser}: NavigateUserType,
        messages: {success: string; failed: string}
    ) => {
        try {
            const {data} = await axiosConfig.post(API_ENDPOINTS.LOGIN, {email, password});
            const {token, ...user} = data;
            if (token && user.id) {
                storage.set("token", token);
                setUser({
                    id: user.id,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    email: user.email,
                    profileImage: user.profile_image ?? null
                });
            }
            toast.success(messages.success);
            navigate("/profile");
        } catch (e: any) {
            toast.error(e?.response?.data?.message || messages.failed);
        }
    },

    register: async (
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        {navigate}: NavigateType,
        messages: {success: string; failed: string}
    ) => {
        try {
            const {status} = await axiosConfig.post(API_ENDPOINTS.REGISTER, {
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: password
            });
            if (status === 201) {
                toast.success(messages.success);
                navigate("/login");
            }
        } catch (e: any) {
            toast.error(e?.response?.data?.message || messages.failed);
        }
    }
};

//profile
export const profileApi = {
    read: async (setUser: (user: User) => void, clearUser: () => void) => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.READ_PROFILE);
            setUser({
                id: response.data.id,
                firstName: response.data.first_name,
                lastName: response.data.last_name,
                email: response.data.email,
                profileImage: response.data.profile_image ?? null
            });
        } catch (e: any) {
            clearUser();
        }
    },

    update: async (
        user: User,
        password: string,
        setUser: (user: User) => void,
        messages: {success: string; failed: string}
    ) => {
        try {
            await axiosConfig.put(API_ENDPOINTS.UPDATE_PROFILE, {
                first_name: user.firstName,
                last_name: user.lastName,
                email: user.email,
                password: password || null,
                profile_image: user.profileImage
            });
            setUser({...user, profileImage: user.profileImage ?? null});
            toast.success(messages.success);
        } catch (error: any) {
            toast.error(error?.response?.data?.message ?? messages.failed);
        }
    }
};

//categories
export const categoryApi = {
    create: async (category: CategoryData, messages: {success: string; failed: string}) => {
        try {
            await axiosConfig.post(API_ENDPOINTS.CREATE_CATEGORY, category);
            toast.success(messages.success);
        } catch (e: any) {
            toast.error(e?.response?.data?.message || messages.failed);
        }
    },

    read: async (
        filter: CategoryFilter,
        keyword: string,
        pageIndex: number,
        setPage: (page: CategoryPage) => void,
        failedMessage: string
    ) => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.READ_CATEGORIES, {
                params: {
                    type: filter.type === "all" ? null : filter.type,
                    keyword: keyword.trim() || null,
                    order: filter.order,
                    page: pageIndex,
                    size: filter.size
                }
            });
            setPage({
                content: response.data.content,
                totalElements: response.data.total_elements,
                totalPages: response.data.total_pages,
                number: response.data.number,
                size: response.data.size,
                first: response.data.first,
                last: response.data.last
            });
        } catch (e: any) {
            toast.error(e?.response?.data?.message || failedMessage);
        }
    },

    fetch: async (id: number | null, setCategory: (response: CategoryData | null) => void, failedMessage: string) => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.FETCH_CATEGORY.replace("{id}", String(id)));
            setCategory(response.data);
        } catch (e: any) {
            toast.error(e?.response?.data?.message || failedMessage);
        }
    },

    update: async (category: CategoryData, messages: {success: string; failed: string}) => {
        try {
            await axiosConfig.put(API_ENDPOINTS.UPDATE_CATEGORY.replace("{id}", String(category.id)), category);
            toast.success(messages.success);
        } catch (e: any) {
            toast.error(e?.response?.data?.message || messages.failed);
        }
    },

    delete: async (id: number, messages: {success: string; failed: string}) => {
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_CATEGORY.replace("{id}", String(id)));
            toast.success(messages.success);
        } catch (e: any) {
            toast.error(e?.response?.data?.message || messages.failed);
        }
    },

    import: async (
        file: FormData,
        setResult: (response: ImportResponse | null) => void,
        setShowErrors: (showErrors: boolean) => void,
        onClose: () => void,
        messages: {success: string; failed: string}
    ) => {
        try {
            const response = await axiosConfig.post<ImportResponse>(API_ENDPOINTS.IMPORT_CATEGORIES, file, {
                headers: {"Content-Type": "multipart/form-data"}
            });
            setResult(response.data);
            if (response.data.failed > 0) setShowErrors(true);
            else {
                toast.success(messages.success.replace("$", String(response.data.success)));
                onClose();
            }
        } catch (e: any) {
            toast.error(e?.response?.data?.message || messages.failed);
        }
    },

    exportFile: (type: string) =>
        axiosConfig
            .get(API_ENDPOINTS.EXPORT_CATEGORIES.replace("{type}", type), {responseType: "blob"})
            .then(r => r.data)
};

//records
export const recordApi = {
    create: async (record: RecordData, messages: {success: string; failed: string}) => {
        try {
            await axiosConfig.post(API_ENDPOINTS.CREATE_RECORD, {
                name: record.name,
                type: record.type,
                icon: record.icon,
                price: record.price,
                description: record.description || record.name,
                category_id: record.category_id
            });
            toast.success(messages.success);
        } catch (e: any) {
            toast.error(messages.failed);
        }
    },

    read: async (
        filter: RecordFilter,
        keyword: string,
        pageIndex: number,
        setPage: (page: RecordPage) => void,
        failedMessage: string
    ) => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.READ_RECORDS, {
                params: {
                    type: filter.type === "all" ? null : filter.type,
                    order: filter.order,
                    size: filter.size,
                    dateStart: filter.dateStart,
                    dateEnd: filter.dateEnd,
                    priceLow: filter.priceLow,
                    priceHigh: filter.priceHigh,
                    keyword: keyword || null,
                    categoryId: filter.categoryId,
                    page: pageIndex
                }
            });
            setPage({
                content: response.data.content,
                totalElements: response.data.total_elements,
                totalPages: response.data.total_pages,
                number: response.data.number,
                size: response.data.size,
                first: response.data.first,
                last: response.data.last
            });
        } catch (e: any) {
            toast.error(e?.response?.data?.message || failedMessage);
        }
    },

    readAll: async (
        filter: SummaryFilter,
        keyword: string,
        setRecords: (records: any) => void,
        failedMessage: string
    ) => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.READ_ALL_RECORDS, {
                params: {
                    type: filter.type === "all" ? null : filter.type,
                    dateStart: filter.dateStart,
                    dateEnd: filter.dateEnd,
                    priceLow: filter.priceLow,
                    priceHigh: filter.priceHigh,
                    categories: filter.category,
                    keyword: keyword || null
                }
            });
            setRecords(response.data);
        } catch (e: any) {
            toast.error(e?.response?.data?.message || failedMessage);
        }
    },

    update: async (record: RecordData, messages: {success: string; failed: string}) => {
        try {
            await axiosConfig.put(API_ENDPOINTS.UPDATE_RECORD.replace("{id}", String(record.id)), record);
            toast.success(messages.success);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || messages.failed);
        }
    },

    delete: async (id: number, messages: {success: string; failed: string}) => {
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_RECORD.replace("{id}", String(id)));
            toast.success(messages.success);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || messages.failed);
        }
    },

    import: async (
        file: FormData,
        setResult: (response: ImportResponse | null) => void,
        setShowErrors: (showErrors: boolean) => void,
        onClose: () => void,
        messages: {success: string; failed: string}
    ) => {
        try {
            const response = await axiosConfig.post<ImportResponse>(API_ENDPOINTS.IMPORT_RECORDS, file, {
                headers: {"Content-Type": "multipart/form-data"}
            });
            setResult(response.data);
            if (response.data.failed > 0) setShowErrors(true);
            else {
                toast.success(messages.success.replace("$", String(response.data.success)));
                onClose();
            }
        } catch (e: any) {
            toast.error(e?.response?.data?.message || messages.failed);
        }
    },

    exportFile: (type: string) =>
        axiosConfig.get(API_ENDPOINTS.EXPORT_RECORDS.replace("{type}", type), {responseType: "blob"}).then(r => r.data)
};
