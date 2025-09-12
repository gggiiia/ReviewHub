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
import type { LocationItem } from "@/components/app/Locations/LocationCard.tsx"

export interface EditLocationData {
  name: string
  avatarUrl: string
}

interface EditLocationDialogProps {
  children: ReactNode // trigger
  location: LocationItem
  title?: string
  onSubmit?: (updated: LocationItem) => Promise<void> | void
}

export function EditLocationDialog({ children, location, title = "Edit location", onSubmit }: EditLocationDialogProps) {
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, reset, setValue } = useForm<EditLocationData>({
    defaultValues: { name: location.name, avatarUrl: location.avatarUrl ?? "" }
  })

  // Keep form in sync if a different location is passed while dialog is closed.
  useEffect(() => {
    if (!open) {
      reset({ name: location.name, avatarUrl: location.avatarUrl ?? "" })
    }
  }, [location.id, location.name, location.avatarUrl, open, reset])

  const avatarUrl = watch("avatarUrl")?.trim()

  async function submit(values: EditLocationData) {
    const payload: LocationItem = { id: location.id, name: values.name.trim(), avatarUrl: (values.avatarUrl || "").trim() }
    if (!payload.name) return
    // Always log for visibility as per create dialog pattern
    // eslint-disable-next-line no-console
    console.log("Updated location:", payload)
    try {
      await onSubmit?.(payload)
      setOpen(false)
      // keep the latest values in the form after closing
      reset({ name: payload.name, avatarUrl: payload.avatarUrl })
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
          <DialogDescription>Update the location details.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="space-y-2">
            <div>
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input id="name" placeholder="Location name" aria-invalid={!!errors.name}
                     {...register("name", { required: "Name is required", minLength: { value: 2, message: "Name is too short" } })}
              />
              {errors.name && (
                <TypographyP className="text-destructive text-sm mt-1">{errors.name.message}</TypographyP>
              )}
            </div>
            <ImageInput
              id="avatar"
              label="Profile picture"
              value={avatarUrl || null}
              onChange={(val) => setValue("avatarUrl", val ?? "", { shouldDirty: true })}
              disabled={isSubmitting}
              helperText="PNG, JPG, or GIF. Drag and drop or click to select."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save changes"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditLocationDialog
