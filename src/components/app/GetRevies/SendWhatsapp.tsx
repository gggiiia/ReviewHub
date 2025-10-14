import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {TagTextarea} from "@/components/ui/TagTextarea.tsx";
import {Button} from "@/components/ui/button.tsx";
import {SendHorizontal} from "lucide-react";

const WhatsappTemplate = `Hi [[Name]],
                
thank you for choosing to trust us at [[Company name]].
                
You are important to us and we want to know what you think! Would you like to give us two minutes of your time to write a review?

Reviews allow our business to grow, you'd be giving us a big hand!

To leave a review, click the link below, the link is only clickable if we are a saved contact of yours, in case you don't see it clickable, add us to your contacts.

[[Your link]]

Thanks!
`

export const SendWhatsapp = () => {
    return <Card>
        <CardHeader>
            <CardTitle>Whatsapp</CardTitle>
            <CardDescription>
                Send a Whatsapp to your customers to get new positive reviews.
            </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
            <div className={"flex gap-2"}>
                <div className={"w-full"}>
                    <Label>Name</Label>
                    <Input></Input>
                </div>
                <div className={"w-full"}>
                    <Label>Phone</Label>
                    <Input type={"tel"}>

                    </Input>
                </div>
            </div>
            <Separator/>

            <div>
                <Label>Message Template</Label>
                <TagTextarea value={WhatsappTemplate}
                             onChange={(value) => console.log(value)}
                             tags={[
                                 {label: "company name", value: "Company name"},
                                 {label: "name", value: "Name"},
                                 {label: "landing link", value: "Your link"}
                             ]}/>
            </div>

        </CardContent>
        <CardFooter>
            <div className={"mr-auto"}/>
            <Button>
                <SendHorizontal/>
                Send Message
            </Button>
        </CardFooter>
    </Card>
}