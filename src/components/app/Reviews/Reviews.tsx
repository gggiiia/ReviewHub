import {TypographyH2, TypographyP} from "@/components/ui/Typography.tsx";
import {Page} from "@/components/app/Page.tsx";
import {ReviewCard} from "@/components/app/Reviews/ReviewCard.tsx";
import { reviewsActions, useReviews } from "@/services/ReviewsService.ts";

export function Reviews() {
    const { reviews } = useReviews();

    return (
        <Page className="p-4 pt-24 lg:w-1/3 lg:ml-[33%]">
            <TypographyH2>Recent Reviews</TypographyH2>
            <TypographyP className={"mb-4"}>Respond to customer feedback from one place.</TypographyP>

            <div className="overflow-y-auto pr-1 space-y-3">
                {reviews.map((r) => (
                    <ReviewCard key={r.id} review={r} onReplySubmit={(rev, reply) => reviewsActions.sendReply(rev.id, reply)} />
                ))}
            </div>
        </Page>
    )
}