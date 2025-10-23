import {createBrowserRouter, RouterProvider} from "react-router";
import App from "@/App.tsx";
import {Reviews} from "@/components/app/Reviews/Reviews.tsx";
import {Locations} from "@/components/app/Locations/Locations.tsx";
import {Landing} from "@/components/app/Landing/Landing.tsx";
import {Widgets} from "@/components/app/Widgets/Widgets.tsx";
import {
    BadgeDollarSign,
    Grid2x2,
    MapPin,
    MessageCircleMore,
    Paintbrush,
    PanelTop,
    Settings,
    Star,
    Users
} from "lucide-react";
import {SettingsPage} from "@/components/app/Settings/SettingsPage.tsx";
import {Clients} from "@/components/app/Clients/Clients.tsx";
import {Plans} from "@/components/app/Plans/Plans.tsx";
import {Design} from "@/components/app/Design/Design.tsx";
import {GetReviews} from "@/components/app/GetRevies/GetReviews.tsx";
import {SettingsPageAgency} from "@/components/app/settingsAgency/SettingsAgency.tsx";

export const businessModeLinks = [
    {label: "Reviews", path: "/Reviews", element: <Reviews/>},
    {label: "Locations", path: "/Locations", element: <Locations/>},
    {label: "Landing", path: "/Landing", element: <Landing/>},
    /*{label: "Share", path: "/Share", element: <Share/>},*/
    {label: "Get", path: "/Get", element: <GetReviews/>},
    {label: "Widgets", path: "/Widgets", element: <Widgets/>},
    {label: "Settings", path: "/Settings", element: <SettingsPage/>}
]

export const agencyModeLinks = [
    {label: "Plans", path: "/Plans", element: <Plans/>},
    {label: "Clients", path: "/Clients", element: <Clients/>},
    {label: "Design", path: "/Design", element: <Design/>},
    {label: "Settings", path: "/Settings-agency", element: <SettingsPageAgency/>}
]

export const agencyRoutingIconMap = {
    Plans: <BadgeDollarSign/>,
    Clients: <Users/>,
    Design: <Paintbrush />,
    Settings: <Settings/>,
}

export const businessRoutingIconMap = {
    Reviews: <Star/>,
    Locations: <MapPin/>,
    Landing: <PanelTop/>,
    /*Share: <Share2/>,*/
    Get: <MessageCircleMore/>,
    Widgets: <Grid2x2/>,
    Settings: <Settings/>,
}

export const router = createBrowserRouter([
        {
            path: "/",
            element: <App/>,
            children: [...agencyModeLinks, ...businessModeLinks]
        },

    ],
    {basename: "/ReviewHub/"});


export function MainRouter() {
    return <RouterProvider router={router}></RouterProvider>
}
