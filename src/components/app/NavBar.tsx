import {topBarActions, useTopBar} from "@/services/TopBarService.tsx";
import {cn} from "@/lib/utils.ts";
import {Link, useLocation} from "react-router";
import {agencyModeLinks, agencyRoutingIconMap, businessModeLinks, businessRoutingIconMap} from "@/routes/router.tsx";
import {useRoutingState} from "@/services/RoutingState.ts";
import {useEffect} from "react";


interface NavBarNavLinkProps {
    path: string;
    label: string;
    isDisabled: () => boolean;
}

function NavBarLink(props: NavBarNavLinkProps) {
    const location = useLocation()
    const {mode} = useRoutingState()
    const isSelected = location.pathname === props.path
    const isSelectedClass = isSelected ? "bg-accent" : ""
    const iconMap = mode === "business" ? businessRoutingIconMap : agencyRoutingIconMap

    if(props.isDisabled && props.isDisabled()) return null

    return <Link to={props.path} className={cn("block p-4", isSelectedClass)}>
        {iconMap[props.label]}
    </Link>
}

export function NavBar() {
    const {routes} = useTopBar()
    const {mode} = useRoutingState()

    useEffect(() => {
        if (mode === "agency") {
            topBarActions.initTopBarLinks(agencyModeLinks)
        } else {
            topBarActions.initTopBarLinks(businessModeLinks)
        }
    }, [mode]);

    return <div className={"flex flex-row gap-2 justify-around fixed bottom-0 w-full bg-background z-50"}>
        {
            routes.map(({path, label,isDisabled}) => (
                <div key={path}>
                    <NavBarLink path={path} label={label} isDisabled={isDisabled}/>
                </div>
            ))
        }
    </div>
}