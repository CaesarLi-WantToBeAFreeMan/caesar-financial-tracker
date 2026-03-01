import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import "./app.css";
import Category from "./pages/Category";
import Summary from "./pages/Summary";
import Record from "./pages/Record";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import {Toaster} from "react-hot-toast";
import {UserContextProvider} from "./context/UserContext";
import Profile from "./pages/Profile";

export default function App() {
    const Root = () => {
        const isAuthenticated = !!localStorage.getItem("token");
        return isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
    };
    return (
        <>
            <Toaster />
            <UserContextProvider>
                <BrowserRouter>
                    <Routes>
                        {/*redirect to login*/}
                        <Route path="/" element={<Root />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/category" element={<Category />} />
                        <Route path="/summary" element={<Summary />} />
                        <Route path="/record" element={<Record />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                </BrowserRouter>
            </UserContextProvider>
        </>
    );
}
