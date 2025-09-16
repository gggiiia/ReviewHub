import React from "react"
import {cn} from "@/lib/utils.ts"
import { Button } from "@/components/ui/button.tsx"
import { Trash2, Pencil } from "lucide-react"
import { DeleteConfirmDialog } from "@/components/ui/DeleteConfirmDialog.tsx"
import { EditLocationDialog } from "@/components/app/Locations/EditLocationDialog.tsx"
import {useLocations} from "@/services/LocationsService.ts";

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

    const isSelected = selectedLocation.id === location.id
    const isSelectedClass = isSelected ? "shadow-xl border border-black" : ""

    return (
    <div className={cn("border rounded-md p-3 flex items-center gap-3 hover:bg-accent/40 transition-colors",isSelectedClass, className)} {...props}>
      <img
        src={location.avatarUrl}
        alt={location.name}
        className="size-12 rounded object-cover bg-muted"
        loading="lazy"
      />
      <div className="min-w-0 flex-1">
        <div className="font-medium truncate">{location.name}</div>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <EditLocationDialog location={location} onSubmit={(updated) => onEdit?.(updated)}>
          <Button type="button" variant="outline" size="sm" aria-label="Edit location">
            <Pencil className="size-4" />
            Edit
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
  )
}

export default LocationCard
