import {useContext, useEffect} from "react";
import {UserContext} from "../context/UserContext";
import {API_ENDPOINTS} from "../utilities/apiEndpoint";
import axiosConfig from "../utilities/AxiosUtility";
import toast from "react-hot-toast";

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within UserContextProvider");
    const {user, setUser} = context;

    useEffect(() => {
        if (user) return;
        const readUser = async () => {
            try {
                const {data} = await axiosConfig.get(API_ENDPOINTS.READ_PROFILE);
                setUser({
                    id: data.id,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    email: data.email,
                    profileImage: data.profileImage ?? null
                });
            } catch (error: any) {
                toast.error(error?.message || "read profile info failed");
            }
        };
        readUser();
    }, [user, setUser]);
};
