import {Page} from "@/components/app/Page.tsx";
import {TypographyH2, TypographyP} from "@/components/ui/Typography.tsx";

export function SettingsPage() {
    return <Page className="p-4 lg:w-1/2 lg:ml-[25%]">
        <TypographyH2>Settings</TypographyH2>
        <TypographyP>Manage your account and your platform integrations.</TypographyP>
    </Page>
}