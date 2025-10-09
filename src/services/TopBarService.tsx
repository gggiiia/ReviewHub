import {proxy, subscribe} from "valtio/vanilla";
import {useSnapshot} from "valtio/react";
import {agencyModeLinks, businessModeLinks} from "@/routes/router.tsx";
import {routingState} from "@/services/RoutingState.ts";
import {useNavigate} from "react-router";


type TopBarLInk = {
    path: string;
    label: string;
}

interface TopBarState {
    routes: TopBarLInk[];
}

export const topBarState = proxy<TopBarState>({
    routes: [],
})


function initTopBarLinks(links:TopBarLInk[]) {
    topBarState.routes = links.map(link => ({
        path: link.path,
        label: link.label,
    }))
}

export const topBarActions = {
    initTopBarLinks
}

export function useTopBar() {
    return useSnapshot(topBarState)
}