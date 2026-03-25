/**
 * `true` if the device is desktop/laptop
 * `false` if the device is mobile phones/tablets
 */
import {useMemo} from "react";

export function useHoverSupport(): boolean {
    return useMemo(() => {
        //assume a non-browser environment supports hover
        if (typeof window === "undefined" || !window.matchMedia) return true;
        //`true` on mouse devices
        //`false` on touchscreens
        return window.matchMedia("(hover: hover)").matches;
    }, []);
}
