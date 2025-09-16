import {Card} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Link, useLocation} from "react-router";
import {useTopBar} from "@/services/TopBarService.tsx";
import {fakeLocations, locationsActions, useLocations} from "@/services/LocationsService.ts";


function BusinessSelect() {
    const {selectedLocation} = useLocations()
    const options = fakeLocations

    function setCurrentValue(v) {
        locationsActions.setSelectedLocation(fakeLocations.find(({id}) => id === v) || fakeLocations[0])
    }

    const initial = (selectedLocation?.name || selectedLocation?.id || "").trim().charAt(0).toUpperCase() || "?"

    return <Select value={selectedLocation.id} onValueChange={setCurrentValue}>
        <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select a location"/>
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
                {options.map(opt => (
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

                ))}
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

    return <Link to={props.path}>
        <Button variant={"ghost"} className={isSelected ? 'bg-accent' : ""}>
            {props.label}
        </Button>
    </Link>
}

export function TopBar() {

    const {routes} = useTopBar()

    return <Card className={'p-2 2xl:px-24 overflow-visible fixed w-full'}>
        <div className={'flex gap-4 items-center p-2'}>
            <BusinessSelect/>

            <div className={'w-full'}></div>

            {routes.map(({path, label}) => (
                <TopBarNavLink path={path} label={label}/>
            ))}
        </div>
    </Card>
}