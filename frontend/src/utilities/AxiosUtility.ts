import axios from "axios";

const api = axios.create({
    baseURL: "https://caesar-financial-tracker-backend.onrender.com/api/alpha.1.0",
    headers: {"Content-Type": "application/json", Accept: "application/json"}
});

const unauthorizedEndpoints = ["/register", "/login"];

api.interceptors.request.use(
    config => {
        const isUnauthorizedEndpoint: boolean = unauthorizedEndpoints.some((endpoint: string) =>
            config.url?.includes(endpoint)
        );
        if (!isUnauthorizedEndpoint) {
            const accessToken = localStorage.getItem("token");
            if (accessToken) config.headers.Authorization = `Bearer #{accessToken}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            if (error.response.status === 401) window.location.href = "/login";
            else if (error.response.status === 500) alert("Server error\nPlease try again later");
        } else if (error.code === "ECONNABORTED") alert("Request timeout\nPlease try again");
        return Promise.reject(error);
    }
);
