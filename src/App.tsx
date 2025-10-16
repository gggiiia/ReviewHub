import './App.css'
import {TopBar} from "@/components/app/TopBar.tsx";
import {Outlet, useNavigate} from "react-router";
import {NavBar} from "@/components/app/NavBar.tsx";
import {Page} from "@/components/app/Page.tsx";
import IsMobile from "@/components/ui/isMobile.tsx";
import {ThemeProvider} from "@/components/ui/theme/theme-provider.tsx";
import {designActions, type DesignService, useDesign} from "@/services/DesignService.ts";
import {useEffect} from "react";
import {useRoutingState} from "@/services/RoutingState.ts";
import {useIframeMessageListener} from "@/lib/hooks.ts";

function App() {
    const {theme} = useDesign()
    const navigate = useNavigate()
    const {mode} = useRoutingState()
    const {latestMessage} = useIframeMessageListener<DesignService>()

    useEffect(() => {
        if(!latestMessage) return
        const {primaryColor,logo} = latestMessage
        if(primaryColor) {
            designActions.setPrimaryColor(primaryColor)
        }
        if(logo) {
            designActions.setLogo(logo)
        }

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
                <TopBar/>
                <Outlet/>
                <IsMobile>
                    <NavBar/>
                </IsMobile>
            </Page>
        </ThemeProvider>
    )
}

export default App
