import './App.css'
import {TopBar} from "@/components/app/TopBar.tsx";
import {Outlet} from "react-router";
import {NavBar} from "@/components/app/NavBar.tsx";
import {Page} from "@/components/app/Page.tsx";
import IsDesktop from "@/components/ui/isDesktop.tsx";
import IsMobile from "@/components/ui/isMobile.tsx";
import {ThemeProvider} from "@/components/ui/theme/theme-provider.tsx";
import {designActions, useDesign} from "@/services/DesignService.ts";
import {Button} from "@/components/ui/button.tsx";

function App() {

    const {theme} = useDesign()

    return (
        <ThemeProvider defaultTheme={theme} storageKey="vite-ui-theme">
            <Page>
                <IsDesktop>
                    <TopBar/>
                </IsDesktop>
                <Outlet/>
                <IsMobile>
                    <NavBar/>
                </IsMobile>
            </Page>
        </ThemeProvider>
    )
}

export default App
