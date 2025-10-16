import {Page} from "@/components/app/Page.tsx";
import {TypographyH2, TypographyP} from "@/components/ui/Typography.tsx";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";
import {SendEmail} from "@/components/app/GetRevies/SendEmail.tsx";
import {SendSms} from "@/components/app/GetRevies/SendSms.tsx";
import {SendWhatsapp} from "@/components/app/GetRevies/SendWhatsapp.tsx";
import {Mail, MessageCircle, MessageSquare} from "lucide-react";

export function GetReviews() {

    const [tab, setTab] = useState("account")


    return <Page className="p-4 lg:w-1/3 lg:ml-[33%]">
        <div className="flex items-center justify-between gap-2 mb-2">
            <TypographyH2 className="m-0">Get Reviews</TypographyH2>
        </div>
        <TypographyP className="mb-4">Send personalized messages to collect new reviews from your customers.</TypographyP>

        <Tabs defaultValue="Email">
            <TabsList>
                <TabsTrigger className={"cursor-pointer"} value="Email"><Mail />Email</TabsTrigger>
                <TabsTrigger className={"cursor-pointer"} value="Sms"><MessageSquare />SMS</TabsTrigger>
                <TabsTrigger className={"cursor-pointer"} value="whatsapp"><MessageCircle />Whatsapp</TabsTrigger>
            </TabsList>
            <TabsContent value="Email">
                <SendEmail/>
            </TabsContent>
            <TabsContent value="Sms">
               <SendSms/>
            </TabsContent>
            <TabsContent value="whatsapp">
                <SendWhatsapp/>
            </TabsContent>
        </Tabs>
    </Page>
}