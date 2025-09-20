import {Page} from "@/components/app/Page.tsx";
import {TypographyH2, TypographyP} from "@/components/ui/Typography.tsx";
import {LocationCard, type LocationItem} from "@/components/app/Locations/LocationCard.tsx";
import {faker} from "@faker-js/faker";
import { locationsActions, useLocations } from "@/services/LocationsService.ts";
import {Button} from "@/components/ui/button.tsx";
import {CreateLocationDialog, type NewLocationData} from "@/components/app/Locations/CreateLocationDialog.tsx";
import { Plus } from "lucide-react";

export function Locations() {
    const { locations } = useLocations()

    function handleCreate(data: NewLocationData) {
        const newLoc: LocationItem = {
            id: `loc-${locations.length + 1}`,
            name: data.name,
            avatarUrl: data.avatarUrl || faker.image.avatarGitHub(),
        }
        locationsActions.createLocation(newLoc)
    }

    return <Page className="p-4 pt-24 lg:w-1/2 lg:ml-[25%]">
        <div className="flex items-center justify-between gap-2 mb-2">
            <TypographyH2 className="m-0">Locations</TypographyH2>
            <CreateLocationDialog onCreate={handleCreate}>
                <Button><Plus className="size-4" />Create location</Button>
            </CreateLocationDialog>
        </div>
        <TypographyP className="mb-4">Manage and switch between your business locations.</TypographyP>

        <div className="grid gap-3 sm:grid-cols-2">
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
    </Page>
}