import {Page} from "@/components/app/Page.tsx";
import {TypographyH2, TypographyP} from "@/components/ui/Typography.tsx";
import {LocationCard} from "@/components/app/Locations/LocationCard.tsx";
import {locationsActions, useLocations} from "@/services/LocationsService.ts";
import {CreateLocationButton} from "@/components/app/Locations/components/CreateLocationButton.tsx";
import {MapPin} from "lucide-react";

function NoLocationsSection() {
    return <div
        className={"flex flex-col items-center justify-center gap-2 rounded-md p-3 text-sm text-muted-foreground"}>
        <MapPin className={"size-14"}/>
        <div className="p-3 text-sm text-muted-foreground text-center">No locations yet.</div>
    </div>
}

function LocationsSection() {
    const {locations} = useLocations()
    return <div className="grid gap-3 sm:grid-cols-2">
        {locations.map((loc) => (
            <LocationCard
                key={loc.id}
                location={loc}
                onEdit={(updated) => {
                    locationsActions.updateLocation(updated)
                }}
                onDelete={(l) => {
                    locationsActions.deleteLocation(l)
                }}
            />
        ))}
    </div>
}

export function Locations() {
    const {locations} = useLocations()

    return <Page className="p-4 lg:w-1/2 lg:ml-[25%]">
        <div className="flex items-center justify-between gap-2 mb-2">
            <TypographyH2 className="m-0">Locations</TypographyH2>
            <CreateLocationButton/>
        </div>
        <TypographyP className="mb-4">Manage and switch between your business locations.</TypographyP>

        {
            locations.length === 0 ?
                <NoLocationsSection/> :
                <LocationsSection/>
        }
    </Page>
}