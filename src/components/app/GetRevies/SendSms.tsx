import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {TagTextarea} from "@/components/ui/TagTextarea.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useLocations} from "@/services/LocationsService.ts";
import {SendHorizontal} from "lucide-react";
import {useForm} from "react-hook-form";

const SmsTemplate = `Hi [[Name]], thanks for choosing us. We ask you to leave us a review. 

[[Your link]] 
`
interface SendSmsForm {
    name: string
    phone: string
    sender: string
    message: string
}

export function SendSms() {


    const {selectedLocation} = useLocations()

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting, isDirty},
        watch,
        reset,
        setValue
    } = useForm<SendSmsForm>({
        defaultValues: {
            name: "",
            phone: "",
            sender: selectedLocation?.name,
            message: SmsTemplate
        }
    })

    function onSubmit(values: SendSmsForm) {
        console.log(values)
    }

    return <Card>
        <CardHeader>
            <CardTitle>SMS</CardTitle>
            <CardDescription>
                Send sms to your customers to get new positive reviews.
            </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
            <div className={"flex flex-col lg:flex-row  gap-2"}>
                <div className={"w-full"}>
                    <Label>Name</Label>
                    <Input {...register("name")}></Input>
                </div>
                <div className={"w-full"}>
                    <Label>Phone</Label>
                    <Input {...register("phone")} type={"tel"}>

                    </Input>
                </div>
            </div>
            <Separator/>
            <div className={"flex gap-2"}>
                <div className={"w-full"}>
                    <Label>Sender name</Label>
                    <Input {...register("sender")} value={selectedLocation?.name} />
                </div>
            </div>

            <div>
                <Label>Message Template</Label>
                <TagTextarea value={watch("message")}
                             onChange={( value) => setValue("message",value,{shouldDirty:true})}
                             tags={[
                                 {label:"company name", value:"Company name"},
                                 {label:"name", value:"Name"},
                                 {label:"landing link", value:"Your link"}
                             ]}/>
            </div>

        </CardContent>
        <CardFooter>
            <div className={"mr-auto"}/>
            <Button className={"w-full lg:w-auto"} disabled={!isDirty} onClick={handleSubmit(onSubmit)}>
                <SendHorizontal />
                Send SMS
            </Button>
        </CardFooter>
    </Card>
}