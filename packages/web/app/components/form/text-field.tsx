import type { ComponentProps, ReactNode } from "react";
import { type Control, Controller, type FieldPath, type FieldValues } from "react-hook-form";
import { Field, FieldError, FieldLabel, FieldRequiredDot } from "~/components/ui/field";
import { Input } from "~/components/ui/input";

export function TextField<T extends FieldValues>({
	control,
	name,
	label,
	placeholder,
	required = false,
	autoComplete = "off",
	type,
	onValueChange,
}: {
	control: Control<T>;
	name: FieldPath<T>;
	label: ReactNode;
	placeholder?: string;
	required?: boolean;
	autoComplete?: string;
	type?: ComponentProps<"input">["type"];
	onValueChange?: (value: string) => void;
}) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel htmlFor={field.name}>
						{label}
						{required && (
							<FieldRequiredDot filled={typeof field.value === "string" && !!field.value.trim()} />
						)}
					</FieldLabel>
					<Input
						{...field}
						value={field.value ?? ""}
						aria-invalid={fieldState.invalid}
						aria-required={required || undefined}
						autoComplete={autoComplete}
						id={field.name}
						placeholder={placeholder}
						type={type}
						onChange={(event) => {
							field.onChange(event);
							onValueChange?.(event.target.value);
						}}
					/>
					{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	);
}
