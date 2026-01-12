import Dashboard from "../components/Dashboard";
import {useUser} from "../hooks/useUser";

export default function Expense() {
    useUser();
    return (
        <>
            <Dashboard activeRoute="Expense">Expense</Dashboard>
        </>
    );
}
