import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {TagTextarea} from "@/components/ui/TagTextarea.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useLocations} from "@/services/LocationsService.ts";
import {SendHorizontal} from "lucide-react";
import {useForm} from "react-hook-form";
import type {NewClientData} from "@/components/app/Clients/CreateClientDialog.tsx";

const EmailTemplate = `
Hi [[Name]],

thank you for choosing to trust us at [[Company name]].

You are important to us and we want to know what you think! Would you like to give us two minutes of your time to write a review?

Reviews allow our business to grow, you'd be giving us a big hand!

[[Your link]]

Thanks!`

interface SendEmailForm {
    name: string
    email: string
    sender: string
    subject: string
    message: string
}

export function SendEmail() {

    const {selectedLocation} = useLocations()
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting, isDirty},
        watch,
        reset,
        setValue
    } = useForm<SendEmailForm>({
        defaultValues: {
            name: "",
            email: "",
            sender: selectedLocation?.name,
            subject: "Leave us a review",
            message: EmailTemplate
        }
    })


    function onSubmit(values: NewClientData) {
        console.log(values)
    }

    return <Card>
        <CardHeader>
            <CardTitle>Email</CardTitle>
            <CardDescription>
                Send emails to your customers to get new positive reviews.
            </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
            <div className={"flex flex-col lg:flex-row gap-2"}>
                <div className={"w-full"}>
                    <Label>Name</Label>
                    <Input {...register("name")}></Input>
                </div>
                <div className={"w-full"}>
                    <Label>Email</Label>
                    <Input {...register("email")} type={"email"}>

                    </Input>
                </div>
            </div>
            <Separator/>
            <div className={"flex flex-col lg:flex-row  gap-2"}>
                <div className={"w-full"}>
                    <Label>Sender name</Label>
                    <Input {...register("sender")}/>
                </div>
                <div className={"w-full"}>
                    <Label>Subject</Label>
                    <Input {...register("subject")}/>
                </div>
            </div>

            <div>
                <Label>Message Template</Label>
                <TagTextarea
                             onChange={(value) => setValue("message",value,{shouldDirty:true})}
                             value={watch("message")}
                             tags={[
                                 {label: "company name", value: "Company name"},
                                 {label: "name", value: "Name"},
                                 {label: "landing link", value: "Your link"}
                             ]}/>
            </div>

        </CardContent>
        <CardFooter>
            <div className={"mr-auto"}/>
            <Button disabled={!isDirty} onClick={handleSubmit(onSubmit)}>
                <SendHorizontal/>
                Send Message
            </Button>
        </CardFooter>
    </Card>
}