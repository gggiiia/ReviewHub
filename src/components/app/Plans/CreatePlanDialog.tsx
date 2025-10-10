import {ReactNode, useState} from "react"
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
import IsDesktop from "@/components/ui/isDesktop.tsx";

export interface NewPlanData {
  name: string
  price: number
  color: string
}

interface CreatePlanDialogProps {
  children: ReactNode
  title?: string
  onCreate?: (data: NewPlanData) => Promise<void> | void
}

export function CreatePlanDialog({children, onCreate, title = "Create plan"}: CreatePlanDialogProps) {
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch, setValue } = useForm<NewPlanData>({
    defaultValues: { name: "", price: 0, color: "#64748b" }
  })

  async function submit(values: NewPlanData) {
    const payload = { name: values.name.trim(), price: Number(values.price) || 0, color: values.color.trim() || "#64748b" }
    if (!payload.name) return
    try {
      await onCreate?.(payload)
      setOpen(false)
      reset({ name: "", price: 0, color: "#64748b" })
    } finally {
      if (!onCreate) {
        // eslint-disable-next-line no-console
        console.log("Created plan:", payload)
      }
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
          <DialogDescription>Define a plan that clients can subscribe to.</DialogDescription>
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

          <DialogFooter>
            <IsDesktop>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={isSubmitting}>Cancel</Button>
            </IsDesktop>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreatePlanDialog
