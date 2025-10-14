import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {TagTextarea} from "@/components/ui/TagTextarea.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useLocations} from "@/services/LocationsService.ts";
import {SendHorizontal} from "lucide-react";

const EmailTemplate = `
Hi [[Name]],

thank you for choosing to trust us at [[Company name]].

You are important to us and we want to know what you think! Would you like to give us two minutes of your time to write a review?

Reviews allow our business to grow, you'd be giving us a big hand!

[[Your link]]

Thanks!`

export function SendEmail() {

    const {selectedLocation} = useLocations()

    return <Card>
        <CardHeader>
            <CardTitle>Email</CardTitle>
            <CardDescription>
                Send emails to your customers to get new positive reviews.
            </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
            <div className={"flex gap-2"}>
                <div className={"w-full"}>
                    <Label>Name</Label>
                    <Input></Input>
                </div>
                <div className={"w-full"}>
                    <Label>Email</Label>
                    <Input type={"email"}>

                    </Input>
                </div>
            </div>
            <Separator/>
            <div className={"flex gap-2"}>
                <div className={"w-full"}>
                    <Label>Sender name</Label>
                    <Input value={selectedLocation?.name}/>
                </div>
                <div className={"w-full"}>
                    <Label>Subject</Label>
                    <Input value={"Leave us a review"}/>
                </div>
            </div>

            <div>
                <Label>Message Template</Label>
                <TagTextarea value={EmailTemplate}
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