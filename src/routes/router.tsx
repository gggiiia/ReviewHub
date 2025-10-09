import {createBrowserRouter, RouterProvider} from "react-router";
import App from "@/App.tsx";
import {Reviews} from "@/components/app/Reviews/Reviews.tsx";
import {Locations} from "@/components/app/Locations/Locations.tsx";
import {Landing} from "@/components/app/Landing/Landing.tsx";
import {Share} from "@/components/app/share/Share.tsx";
import {Widgets} from "@/components/app/Widgets/Widgets.tsx";
import {Grid2x2, MapPin, PanelTop, Settings, Share2, Star} from "lucide-react";
import {SettingsPage} from "@/components/app/Settings/SettingsPage.tsx";

export const businessModeLinks = [
    {label: "Reviews", path: "/Reviews", element: <Reviews/>},
    {label: "Locations", path: "/Locations", element: <Locations/>},
    {label: "Landing", path: "/Landing", element: <Landing/>},
    {label: "Share", path: "/Share", element: <Share/>},
    {label: "Widgets", path: "/Widgets", element: <Widgets/>},
    {label: "Settings", path: "/Settings", element:<SettingsPage/>}
]

export const agencyModeLinks = [
    {label: "Clients", path: "/Clients", element: <Reviews/>},
    {label: "Design", path: "/Design", element: <Widgets/>},
    {label: "Settings", path: "/Settings", element:<SettingsPage/>}
]

export const agencyRoutingIconMap = {
    Clients: <Grid2x2/>,
    Design: <Settings/>,
    Settings: <Settings/>,
}

export const businessRoutingIconMap = {
    Reviews: <Star/>,
    Locations: <MapPin/>,
    Landing: <PanelTop/>,
    Share: <Share2/>,
    Widgets: <Grid2x2/>,
    Settings: <Settings/>,
}

export const router =  createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [...agencyModeLinks,...businessModeLinks]
    },

]);


export function MainRouter() {
    return <RouterProvider router={router}></RouterProvider>
}
