import {Card} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";


function BusinessSelect() {
    return <Select>
        <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select a location" />
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
                <SelectItem value="1">Location #1</SelectItem>
                <SelectItem value="2">Location #2</SelectItem>
                <SelectItem value="3">Location #3</SelectItem>
            </SelectGroup>
        </SelectContent>
    </Select>
}

export function TopBar() {
    return <Card className={'p-2 px-24 overflow-visible'}>
        <div className={'flex gap-4 items-center p-2'}>
            <BusinessSelect/>

            <div className={'w-full'}></div>

            <Button variant={"ghost"} className={'bg-accent'}>
                Reviews
            </Button>
            <Button variant={"ghost"}>
                Locations
            </Button>
            <Button variant={"ghost"}>
                Landing
            </Button>
            <Button variant={"ghost"}>
                Share
            </Button>
            <Button variant={"ghost"}>
                Widgets
            </Button>
            <Button variant={"ghost"}>
                Settings
            </Button>
        </div>


    </Card>
}