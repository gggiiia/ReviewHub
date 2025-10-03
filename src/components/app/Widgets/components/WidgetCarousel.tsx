import React from "react";
import {AvatarBadge, type ReviewItem, SourceBadge} from "@/components/app/Reviews/ReviewCard.tsx";
import { Star as StarIcon } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel.tsx";
import {NoReviewsSection} from "@/components/app/Reviews/NoReviewsSection.tsx";
import IsDesktop from "@/components/ui/isDesktop.tsx";

export interface WidgetCarouselProps {
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

export function WidgetCarousel({ reviews }: WidgetCarouselProps) {
  const items = reviews;
  const total = items.length;

  if (total === 0) {
    return <NoReviewsSection/>;
  }

  return (
    <div className="relative">
      <Carousel className="w-full">
        {/* Ensure all slides have equal height by stretching items and cards */}
        <CarouselContent className="items-stretch">
          {items.map((current) => {
            return (
              <CarouselItem key={current.id} className={"lg:basis-1/2 xl:basis-1/3 h-full self-stretch"}>
                <div className="border rounded-md p-3 bg-white h-full flex flex-col min-h-[200px]">
                  <div className="flex items-start gap-3 flex-1">
                      <IsDesktop>
                          <AvatarBadge name={current.author}></AvatarBadge>
                      </IsDesktop>
                    <div className="min-w-0 w-full flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate max-w-[50%]">{current.author}</span>
                        <span className="text-muted-foreground text-xs">{new Date(current.date).toLocaleDateString()}</span>
                        <span className="ml-auto"><SourceBadge source={current.source} /></span>
                      </div>
                      <div className="mt-1">
                        <Stars value={current.rating} />
                      </div>
                      {current.text && (
                        <div className="mt-2 text-sm text-foreground/90 break-words max-h-28 overflow-y-auto pr-1 flex-1">{current.text}</div>
                      )}
                      {/* push bottom spacing to bottom to equalize heights */}
                      <div className="mt-2" />
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="-left-4" />
        <CarouselNext className="-right-4" />
      </Carousel>
    </div>
  );
}

export default WidgetCarousel;
