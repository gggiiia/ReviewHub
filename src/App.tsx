import './App.css'
import {TopBar} from "@/components/app/TopBar.tsx";
import {Outlet} from "react-router";

function App() {
  return (
    <>
        <TopBar/>
        <Outlet/>
    </>
  )
}

export default App
