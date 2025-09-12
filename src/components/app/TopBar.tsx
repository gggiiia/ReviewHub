import {Card} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {useState} from "react";
import {Link, useLocation} from "react-router";
import {useTopBar} from "@/services/TopBarService.tsx";


function BusinessSelect() {
    const [currentValue, setCurrentValue] = useState<string | undefined>(undefined)
    const options = [
        { label: "Home Base", value: "home" },
        { label: "Location #2", value: "loc2" },
        { label: "Location #3", value: "loc3" },
    ]

    const selectedOption = options.find(o => o.value === currentValue)
    const initial = (selectedOption?.label || selectedOption?.value || "").trim().charAt(0).toUpperCase() || "?"

    return <Select value={currentValue} onValueChange={setCurrentValue}>
        <SelectTrigger className="w-[280px]">
            <div className={'aspect-square w-6 bg-gray-300 rounded flex items-center justify-center font-medium'}>
                {initial}
            </div>
            <SelectValue placeholder="Select a location" />
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
                {options.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
            </SelectGroup>
        </SelectContent>
    </Select>
}

interface TopBarNavLinkProps {
    path: string;
    label: string;
}

function TopBarNavLink(props:TopBarNavLinkProps) {

    const location = useLocation()
    const isSelected = location.pathname === props.path

    return <Link to={props.path}>
        <Button variant={"ghost"} className={isSelected ? 'bg-accent' : "" }>
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