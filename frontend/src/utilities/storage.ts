export const storage = {
    set(key: string, value: string): boolean {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch {
            return false;
        }
    },

    get(key: string): string | null {
        try {
            return localStorage.getItem(key);
        } catch {
            return null;
        }
    },

    remove(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch {}
    },

    saveFile(url: string, name: string, type: string): void {
        try {
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = `${name}.${type}`;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            window.URL.revokeObjectURL(url);
        } catch {}
    }
};
