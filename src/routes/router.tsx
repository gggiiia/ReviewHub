import {createBrowserRouter} from "react-router";
import App from "@/App.tsx";
import {Reviews} from "@/components/app/Reviews/Reviews.tsx";
import {Locations} from "@/components/app/Locations/Locations.tsx";

export const businessModeLinks = [
    {label: "Reviews", path: "/Reviews", element: <Reviews/>},
    {label: "Locations", path: "/Locations", element: <Locations/>},
    {label: "Landing", path: "/Landing", element: <div>Landing</div>},
    {label: "Share", path: "/Share", element: <div>Share</div>},
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

