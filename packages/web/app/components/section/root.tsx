import type { ReactNode } from "react";
import { Text } from "~/components/text";
import { cn } from "~/lib/utils";
import { Label } from "./label";

export function Root({
	index,
	label,
	title,
	prompt,
	children,
}: {
	index: number;
	label: string;
	title?: string;
	prompt: string;
	children?: ReactNode;
}) {
	return (
		<section className="flex flex-col gap-16">
			<div className="flex flex-col gap-4">
				<Label index={index}>{label}</Label>
				<Text.Heading className={cn("max-w-2xl text-balance", !title && "text-muted-foreground")}>
					{title ?? `[ ${prompt} ]`}
				</Text.Heading>
			</div>
			{children}
		</section>
	);
}
