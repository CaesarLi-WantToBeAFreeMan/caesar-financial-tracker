import axios from "axios";
import {BASE_URL} from "./apiEndpoint";

const axiosConfig = axios.create({
    baseURL: BASE_URL,
    headers: {"Content-Type": "application/json"},
    withCredentials: false,
    timeout: 32_000 //32 seconds
});

axiosConfig.interceptors.request.use(
    config => {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
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
            } else if (error.response.status === 500) console.log("Server error\nPlease try again later");
            else if (error.response.status === 503)
                console.log(
                    "Backend is waking up\n(please donate me to use paid server.·´¯`(>▂<)´¯`·. )\nPlease wait 30-60 seconds"
                );
        } else if (error.code === "ECONNABORTED")
            console.log("Request timeout (server might be starting up)\nPlease try again");
        else if (!error.response) console.log("Network error\n Please check your connecition and then try again");
        return Promise.reject(error);
    }
);

export default axiosConfig;
