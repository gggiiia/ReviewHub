import {Page} from "@/components/app/Page.tsx";
import {TypographyH2, TypographyH3, TypographyP} from "@/components/ui/Typography.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {ImageInput} from "@/components/ui/image-input.tsx";
import {Bell, CheckCircle2, Chrome, Facebook, Plug2, Trash2, User} from "lucide-react";
import {useEffect, useState} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {useForm} from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.tsx";
import {saveSettings, toggleFacebook, toggleGoogle, useSettings} from "@/services/SettingsService.ts";
import {FacebookIcon} from "@/components/ui/icons/facebookIcon.tsx";
import {GoogleIcon} from "@/components/ui/icons/googleIcon.tsx";
import {Label} from "@/components/ui/label.tsx";

interface SettingsForm {
    notifEmail: boolean
    notifSms: boolean
    notifPush: boolean
    notifFreq: string
    fullName: string
    email: string
    avatar: string
}

export function SettingsPage() {
    const snap = useSettings()
    const [fbConnected, setFbConnected] = useState(snap.fbConnected)
    const [googleConnected, setGoogleConnected] = useState(snap.googleConnected)
    const [confirm, setConfirm] = useState<{open: boolean; provider: 'facebook' | 'google' | null}>({open:false, provider:null})

    const {register, handleSubmit, formState: {errors, isSubmitting,isDirty}, watch, setValue, reset} = useForm<SettingsForm>({
        defaultValues: {
            notifEmail: snap.notifEmail,
            notifSms: snap.notifSms,
            notifPush: snap.notifPush,
            notifFreq: snap.notifFreq,
            fullName: snap.fullName,
            email: snap.email,
            avatar: snap.avatar
        }
    })

    useEffect(() => {
        reset({
            notifEmail: snap.notifEmail,
            notifSms: snap.notifSms,
            notifPush: snap.notifPush,
            notifFreq: snap.notifFreq,
            fullName: snap.fullName,
            email: snap.email,
            avatar: snap.avatar,
        })
        setFbConnected(snap.fbConnected)
        setGoogleConnected(snap.googleConnected)
    }, [snap, reset])

    const notifEmail = watch("notifEmail")
    const notifSms = watch("notifSms")
    const notifPush = watch("notifPush")
    const notifFreq = watch("notifFreq")
    const avatar = watch("avatar") || null

    function onSubmit(values: SettingsForm) {
        saveSettings({
            ...values,
            fbConnected,
            googleConnected,
        })
        // eslint-disable-next-line no-console
        console.log("Settings saved:", values)
    }

    return <Page className="p-4 lg:w-1/2 lg:ml-[25%] space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
            <TypographyH2 className="mb-1">Settings</TypographyH2>
            <TypographyP>Manage your integrations, notifications, and account.</TypographyP>
        </div>



        {/* Integrations */}
        <Card>

           {/* <ThemeInput></ThemeInput>*/}

            <CardHeader className="flex flex-row items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-accent text-accent-foreground"><Plug2 className="size-4"/></div>
                    <div>
                        <CardTitle>Integrations</CardTitle>
                        <CardDescription>Connect your accounts to sync data.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Facebook */}
                <div className="flex items-center justify-between gap-4 border rounded-lg p-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <FacebookIcon className="size-5"/>
                        <div className="min-w-0">
                            <TypographyH3 className="text-base">Facebook</TypographyH3>
                            <TypographyP className="text-sm text-muted-foreground truncate">Manage your Facebook reviews and pages.</TypographyP>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        {fbConnected ? (
                            <span className="inline-flex items-center gap-1 text-green-600 text-sm"><CheckCircle2 className="size-4"/> Connected</span>
                        ) : (
                            <span className="text-muted-foreground text-sm">Not connected</span>
                        )}
                        {
                            fbConnected && <Button variant={"ghost"} onClick={() => setConfirm({open:true, provider:'facebook'})}>
                                <Trash2 className={"text-destructive"} />
                            </Button>
                        }
                        {
                            !fbConnected &&
                            <Button variant={"outline"} size="sm" onClick={() => { setFbConnected(v => !v); toggleFacebook(); }} >
                                {"Connect"}
                            </Button>
                        }

                    </div>
                </div>

                {/* Google */}
                <div className="flex items-center justify-between gap-4 border rounded-lg p-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <GoogleIcon className="size-5 text-emerald-600"/>
                        <div className="min-w-0">
                            <TypographyH3 className="text-base">Google</TypographyH3>
                            <TypographyP className="text-sm text-muted-foreground truncate">Connect to manage Google Business reviews.</TypographyP>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        {googleConnected ? (
                            <span className="inline-flex items-center gap-1 text-green-600 text-sm"><CheckCircle2 className="size-4"/> Connected</span>
                        ) : (
                            <span className="text-muted-foreground text-sm">Not connected</span>
                        )}

                        {
                            googleConnected && <Button variant={"ghost"} onClick={() => setConfirm({open:true, provider:'google'})}>
                                <Trash2 className={"text-destructive"} />
                            </Button>
                        }

                        {
                            !googleConnected && <Button variant={"outline"} size="sm" onClick={() => { setGoogleConnected(v => !v); toggleGoogle(); }} >
                                {"Connect"}
                            </Button>
                        }


                    </div>
                </div>
            </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
            <CardHeader className="flex flex-row items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-accent text-accent-foreground"><Bell className="size-4"/></div>
                    <div>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>Choose how and when we notify you.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Label className="flex items-center justify-between gap-4 border rounded-lg p-3">
                        <span>Email alerts</span>
                        <Checkbox checked={notifEmail} onCheckedChange={(v)=>{ const val = v === true; setValue('notifEmail', val, {shouldDirty:true}); saveSettings({notifEmail: val}); }} />
                    </Label>
                    <Label className="flex items-center justify-between gap-4 border rounded-lg p-3">
                        <span>SMS alerts</span>
                        <Checkbox checked={notifSms} onCheckedChange={(v)=>{ const val = v === true; setValue('notifSms', val, {shouldDirty:true}); saveSettings({notifSms: val}); }} />
                    </Label>
                    <Label className="flex items-center justify-between gap-4 border rounded-lg p-3">
                        <span>Push notifications</span>
                        <Checkbox checked={notifPush} onCheckedChange={(v)=>{ const val = v === true; setValue('notifPush', val, {shouldDirty:true}); saveSettings({notifPush: val}); }} />
                    </Label>
                    <div className="flex items-center justify-between gap-4 border rounded-lg p-3">
                        <span className="mr-4">Digest frequency</span>
                        <div>
                            <Select value={notifFreq} onValueChange={(v)=>{ setValue('notifFreq', v, {shouldDirty:true}); saveSettings({notifFreq: v as any}); }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="realtime">Real-time</SelectItem>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
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
            </CardContent>
        </Card>
        <div className="flex justify-between gap-2">
            <Button type="button" variant="destructive" size="sm">Log Out</Button>
            <Button type="submit" variant="default" size="sm" disabled={isSubmitting || !isDirty}>{isSubmitting ? "Saving..." : "Save changes"}</Button>
        </div>

        <Dialog open={confirm.open} onOpenChange={(open)=> !open ? setConfirm({open:false, provider:null}) : undefined}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Disconnect {confirm.provider === 'facebook' ? 'Facebook' : confirm.provider === 'google' ? 'Google' : 'integration'}?</DialogTitle>
                    <DialogDescription>
                        This will disconnect your {confirm.provider ?? ''} integration. You can reconnect at any time. Are you sure?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={()=> setConfirm({open:false, provider:null})}>Cancel</Button>
                    <Button type="button" variant="destructive" onClick={()=>{
                        if (confirm.provider === 'facebook') { setFbConnected(false); toggleFacebook(); }
                        if (confirm.provider === 'google') { setGoogleConnected(false); toggleGoogle(); }
                        setConfirm({open:false, provider:null})
                    }}>Disconnect</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </form>
    </Page>
}