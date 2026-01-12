import Dashboard from "../components/Dashboard";
import {useUser} from "../hooks/useUser";

export default function Income() {
    useUser();
    return (
        <>
            <Dashboard activeRoute="Income">Income</Dashboard>
        </>
    );
}
