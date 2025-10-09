import {Card} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Link, NavLink, useLocation, useNavigate} from "react-router";
import {topBarActions, useTopBar} from "@/services/TopBarService.tsx";
import {locationsActions, useLocations} from "@/services/LocationsService.ts";
import {CreateLocationButton} from "@/components/app/Locations/components/CreateLocationButton.tsx";
import {ChevronLeft, Wand2} from "lucide-react";
import {Tooltip, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {TooltipContent} from "@radix-ui/react-tooltip";
import React, {useEffect} from "react";
import {routingActions, useRoutingState} from "@/services/RoutingState.ts";
import {agencyModeLinks, businessModeLinks} from "@/routes/router.tsx";
import {designActions} from "@/services/DesignService.ts";


function BusinessSelect() {
    const {selectedLocation, locations} = useLocations()
    const options = locations

    function setCurrentValue(v: string) {
        const found = options.find(({id}) => id === v) || options[0]
        if (found) {
            locationsActions.setSelectedLocation(found)
        }
    }

    if (locations.length === 0) return <CreateLocationButton/>

    if (locations.length === 1) return

    return <Select value={selectedLocation?.id} onValueChange={setCurrentValue}>
        <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select a location"/>
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
                {options.map(opt => {
                    const initial = (opt.name || opt.id || "").trim().charAt(0).toUpperCase() || "?"
                    return (
                        <SelectItem key={opt.id} value={opt.id}>
                            <div className={"flex items-center gap-2"}>
                                {
                                    !opt.avatarUrl &&
                                    <div
                                        className={'aspect-square w-6 bg-gray-300 rounded flex items-center justify-center font-medium'}>
                                        {initial}
                                    </div>
                                }
                                {
                                    opt.avatarUrl &&
                                    <img
                                        className={'aspect-square w-6 bg-gray-300 rounded flex items-center justify-center font-medium'}
                                        src={opt.avatarUrl} alt=""/>
                                }

                                {opt.name}
                            </div>
                        </SelectItem>
                    )
                })}
            </SelectGroup>
        </SelectContent>
    </Select>
}

interface TopBarNavLinkProps {
    path: string;
    label: string;
}

function TopBarNavLink(props: TopBarNavLinkProps) {

    const location = useLocation()
    const isSelected = location.pathname === props.path

    return <NavLink to={props.path} className={
        ({isActive}) => isActive ? 'bg-accent' : ""
    }>
        <Button variant={"ghost"} className={isSelected ? 'bg-accent' : ""}>
            {props.label}
        </Button>
    </NavLink>
}

function SwitchToAgentModeButton() {

    const navigate = useNavigate()

    function onSwitch() {
        routingActions.switchMode(navigate)
        designActions.switchTheme()
    }

    return <Button variant={"outline"} onClick={onSwitch}>
        <ChevronLeft/>
    </Button>
}

export function TopBar() {

    const {mode} = useRoutingState()
    const {routes} = useTopBar()

    useEffect(() => {
        if(mode === "agency") {
            topBarActions.initTopBarLinks(agencyModeLinks)
        } else {
            topBarActions.initTopBarLinks(businessModeLinks)
        }
    }, [mode]);

    return <Card className={'p-2 2xl:px-24 overflow-visible w-full z-50'}>
        <div className={'flex gap-4 items-center p-2'}>
            <SwitchToAgentModeButton/>
            <BusinessSelect/>

            <div className={'w-full'}></div>

            {routes.map(({path, label}) => (
                <div key={path}>
                    <TopBarNavLink path={path} label={label}/>
                </div>
            ))}
        </div>
    </Card>
}