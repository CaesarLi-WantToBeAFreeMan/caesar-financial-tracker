import {Box, LoaderCircle} from "lucide-react";
import {useState} from "react";

export function isIconImage(icon?: string | null): boolean {
    if (!icon) return false;
    return icon.startsWith("http") || icon.startsWith("https") || icon.startsWith("data:image");
}

export function getFirstChar(icon?: string | null): string {
    if (!icon) return "";
    return [...icon.trim()][0] || "";
}

interface RenderIconVariableType {
    icon?: string | null;
    name: string;
    loaderSize?: number;
    imageSize?: string;
    charSize?: string;
    boxSize?: number;
    className?: string;
}

export function RenderIcon({
    icon,
    name,
    loaderSize = 23,
    imageSize = "h-5 w-5",
    charSize = "text-lg",
    boxSize = 23,
    className = ""
}: RenderIconVariableType) {
    const [loading, setLoading] = useState(isIconImage(icon));
    const [error, setError] = useState(false);

    return (
        <div className={`flex items-center justify-center transition duration-300 ${className}`}>
            {loading && <LoaderCircle size={loaderSize} className="animate-spin text-cyan-400" />}
            {error && <Box size={boxSize} className="text-cyan-400" />}
            {icon ? (
                isIconImage(icon) ? (
                    <img
                        src={icon}
                        alt={name}
                        onLoad={() => setLoading(false)}
                        onError={() => {
                            setLoading(false);
                            setError(true);
                        }}
                        className={`${imageSize} object-contain transition duration-300 rounded-lg`}
                    />
                ) : (
                    <span className={`${charSize} font-mono leading-none text-cyan-400`}>{getFirstChar(icon)}</span>
                )
            ) : (
                <Box size={boxSize} className="text-cyan-400" />
            )}
        </div>
    );
}
