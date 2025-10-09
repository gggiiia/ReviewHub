import {proxy} from "valtio/vanilla";
import {useSnapshot} from "valtio/react";

interface RoutingState {
    mode: "agency" | "business"
}

export const routingState = proxy<RoutingState>({
    mode: "business",
})

export const routingActions = {
    switchMode: (navigate: (route:string) => any) => {
        const mode = routingState.mode === "agency" ? "business" : "agency"

        if(mode === "agency") {
            navigate("/Clients")
        } else {
            navigate("/Reviews")
        }

        routingState.mode = mode
    }
}

export function useRoutingState() {
    return useSnapshot(routingState)
}