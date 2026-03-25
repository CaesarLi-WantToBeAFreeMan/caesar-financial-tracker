import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import "./app.css";
import {Toaster} from "react-hot-toast";

import {ThemeProvider} from "./context/ThemeContext";
import {I18nProvider} from "./context/I18nContext";
import {SettingsProvider} from "./context/SettingsContext";
import {UserContextProvider} from "./context/UserContext";
import {storage} from "./utilities/storage";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Category from "./pages/Category";
import Record from "./pages/Record";
import Summary from "./pages/Summary";
import Settings from "./pages/Settings";

//redirect to /profile when logged in, otherwise to /home
function AuthRedirect() {
    return storage.get("token") ? <Navigate to="/profile" replace /> : <Navigate to="/login" replace />;
}

function ThemedToaster() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 3000,
                style: {
                    background: "var(--bg-base)",
                    color: "var(--text-accent)",
                    border: "1px solid var(--glow-purple)",
                    borderRadius: "12px",
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 0 20px var(--shadow)",
                    fontFamily: "monospace",
                    fontSize: "0.7rem"
                },
                success: {iconTheme: {primary: "var(--text-primary)", secondary: "var(--text-accent)"}},
                error: {
                    style: {
                        color: "#F87171",
                        border: "1px solid rgb(from var(--text-dim) r g b / 0.3)",
                        boxShadow: "0 0 16px rgb(from var(--text-dim) r g b / 0.1)"
                    },
                    iconTheme: {primary: "var(--text-dim)", secondary: "var(--text-heading)"}
                }
            }}
        />
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <I18nProvider>
                <SettingsProvider>
                    <UserContextProvider>
                        <ThemedToaster />
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
                                <Route path="/settings" element={<Settings />} />
                                <Route path="*" element={<Navigate to="/home" replace />} />
                            </Routes>
                        </BrowserRouter>
                    </UserContextProvider>
                </SettingsProvider>
            </I18nProvider>
        </ThemeProvider>
    );
}
