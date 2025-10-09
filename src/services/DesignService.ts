import {proxy} from "valtio/vanilla";
import {useSnapshot} from "valtio/react";
import {generateThemeVariables} from "@/lib/colors.ts";


export type DesignService = {
    theme: "light" | "dark",
    primaryColor: string,
}

export const DesignService =  proxy<DesignService>({
    theme: "light",
    primaryColor: "#000000",
})

export const designActions = {
    switchTheme: () => {
         DesignService.theme = DesignService.theme === "light" ? "dark" : "light"
     },
     setPrimaryColor: (color: string) => {
         DesignService.primaryColor = color

         const root = document.documentElement;

         const newVariables = generateThemeVariables(color);
         // B. Loop through the generated variables and assign them to the root's style property
         for (const [variable, value] of Object.entries(newVariables)) {
             // The setProperty method dynamically updates the CSS variable on the <html> element
             // For example, this sets: <html style="--primary: 0.6 0.2 240;">
             root.style.setProperty(variable, "oklch("+value+")");
         }

     }
}

export function useDesign() {
    return  useSnapshot(DesignService)
}