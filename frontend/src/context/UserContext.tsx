import {createContext, useState} from "react";
import type {ReactNode} from "react";

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
}

export const UserContext = createContext<UserContextType | null>(null);
export const UserContextProvider = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    return <UserContext.Provider value={{user, setUser}}>{children}</UserContext.Provider>;
};
