import React, {useMemo} from "react";
import {Page} from "@/components/app/Page.tsx";
import {TypographyH2, TypographyH4, TypographyP} from "@/components/ui/Typography.tsx";
import {useLocations} from "@/services/LocationsService.ts";
import {WidgetCarousel} from "@/components/app/Widgets/components/WidgetCarousel.tsx";
import {WidgetFeed} from "@/components/app/Widgets/components/WidgetFeed.tsx";
import {WidgetMasonry} from "@/components/app/Widgets/components/WidgetMasonry.tsx";
import {useReviews} from "@/services/ReviewsService.ts";
import IsDesktop from "@/components/ui/isDesktop.tsx";

export function Widgets() {
    const {selectedLocation} = useLocations();
    const {reviews} = useReviews();

    const positiveReviews = useMemo(
        () => reviews.filter(r => r.rating >= 4 && (r.text?.trim().length || 0) > 0),
        [reviews]
    );

    return (
        <Page className="p-4 lg:w-1/2 lg:ml-[25%]">
            <div className="flex items-center justify-between gap-2 mb-2">
                <TypographyH2 className="m-0">Widgets</TypographyH2>
            </div>
            <TypographyP className="mb-4">Preview embeddable widgets showing your positive public reviews
                for {selectedLocation?.name || "your business"}.</TypographyP>

            <section className="space-y-6">
                <div>
                    <TypographyH4 className="mb-2">Carousel</TypographyH4>
                    <div className="rounded-md p-4 bg-primary/5">
                        <WidgetCarousel reviews={positiveReviews}/>
                    </div>
                </div>
                <div>
                    <TypographyH4 className="mb-2">Feed</TypographyH4>
                    <div className="rounded-md p-4 bg-primary/5">
                        <WidgetFeed reviews={positiveReviews}/>
                    </div>
                </div>
                <IsDesktop>
                    <div>
                        <TypographyH4 className="mb-2">Masonry</TypographyH4>
                        <div className="rounded-md p-4 bg-primary/5">
                            <WidgetMasonry reviews={positiveReviews}/>
                        </div>
                    </div>
                </IsDesktop>
            </section>
        </Page>
    );
}

export default Widgets;
