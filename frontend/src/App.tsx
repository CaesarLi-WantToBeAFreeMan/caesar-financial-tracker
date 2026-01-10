import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import "./app.css";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Filter from "./pages/Filter";
import Income from "./pages/Income";
import Expense from "./pages/Expense";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import {Toaster} from "react-hot-toast";
import {UserContextProvider} from "./context/UserContext";
import Settings from "./pages/Settings";

export default function App() {
    return (
        <>
            <Toaster />
            <UserContextProvider>
                <BrowserRouter>
                    <Routes>
                        {/*redirect to login*/}
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="/dashboard" element={<Home />} />
                        <Route path="/category" element={<Category />} />
                        <Route path="/filter" element={<Filter />} />
                        <Route path="/income" element={<Income />} />
                        <Route path="/expense" element={<Expense />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/settings" element={<Settings />} />
                        {/*catch-all for unknown routes*/}
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                </BrowserRouter>
            </UserContextProvider>
        </>
    );
}
