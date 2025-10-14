import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {TagTextarea} from "@/components/ui/TagTextarea.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useLocations} from "@/services/LocationsService.ts";
import {SendHorizontal} from "lucide-react";

const SmsTemplate = `Hi [[Name]], thanks for choosing us. We ask you to leave us a review. 

[[Your link]] 
`

export function SendSms() {

    const {selectedLocation} = useLocations()

    return <Card>
        <CardHeader>
            <CardTitle>SMS</CardTitle>
            <CardDescription>
                Send sms to your customers to get new positive reviews.
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
            <div className={"flex gap-2"}>
                <div className={"w-full"}>
                    <Label>Sender name</Label>
                    <Input value={selectedLocation?.name} />
                </div>
            </div>

            <div>
                <Label>Message Template</Label>
                <TagTextarea value={SmsTemplate}
                             onChange={( value) => console.log(value)}
                             tags={[
                                 {label:"company name", value:"Company name"},
                                 {label:"name", value:"Name"},
                                 {label:"landing link", value:"Your link"}
                             ]}/>
            </div>

        </CardContent>
        <CardFooter>
            <div className={"mr-auto"}/>
            <Button>
                <SendHorizontal />
                Send Message
            </Button>
        </CardFooter>
    </Card>
}