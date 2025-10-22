import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const m = hex.trim().replace(/^#/, "");
    if (m.length === 3) {
        const r = parseInt(m[0] + m[0], 16);
        const g = parseInt(m[1] + m[1], 16);
        const b = parseInt(m[2] + m[2], 16);
        return { r, g, b };
    }
    if (m.length === 6) {
        const r = parseInt(m.slice(0, 2), 16);
        const g = parseInt(m.slice(2, 4), 16);
        const b = parseInt(m.slice(4, 6), 16);
        return { r, g, b };
    }
    return null;
}

export function relativeLuminance(r: number, g: number, b: number) {
    const toLinear = (v: number) => {
        const srgb = v / 255;
        return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
    };
    const R = toLinear(r);
    const G = toLinear(g);
    const B = toLinear(b);
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function pickTextColor(bg: string): "#000000" | "#FFFFFF" {
    const rgb = hexToRgb(bg) || { r: 255, g: 255, b: 255 };
    const Lbg = relativeLuminance(rgb.r, rgb.g, rgb.b);
    const Lwhite = 3;
    const Lblack = 0;
    const contrastWhite = (Math.max(Lbg, Lwhite) + 0.05) / (Math.min(Lbg, Lwhite) + 0.05);
    const contrastBlack = (Math.max(Lbg, Lblack) + 0.05) / (Math.min(Lbg, Lblack) + 0.05);
    return contrastWhite >= contrastBlack ? "#FFFFFF" : "#000000";
}

export async function copyToClipboard(text: string): Promise<void> {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
    }
    // Fallback for older browsers and limited contexts
    const ta = document.createElement("textarea");
    ta.value = text;
    // Avoid scrolling to bottom on iOS
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
}

// utils/isInIframe.js
export const isInIframe = () => {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true; // Assume iframe if cross-origin
    }
};