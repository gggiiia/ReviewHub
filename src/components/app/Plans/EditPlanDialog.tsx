import {ReactNode, useEffect, useState} from "react"
import {useForm} from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog.tsx"
import {Button} from "@/components/ui/button.tsx"
import {Input} from "@/components/ui/input.tsx"
import {TypographyP} from "@/components/ui/Typography.tsx"
import type {Plan} from "@/services/PlansService.ts"
import IsDesktop from "@/components/ui/isDesktop.tsx";

export interface PlanFormValues {
  name: string
  price: number
  color: string
}

interface EditPlanDialogProps {
  children: ReactNode
  plan: Plan
  title?: string
  onSubmit?: (updated: Plan) => Promise<void> | void
}

export function EditPlanDialog({children, plan, title = "Edit plan", onSubmit}: EditPlanDialogProps) {
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch, setValue } = useForm<PlanFormValues>({
    defaultValues: { name: plan.name, price: plan.price, color: plan.color }
  })

  useEffect(() => {
    if (!open) {
      reset({ name: plan.name, price: plan.price, color: plan.color })
    }
  }, [plan.id, plan.name, plan.price, plan.color, open, reset])

  async function submit(values: PlanFormValues) {
    const payload: Plan = { id: plan.id, name: values.name.trim(), price: Number(values.price) || 0, color: values.color.trim() || "#64748b" }
    if (!payload.name) return
    try {
      await onSubmit?.(payload)
      setOpen(false)
      reset({ name: payload.name, price: payload.price, color: payload.color })
    } finally {
      // no-op
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span>{children}</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Update the plan details.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="space-y-2">
            <div>
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input id="name" placeholder="Plan name" aria-invalid={!!errors.name}
                     {...register("name", { required: "Name is required", minLength: { value: 2, message: "Name is too short" } })}
              />
              {errors.name && (
                <TypographyP className="text-destructive text-sm mt-1">{errors.name.message}</TypographyP>
              )}
            </div>
            <div>
              <label htmlFor="price" className="text-sm font-medium">Monthly price (USD)</label>
              <Input id="price" type="number" step="1" placeholder="0" aria-invalid={!!errors.price}
                     {...register("price", { valueAsNumber: true, min: { value: 0, message: "Price cannot be negative" } })}
              />
            </div>
            <div>
              <label htmlFor="color" className="text-sm font-medium">Color</label>
              <div className="flex items-center gap-2">
                <Input
                    className={"h-10 w-10 p-1"}
                  id="color"
                  type="color"
                  value={watch("color") || "#64748b"}
                  onChange={(e) => setValue("color", e.target.value, { shouldDirty: true })}
                  aria-invalid={!!errors.color}
                />
                <Input
                  id="color-hex"
                  placeholder="#22c55e"
                  aria-invalid={!!errors.color}
                  {...register("color", { pattern: { value: /^#[0-9a-fA-F]{6}$/, message: "Enter a hex color like #22c55e" } })}
                />
              </div>
              {errors.color && (
                <TypographyP className="text-destructive text-sm mt-1">{errors.color.message}</TypographyP>
              )}
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            <IsDesktop>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={isSubmitting}>Cancel</Button>
            </IsDesktop>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save changes"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditPlanDialog
