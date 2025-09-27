import React, {useRef, useState} from "react";
import {Button} from "@/components/ui/button.tsx";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog.tsx";
import {QrCode as QrCodeIcon, Download as DownloadIcon } from "lucide-react";
import {QRCodeCanvas} from "qrcode.react";

export interface LandingQrDialogProps {
  publicLink: string;
}

export function LandingQrDialog({ publicLink }: LandingQrDialogProps) {
  const [open, setOpen] = useState(false);
  const qrRef = useRef<HTMLCanvasElement | null>(null);

  async function downloadQr() {
    try {
      const canvas = qrRef.current;
      if (!canvas) return;
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "landing-qr.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("QR download failed", e);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <QrCodeIcon className="size-4" />
          QR code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Landing QR code</DialogTitle>
          <DialogDescription>
            Scan or download the QR. You can also copy the public link.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="w-60 h-60 rounded bg-white border flex items-center justify-center">
            <QRCodeCanvas
              value={publicLink}
              size={240}
              includeMargin
              bgColor="#FFFFFF"
              fgColor="#000000"
              imageSettings={undefined}
              ref={qrRef}
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Button onClick={downloadQr}>
              <DownloadIcon className="size-4" />
              Download QR
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LandingQrDialog;
