import {createBrowserRouter} from "react-router";
import App from "@/App.tsx";
import {Reviews} from "@/components/app/Reviews/Reviews.tsx";
import {Locations} from "@/components/app/Locations/Locations.tsx";
import {Landing} from "@/components/app/Landing/Landing.tsx";
import {Share} from "@/components/app/share/Share.tsx";

export const businessModeLinks = [
    {label: "Reviews", path: "/Reviews", element: <Reviews/>},
    {label: "Locations", path: "/Locations", element: <Locations/>},
    {label: "Landing", path: "/Landing", element: <Landing/>   },
    {label: "Share", path: "/Share", element: <Share/>},
    {label: "Widgets", path: "/Widgets", element: <div>Widgets</div>},
    {label: "Settings", path: "/Settings", element: <div>Settings</div>}
]

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: businessModeLinks
    },

]);

