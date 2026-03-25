/*
 * store the currently authenticated user
 */
import {createContext, useContext, useEffect, useState, type ReactNode} from "react";
import {storage} from "../utilities/storage";
import {profileApi} from "../utilities/api";

//context types
export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    profileImage: string | null;
}

export interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    clearUser: () => void;
}

export const UserContext = createContext<UserContextType | null>(null);

//provider
export const UserContextProvider = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const clearUser = () => {
        storage.remove("token");
        setUser(null);
    };
    useEffect(() => {
        const token = storage.get("token");
        if (!token) return;
        const fetchProfile = async () => await profileApi.read(setUser, clearUser);
        fetchProfile();
    }, []);
    return <UserContext.Provider value={{user, setUser, clearUser}}>{children}</UserContext.Provider>;
};

//hook
export function useUser(): UserContextType {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within UserContextProvider");
    return context;
}
