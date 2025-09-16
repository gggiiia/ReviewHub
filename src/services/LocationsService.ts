import type {LocationItem} from "@/components/app/Locations/LocationCard.tsx";
import {faker} from "@faker-js/faker";
import {proxy} from "valtio/vanilla";
import {useSnapshot} from "valtio/react";

function makeLocations(count: number): LocationItem[] {
    return Array.from({length: count}).map((_, i) => {
        const name = faker.company.name();
        return {
            id: `loc-${i + 1}`,
            name,
            avatarUrl: faker.image.avatarGitHub(),
        };
    });
}

export const fakeLocations: LocationItem[] = makeLocations(8);

const locationState = proxy({
    selectedLocation: fakeLocations[0]
})

export const locationsActions = {
    setSelectedLocation: (location: LocationItem) => {
        locationState.selectedLocation = location
    },
}

export function useLocations() {
    return useSnapshot(locationState)
}