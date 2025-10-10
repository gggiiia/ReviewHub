import {TypographyH2, TypographyP} from "@/components/ui/Typography.tsx";
import {Page} from "@/components/app/Page.tsx";
import {ReviewCard} from "@/components/app/Reviews/ReviewCard.tsx";
import { reviewsActions, useReviews } from "@/services/ReviewsService.ts";
import {NoReviewsSection} from "@/components/app/Reviews/NoReviewsSection.tsx";
import {useLocations} from "@/services/LocationsService.ts";
import {Navigate} from "react-router";

export function Reviews() {
    const { reviews } = useReviews();
    const {locations} = useLocations()

    if(locations.length === 0) return (
        <Navigate to="/Locations" replace />
    )

    return (
        <Page className="p-4 lg:w-1/2 lg:ml-[25%]">
            <TypographyH2>Recent Reviews</TypographyH2>
            <TypographyP className={"mb-4"}>Respond to customer feedback from one place.</TypographyP>

            {
                reviews.length > 0 ?
                    <div className="pr-1 space-y-3">
                        {reviews.map((r) => (
                            <ReviewCard key={r.id} review={r} onReplySubmit={(rev, reply) => reviewsActions.sendReply(rev.id, reply)} />
                        ))}
                    </div> :
                    <NoReviewsSection/>
            }
        </Page>
    )
}