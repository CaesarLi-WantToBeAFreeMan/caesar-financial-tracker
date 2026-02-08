export function isIconImage(icon?: string | null): boolean {
    if (!icon) return false;
    return (
        icon.startsWith("http") ||
        icon.startsWith("https") || //remote icons
        icon.startsWith("data:image") //local icons
    );
}

export function getFirstChar(icon?: string | null): string {
    if (!icon) return "";
    return [...icon.trim()].slice(0, 1).join("");
}
