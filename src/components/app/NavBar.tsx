import {TypographyH1} from "@/components/ui/Typography.tsx";
import {useTopBar} from "@/services/TopBarService.tsx";
import {routingIconMap} from "@/routes/router.tsx";
import {cn} from "@/lib/utils.ts";
import {Link, useLocation} from "react-router";


interface NavBarNavLinkProps {
    path: string;
    label: string;
}

function NavBarLink(props: NavBarNavLinkProps) {

    const location = useLocation()
    const isSelected = location.pathname === props.path
    const isSelectedClass = isSelected ? "bg-accent" : ""

    return <Link to={props.path} className={cn("block p-4", isSelectedClass)}>
        {routingIconMap[props.label]}
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