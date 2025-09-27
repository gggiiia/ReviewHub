import * as React from "react";
import {useCallback, useEffect, useRef, useState} from "react";
import { Button, type buttonVariants } from "@/components/ui/button.tsx";
import type { VariantProps } from "class-variance-authority";
import {cn, copyToClipboard} from "@/lib/utils.ts";

export interface CopyButtonProps
  extends Omit<React.ComponentProps<"button">, "onClick">,
    VariantProps<typeof buttonVariants> {
  text: string;
  durationMs?: number;
  copiedLabel?: React.ReactNode;
  children?: React.ReactNode;
  onCopied?: () => void;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export function CopyButton({
  text,
  durationMs = 2000,
  copiedLabel = "Copied!",
  children,
  onCopied,
  iconLeft,
  iconRight,
  className,
  variant,
  size,
  disabled,
  ...rest
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await copyToClipboard(text);
      setCopied(true);
      if (onCopied) onCopied();
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setCopied(false), durationMs);
    } catch (e) {
      console.error("Copy failed", e);
    }
  }, [text, durationMs, onCopied]);

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      disabled={disabled}
      className={cn(className)}
      onClick={handleCopy}
      {...rest}
    >
      {!copied && iconLeft}
      {copied ? copiedLabel : children}
      {!copied && iconRight}
    </Button>
  );
}

export default CopyButton;
