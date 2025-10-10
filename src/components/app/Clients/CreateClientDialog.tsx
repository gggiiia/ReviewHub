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
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import type {PlanType} from "@/services/ClientsService.ts";

export interface NewClientData {
    name: string
    logoUrl: string
    planId: string
}

interface CreateClientDialogProps {
    children: ReactNode // trigger
    onCreate?: (data: NewClientData) => Promise<void> | void
    title?: string
    plans: PlanType[]
}

export function CreateClientDialog({children, onCreate, title = "Create client", plans}: CreateClientDialogProps) {
    const [open, setOpen] = useState(false)
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        watch,
        reset,
        setValue
    } = useForm<NewClientData>({
        defaultValues: {name: "", logoUrl: "", planId: plans[0]?.id || "free"}
    })

    const logoUrl = watch("logoUrl")?.trim()

    async function submit(values: NewClientData) {
        const payload = { ...values, name: values.name.trim(), logoUrl: (values.logoUrl||"").trim() }
        if (!payload.name || !payload.planId) return
        try {
            await onCreate?.(payload)
            setOpen(false)
            reset({name: "", logoUrl: "", planId: plans[0]?.id || "free"})
        } finally {
            if (!onCreate) {
                // eslint-disable-next-line no-console
                console.log("Created client:", payload)
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
                    <DialogDescription>Fill in the details to add a new client.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(submit)} className="space-y-4">
                    <div className="space-y-2">
                        <div>
                            <label htmlFor="name" className="text-sm font-medium">Name</label>
                            <Input id="name" placeholder="Client name" aria-invalid={!!errors.name}
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
                            id="logo"
                            label="Logo"
                            value={logoUrl || null}
                            onChange={(val) => setValue("logoUrl", val ?? "", {shouldDirty: true})}
                            disabled={isSubmitting}
                            helperText="PNG, JPG, or GIF. Drag and drop or click to select."
                        />
                        <div>
                            <label htmlFor="plan" className="text-sm font-medium">Plan</label>
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

export default CreateClientDialog
