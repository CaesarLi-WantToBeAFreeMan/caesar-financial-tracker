import Dashboard from "../components/Dashboard";
import {useUser} from "../hooks/useUser";

export default function Home() {
    useUser();
    return (
        <>
            <Dashboard activeRoute="Dashboard">Home</Dashboard>
        </>
    );
}
