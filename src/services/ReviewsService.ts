import { proxy } from "valtio/vanilla";
import { useSnapshot } from "valtio/react";
import type { ReviewItem } from "@/components/app/Reviews/ReviewCard.tsx";

// Initial mock reviews are currently defined in Reviews.tsx.
// We move them here so all data and actions are centralized.
const initialReviews: ReviewItem[] = [
  {
    id: "r1",
    author: "Alice Johnson",
    rating: 5,
    date: "2025-08-02",
    text: "Fantastic experience! Staff was friendly and the service was quick. Highly recommend to everyone.",
    reply: "Thank you, Alice! We appreciate your kind words and hope to see you again soon.",
    source: "google",
  },
  /*{
    id: "r1b",
    author: "Very Long Reviewer Name That Still Reads Well",
    rating: 5,
    date: "2025-09-26",
    text:
      "This is a very long review intended to test wrapping, truncation, and overall layout stability across multiple components including ReviewCard, WidgetCarousel, WidgetFeed, and WidgetMasonry. From the moment I walked in, I was impressed by the cleanliness, the attention to detail, and the genuine warmth of the staff. The ordering process was straightforward, the explanations were clear, and every recommendation turned out to be spot on. I particularly appreciated how the team anticipated questions before I even had to ask them—something that speaks to both experience and care. Over the course of my visit, I interacted with several team members and each of them provided consistent, high‑quality service. The product quality was equally impressive: well‑made, thoughtfully presented, and exactly as described. Beyond the core experience, small touches like prompt follow‑ups, a welcoming atmosphere, and an obvious commitment to continuous improvement made a big difference. I’ve visited similar places in the past, but this one genuinely stands out for its blend of professionalism and personality. I left feeling confident, satisfied, and eager to return. If you’re on the fence, take this as your sign to give them a try—you’ll likely walk away with the same positive impression. Kudos to the entire team for an exceptional experience from start to finish!",
    source: "google",
  },*/
  { id: "r2", author: "Bob Smith", rating: 4, date: "2025-08-01", text: "Great overall. A small wait during peak hours, but totally worth it.", source: "facebook" },
  {
    id: "r3",
    author: "Clara Martinez",
    rating: 3,
    date: "2025-07-28",
    text: "Good place. Could improve seating comfort, but the quality is solid.",
    reply: null,
    source: "google",
  },
  { id: "r4", author: "David Lee", rating: 5, date: "2025-07-22", text: null, source: "facebook" },
  { id: "r5", author: "Emma Wilson", rating: 2, date: "2025-07-20", text: "Not my favorite visit this time. Staff seemed overwhelmed.", source: "google" },
  { id: "r6", author: "Frank Nguyen", rating: 4, date: "2025-07-12", text: "Tasty and consistent. Prices are fair and the ambiance is nice.", reply: "Thanks Frank! We'll keep it up.", source: "facebook" },
  { id: "r7", author: "Grace Hopper", rating: 5, date: "2025-07-01", text: "Exceptional! The team went above and beyond. Will recommend to friends.", source: "google" },
  // Added more fake reviews below for richer demos
  { id: "r8", author: "Hannah Kim", rating: 4, date: "2025-09-10", text: "Really good experience. The staff were attentive and the place was clean.", source: "google" },
  { id: "r9", author: "Ian Thompson", rating: 1, date: "2025-09-05", text: "Disappointed this time. My order was wrong and took a while to fix.", source: "facebook" },
  { id: "r10", author: "Julia Chen", rating: 5, date: "2025-08-28", text: "Absolutely loved it! Everything was perfect from start to finish.", reply: "Thank you, Julia! We're thrilled you had a great time.", source: "google" },
  { id: "r11", author: "Kevin Patel", rating: 3, date: "2025-08-18", text: null, source: "facebook" },
  { id: "r12", author: "Lara O'Connor", rating: 4, date: "2025-08-15", text: "Good value and friendly people. Will come again.", source: "google" },
  { id: "r13", author: "Marco Rossi", rating: 2, date: "2025-08-09", text: "Service was slow and the table wasn't ready on time.", source: "facebook" },
  { id: "r14", author: "Nina Berg", rating: 5, date: "2025-07-30", text: "Best spot in town! Highly recommended.", source: "google" },
  { id: "r15", author: "Owen Wright", rating: 4, date: "2025-07-25", text: "Great atmosphere and good prices.", reply: "Thanks Owen! Appreciate your support.", source: "facebook" },
  { id: "r16", author: "Priya Singh", rating: 5, date: "2025-07-18", text: "Wonderful service and delicious menu.", source: "google" },
  { id: "r17", author: "Quentin Dupont", rating: 3, date: "2025-07-11", text: "Average this time; hoping for better next visit.", source: "facebook" },
  { id: "r18", author: "Riley Adams", rating: 4, date: "2025-07-05", text: "Solid experience overall, would recommend.", source: "google" },
];

const reviewsState = proxy({
  reviews: initialReviews as ReviewItem[],
});

export const reviewsActions = {
  setReviews(next: ReviewItem[]) {
    reviewsState.reviews = next;
  },
  sendReply(id: string, reply: string) {
    const trimmed = (reply || "").trim();
    if (!trimmed) return;
    reviewsState.reviews = reviewsState.reviews.map((r) =>
      r.id === id ? { ...r, reply: trimmed } : r
    );
  },
};

export function useReviews() {
  return useSnapshot(reviewsState);
}
