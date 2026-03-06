import axios from "axios";

const axiosConfig = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {"Content-Type": "application/json"},
    withCredentials: false,
    timeout: 32_000
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
                localStorage.removeItem("token");
                window.location.href = "/login";
            }
        } else if (error.code === "ECONNABORTED") console.error("Request timeout — server may be starting up");
        else if (!error.response) console.error("Network error — check your connection");
        return Promise.reject(error);
    }
);

export default axiosConfig;
