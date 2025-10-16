import {proxy} from "valtio/vanilla";
import {useSnapshot} from "valtio/react";
import {generateThemeVariables} from "@/lib/colors.ts";
import {faker} from "@faker-js/faker";


export type DesignService = {
    theme: "light" | "dark",
    primaryColor: string,
    logo: string
}

export const designService = proxy<DesignService>({
    theme: "light",
    primaryColor: "#000000",
    logo: faker.image.avatar()
})

export const designActions = {
    switchTheme: () => {
        designService.theme = designService.theme === "light" ? "dark" : "light"
    },
    setPrimaryColor: (color: string) => {
        designService.primaryColor = color

        const root = document.documentElement;

        const newVariables = generateThemeVariables(color);
        // B. Loop through the generated variables and assign them to the root's style property
        for (const [variable, value] of Object.entries(newVariables)) {
            // The setProperty method dynamically updates the CSS variable on the <html> element
            // For example, this sets: <html style="--primary: 0.6 0.2 240;">
            root.style.setProperty(variable, "oklch(" + value + ")");
        }

    },
    setLogo(logo: string) {
        designService.logo = logo
    }

}

export function useDesign() {
    return useSnapshot(designService)
}