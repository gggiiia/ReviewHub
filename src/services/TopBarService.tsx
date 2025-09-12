import {proxy} from "valtio/vanilla";
import {useSnapshot} from "valtio/react";
import {businessModeLinks} from "@/routes/router.tsx";


type TopBarLInk = {
    path: string;
    label: string;
}

interface TopBarState {
    routes: TopBarLInk[];
}

export const topBarState = proxy<TopBarState>({
    routes: []
})

function initTopBarLinks(links:TopBarLInk[]) {
    topBarState.routes = links.map(link => ({
        path: link.path,
        label: link.label
    }))
}

export function useTopBar() {
    if(topBarState.routes.length == 0) {
        initTopBarLinks(businessModeLinks)
    }
    return useSnapshot(topBarState)
}