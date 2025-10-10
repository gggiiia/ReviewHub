import {ReactNode, useState} from "react"
import {useForm} from "react-hook-form"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx"
import {Button} from "@/components/ui/button.tsx"
import {Textarea} from "@/components/ui/textarea.tsx"
import {TypographyP} from "@/components/ui/Typography.tsx"
import {Label} from "@/components/ui/label.tsx";

export interface ReviewItemData {
    id: string
    author: string
    rating: number
    date: string
    text: string | null
    reply?: string | null
}

interface ReplyDialogProps {
    review: ReviewItemData
    children: ReactNode // the trigger
    onSubmit?: (review: ReviewItemData, reply: string) => Promise<void> | void
    title?: string
}

interface FormValues {
    reply: string
}

export function ReplyDialog({review, children, onSubmit, title = "Reply to review"}: ReplyDialogProps) {
    const [open, setOpen] = useState(false)
    const {register, handleSubmit, formState: {errors, isSubmitting}, reset, setValue} = useForm<FormValues>({
        defaultValues: {reply: review.reply ?? ""}
    })

    const [aiLoading, setAiLoading] = useState(false)
    const [aiError, setAiError] = useState<string | null>(null)

    async function generateAiReply() {
        setAiError(null)
        setAiLoading(true)
        try {
            const name = review.author?.split(" ")[0] || "there"
            const rating = review.rating
            const text = review.text?.trim() || ""

            let opener = "Thank you for your review."
            if (rating >= 4) {
                opener = `Thank you so much, ${name}! We truly appreciate your positive feedback.`
            } else if (rating <= 2) {
                opener = `Hi ${name}, we’re sorry to hear about your experience and appreciate you letting us know.`
            } else {
                opener = `Thanks for sharing your thoughts, ${name}.`
            }

            let middle = ""
            if (text) {
                // briefly refer to their comment
                middle = " We’ve noted your comments and will share them with our team."
                if (rating >= 4) middle = " We’re thrilled to hear your comments and will share them with our team."
                if (rating <= 2) middle = " We’re looking into this and will use your comments to improve."
            }

            let closer = " If you have any other questions or details to share, please reach out."
            if (rating >= 4) closer = " We hope to welcome you back again soon!"

            const suggestion = `${opener}${middle}${closer}`
            setValue("reply", suggestion, {shouldValidate: true, shouldDirty: true})
        } catch {
            setAiError("Could not generate a suggestion. Please try again.")
        } finally {
            setAiLoading(false)
        }
    }

    async function submit(values: FormValues) {
        // basic guard
        const payload = values.reply?.trim() ?? ""
        if (!payload) return

        try {
            await onSubmit?.(review, payload)
        } finally {
            // close and reset regardless, UI-only component
            setOpen(false)
            reset({reply: payload})
            // eslint-disable-next-line no-console
            if (!onSubmit) console.log("Reply submitted:", {reviewId: review.id, reply: payload})
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {/* the consumer-provided trigger */}
                <span>{children}</span>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        You are replying to {review.author}'s review from {new Date(review.date).toLocaleDateString()}.
                    </DialogDescription>
                </DialogHeader>

                {/* Original review preview */}
                <div className="rounded-md border p-3 bg-accent/30">
                    <div className="text-xs text-muted-foreground mb-1">Original review</div>
                    <TypographyP className="text-sm">
                        {review.text?.trim().length ? review.text : "the review is empty"}
                    </TypographyP>
                </div>

                <form onSubmit={handleSubmit(submit)} className="space-y-3 mt-3">
                    <div>
                        <Label htmlFor="reply" className="text-sm font-medium">Your reply</Label>
                        <Textarea
                            id="reply"
                            placeholder="Write your reply..."
                            className="mt-1"
                            rows={5}
                            aria-invalid={!!errors.reply}
                            {...register("reply", {
                                required: "Reply is required",
                                minLength: {value: 2, message: "Reply is too short"}
                            })}
                        />
                        {errors.reply && (
                            <p className="text-destructive text-sm mt-1">{errors.reply.message}</p>
                        )}
                        {aiError && (
                            <p role="alert" className="text-destructive text-sm mt-1">{aiError}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="button" className={"mr-auto"} variant="ghost" onClick={() => setOpen(false)}
                                disabled={isSubmitting}>Close</Button>
                        <Button type="button" variant="outline" onClick={generateAiReply}
                                disabled={aiLoading || isSubmitting}>
                            {aiLoading ? "Generating..." : "Reply with AI"}
                        </Button>
                        <Button type="submit"
                                disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Send reply"}</Button>
                    </DialogFooter>
                    <div className="flex-1 text-left text-xs text-muted-foreground hidden sm:block">
                        Tip: You can edit the AI suggestion before sending.
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ReplyDialog
