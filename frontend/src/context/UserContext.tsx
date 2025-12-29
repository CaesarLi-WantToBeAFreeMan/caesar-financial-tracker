import {createContext, useState} from "react";
import type {ReactNode} from "react";

export interface UserContextType {
    user: any | null;
    setUser: React.Dispatch<React.SetStateAction<any | null>>;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserContextProvider = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState<any | null>(null);
    const contextValue: UserContextType = {user, setUser};
    return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};
