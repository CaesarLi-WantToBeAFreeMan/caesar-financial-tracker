import axios from "axios";
import {storage} from "./storage";
import toast from "react-hot-toast";
import {enUS} from "../i18n/en-US";
import {enUK} from "../i18n/en-UK";
import {zhTW} from "../i18n/zh-TW";
import {zhCN} from "../i18n/zh-CN";

const TRANSLATIONS = {"en-US": enUS, "en-UK": enUK, "zh-TW": zhTW, "zh-CN": zhCN};

const getError = () => {
    const locale = (storage.get("locale") ?? "en-US") as keyof typeof TRANSLATIONS;
    return TRANSLATIONS[locale]?.errors;
};

const axiosConfig = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {"Content-Type": "application/json"},
    withCredentials: false,
    timeout: 32_000
});

//request interceptor
//attach JWT token
axiosConfig.interceptors.request.use(
    config => {
        const token = storage.get("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    error => Promise.reject(error)
);

//response interceptor
//global error handling
axiosConfig.interceptors.response.use(
    response => response,
    error => {
        const errors = getError();
        if (error.response) {
            //session expired
            if (error.response.status === 401 || error.response.status === 403) {
                storage.remove("token");
                toast.error(errors?.unauthorized ?? "Session expired — please log in again.");
                setTimeout(() => (window.location.href = "/login"), 1500);
            }
        } else if (error.code === "ECONNABORTED")
            toast.error(error?.serverError ?? "Server error — please try again later.");
        else if (!error.response) toast.error(errors?.networkError ?? "Network error — check your connection.");
        return Promise.reject(error);
    }
);

export default axiosConfig;
