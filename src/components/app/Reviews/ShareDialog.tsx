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

export function ShareDialog({ review, children, title = "Share review" }: ShareDialogProps) {
  const [open, setOpen] = useState(false);
  const [bgColor, setBgColor] = useState<string>("#0ea5e9");
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
      a.download = `review-${(review.author || 'anonymous').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')}.png`;
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
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Preview and download a square image for this review.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-3">
          <div className="w-full max-w-[420px]" data-share-preview ref={previewRef}>
            <SharePreview bgColor={bgColor} review={review} />
          </div>

          <div className="flex items-center gap-2 w-full max-w-[420px]">
            <label className="text-sm font-medium">Background</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="h-9 w-9 rounded border p-0"
              aria-label="Pick background color"
            />
            <input
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="flex-1 h-9 rounded border px-2 text-sm"
              aria-label="Background color hex"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Close</Button>
          <Button type="button" onClick={download} disabled={downloading}>{downloading ? "Preparing..." : "Download PNG"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ShareDialog;
