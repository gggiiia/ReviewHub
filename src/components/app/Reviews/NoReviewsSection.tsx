import {MessageCircleOff} from "lucide-react";
import React from "react";

export function NoReviewsSection() {
    return  <div className={"flex flex-col items-center justify-center gap-2 rounded-md p-3 text-sm text-muted-foreground"}>
        <MessageCircleOff className={"size-14"} />
        <div className="p-3 text-sm text-muted-foreground text-center">No reviews yet.</div>
    </div>
}