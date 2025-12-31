import axios from "axios";
import {BASE_URL} from "./apiEndpoint";

const axiosConfig = axios.create({baseURL: BASE_URL, headers: {"Content-Type": "application/json"}});

const unauthorizedEndpoints = ["/register", "/login"];

axiosConfig.interceptors.request.use(
    config => {
        const isUnauthorizedEndpoint = unauthorizedEndpoints.some(endpoint => config.url?.includes(endpoint));
        if (!isUnauthorizedEndpoint) {
            const accessToken = localStorage.getItem("token");
            if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

axiosConfig.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            if (error.response.status === 401) window.location.href = "/login";
            else if (error.response.status === 500) alert("Server error\nPlease try again later");
        } else if (error.code === "ECONNABORTED") alert("Request timeout\nPlease try again");
        return Promise.reject(error);
    }
);

export default axiosConfig;
