import React from "react";
import {AvatarBadge, type ReviewItem, SourceBadge} from "@/components/app/Reviews/ReviewCard.tsx";
import {MessageCircleOff, Star as StarIcon} from "lucide-react";
import {NoReviewsSection} from "@/components/app/Reviews/NoReviewsSection.tsx";
import IsDesktop from "@/components/ui/isDesktop.tsx";


export interface WidgetFeedProps {
  reviews: ReviewItem[];
}

function Stars({ value }: { value: number }) {
  const stars = Array.from({ length: 5 }, (_, i) => i < value);
  return (
    <div className="flex items-center gap-1" aria-label={`${value} out of 5 stars`}>
      {stars.map((filled, idx) => (
        <StarIcon key={idx} className={`size-4 ${filled ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
      ))}
    </div>
  );
}


export function WidgetFeed({ reviews }: WidgetFeedProps) {
  return (
      <div className="flex flex-col">
        {reviews.length === 0 && (
            <NoReviewsSection/>
        )}
        {reviews.map((current) => {
          return (
            <div key={current.id} className="py-3">
              <div className="border rounded-md p-3 bg-white">
                <div className="flex items-start gap-3">
                    <IsDesktop>
                        <AvatarBadge name={current.author}></AvatarBadge>
                    </IsDesktop>
                  <div className="min-w-0 w-full">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate max-w-[50%]">{current.author}</span>
                      <span className="text-muted-foreground text-xs">{new Date(current.date).toLocaleDateString()}</span>
                      <span className="ml-auto"><SourceBadge source={current.source} /></span>
                    </div>
                    <div className="mt-1">
                      <Stars value={current.rating} />
                    </div>
                    {current.text && <p className="mt-2 text-sm text-foreground/90 break-words">{current.text}</p>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
  );
}

export default WidgetFeed;
