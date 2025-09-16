import React, {useState} from "react";
import {Page} from "@/components/app/Page.tsx";
import {TypographyH2, TypographyP} from "@/components/ui/Typography.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useLocations} from "@/services/LocationsService.ts";
import {LandingPreview} from "@/components/app/Landing/LandingPreview.tsx";
import { Link as LinkIcon } from "lucide-react";

export function Landing() {
    const { selectedLocation } = useLocations();
    const [copied, setCopied] = useState<"link" | null>(null);

    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://example.com";
    const publicLink = `${baseUrl}/l/${encodeURIComponent(selectedLocation?.id || "loc-1")}`;

    async function copy(text: string, kind: "link") {
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                const ta = document.createElement("textarea");
                ta.value = text;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand("copy");
                document.body.removeChild(ta);
            }
            setCopied(kind);
            setTimeout(() => setCopied(null), 2000);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error("Copy failed", e);
        }
    }

    return (
        <Page className="p-4 pt-24 lg:w-1/2 lg:ml-[25%]">
            <div className="flex items-center justify-between gap-2 mb-2">
                <TypographyH2 className="m-0">Landing</TypographyH2>
                <Button onClick={() => copy(publicLink, "link")}>
                    {copied === "link" ? (
                        "Copied!"
                    ) : (
                        <>
                            <LinkIcon className="size-4" />
                            Copy link
                        </>
                    )}
                </Button>
            </div>
            <TypographyP className="mb-4">Preview and share your public landing page to collect customer reviews.</TypographyP>

            <Card className="mb-4">
                <CardHeader className="border-b">
                    <CardTitle>Landing page preview</CardTitle>
                    <CardDescription>This is how your customers will experience the review flow.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="w-full max-w-[640px] mx-auto">
                        <div className="relative w-full aspect-square overflow-hidden rounded-lg border">
                            <div className="absolute inset-0 overflow-auto p-0">
                                <LandingPreview/>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Page>
    );
}
