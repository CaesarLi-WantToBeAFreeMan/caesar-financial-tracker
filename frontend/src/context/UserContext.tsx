import {createContext, useEffect, useState} from "react";
import type {ReactNode} from "react";
import axiosConfig from "../utilities/AxiosUtility";
import {API_ENDPOINTS} from "../utilities/apiEndpoint";

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    profileImage: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    clearUser: () => void;
    loading: boolean;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserContextProvider = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const clearUser = () => {
        localStorage.removeItem("token");
        setUser(null);
    };
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }
        axiosConfig
            .get(API_ENDPOINTS.GET_USER_INFO)
            .then(response => setUser(response.data))
            .catch(clearUser)
            .finally(() => setLoading(false));
    }, []);
    return <UserContext.Provider value={{user, setUser, clearUser, loading}}>{children}</UserContext.Provider>;
};
