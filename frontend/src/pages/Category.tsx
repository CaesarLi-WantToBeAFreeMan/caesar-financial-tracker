import Dashboard from "../components/Dashboard";
import {useUser} from "../hooks/useUser";

export default function Category() {
    useUser();
    return (
        <>
            <Dashboard activeRoute="Category">Category</Dashboard>
        </>
    );
}
