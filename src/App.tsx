import './App.css'
import {TopBar} from "@/components/app/TopBar.tsx";
import {Outlet, useNavigate} from "react-router";
import {NavBar} from "@/components/app/NavBar.tsx";
import {Page} from "@/components/app/Page.tsx";
import IsDesktop from "@/components/ui/isDesktop.tsx";
import IsMobile from "@/components/ui/isMobile.tsx";
import {ThemeProvider} from "@/components/ui/theme/theme-provider.tsx";
import {designActions, useDesign} from "@/services/DesignService.ts";
import {Button} from "@/components/ui/button.tsx";
import {useEffect} from "react";
import {useRoutingState} from "@/services/RoutingState.ts";
import {useIframeMessageListener} from "@/lib/hooks.ts";

function App() {

    const {theme} = useDesign()
    const navigate = useNavigate()
    const {mode} = useRoutingState()
    const {latestMessage} = useIframeMessageListener<{primaryColor:string}>()

    useEffect(() => {
        if(!latestMessage) return
        designActions.setPrimaryColor(latestMessage.primaryColor)
    }, [latestMessage]);

    useEffect(() => {
        if (mode === "business") {
            navigate("/Reviews")
        } else {
            navigate("/Clients")
        }

    }, [navigate, mode]);

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
