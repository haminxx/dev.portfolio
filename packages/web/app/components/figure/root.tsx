import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

export function Root({
	title,
	flip = false,
	children,
}: {
	title: string;
	flip?: boolean;
	children: ReactNode;
}) {
	return (
		<figure className="grid items-center gap-10 sm:grid-cols-2 sm:gap-16">
			<figcaption
				className={cn(
					"text-balance font-[450] text-2xl tracking-tight sm:text-3xl",
					flip && "sm:order-last",
				)}
			>
				{title}
			</figcaption>
			<div>{children}</div>
		</figure>
	);
}
