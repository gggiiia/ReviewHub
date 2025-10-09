'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {designActions} from "@/services/DesignService.ts";


export function ThemeInput() {
    // 1. State to hold the user's chosen HEX color
    const [primaryColor, setPrimaryColor] = useState('#0070f3');

    const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const color = event.target.value;
        designActions.setPrimaryColor(color)
        setPrimaryColor(color)
    };// Dependency array: runs only when primaryColor changes

    return (
        <div className="flex items-center space-x-4">
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
    );
}