import type {LocationItem} from "@/components/app/Locations/LocationCard.tsx";
import {faker} from "@faker-js/faker";
import {proxy, subscribe} from "valtio/vanilla";
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

interface LocationsState {
    selectedLocation: LocationItem | null;
    locations: LocationItem[];
}

const locationState = proxy<LocationsState>({
    selectedLocation: null,
    locations: fakeLocations,
})

const unsubscribe = subscribe(locationState, () =>
    console.log('locations state has changed to', locationState),
)

export const locationsActions = {
    setSelectedLocation: (location: LocationItem) => {
        locationState.selectedLocation = location
    },
    createLocation: (newLoc: LocationItem) => {
        locationState.locations = [newLoc, ...locationState.locations]
        if (locationState.locations.length === 1) {
            locationState.selectedLocation = locationState.locations[0]
        }
    },
    updateLocation: (updated: LocationItem) => {
        locationState.locations = locationState.locations.map(item => item.id === updated.id ? updated : item)
        if (locationState.selectedLocation?.id === updated.id) {
            locationState.selectedLocation = updated
        }
    },
    deleteLocation: (toDelete: LocationItem) => {
        locationState.locations = locationState.locations.filter(item => item.id !== toDelete.id)
        if (locationState.selectedLocation?.id === toDelete.id) {
            locationState.selectedLocation = locationState.locations[0] || undefined as any
        }
    },
}

export function useLocations() {
    return useSnapshot(locationState)
}