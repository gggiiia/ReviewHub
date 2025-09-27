import React, {useState} from "react";
import {Page} from "@/components/app/Page.tsx";
import {TypographyH2, TypographyP} from "@/components/ui/Typography.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useLocations} from "@/services/LocationsService.ts";
import {LandingPreview} from "@/components/app/Landing/LandingPreview.tsx";
import { Link as LinkIcon } from "lucide-react";
import { LandingQrDialog } from "@/components/app/Landing/LandingQrDialog.tsx";
import { CopyButton } from "@/components/ui/copy-button.tsx";

export function Landing() {
    const { selectedLocation } = useLocations();


    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://example.com";
    const publicLink = `${baseUrl}/l/${encodeURIComponent(selectedLocation?.id || "loc-1")}`;

    return (
        <Page className="p-4 pt-24 lg:w-1/2 lg:ml-[25%]">
            <div className="flex items-center justify-between gap-2 mb-2">
                <TypographyH2 className="m-0">Landing</TypographyH2>
                <div className="flex items-center gap-2">
                    <CopyButton text={publicLink}>
                        <LinkIcon className="size-4" />
                        Copy link
                    </CopyButton>
                    <LandingQrDialog publicLink={publicLink} />
                </div>
            </div>
            <TypographyP className="mb-4">Preview and share your public landing page to collect customer reviews.</TypographyP>


            <div className="w-full max-w-[640px] mx-auto">
                <div className="relative w-full aspect-square overflow-hidden rounded-lg border">
                    <div className="absolute inset-0 overflow-auto p-0">
                        <LandingPreview/>
                    </div>
                </div>
            </div>
        </Page>
    );
}
