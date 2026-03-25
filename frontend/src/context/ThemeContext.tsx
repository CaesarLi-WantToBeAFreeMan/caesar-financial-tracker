/*
 * read stored theme
 * default is `dark`
 */
import {createContext, useContext, useEffect, useState, type ReactNode} from "react";
import {storage} from "../utilities/storage";

//context types
type Theme = "dark" | "light";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

//provider
export function ThemeProvider({children}: {children: ReactNode}) {
    const [theme, setTheme] = useState<Theme>(() => {
        return (storage.get("theme") as Theme | null) ?? "dark";
    });

    //add `dark`/`light` class to <html> tag to style entirely
    useEffect(() => {
        document.documentElement.classList.remove("dark", "light");
        document.documentElement.classList.add(theme);
        storage.set("theme", theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => (prev === "dark" ? "light" : "dark"));

    return (
        <ThemeContext.Provider value={{theme, toggleTheme, isDark: theme === "dark"}}>{children}</ThemeContext.Provider>
    );
}

//hook
export function useTheme(): ThemeContextType {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within ThemeProvider");
    return context;
}
