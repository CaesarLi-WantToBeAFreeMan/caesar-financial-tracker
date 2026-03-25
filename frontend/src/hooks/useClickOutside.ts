/*
 * auto close dropdown list when the user click/touch outside
 */
import {type RefObject, useEffect, useCallback} from "react";

export function useClickOutside<T extends HTMLElement>(
    ref: RefObject<T | null>,
    callback: () => void,
    enabled = true
): void {
    const stableCallback = useCallback(callback, [callback]);

    useEffect(() => {
        if (!enabled) return;
        const handleClickOutside = (e: MouseEvent | TouchEvent) =>
            ref.current && !ref.current.contains(e.target as Node) && stableCallback();

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside, {passive: true}); //prevent scroll

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [ref, stableCallback, enabled]);
}
