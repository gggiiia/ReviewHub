import React, {useMemo, useRef} from "react";
import { Star as StarIcon } from "lucide-react";
import {useLocations} from "@/services/LocationsService.ts";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.trim().replace(/^#/, "");
  if (m.length === 3) {
    const r = parseInt(m[0] + m[0], 16);
    const g = parseInt(m[1] + m[1], 16);
    const b = parseInt(m[2] + m[2], 16);
    return { r, g, b };
  }
  if (m.length === 6) {
    const r = parseInt(m.slice(0, 2), 16);
    const g = parseInt(m.slice(2, 4), 16);
    const b = parseInt(m.slice(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

function relativeLuminance(r: number, g: number, b: number) {
  const toLinear = (v: number) => {
    const srgb = v / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
  };
  const R = toLinear(r);
  const G = toLinear(g);
  const B = toLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function pickTextColor(bg: string): "#000000" | "#FFFFFF" {
  const rgb = hexToRgb(bg) || { r: 255, g: 255, b: 255 };
  const Lbg = relativeLuminance(rgb.r, rgb.g, rgb.b);
  const Lwhite = 3;
  const Lblack = 0;
  const contrastWhite = (Math.max(Lbg, Lwhite) + 0.05) / (Math.min(Lbg, Lwhite) + 0.05);
  const contrastBlack = (Math.max(Lbg, Lblack) + 0.05) / (Math.min(Lbg, Lblack) + 0.05);
  return contrastWhite >= contrastBlack ? "#FFFFFF" : "#000000";
}

export interface ReviewData {
  author: string;
  rating: number; // 1-5
  date: string | Date;
  text: string;
}

export interface SharePreviewProps {
  bgColor: string;
  review: ReviewData;
  className?: string;
}

export function SharePreview({ bgColor, review, className }: SharePreviewProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const textColor = useMemo(() => pickTextColor(bgColor), [bgColor]);

  const isDark = textColor === "#FFFFFF";
  const surface = isDark ? "rgba(255,255,255,0.08)" : "rgba(17,24,39,0.06)"; // subtle card surface over bg
  const border = isDark ? "rgba(255,255,255,0.18)" : "rgba(17,24,39,0.12)";
  const muted = isDark ? "#E5E7EB" : "#475569";
  const primary = isDark ? "#FFD166" : "#F59E0B";
  const strong = isDark ? "#FFFFFF" : "#111827";

  const reviewerInitial = review.author.trim().charAt(0).toUpperCase() || "?";
  const dateText = typeof review.date === "string" ? review.date : review.date.toLocaleDateString();

  // Business footer data from selected location
  const { selectedLocation } = useLocations();
  const businessName = selectedLocation?.name || "Your Business";
  const businessInitial = (selectedLocation?.name || selectedLocation?.id || "?").trim().charAt(0).toUpperCase();
  const businessAvatar = selectedLocation?.avatarUrl;

  return (
    <div ref={rootRef} className={className}>
      <div
        className="w-full aspect-square overflow-hidden rounded-lg border p-6 md:p-8 relative"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <div className="w-full h-full max-w-xl mx-auto flex flex-col gap-8 justify-center">
          {/* Header: Avatar + Name + Date */}
          <div className="flex items-center gap-4">
            <div
              className="rounded-full flex items-center justify-center shadow-sm"
              style={{ width: 64, height: 64, backgroundColor: isDark ? "rgba(255,255,255,0.9)" : "#ffffff", border: `1px solid ${border}` }}
              aria-hidden="true"
            >
              <span className="font-bold" style={{ fontSize: 26, color: "#111827" }}>{reviewerInitial}</span>
            </div>
            <div className="min-w-0">
              <div className="font-semibold truncate" style={{ fontSize: 20, color: strong }}>{review.author}</div>
              <div className="text-sm" style={{ color: muted }}>{dateText}</div>
            </div>
          </div>

          {/* Message bubble */}
          <div className="relative" style={{ alignSelf: "flex-start" }}>
            <div
              className="rounded-2xl px-5 py-4 shadow-md"
              style={{ backgroundColor: surface, border: `1px solid ${border}`, backdropFilter: "saturate(120%) blur(0.5px)" as React.CSSProperties["backdropFilter"] }}
            >
              <div className="flex items-center gap-1 mb-2" style={{ color: primary }}>
                {[1,2,3,4,5].map(i => (
                  <StarIcon
                    key={i}
                    className="size-5"
                    fill={i <= review.rating ? primary : "none"}
                    color={i <= review.rating ? primary : muted}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <div className="text-base" style={{ lineHeight: 1.6, color: strong }}>
                {review.text}
              </div>
            </div>
          </div>

            <div
                className="flex items-center justify-center gap-2"
                style={{ bottom: 12 }}
            >
                {businessAvatar ? (
                    <img
                        src={businessAvatar}
                        alt={`${businessName} logo`}
                        style={{ width: 20, height: 20, borderRadius: 9999, objectFit: "cover", border: `1px solid ${border}`, background: isDark ? "rgba(255,255,255,0.9)" : "#ffffff" }}
                        loading="lazy"
                    />
                ) : (
                    <div
                        aria-hidden="true"
                        style={{ width: 20, height: 20, borderRadius: 9999, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#334155", background: "#e2e8f0", border: `1px solid ${border}` }}
                    >
                        {businessInitial}
                    </div>
                )}
                <span style={{ fontSize: 12, letterSpacing: 0.2, color: muted }}>{businessName}</span>
            </div>
        </div>
      </div>
    </div>
  );
}

export default SharePreview;
