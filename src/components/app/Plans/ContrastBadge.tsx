import {getContrastTextColorClass} from "@/lib/colors.ts";
import {cn} from "@/lib/utils.ts";

interface PriceBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    color: string;
}

export function ContrastBadge(props: PriceBadgeProps) {
    const {color} = props
    const colorClass = getContrastTextColorClass(color)

    return <div style={{backgroundColor: color}}
                {...props}
                className={cn("text-xs px-2 py-1 rounded-full font-bold", props.className, colorClass)}/>
}