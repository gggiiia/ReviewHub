import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import React, {useRef, useState} from "react";
import useIframeCommunicator from "@/lib/hooks.ts";
import {designActions, useDesign} from "@/services/DesignService.ts";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";

export function DesignPreview() {
    const {sendMessage} = useIframeCommunicator()
    const iframeRef = useRef()
    const [color, setColor] = useState("#000000")

    function onSendColor(color: string) {
        sendMessage(iframeRef, {primaryColor: color})
        setColor(color)
    }

    return <Card className={"w-full h-full"}>
        <CardHeader className={"mx-auto w-full max-w-[420px]"}>
            <Label>
                Primary Color
            </Label>
            <div className={"flex items-center gap-2"}>
                <input type="color"
                       value={color}
                       className="h-10 w-10 rounded border p-1"
                       onChange={(event) => onSendColor(event.target.value)}
                />
                <Input type="text" value={color}/>
            </div>
        </CardHeader>
        <CardContent className={"w-full h-full"}>
            <div className="w-full h-full mx-auto">
                <div className="relative w-full h-full overflow-hidden rounded-lg border">
                    <iframe ref={iframeRef} className={"w-full h-full"} src="http://localhost:3000/Reviews"></iframe>
                </div>
            </div>
        </CardContent>
    </Card>
}