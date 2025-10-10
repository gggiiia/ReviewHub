import {useTopBar} from "@/services/TopBarService.tsx";
import {cn} from "@/lib/utils.ts";
import {Link, useLocation} from "react-router";
import {agencyRoutingIconMap, businessRoutingIconMap} from "@/routes/router.tsx";
import {useRoutingState} from "@/services/RoutingState.ts";


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

    console.log("NavBarLink",props.isDisabled)

    return <Link to={props.path} className={cn("block p-4", isSelectedClass)}>
        {iconMap[props.label]}
    </Link>
}

export function NavBar() {
    const {routes} = useTopBar()

    return <div className={"flex flex-row gap-2 justify-around"}>
        {
            routes.map(({path, label,isDisabled}) => (
                <div key={path}>
                    <NavBarLink path={path} label={label} isDisabled={isDisabled}/>
                </div>
            ))
        }
    </div>
}