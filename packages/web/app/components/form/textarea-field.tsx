import type { ReactNode } from "react";
import { type Control, Controller, type FieldPath, type FieldValues } from "react-hook-form";
import { Field, FieldError, FieldLabel, FieldRequiredDot } from "~/components/ui/field";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";

export function TextareaField<T extends FieldValues>({
	control,
	name,
	label,
	placeholder,
	required = false,
	className,
	textareaClassName,
}: {
	control: Control<T>;
	name: FieldPath<T>;
	label: ReactNode;
	placeholder?: string;
	required?: boolean;
	className?: string;
	textareaClassName?: string;
}) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<Field className={className} data-invalid={fieldState.invalid}>
					<FieldLabel htmlFor={field.name}>
						{label}
						{required && (
							<FieldRequiredDot filled={typeof field.value === "string" && !!field.value.trim()} />
						)}
					</FieldLabel>
					<Textarea
						{...field}
						aria-invalid={fieldState.invalid}
						aria-required={required || undefined}
						className={cn("min-h-24 resize-none", textareaClassName)}
						id={field.name}
						onChange={(event) => field.onChange(event.target.value || undefined)}
						placeholder={placeholder}
						value={field.value ?? ""}
					/>
					{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	);
}
