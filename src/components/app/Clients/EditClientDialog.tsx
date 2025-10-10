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
import {ImageInput} from "@/components/ui/image-input.tsx"
import IsDesktop from "@/components/ui/isDesktop.tsx";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import type {Client, PlanType} from "@/services/ClientsService.ts";
import {Label} from "@/components/ui/label.tsx";

export interface EditClientData {
  name: string
  logoUrl: string
  planId: string
}

interface EditClientDialogProps {
  children: ReactNode // trigger
  client: Client
  plans: PlanType[]
  title?: string
  onSubmit?: (updated: Client) => Promise<void> | void
}

export function EditClientDialog({ children, client, plans, title = "Edit client", onSubmit }: EditClientDialogProps) {
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, reset, setValue } = useForm<EditClientData>({
    defaultValues: { name: client.name, logoUrl: client.logoUrl ?? "", planId: client.planId }
  })

  // Keep form synced with new client prop when dialog closed
  useEffect(() => {
    if (!open) {
      reset({ name: client.name, logoUrl: client.logoUrl ?? "", planId: client.planId })
    }
  }, [client.id, client.name, client.logoUrl, client.planId, open, reset])

  const logoUrl = watch("logoUrl")?.trim()

  async function submit(values: EditClientData) {
    const payload: Client = { id: client.id, name: values.name.trim(), logoUrl: (values.logoUrl || "").trim(), planId: values.planId }
    if (!payload.name || !payload.planId) return
    // eslint-disable-next-line no-console
    console.log("Updated client:", payload)
    try {
      await onSubmit?.(payload)
      setOpen(false)
      reset({ name: payload.name, logoUrl: payload.logoUrl ?? "", planId: payload.planId })
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
          <DialogDescription>Update the client details.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="space-y-2">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">Name</Label>
              <Input id="name" placeholder="Client name" aria-invalid={!!errors.name}
                     {...register("name", { required: "Name is required", minLength: { value: 2, message: "Name is too short" } })}
              />
              {errors.name && (
                <TypographyP className="text-destructive text-sm mt-1">{errors.name.message}</TypographyP>
              )}
            </div>
            <ImageInput
              id="logo"
              label="Logo"
              value={logoUrl || null}
              onChange={(val) => setValue("logoUrl", val ?? "", { shouldDirty: true })}
              disabled={isSubmitting}
              helperText="PNG, JPG, or GIF. Drag and drop or click to select."
            />
            <div>
              <Label htmlFor="plan" className="text-sm font-medium">Plan</Label>
              <Select value={watch("planId")} onValueChange={(v)=> setValue("planId", v, {shouldDirty: true})}>
                <SelectTrigger id="plan">
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {plans.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name} — ${p.price}/mo</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
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

export default EditClientDialog
