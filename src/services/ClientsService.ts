import {proxy} from "valtio/vanilla";
import {useSnapshot} from "valtio/react";
import {faker} from "@faker-js/faker";

export type PlanType = {
    id: string;
    name: string;
    price: number; // monthly price in USD
    color: string; // css color or tailwind class
}

export type Client = {
    id: string;
    name: string;
    logoUrl?: string;
    planId: string;
}

function uid(prefix = "cli"): string {
    return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

// seed with a couple fake clients for initial UI
const seedClients: Client[] = [
    {id: uid(), name: "Acme Inc.", logoUrl: faker.image.avatar(), planId: "basic"},
    {id: uid(), name: "Globex", logoUrl: faker.image.avatar(), planId: "premium"},
]

const STORAGE_KEY = "review-hub:clients";

function loadClients(): Client[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return seedClients;
        const parsed = JSON.parse(raw) as Client[];
        return Array.isArray(parsed) ? parsed : seedClients;
    } catch {
        return seedClients;
    }
}

function persist(clients: Client[]) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
    } catch {
        // ignore persistence errors (e.g., private mode)
    }
}

interface ClientsState {
    clients: Client[];
    selectedClient: Client | null;
}

const clientsState = proxy<ClientsState>({
    clients: loadClients(),
    selectedClient: null
})

export const clientsActions = {
    create(client: Omit<Client, "id">) {
        const newItem: Client = {...client, id: uid()};
        clientsState.clients = [newItem, ...clientsState.clients];
        persist(clientsState.clients);
    },
    update(client: Client) {
        clientsState.clients = clientsState.clients.map(c => c.id === client.id ? client : c);
        persist(clientsState.clients);
    },
    remove(id: string) {
        clientsState.clients = clientsState.clients.filter(c => c.id !== id);
        persist(clientsState.clients);
    },
    selectedClient(id: string) {
        clientsState.selectedClient = clientsState.clients.find(c => c.id === id) || null;
    },
}

export function useClients() {
    return useSnapshot(clientsState)
}
