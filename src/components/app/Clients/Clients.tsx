import {Page} from "@/components/app/Page.tsx";
import {TypographyH2, TypographyP} from "@/components/ui/Typography.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Plus, Users} from "lucide-react";
import {clientsActions, useClients} from "@/services/ClientsService.ts";
import {ClientCard} from "@/components/app/Clients/ClientCard.tsx";
import {CreateClientDialog} from "@/components/app/Clients/CreateClientDialog.tsx";
import IsDesktop from "@/components/ui/isDesktop.tsx";

import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty.tsx";
import {usePlans} from "@/services/PlansService.ts";

function NoClientsSection() {
    return <Empty className="border">
        <EmptyHeader>
            <EmptyMedia variant="icon">
                <Users className="size-6" />
            </EmptyMedia>
            <EmptyTitle>No clients yet</EmptyTitle>
            <EmptyDescription>
                Add your first client to start managing their locations and reviews.
            </EmptyDescription>
        </EmptyHeader>
    </Empty>
}

function ClientsSection() {
    const {clients, plans} = useClients()
    return <div className="grid gap-3 sm:grid-cols-2">
        {clients.map((c) => (
            <ClientCard
                key={c.id}
                client={c}
                plans={plans}
                onEdit={(updated) => {
                    clientsActions.update(updated)
                }}
                onDelete={(cli) => {
                    clientsActions.remove(cli.id)
                }}
            />
        ))}
    </div>
}

export function Clients() {
    const {clients} = useClients()
    const {plans} = usePlans()

    return <Page className="p-4 lg:w-1/2 lg:ml-[25%]">
        <div className="flex items-center justify-between gap-2 mb-2">
            <TypographyH2 className="m-0">Clients</TypographyH2>
            <CreateClientDialog plans={plans} onCreate={(data)=> clientsActions.create({ name: data.name, logoUrl: data.logoUrl, planId: data.planId })}>
                <Button>
                    <Plus className="size-4" />
                    <IsDesktop>
                        Create client
                    </IsDesktop>
                </Button>
            </CreateClientDialog>
        </div>
        <TypographyP className="mb-4">Manage your clients and their subscription plans.</TypographyP>

        {
            clients.length === 0 ?
                <NoClientsSection/> :
                <ClientsSection/>
        }
    </Page>
}