import axios from "axios";
import {BASE_URL} from "./apiEndpoint";

const axiosConfig = axios.create({
    baseURL: BASE_URL,
    headers: {"Content-Type": "application/json"},
    timeout: 32_000 //32 seconds
});

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
            if (error.response.status === 401) {
                localStorage.removeItem("token"); //clear invalid/expired token
                window.location.href = "/login";
            } else if (error.response.status === 500) alert("Server error\nPlease try again later");
            else if (error.response.status === 503)
                alert(
                    "Backend is waking up\n(please donate me to use paid server.·´¯`(>▂<)´¯`·. )\nPlease wait 30-60 seconds"
                );
        } else if (error.code === "ECONNABORTED")
            alert("Request timeout (server might be starting up)\nPlease try again");
        else if (!error.response) alert("Network error\n Please check your connecition and then try again");
        return Promise.reject(error);
    }
);

export default axiosConfig;
