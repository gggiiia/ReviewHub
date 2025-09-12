import {TypographyH2, TypographyH4, TypographyP} from "@/components/ui/Typography.tsx";
import {Page} from "@/components/app/Page.tsx";
import {ReviewCard, type ReviewItem} from "@/components/app/Reviews/ReviewCard.tsx";


const mockReviews: ReviewItem[] = [
    {
        id: "r1",
        author: "Alice Johnson",
        rating: 5,
        date: "2025-08-02",
        text: "Fantastic experience! Staff was friendly and the service was quick. Highly recommend to everyone.",
        reply: "Thank you, Alice! We appreciate your kind words and hope to see you again soon.",
        source: "google",
    },
    {
        id: "r2",
        author: "Bob Smith",
        rating: 4,
        date: "2025-08-01",
        text: "Great overall. A small wait during peak hours, but totally worth it.",
        source: "facebook",
    },
    {
        id: "r3",
        author: "Clara Martinez",
        rating: 3,
        date: "2025-07-28",
        text: "Good place. Could improve seating comfort, but the quality is solid.",
        reply: null,
        source: "google",
    },
    {
        id: "r4",
        author: "David Lee",
        rating: 5,
        date: "2025-07-22",
        text: null,
        source: "facebook",
    },
    {
        id: "r5",
        author: "Emma Wilson",
        rating: 2,
        date: "2025-07-20",
        text: "Not my favorite visit this time. Staff seemed overwhelmed.",
        source: "google",
    },
    {
        id: "r6",
        author: "Frank Nguyen",
        rating: 4,
        date: "2025-07-12",
        text: "Tasty and consistent. Prices are fair and the ambiance is nice.",
        reply: "Thanks Frank! We'll keep it up.",
        source: "facebook",
    },
    {
        id: "r7",
        author: "Grace Hopper",
        rating: 5,
        date: "2025-07-01",
        text: "Exceptional! The team went above and beyond. Will recommend to friends.",
        source: "google",
    }
]

export function Reviews() {
    return (
        <Page className="p-4 pt-24 lg:w-1/2 lg:ml-[25%]">
            <TypographyH2>Recent Reviews</TypographyH2>
            <TypographyP className={"mb-4"}>Respond to customer feedback from one place.</TypographyP>

            <div className="overflow-y-auto pr-1 space-y-3">
                {mockReviews.map((r) => (
                    <ReviewCard key={r.id} review={r} />
                ))}
            </div>
        </Page>
    )
}