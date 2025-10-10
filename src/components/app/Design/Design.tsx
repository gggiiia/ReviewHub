import {Page} from "@/components/app/Page.tsx";
import {TypographyH2, TypographyP} from "@/components/ui/Typography.tsx";
import {DesignPreview} from "@/components/app/Design/DesignPreview.tsx";

export function Design() {
    return <Page className="p-4 lg:w-1/2 lg:ml-[25%]">
        <div className="flex items-center justify-between gap-2 mb-2">
            <TypographyH2 className="m-0">Design</TypographyH2>
        </div>
        <TypographyP className="mb-4">Customise the platform with your own style.</TypographyP>
        <DesignPreview/>
    </Page>
}