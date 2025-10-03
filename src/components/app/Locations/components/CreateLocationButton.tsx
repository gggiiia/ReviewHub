import {Button} from "@/components/ui/button.tsx";
import {Plus} from "lucide-react";
import CreateLocationDialog, {type NewLocationData} from "@/components/app/Locations/CreateLocationDialog.tsx";
import type {LocationItem} from "@/components/app/Locations/LocationCard.tsx";
import {faker} from "@faker-js/faker";
import {locationsActions, useLocations} from "@/services/LocationsService.ts";
import IsDesktop from "@/components/ui/isDesktop.tsx";

export function CreateLocationButton() {
    const { locations } = useLocations()

    function handleCreate(data: NewLocationData) {
        const newLoc: LocationItem = {
            id: faker.string.uuid(),
            name: data.name,
            avatarUrl: data.avatarUrl || faker.image.avatarGitHub(),
        }
        locationsActions.createLocation(newLoc)
    }

    return <CreateLocationDialog onCreate={handleCreate}>
        <Button>
            <Plus className="size-4" />
            <IsDesktop>
                Create location
            </IsDesktop>
        </Button>
    </CreateLocationDialog>
}