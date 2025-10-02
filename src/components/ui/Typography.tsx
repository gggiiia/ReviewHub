import {cn} from "@/lib/utils.ts";

export function TypographyH1(props: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h1
            {...props}
            className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight text-balance", props.className)}
        />
    )
}

export function TypographyH2(props: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h2
            {...props}
            className={cn("scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0", props.className)}
        />
    )
}

export function TypographyH3(props: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3
            {...props}
            className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", props.className)}
        />
    )
}

export function TypographyH4(props: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h4
            {...props}
            className={cn("scroll-m-20 text-xl font-semibold tracking-tight",props.className)}

        />
    )
}

export function TypographyP(props: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p
            {...props}
            className={cn("leading-7",props.className)}
        />
    )
}
