import { colord } from 'colord';

/**
 * Derives a full shadcn OKLCH color palette from a single HEX input.
 * Includes dynamic handling for black/white/gray inputs and ensures proper
 * contrast for the primary-foreground text color (light text on dark buttons).
 *
 * @param hex A user-provided HEX color string (e.g., "#1877F2").
 * @returns An object of CSS variable names and their OKLCH values (L C H).
 */
export function generateThemeVariables(hex: string): Record<string, string> {
    const baseColord = colord(hex);

    // 1. Get HSL values for analysis
    const { h: hslHue, s: hslSaturation, l: hslLuminosity } = baseColord.toHsl();

    // --- ACHROMATIC & BLACK/WHITE FIX ---
    // A color is achromatic (gray/black/white) if its HSL saturation is very low (< 5%).
    const isAchromatic = hslSaturation < 5;

    // Determine the base hue: 0 for neutrals (to prevent tint), or the color's actual hue.
    const baseHue = isAchromatic ? 0 : hslHue;
    const shouldBeAchromatic = isAchromatic;

    // Helper to format OKLCH values for CSS variables: "L C H"
    const formatOklch = (l: number, c: number, h: number) =>
        `${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(1)}`;

    // --- Luminosity Management for Neutrals ---
    // This factor subtly shifts the L of neutral colors.
    // Factor is zero if the input is achromatic, preventing drift.
    const L_norm = hslLuminosity / 100;
    const factorDirection = L_norm > 0.5 ? -1 : 1; // Light primary -> darken neutrals
    const factorMagnitude = Math.abs(L_norm - 0.5) * 0.04;
    const luminosityFactor = shouldBeAchromatic ? 0 : factorDirection * factorMagnitude;

    // Helper function to apply the luminosity factor to a neutral L value, ensuring bounds
    const adjustL = (l: number) => Math.max(0.05, Math.min(1.0, l + luminosityFactor));

    // --- OKLCH Core Constants ---
    const veryLowChroma = 0.005;

    // 2. Primary Color Logic (The core fix)
    let primaryL, primaryC;

    if (shouldBeAchromatic) {
        // Black/White/Gray input: Use the input's luminosity for L and near-zero chroma for C.
        if (L_norm < 0.2) { // Dark input (Black)
            primaryL = 0.1;
        } else if (L_norm > 0.8) { // Light input (White)
            primaryL = 0.98;
        } else { // Mid-Gray input
            primaryL = L_norm;
        }
        primaryC = 0.01; // Force near-achromatic
    } else {
        // Normal vibrant color: Use a slightly darker L to guarantee white text contrast.
        primaryL = 0.45; // Setting L < 0.5 ensures light text on dark colors
        primaryC = 0.2;
    }

    // 3. CRITICAL FIX: Dynamic Contrast Logic for Primary Foreground
    // If L < 0.5, the color is dark, and the text MUST be light (white/L=0.98).
    const L_THRESHOLD = 0.5;
    const requiresLightText = primaryL < L_THRESHOLD;

    // Set L: 0.98 (near white) for light text, 0.15 (near black) for dark text
    const primaryForegroundL = requiresLightText ? 0.98 : 0.15;
    const primaryForegroundC = 0.01;

    // --- Generate Variables ---
    const colors = {
        // 1. Primary Colors
        '--primary': formatOklch(primaryL, primaryC, baseHue),
        '--primary-foreground': formatOklch(primaryForegroundL, primaryForegroundC, baseHue),
        '--ring': formatOklch(0.65, shouldBeAchromatic ? 0.05 : 0.15, baseHue),

        // 2. Neutral Background/Foreground Colors (Adjusted L)
        '--background': formatOklch(adjustL(1.0), veryLowChroma, baseHue),
        '--foreground': formatOklch(adjustL(0.15), veryLowChroma, baseHue),

        // 3. Card/Popover Colors
        '--card': formatOklch(adjustL(0.98), veryLowChroma, baseHue),
        '--card-foreground': formatOklch(adjustL(0.15), veryLowChroma, baseHue),
        '--popover': formatOklch(adjustL(0.98), veryLowChroma, baseHue),
        '--popover-foreground': formatOklch(adjustL(0.15), veryLowChroma, baseHue),

        // 4. Border/Input Colors
        '--border': formatOklch(adjustL(0.92), 0.02, baseHue),
        '--input': formatOklch(adjustL(0.9), 0.03, baseHue),

        // 5. Secondary/Muted/Accent Colors
        '--secondary': formatOklch(adjustL(0.95), 0.05, baseHue),
        '--secondary-foreground': formatOklch(adjustL(0.2), 0.05, baseHue),
        '--muted': formatOklch(adjustL(0.96), 0.03, baseHue),
        '--muted-foreground': formatOklch(adjustL(0.5), 0.05, baseHue),
        '--accent': formatOklch(adjustL(0.95), 0.05, baseHue),
        '--accent-foreground': formatOklch(adjustL(0.2), 0.05, baseHue),

        // 6. Destructive (Fixed Red)
        '--destructive': '0.590 0.200 29.5',
        '--destructive-foreground': formatOklch(0.98, 0.01, baseHue),
    };

    return colors;
}