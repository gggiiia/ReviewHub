import React from "react";
import {Page} from "@/components/app/Page.tsx";
import {TypographyH2, TypographyP} from "@/components/ui/Typography.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useLocations} from "@/services/LocationsService.ts";
import {SharePreview} from "@/components/app/share/SharePreview.tsx";
import { shareActions, useShare } from "@/services/ShareService.ts";
import {Label} from "@/components/ui/label.tsx";


export function Share() {
  const { selectedLocation } = useLocations();
  const { bgColor } = useShare();

  const businessName = selectedLocation?.name || "Your Business";


  async function download() {
    const wrapper = document.querySelector('[data-share-preview]');
    const node = wrapper?.firstElementChild as HTMLElement | null;
    if (!node) return;

    // Use an inline dom-to-image using foreignObject
    const scale = 2; // improve quality
    const rect = node.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const cloned = node.cloneNode(true) as HTMLElement;
    // Ensure absolute sizes for rendering
    cloned.style.margin = '0';
    cloned.style.boxSizing = 'border-box';
    cloned.style.width = width + 'px';
    cloned.style.height = height + 'px';

    const container = document.createElement('div');
    container.appendChild(cloned);
    const xhtml = `<div xmlns=\"http://www.w3.org/1999/xhtml\">${container.innerHTML}</div>`;

    const svg = `<?xml version=\"1.0\" encoding=\"UTF-8\"?>
    <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"${width * scale}\" height=\"${height * scale}\" viewBox=\"0 0 ${width} ${height}\">
      <foreignObject width=\"100%\" height=\"100%\">${xhtml}</foreignObject>
    </svg>`;

    const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    const pngUrl: string = await new Promise((resolve) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width * scale;
        canvas.height = height * scale;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve('');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/png'));
        URL.revokeObjectURL(url);
      };
      img.onerror = () => resolve('');
      img.src = url;
    });

    if (!pngUrl) return;
    const a = document.createElement('a');
    a.href = pngUrl;
    const fileNameSafe = businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    a.download = `${fileNameSafe || 'share'}-reviews.png`;
    a.click();
  }
  
  return (
    <Page className="p-4 lg:w-1/2 lg:ml-[25%]">
      <div className="flex items-center justify-between gap-2 mb-2">
        <TypographyH2 className="m-0">Share</TypographyH2>
      </div>
      <TypographyP className="mb-4">Generate a square image of a single review to share on social media. Pick a background color; text color adjusts automatically for contrast.</TypographyP>

      <Card>
        <CardContent>
          <div className="flex flex-col max-w-[420px] m-auto gap-4 items-center Create selector">
              <div className="flex flex-col gap-3 w-full">
                  <Label className="text-sm font-medium">Background color</Label>
                  <div className="flex items-center gap-2">
                      <input
                          type="color"
                          value={bgColor}
                          onChange={(e) => shareActions.setBgColor(e.target.value)}
                          className="h-10 w-10 rounded border p-1"
                          aria-label="Pick background color"
                      />
                      <Input value={bgColor} onChange={(e) => shareActions.setBgColor(e.target.value)} aria-label="Background color hex" />
                  </div>
              </div>
            {/* Preview area */}
            <div className="w-full" data-share-preview>
              <SharePreview
                review={{
                  author: "Alex Johnson",
                  rating: 5,
                  date: new Date().toLocaleDateString(),
                  text: "Absolutely fantastic service! The staff was friendly and the atmosphere was welcoming. I’ll definitely be coming back and recommending this place to friends.",
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Page>
  );
}
