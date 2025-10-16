import {proxy} from "valtio/vanilla";
import {useSnapshot} from "valtio/react";


type TopBarLInk = {
    path: string;
    label: string;
    isDisabled?: () => boolean;
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
        isDisabled: link.isDisabled,
    }))
}

export const topBarActions = {
    initTopBarLinks
}

export function useTopBar() {
    return useSnapshot(topBarState)
}