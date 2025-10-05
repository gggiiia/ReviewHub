import React, { useMemo, useState } from "react"
import {cn} from "@/lib/utils.ts"
import { Button } from "@/components/ui/button.tsx"
import { Trash2, Pencil } from "lucide-react"
import { DeleteConfirmDialog } from "@/components/ui/DeleteConfirmDialog.tsx"
import { EditLocationDialog } from "@/components/app/Locations/EditLocationDialog.tsx"
import {locationsActions, useLocations} from "@/services/LocationsService.ts";
import IsDesktop from "@/components/ui/isDesktop.tsx";

export interface LocationItem {
  id: string
  name: string
  avatarUrl: string
}

interface LocationCardProps extends React.HTMLAttributes<HTMLDivElement> {
  location: LocationItem
  onEdit?: (location: LocationItem) => void
  onDelete?: (location: LocationItem) => void
}

export function LocationCard({ location, className, onEdit, onDelete, ...props }: LocationCardProps) {

    const {selectedLocation} = useLocations()

    const isSelected = selectedLocation?.id === location.id
    const isSelectedClass = isSelected ? "shadow-xl" : ""

    const [imgError, setImgError] = useState(false)
    const avatarUrl = location.avatarUrl?.trim() || ""
    const showImage = !!avatarUrl && !imgError
    const initial = location.name[0]

    function onSelect() {
        locationsActions.setSelectedLocation(location)
    }

    return (
    <div className={cn("border rounded-md p-3 flex items-center gap-3 transition-colors",isSelectedClass, className)} {...props}>
      {showImage ? (
        <img
          src={avatarUrl}
          alt={location.name}
          className="size-12 rounded object-contain bg-muted"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className="size-12 rounded bg-muted text-muted-foreground flex items-center justify-center font-semibold select-none"
          aria-label={`placeholder for ${location.name}`}
        >
          {initial}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="font-medium truncate">{location.name}</div>
          <div className="flex items-center gap-2 ml-auto">

              {
                  isSelected ?
                      <div className={cn("text-primary-foreground bg-green-500 rounded-2xl w-fit px-3 py-2 text-xs font-bold text-white")}>
                          Active
                      </div> :
                      <Button onClick={onSelect} type="button" variant="outline" size="sm" aria-label="Select location">
                          Select
                      </Button>
              }

              <div className={"mr-auto"}></div>

              <EditLocationDialog location={location} onSubmit={(updated) => onEdit?.(updated)}>
                  <Button type="button" variant="outline" size="sm" aria-label="Edit location">
                      <Pencil className="size-4" />
                      <IsDesktop>
                          Edit
                      </IsDesktop>
                  </Button>
              </EditLocationDialog>
              <DeleteConfirmDialog
                  title="Delete location"
                  description={`Are you sure you want to delete "${location.name}"? This action cannot be undone.`}
                  confirmText="Delete"
                  cancelText="Cancel"
                  onConfirm={() => onDelete?.(location)}
              >
                  {
                      !isSelected &&
                      <Button type="button" variant="ghost" size="sm" aria-label="Delete location">
                          <Trash2 className="size-4 text-destructive" />
                      </Button>
                  }
              </DeleteConfirmDialog>
          </div>
      </div>
    </div>
  )
}

export default LocationCard
