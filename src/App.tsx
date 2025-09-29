import './App.css'
import {TopBar} from "@/components/app/TopBar.tsx";
import {Outlet} from "react-router";
import {NavBar} from "@/components/app/NavBar.tsx";
import {Page} from "@/components/app/Page.tsx";

function App() {
  return (
    <>
        <Page>
            <TopBar/>
            <Outlet/>
            <NavBar/>
        </Page>
    </>
  )
}

export default App
