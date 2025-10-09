import {useTopBar} from "@/services/TopBarService.tsx";
import {cn} from "@/lib/utils.ts";
import {Link, useLocation} from "react-router";
import {agencyRoutingIconMap, businessRoutingIconMap} from "@/routes/router.tsx";
import {useRoutingState} from "@/services/RoutingState.ts";


interface NavBarNavLinkProps {
    path: string;
    label: string;
}

function NavBarLink(props: NavBarNavLinkProps) {
    const location = useLocation()
    const {mode} = useRoutingState()
    const isSelected = location.pathname === props.path
    const isSelectedClass = isSelected ? "bg-accent" : ""
    const iconMap = mode === "business" ? businessRoutingIconMap : agencyRoutingIconMap

    return <Link to={props.path} className={cn("block p-4", isSelectedClass)}>
        {iconMap[props.label]}
    </Link>
}

export function NavBar() {
    const {routes} = useTopBar()

    return <div className={"flex flex-row gap-2 justify-around"}>
        {
            routes.map(({path, label}) => (
                <div key={path}>
                    <NavBarLink path={path} label={label}/>
                </div>
            ))
        }
    </div>
}