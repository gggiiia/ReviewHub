import './App.css'
import {TopBar} from "@/components/app/TopBar.tsx";
import {Outlet} from "react-router";
import {NavBar} from "@/components/app/NavBar.tsx";
import {Page} from "@/components/app/Page.tsx";
import IsDesktop from "@/components/ui/isDesktop.tsx";
import IsMobile from "@/components/ui/isMobile.tsx";

function App() {
    return (
        <>
            <Page>
                <IsDesktop>
                    <TopBar/>
                </IsDesktop>
                <Outlet/>
                <IsMobile>
                    <NavBar/>
                </IsMobile>
            </Page>
        </>
    )
}

export default App
