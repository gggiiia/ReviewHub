import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z, ZodObject } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type {ZodTypeAny} from "zod/v3/types";

type FieldSchema = {
    input: React.ReactElement;
    validator: ZodTypeAny;
};

export type Schema = Record<string, FieldSchema>;

export function useFormSchema<T extends Schema>(schema: T) {
    // Build a Zod object schema dynamically from validators
    const zodSchema = z.object(
        Object.fromEntries(
            Object.entries(schema).map(([key, { validator }]) => [key, validator])
        )
    ) as ZodObject<Record<keyof T, any>>;

    // Initialize react-hook-form
    const form = useForm({
        resolver: zodResolver(zodSchema),
        mode: "onChange",
    });

    // Auto-bind the input components via Controller
    const fields = Object.fromEntries(
        Object.entries(schema).map(([name, { input }]) => [
            name,
            (
                <Controller
                    key={name}
                    name={name as any}
                    control={form.control}
                    render={({ field }) =>
                        React.cloneElement(input, {
                            ...field,
                            value: field.value ?? "",
                            onChange: (e: any) =>
                                field.onChange(e?.target ? e.target.value : e),
                        })
                    }
                />
            ),
        ])
    ) as Record<keyof T, React.ReactNode>;

    return {
        ...form,
        fields,
    };
}
