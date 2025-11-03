import type {HtmlHTMLAttributes} from "react";
import {cn} from "@/lib/utils.ts";
import {type Schema, useFormSchema} from "@/lib/hooks/useFormSchema.tsx";
import {Input} from "@/components/ui/input.tsx";
import {z} from "zod";

interface PageProps extends HtmlHTMLAttributes<HTMLDivElement> {
}

interface TestFormSchema {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const testFormSchema: Schema = {
    name: {
        input: <Input></Input>,
        validator: z.string()
    },
    email: {
        input: <Input></Input>,
        validator: z.string()
    },
    password:
        {
            input: <Input></Input>,
            validator: z.string()
        },
    confirmPassword:
        {
            input: <Input></Input>,
            validator: z.string()
        },
}

export function Page(props: PageProps) {

    const {fields, watch} = useFormSchema<TestFormSchema>(testFormSchema)

    console.log(watch())

    return <div className={cn('flex flex-col w-screen h-screen min-h-0 overflow-auto mb-[112px] lg:mb-auto lg:pb-0', props.className)}>
        {props.children}
        {fields.name}
        {fields.email}
        {fields.password}
        {fields.confirmPassword}
    </div>
}