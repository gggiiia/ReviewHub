'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {generateThemeVariables} from "@/lib/colors.ts";


export function ThemeInput() {
    // 1. State to hold the user's chosen HEX color
    const [primaryColor, setPrimaryColor] = useState('#0070f3');

    const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPrimaryColor(event.target.value);
    };

    // 2. The useEffect hook runs when primaryColor changes
    useEffect(() => {
        // Get a reference to the <html> element (the :root selector)
        const root = document.documentElement;

        // A. Generate the new OKLCH values for all theme variables
        // This returns an object: { '--primary': '0.6 0.2 240', '--background': '1.0 0.01 240', ... }

        console.log('set primaryColor:', primaryColor);

        const newVariables = generateThemeVariables(primaryColor);



        // B. Loop through the generated variables and assign them to the root's style property
        for (const [variable, value] of Object.entries(newVariables)) {
            // The setProperty method dynamically updates the CSS variable on the <html> element
            // For example, this sets: <html style="--primary: 0.6 0.2 240;">
            root.style.setProperty(variable, "oklch("+value+")");
        }

        // NOTE: To also update dark mode, you would need separate logic here
        // to identify if the dark class is active and update the variables on that element/class.

    }, [primaryColor]); // Dependency array: runs only when primaryColor changes

    return (
        <div className="flex flex-col space-y-4 p-6 border rounded-lg shadow-md max-w-lg">
            <h3 className="text-xl font-bold">Dynamic OKLCH Theme Customizer</h3>

            <div className="flex items-center space-x-4">
                <label htmlFor="theme-color" className="shrink-0 font-medium">
                    Primary Color:
                </label>

                <Input
                    id="theme-color"
                    type="color"
                    value={primaryColor}
                    onChange={handleColorChange}
                    className="w-16 h-10 p-0 border cursor-pointer"
                />

                <Input
                    type="text"
                    value={primaryColor}
                    onChange={handleColorChange}
                    maxLength={7}
                    className="w-24 font-mono text-sm"
                />
            </div>

            {/* Demonstrating the theme update */}
            <div className="pt-4 space-y-2">
                <Button>Primary Button (bg-primary)</Button>
                <Button variant="secondary" className="ml-2">Secondary Button</Button>
            </div>
        </div>
    );
}