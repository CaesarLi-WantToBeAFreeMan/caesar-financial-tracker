import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import "./app.css";
import {Toaster} from "react-hot-toast";

import {ThemeProvider} from "./context/ThemeContext";
import {I18nProvider} from "./context/I18nContext";
import {SettingsProvider} from "./context/SettingsContext";
import {UserContextProvider} from "./context/UserContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Category from "./pages/Category";
import Record from "./pages/Record";
import Summary from "./pages/Summary";
import Settings from "./pages/Settings";

function AuthRedirect() {
    return !!localStorage.getItem("token") ? <Navigate to="/profile" replace /> : <Navigate to="/home" replace />;
}

export default function App() {
    return (
        <ThemeProvider>
            <I18nProvider>
                <SettingsProvider>
                    <UserContextProvider>
                        <Toaster
                            position="top-right"
                            toastOptions={{
                                duration: 3000,
                                style: {
                                    background: "rgba(10,0,31,0.95)",
                                    color: "#22d3ee",
                                    border: "1px solid rgba(34,211,238,0.4)",
                                    borderRadius: "12px",
                                    backdropFilter: "blur(12px)",
                                    boxShadow: "0 0 20px rgba(34,211,238,0.3)",
                                    fontFamily: "monospace",
                                    fontSize: "0.875rem"
                                },
                                success: {iconTheme: {primary: "#22d3ee", secondary: "#0a001f"}},
                                error: {
                                    style: {
                                        color: "#f87171",
                                        border: "1px solid rgba(248,113,113,0.4)",
                                        boxShadow: "0 0 20px rgba(248,113,113,0.2)"
                                    },
                                    iconTheme: {primary: "#f87171", secondary: "#0a001f"}
                                }
                            }}
                        />
                        <BrowserRouter>
                            <Routes>
                                <Route path="/" element={<AuthRedirect />} />
                                <Route path="/home" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<Signup />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/category" element={<Category />} />
                                <Route path="/record" element={<Record />} />
                                <Route path="/summary" element={<Summary />} />
                                {/* <Route path="/settings" element={<Settings />} /> */}
                                <Route path="*" element={<Navigate to="/home" replace />} />
                            </Routes>
                        </BrowserRouter>
                    </UserContextProvider>
                </SettingsProvider>
            </I18nProvider>
        </ThemeProvider>
    );
}
