import React from "react"
import {cn} from "@/lib/utils.ts"
import {Button} from "@/components/ui/button.tsx"
import {Pencil, Trash2} from "lucide-react"
import {DeleteConfirmDialog} from "@/components/ui/DeleteConfirmDialog.tsx"
import type {Plan} from "@/services/PlansService.ts"
import IsDesktop from "@/components/ui/isDesktop.tsx";
import {EditPlanDialog} from "@/components/app/Plans/EditPlanDialog.tsx";
import {ContrastBadge} from "@/components/app/Plans/ContrastBadge.tsx";

interface PlanCardProps extends React.HTMLAttributes<HTMLDivElement> {
  plan: Plan
  onEdit?: (plan: Plan) => void
  onDelete?: (plan: Plan) => void
}

export function PlanCard({ plan, className, onEdit, onDelete, ...props }: PlanCardProps) {
  return (
    <div className={cn("border rounded-md p-3 flex items-center gap-3 transition-colors min-w-0", className)} {...props}>
      <ContrastBadge color={plan.color} className="size-12 text-xl rounded flex items-center justify-center font-semibold select-none">
        {plan.name.charAt(0).toUpperCase()}
      </ContrastBadge>
      <div className="min-w-0 flex-1">
        <div className="font-medium truncate flex items-center gap-2">
          <span className="truncate">{plan.name}</span>
        </div>
        <div className="flex items-center gap-2 ml-auto mt-2">
            <ContrastBadge color={plan.color}>
                ${plan.price}/mo
            </ContrastBadge>
            <div className={"mr-auto"}/>
          <EditPlanDialog plan={plan} onSubmit={(updated)=> onEdit?.(updated)}>
            <Button type="button" variant="outline" size="sm" aria-label="Edit plan">
              <Pencil className="size-4" />
              <IsDesktop>
                Edit
              </IsDesktop>
            </Button>
          </EditPlanDialog>
          <DeleteConfirmDialog
            title="Delete plan"
            description={`Are you sure you want to delete "${plan.name}"? This action cannot be undone.`}
            confirmText="Delete"
            cancelText="Cancel"
            onConfirm={() => onDelete?.(plan)}
          >
            <Button type="button" variant="ghost" size="sm" aria-label="Delete plan">
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </DeleteConfirmDialog>
        </div>
      </div>
    </div>
  )
}

export default PlanCard
