import {Box, LoaderCircle} from "lucide-react";
import React, {useState} from "react";

//validations
export function isIconImage(icon?: string | null): boolean {
    if (!icon) return false;
    return icon.startsWith("http") || icon.startsWith("https") || icon.startsWith("data:image");
}

//getters
export function getFirstChar(icon?: string | null): string {
    if (!icon) return "";
    return [...icon.trim()][0] || "";
}

//types
interface RenderIconVariableType {
    icon?: React.ReactNode;
    name: string;
    loaderSize?: number;
    imageSize?: string;
    charSize?: string;
    boxSize?: number;
    className?: string;
}

//renders
export function RenderIcon({
    icon,
    name = "icon",
    loaderSize = 23,
    imageSize = "h-5 w-5",
    charSize = "text-lg",
    boxSize = 23,
    className = ""
}: RenderIconVariableType) {
    const isImage = typeof icon === "string" && isIconImage(icon);
    const isLucide = React.isValidElement(icon);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    return (
        <div className={`flex items-center justify-center relative transition duration-300 ${className}`}>
            {isImage && !error ? (
                <div className="relative flex items-center justify-center">
                    {loading && (
                        <LoaderCircle size={loaderSize} className="absolute animate-spin text-(--text-accent) z-10" />
                    )}
                    <img
                        src={icon as string}
                        alt={name}
                        onLoad={() => setLoading(false)}
                        onError={() => {
                            setLoading(false);
                            setError(true);
                        }}
                        className={`${imageSize} object-contain transition duration-300 rounded-lg ${loading ? "opacity-0" : "opacity-100"}`}
                    />
                </div>
            ) : isLucide ? (
                React.cloneElement(icon as React.ReactElement<{size?: number; className?: string}>, {
                    size: boxSize,
                    className: "text-(--text-accent)"
                })
            ) : typeof icon === "string" && icon.trim().length > 0 ? (
                <span className={`${charSize} font-mono leading-none text-(--text-accent)`}>{getFirstChar(icon)}</span>
            ) : (
                <Box size={boxSize} className="text-(--text-accent)" />
            )}
        </div>
    );
}
