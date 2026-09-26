import type { ReactNode } from "react";

export function Root({
	title,
	description,
	children,
}: {
	title: string;
	description: string;
	children: ReactNode;
}) {
	return (
		<figure className="flex flex-col gap-6">
			{children}
			<figcaption className="flex flex-col gap-1 text-sm">
				<span className="font-medium">{title}</span>
				<span className="text-balance text-muted-foreground">{description}</span>
			</figcaption>
		</figure>
	);
}
