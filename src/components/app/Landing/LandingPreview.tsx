import React, {useEffect, useMemo, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {useForm} from "react-hook-form";
import {useLocations} from "@/services/LocationsService.ts";
import { Star as StarIcon } from "lucide-react";
import {Label} from "@/components/ui/label.tsx";

interface PrivateFormValues {
    name: string;
    email: string;
    message: string;
}

// Public, embeddable preview of the Landing flow (no outer page chrome)
export function LandingPreview() {
    const { selectedLocation } = useLocations();
    const [rating, setRating] = useState<number | null>(null);
    const [hover, setHover] = useState<number>(0);
    const [step, setStep] = useState<"rate" | "public" | "private" | "thanks">("rate");

    const { register, handleSubmit, formState: { errors }, reset } = useForm<PrivateFormValues>({
        defaultValues: { name: "", email: "", message: "" }
    });

    // 1–3 -> private feedback, 4–5 -> public review
    const isPrivateRating = (value: number) => value <= 3;

    const googleUrl = useMemo(() => {
        return "https://www.google.com/maps/search/?api=1&query=Leave+a+Google+review";
    }, []);

    const facebookUrl = useMemo(() => {
        return "https://www.facebook.com";
    }, []);

    const onSelectRating = (value: number) => {
        setRating(value);
        setStep(isPrivateRating(value) ? "private" : "public");
    };

    const onSubmitPrivate = handleSubmit((values) => {
        // eslint-disable-next-line no-console
        console.log("Private feedback submitted:", { ...values, rating });
        setStep("thanks");
    });

    const Star = ({ index }: { index: number }) => {
        const active = (hover || rating || 0) >= index;
        return (
            <button
                type="button"
                aria-label={`${index} star`}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(0)}
                onFocus={() => setHover(index)}
                onBlur={() => setHover(0)}
                onMouseUp={() => onSelectRating(index)}
                className="bg-transparent border-0 cursor-pointer p-1.5 leading-none"
            >
                <StarIcon
                    className="size-9"
                    fill={active ? "#f5a524" : "#e2e8f0"}
                    color={active ? "#f5a524" : "#cbd5e1"}
                    aria-hidden="true"
                />
            </button>
        );
    };

    function onGoBack() {
        setRating(null)
        setHover(0)
        setStep("rate")
    }

    function Rate() {
        return <div className="text-center">
            {/* Business logo and name header */}
            <div className="flex flex-col items-center justify-center gap-2 mb-4">
                {selectedLocation?.avatarUrl ? (
                    <img
                        src={selectedLocation.avatarUrl}
                        alt={`${selectedLocation.name || "Business"} logo`}
                        className="w-20 h-20 rounded-full object-contain"
                    />
                ) : (
                    <div
                        aria-hidden="true"
                        className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-2xl"
                    >
                        {(selectedLocation?.name || selectedLocation?.id || "?").trim().charAt(0).toUpperCase() || "?"}
                    </div>
                )}
                {selectedLocation?.name && (
                    <div className="text-lg font-bold">{selectedLocation.name}</div>
                )}
            </div>
            <h1 className="m-0 mb-2 text-[28px]">How was your experience?</h1>
            <p className="m-0 mb-5 text-slate-500">Please rate us by selecting the number of stars below.</p>
            <div role="radiogroup" aria-label="Rating" className="flex justify-center">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} index={i} />
                ))}
            </div>
        </div>
    }

    function Public() {
        return <div className="text-center">
            <h1 className="m-0 mb-3 text-[26px]">Thank you for the positive feedback!</h1>
            <p className="m-0 mb-5 text-slate-500">
                We’d really appreciate it if you could share your experience publicly.
            </p>
            <div className="mx-auto flex w-full max-w-sm flex-col gap-3">
                <Button asChild className="w-full h-10 bg-white text-gray-900 border hover:bg-accent/50">
                    <a
                        href={googleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <svg viewBox="0 0 48 48" className="size-4" aria-hidden="true">
                            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.602 32.91 29.196 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.152 7.957 3.043l5.657-5.657C33.756 6.053 29.121 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20c10.493 0 19.126-8.037 19.126-20 0-1.34-.138-2.636-.515-3.917z"/>
                            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.814C14.481 16.617 18.855 12 24 12c3.059 0 5.842 1.152 7.957 3.043l5.657-5.657C33.756 6.053 29.121 4 24 4 16.318 4 9.689 8.337 6.306 14.691z"/>
                            <path fill="#4CAF50" d="M24 44c5.113 0 9.692-1.968 13.129-5.162l-6.062-4.993C29.065 35.329 26.671 36 24 36c-5.176 0-9.593-3.107-11.29-7.486l-6.52 5.02C9.53 40.021 16.184 44 24 44z"/>
                            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.312 3.754-4.695 6.59-8.774 7.845l6.062 4.993C36.021 39.828 40 33.999 40 24c0-1.34-.138-2.636-.389-3.917z"/>
                        </svg>
                        Leave a Google Review
                    </a>
                </Button>
                <Button asChild className="w-full h-10 bg-[#1877F2] hover:bg-[#145DBF] text-white">
                    <a
                        href={facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
                            <path d="M22 12.06C22 6.507 17.523 2 12 2S2 6.507 2 12.06c0 5.018 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.196 2.238.196v2.47h-1.26c-1.243 0-1.63.774-1.63 1.567v1.883h2.773l-.443 2.91h-2.33v7.03C18.343 21.244 22 17.078 22 12.06z"/>
                        </svg>
                        Leave a Facebook Review
                    </a>
                </Button>
            </div>
            <div className="mx-auto w-full max-w-sm mt-4">
                <Button type="button" variant="ghost" className="w-full h-10" onClick={onGoBack}>Go back</Button>
            </div>
        </div>
    }

    function Private() {
        return <div>
            <h1 className="m-0 mb-2 text-[26px] text-center">We’re sorry your experience wasn’t great</h1>
            <p className="m-0 mb-4 text-slate-500 text-center">
                Please leave us a private review so we can make things right.
            </p>
            <form onSubmit={onSubmitPrivate} noValidate>
                <div className="flex flex-col gap-3">
                    <div>
                        <Label htmlFor="name" className="block text-sm font-medium mb-1">Name</Label>
                        <Input
                            id="name"
                            aria-invalid={!!errors.name}
                            placeholder="Your name"
                            {...register("name", { required: "Please enter your name" })}
                        />
                        {errors.name && <div className="text-destructive text-sm mt-1">{errors.name.message}</div>}
                    </div>
                    <div>
                        <Label htmlFor="email" className="block text-sm font-medium mb-1">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            aria-invalid={!!errors.email}
                            placeholder="you@example.com"
                            {...register("email", {
                                required: "Please enter your email",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Please enter a valid email"
                                }
                            })}
                        />
                        {errors.email && <div className="text-destructive text-sm mt-1">{errors.email.message}</div>}
                    </div>
                    <div>
                        <Label htmlFor="message" className="block text-sm font-medium mb-1">Message</Label>
                        <Textarea
                            id="message"
                            rows={5}
                            aria-invalid={!!errors.message}
                            placeholder="Tell us what happened so we can improve"
                            {...register("message", { required: "Please enter a message" })}
                        />
                        {errors.message && <div className="text-destructive text-sm mt-1">{errors.message.message}</div>}
                    </div>
                    <div className="flex gap-3 justify-between">
                        <Button type="button" variant="ghost" onClick={onGoBack}>Go back</Button>
                        <Button type="submit">Send private review</Button>
                    </div>
                </div>
            </form>
        </div>
    }

    function Thanks() {
        return <div className="text-center">
            <h1 className="m-0 mb-3 text-[26px]">Thanks for your feedback!</h1>
            <p className="m-0 text-slate-500">
                We’ve received your message and will get back to you soon.
            </p>
            <div className="mt-6">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        reset({ name: "", email: "", message: "" });
                        setRating(null);
                        setStep("rate");
                    }}
                >
                    Leave another review
                </Button>
            </div>
        </div>
    }

    return (
        <div className="w-full h-full flex items-center justify-center p-4 text-black">
            <div className="w-full max-w-[640px] bg-white rounded-lg p-6">
                {step === "rate" && (
                    <Rate></Rate>
                )}

                {step === "public" && (
                    <Public></Public>
                )}

                {step === "private" && (
                    <Private></Private>
                )}

                {step === "thanks" && (
                    <Thanks></Thanks>
                )}
            </div>
        </div>
    );
}

export default LandingPreview;
