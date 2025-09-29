import type {HtmlHTMLAttributes} from "react";
import {cn} from "@/lib/utils.ts";

interface PageProps extends HtmlHTMLAttributes<HTMLDivElement> {
}

export function Page(props: PageProps) {
    return <div className={cn('flex flex-col w-screen h-screen min-h-0 overflow-auto', props.className)}>
        {props.children}
    </div>
}