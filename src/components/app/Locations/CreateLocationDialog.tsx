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
import {ImageInput} from "@/components/ui/image-input.tsx"
import IsDesktop from "@/components/ui/isDesktop.tsx";
import {Label} from "@/components/ui/label.tsx";

export interface NewLocationData {
    name: string
    avatarUrl: string
}

interface CreateLocationDialogProps {
    children: ReactNode // trigger
    onCreate?: (data: NewLocationData) => Promise<void> | void
    title?: string
}

export function CreateLocationDialog({children, onCreate, title = "Create location"}: CreateLocationDialogProps) {
    const [open, setOpen] = useState(false)
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        watch,
        reset,
        setValue
    } = useForm<NewLocationData>({
        defaultValues: {name: "", avatarUrl: ""}
    })

    const avatarUrl = watch("avatarUrl")?.trim()

    async function submit(values: NewLocationData) {
        const payload = {...values, name: values.name.trim(), avatarUrl: values.avatarUrl.trim()}
        if (!payload.name) return
        try {
            await onCreate?.(payload)
            setOpen(false)
            reset({name: "", avatarUrl: ""})
        } finally {
            if (!onCreate) {
                // eslint-disable-next-line no-console
                console.log("Created location:", payload)
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
                    <DialogDescription>Fill in the details to add a new location.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(submit)} className="space-y-4">
                    <div className="space-y-2">
                        <div>
                            <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                            <Input id="name" placeholder="Location name" aria-invalid={!!errors.name}
                                   {...register("name", {
                                       required: "Name is required",
                                       minLength: {value: 2, message: "Name is too short"}
                                   })}
                            />
                            {errors.name && (
                                <TypographyP
                                    className="text-destructive text-sm mt-1">{errors.name.message}</TypographyP>
                            )}
                        </div>
                        <ImageInput
                            id="avatar"
                            label="Profile picture"
                            value={avatarUrl || null}
                            onChange={(val) => setValue("avatarUrl", val ?? "", {shouldDirty: true})}
                            disabled={isSubmitting}
                            helperText="PNG, JPG, or GIF. Drag and drop or click to select."
                        />
                    </div>

                    <DialogFooter>
                        <IsDesktop>
                            <Button type="button" variant="ghost" onClick={() => setOpen(false)}
                                    disabled={isSubmitting}>
                                Cancel
                            </Button>
                        </IsDesktop>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateLocationDialog
