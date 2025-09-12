import React, {useCallback, useEffect, useRef, useState} from "react"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button.tsx"

export interface ImageInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> {
  value?: string | null
  onChange?: (value: string | null, file?: File | null) => void
  label?: string
  helperText?: string
  error?: string
  previewClassName?: string
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ""))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function ImageInput({
  value,
  onChange,
  accept = "image/*",
  label,
  helperText,
  error,
  id,
  className,
  previewClassName,
  disabled,
  ...rest
}: ImageInputProps) {
  const [internalPreview, setInternalPreview] = useState<string | null>(value ?? null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // keep in sync if parent controls value
  useEffect(() => {
    setInternalPreview(value ?? null)
  }, [value])

  const handleFile = useCallback(async (file: File) => {
    if (!file) return
    try {
      const dataUrl = await readFileAsDataUrl(file)
      setInternalPreview(dataUrl)
      onChange?.(dataUrl, file)
    } catch {
      // ignore
    }
  }, [onChange])

  const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) await handleFile(f)
  }

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
    if (disabled) return
    const f = e.dataTransfer.files?.[0]
    if (f) await handleFile(f)
  }

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    if (disabled) return
    setDragOver(true)
  }
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (disabled) return
    setDragOver(true)
  }
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const clear = () => {
    setInternalPreview(null)
    onChange?.(null, null)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium">{label}</label>
      )}
      <div
        className={cn(
          "rounded-md border p-3 flex items-center gap-3 transition-colors hover:bg-accent/20 hover:border-ring/50",
          dragOver && "bg-accent/40 border-ring ring-2 ring-ring/30",
          disabled && "opacity-60",
        )}
        onDrop={onDrop}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <div className={cn("size-24 rounded bg-muted overflow-hidden shrink-0 flex items-center justify-center", dragOver && "bg-accent/50", previewClassName)}>
          {internalPreview ? (
            <img src={internalPreview} alt="Selected image preview" className="w-full h-full object-cover" />
          ) : (
            <span className={cn("text-xs", dragOver ? "text-foreground" : "text-muted-foreground")}>Drop or select</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={inputRef}
              id={id}
              type="file"
              accept={accept}
              onChange={onInputChange}
              disabled={disabled}
              aria-invalid={!!error}
              className="block text-sm invisible w-0 h-0 absolute"
              {...rest}
            />
            {internalPreview && (
              <Button type="button" variant="outline" size="sm" onClick={clear} disabled={disabled}>Clear</Button>
            )}
              {
                  !internalPreview && (
                   <Button type="button" variant="outline" size="sm" disabled={disabled} onClick={() => inputRef.current?.click()}>Select</Button>
                  )
              }
          </div>
          {helperText && !error && (
            <p className="text-xs text-muted-foreground mt-1">{helperText}</p>
          )}
          {error && (
            <p className="text-sm text-destructive mt-1">{error}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImageInput
