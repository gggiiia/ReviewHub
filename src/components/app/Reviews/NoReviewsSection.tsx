import {Star} from "lucide-react";
import React from "react";
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty.tsx";

export function NoReviewsSection() {
    return  <Empty className="border">
        <EmptyHeader>
            <EmptyMedia variant="icon">
                <Star className="size-6" />
            </EmptyMedia>
            <EmptyTitle>No reviews yet</EmptyTitle>
            <EmptyDescription>
                Once customers start leaving feedback, you'll see it here and can reply.
            </EmptyDescription>
        </EmptyHeader>
    </Empty>
}