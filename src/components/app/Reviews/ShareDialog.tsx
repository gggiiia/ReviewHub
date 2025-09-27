import React, {ReactNode, useRef, useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {SharePreview, type ReviewData} from "@/components/app/share/SharePreview.tsx";
import html2canvas from "html2canvas-pro";

interface ShareDialogProps {
    review: ReviewData;
    children: ReactNode; // trigger
    title?: string;
}

export function ShareDialog({review, children, title = "Share review"}: ShareDialogProps) {
    const [open, setOpen] = useState(false);
    const previewRef = useRef<HTMLDivElement | null>(null);
    const [downloading, setDownloading] = useState(false); // reserved for future UI disabled state

    async function download() {
        const node = previewRef.current?.firstElementChild as HTMLElement | null;
        if (!node) return;

        try {
            setDownloading(true);
            const scale = 2; // higher quality
            const canvas = await html2canvas(node, {
                scale,
                backgroundColor: null, // keep transparent around rounded corners
                useCORS: true,
                logging: false,
            });
            const pngUrl = canvas.toDataURL("image/png");
            const a = document.createElement('a');
            a.href = pngUrl;
            a.download = `review-${(review.author || 'anonymous').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}.png`;
            a.click();
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Failed to generate PNG with html2canvas', e);
        } finally {
            setDownloading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <span>{children}</span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[540px] max-w-[420px]">
                {/* Make content area scroll if preview is too tall, ensure preview doesn't overflow */}
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Preview and download a square image for this review.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center gap-3 max-h-[75vh] overflow-y-auto pr-1">
                    <div className="w-full" data-share-preview ref={previewRef}>
                        <SharePreview review={review}/>
                    </div>
                </div>

                <DialogFooter>
                    <Button className={"mr-auto"} type="button" variant="ghost"
                            onClick={() => setOpen(false)}>Close</Button>
                    <Button type="button" onClick={download}
                            disabled={downloading}>{downloading ? "Preparing..." : "Download PNG"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default ShareDialog;
