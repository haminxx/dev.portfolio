import type { ReactNode } from "react";

export type LegalSection = { heading: string; body: ReactNode };

export function Root({
	title,
	updated,
	sections,
}: {
	title: string;
	updated: string;
	sections: LegalSection[];
}) {
	return (
		<article className="typeset typeset-legal mx-auto my-16 w-full max-w-xl">
			<h1>{title}</h1>
			<p className="text-muted-foreground">Last updated {updated}</p>
			{sections.map((section) => (
				<section key={section.heading}>
					<h2>{section.heading}</h2>
					<p>{section.body}</p>
				</section>
			))}
		</article>
	);
}
