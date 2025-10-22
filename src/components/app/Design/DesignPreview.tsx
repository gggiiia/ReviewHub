import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import React, {useRef, useState} from "react";
import useIframeCommunicator from "@/lib/hooks.ts";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import ImageInput from "@/components/ui/image-input.tsx";
import {Chromium, X} from "lucide-react";
import {useForm} from "react-hook-form";

interface DesignForm {
    logo: string
    favicon: string
    font: string,
    color: string
}

export function DesignPreview() {

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting, isDirty},
        watch,
        reset,
        setValue
    } = useForm<DesignForm>({
        defaultValues: {
            logo: "",
            favicon: "",
            font: "",
            color: "#000000"
        }
    })

    const logo = watch("logo")
    const favicon = watch("favicon")
    const color = watch("color")

    const {sendMessage} = useIframeCommunicator()
    const iframeRef = useRef()

    function setLogo(logo: string | null) {
        if (!logo) return
        setValue("logo", logo, {shouldDirty: true})
        sendMessage(iframeRef, {logo: logo})
    }

    function setFavicon(favicon: string | null) {
        if (!favicon) return
        setValue("favicon", favicon, {shouldDirty: true})
        sendMessage(iframeRef, {faviconUrl: favicon})
    }

    function setPrimaryColor(color: string) {
        sendMessage(iframeRef, {primaryColor: color})
        setValue("color", color, {shouldDirty: true})
    }

    return <div className={"flex flex-col lg:flex-row items-start gap-4 h-full"}>
        <div className="flex flex-col gap-4">
            <ImageInput value={logo} onChange={setLogo} label={"Logo"}/>

            <ImageInput value={favicon} onChange={setFavicon} label={"Favicon"}/>

            <div className={"w-full"}>
                <Label>
                    Primary Color
                </Label>
                <div className={"flex items-center gap-2"}>
                    <input type="color"
                           value={color}
                           className="h-10 w-10 rounded border p-1"
                           onChange={(e) => setPrimaryColor(e.target.value)}
                    />
                    <Input type="text" value={color} onChange={(e) => setPrimaryColor(e.target.value)}/>
                </div>
            </div>
        </div>

        <Card className={"w-full h-full"}>
            <CardHeader>
                <div className={"flex items-center "}>
                    <div
                        className={"flex items-center gap-2 bg-primary text-primary-foreground w-fit px-2 py-1 rounded-full"}>
                        {!favicon && <Chromium className={"size-4"}/>}
                        {favicon && <img src={favicon} className={"size-4"}/>}
                        Design preview
                        <div className={" bg-red-500 rounded-full"}>
                            <X className={"text-primary  size-4"} />
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className={"w-full h-[80vh] lg:h-full"}>
                <div className="w-full h-full mx-auto">
                    <div className="relative w-full h-full overflow-hidden rounded-lg border">
                        <iframe ref={iframeRef} className={"w-full h-full"}
                                src={window.location.href}></iframe>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>

}