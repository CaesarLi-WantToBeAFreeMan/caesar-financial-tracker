import {BrowserRouter, Route, Routes} from "react-router-dom";
import "./app.css";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Filter from "./pages/Filter";
import Income from "./pages/Income";
import Expense from "./pages/Expense";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import {Toaster} from "react-hot-toast";

export default function App() {
    return (
        <>
            <Toaster />
            <BrowserRouter>
                <Routes>
                    <Route path="/dashboard" element={<Home />} />
                    <Route path="/category" element={<Category />} />
                    <Route path="/filter" element={<Filter />} />
                    <Route path="/income" element={<Income />} />
                    <Route path="/expense" element={<Expense />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}
