import {Page} from "@/components/app/Page.tsx";
import {TypographyH2, TypographyP} from "@/components/ui/Typography.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {ImageInput} from "@/components/ui/image-input.tsx";
import {Globe, Mail, User} from "lucide-react";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {saveSettings, useSettings} from "@/services/SettingsService.ts";
import {Label} from "@/components/ui/label.tsx";

interface SettingsForm {
    fullName: string
    email: string
    avatar: string
}

export function SettingsPageAgency() {
    const snap = useSettings()
    const [confirm, setConfirm] = useState<{open: boolean; provider: 'facebook' | 'google' | null}>({open:false, provider:null})

    const {register, handleSubmit, formState: {errors, isSubmitting,isDirty}, watch, setValue, reset} = useForm<SettingsForm>({
        defaultValues: {
            fullName: snap.fullName,
            email: snap.email,
            avatar: snap.avatar
        }
    })

    useEffect(() => {
        reset({
            fullName: snap.fullName,
            email: snap.email,
            avatar: snap.avatar,
        })
    }, [snap, reset])

    const avatar = watch("avatar") || null

    function onSubmit(values: SettingsForm) {
        saveSettings({
            ...values,
        })
        // eslint-disable-next-line no-console
        console.log("Settings saved:", values)
    }

    return <Page className="p-4 lg:w-2/3 lg:ml-[17%] xl:w-1/2 xl:ml-[25%] space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <TypographyH2 className="mb-1">Settings</TypographyH2>
                <TypographyP>Manage your domain, SMTP and account.</TypographyP>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-accent text-accent-foreground"><Globe className="size-4"/></div>
                        <div>
                            <CardTitle>Domain</CardTitle>
                            <CardDescription>Setup your custom domain</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">

                    <Label htmlFor="domain">Domain</Label>
                    <Input placeholder={"domain.com"}></Input>

                    <Card>
                        <CardHeader className="flex flex-row items-start">
                           <CardDescription>CNAME :</CardDescription>
                            <CardDescription>1234567</CardDescription>
                        </CardHeader>
                    </Card>

                    <Label htmlFor="domain">App DNS</Label>
                    <Input placeholder={"app.domain.com"}></Input>

                    <Card>
                        <CardHeader className="flex flex-row items-start">
                            <CardDescription>CNAME :</CardDescription>
                            <CardDescription>1234567</CardDescription>
                        </CardHeader>
                    </Card>

                    <Label htmlFor="domain">Landing DNS</Label>
                    <Input placeholder={"go.domain.com"}></Input>

                    <Card>
                        <CardHeader className="flex flex-row items-start">
                            <CardDescription>CNAME :</CardDescription>
                            <CardDescription>1234567</CardDescription>
                        </CardHeader>
                    </Card>

                    <div className={"flex"}>
                        <div className={"mr-auto"}/>
                        <Button className={"w-full lg:w-auto"} type="submit" variant="default" size="sm" disabled={isSubmitting || !isDirty}>{isSubmitting ? "Saving..." : "Save changes"}</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-accent text-accent-foreground"><Mail className="size-4"/></div>
                        <div>
                            <CardTitle>SMTP</CardTitle>
                            <CardDescription>Setup your custom Simple Mail Transfer Protocol</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">

                    <Label htmlFor="domain">Host</Label>
                    <Input placeholder={"smtp.gmail.com"}></Input>

                    <Label htmlFor="domain">Port</Label>
                    <Input placeholder={"587"}></Input>

                    <Label htmlFor="domain">Username</Label>
                    <Input></Input>

                    <Label htmlFor="domain">password</Label>
                    <Input placeholder={"*****"}></Input>

                    <div className={"flex"}>
                        <div className={"mr-auto"}/>
                        <Button className={"w-full lg:w-auto"} type="submit" variant="default" size="sm" disabled={isSubmitting || !isDirty}>{isSubmitting ? "Saving..." : "Save changes"}</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Account */}
            <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-accent text-accent-foreground"><User className="size-4"/></div>
                        <div>
                            <CardTitle>Account</CardTitle>
                            <CardDescription>Update your personal information.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <ImageInput label="Profile picture" value={avatar} onChange={(v)=>setValue('avatar', v ?? '', {shouldDirty:true})} helperText="PNG, JPG. Drag & drop or click to upload."/>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium" htmlFor="fullName">Full name</Label>
                                <Input id="fullName" aria-invalid={!!errors.fullName} placeholder="Your full name" {...register('fullName', {required: 'Full name is required', minLength: {value: 2, message: 'Name is too short'}})} />
                                {errors.fullName && (
                                    <TypographyP className="text-destructive text-sm mt-1">{errors.fullName.message}</TypographyP>
                                )}
                            </div>
                            <div>
                                <Label className="text-sm font-medium" htmlFor="email">Email</Label>
                                <Input id="email" type="email" aria-invalid={!!errors.email} placeholder="you@example.com" {...register('email', {required: 'Email is required', pattern: {value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email'}})} />
                                {errors.email && (
                                    <TypographyP className="text-destructive text-sm mt-1">{errors.email.message}</TypographyP>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={"flex"}>
                        <div className={"mr-auto"}/>
                        <Button className={"w-full lg:w-auto"} type="submit" variant="default" size="sm" disabled={isSubmitting || !isDirty}>{isSubmitting ? "Saving..." : "Save changes"}</Button>
                    </div>
                </CardContent>
            </Card>
            <div className="flex flex-col lg:flex-row justify-between gap-2">
                <Button className={"text-destructive w-full lg:my-4"} type="button" variant="ghost" size="sm">Log Out</Button>
            </div>
        </form>
    </Page>
}