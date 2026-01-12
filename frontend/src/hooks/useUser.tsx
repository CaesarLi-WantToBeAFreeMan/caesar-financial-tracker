import {useContext, useEffect} from "react";
import {UserContext} from "../context/UserContext";
import {API_ENDPOINTS} from "../utilities/apiEndpoint";
import axiosConfig from "../utilities/AxiosUtility";

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within UserContextProvider");
    const {user, setUser} = context;
    useEffect(() => {
        if (user) return;
        axiosConfig
            .get(API_ENDPOINTS.GET_USER_INFO)
            .then(response => {
                setUser({
                    id: response.data.is,
                    firstName: response.data.first_name,
                    lastName: response.data.last_name,
                    email: response.data.email,
                    profileImage: response.data.profile_image ?? null,
                    createdAt: response.data.created_at,
                    updatedAt: response.data.updated_at
                });
            })
            .catch(() => {});
    }, [user, setUser]);
};
