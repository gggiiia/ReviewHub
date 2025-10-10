import React, {useState} from "react"
import {cn} from "@/lib/utils.ts"
import {Button} from "@/components/ui/button.tsx"
import {Trash2, Pencil, ChevronRight} from "lucide-react"
import {DeleteConfirmDialog} from "@/components/ui/DeleteConfirmDialog.tsx"
import {EditClientDialog} from "@/components/app/Clients/EditClientDialog.tsx"
import {type Client, clientsActions, type PlanType} from "@/services/ClientsService.ts";
import IsDesktop from "@/components/ui/isDesktop.tsx";
import {routingActions} from "@/services/RoutingState.ts";
import {designActions} from "@/services/DesignService.ts";
import {useNavigate} from "react-router";
import {ContrastBadge} from "@/components/app/Plans/ContrastBadge.tsx";
import {usePlans} from "@/services/PlansService.ts";

interface ClientCardProps extends React.HTMLAttributes<HTMLDivElement> {
    plans: PlanType[]
    onEdit?: (client: Client) => void
    onDelete?: (client: Client) => void
}

export function ClientCard({client, className, onEdit, onDelete, ...props}: ClientCardProps) {
    const [imgError, setImgError] = useState(false)
    const logoUrl = (client.logoUrl || "").trim()
    const showImage = !!logoUrl && !imgError
    const initial = (client.name || "?").trim().charAt(0).toUpperCase() || "?"
    const navigate = useNavigate()
    const {plans} = usePlans()

    const plan = plans.find(p => p.id === client.planId)


    function onSwitch() {
        routingActions.switchMode(navigate)
        designActions.switchTheme()
    }

    function onSelectClient() {
        clientsActions.selectedClient(client.id)
        onSwitch()
    }

    return (
        <div className={cn("border rounded-md p-3 flex items-center gap-3 transition-colors", className)} {...props}>
            {showImage ? (
                <img
                    src={logoUrl}
                    alt={client.name}
                    className="size-12 rounded object-contain bg-muted"
                    loading="lazy"
                    onError={() => setImgError(true)}
                />
            ) : (
                <div
                    className="size-12 rounded bg-muted text-muted-foreground flex items-center justify-center font-semibold select-none"
                    aria-label={`placeholder for ${client.name}`}
                >
                    {initial}
                </div>
            )}
            <div className="min-w-0 flex-1">
                <div className="font-medium truncate flex items-center gap-2">
                    <span className="truncate">{client.name}</span>
                </div>
                <div className="flex items-center gap-2 ml-auto mt-2">
                    {plan && (
                        <ContrastBadge color={plan.color}>
                            ${plan.price}/mo
                        </ContrastBadge>
                    )}
                    <div className={"mr-auto"}></div>
                    <EditClientDialog client={client} plans={plans} onSubmit={(updated) => onEdit?.(updated)}>
                        <Button type="button" variant="outline" size="sm" aria-label="Edit client">
                            <Pencil className="size-4"/>
                            <IsDesktop>
                                Edit
                            </IsDesktop>
                        </Button>
                    </EditClientDialog>
                    <DeleteConfirmDialog
                        title="Delete client"
                        description={`Are you sure you want to delete "${client.name}"? This action cannot be undone.`}
                        confirmText="Delete"
                        cancelText="Cancel"
                        onConfirm={() => onDelete?.(client)}
                    >
                        <Button type="button" variant="ghost" size="sm" aria-label="Delete client">
                            <Trash2 className="size-4 text-destructive"/>
                        </Button>
                    </DeleteConfirmDialog>
                </div>
            </div>
            <Button variant={"secondary"} className={"h-full"} onClick={onSelectClient}>
                <ChevronRight/>
            </Button>
        </div>
    )
}

export default ClientCard
