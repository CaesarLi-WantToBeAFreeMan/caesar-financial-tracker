import {createRoot} from "react-dom/client";
import App from "./App.tsx";
import {UserContextProvider} from "./context/UserContext.tsx";
import React from "react";

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <UserContextProvider>
            <App />
        </UserContextProvider>
    </React.StrictMode>
);
