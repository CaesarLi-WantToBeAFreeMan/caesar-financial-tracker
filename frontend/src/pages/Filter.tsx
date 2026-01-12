import Dashboard from "../components/Dashboard";
import {useUser} from "../hooks/useUser";

export default function Filter() {
    useUser();
    return (
        <>
            <Dashboard activeRoute="Filters">Filter</Dashboard>
        </>
    );
}
