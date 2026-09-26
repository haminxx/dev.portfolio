import type { ReactNode } from "react";

export function Field({
	label,
	hint,
	children,
}: {
	label: string;
	hint: string;
	children?: ReactNode;
}) {
	return (
		<div className="flex flex-col gap-3">
			<span className="font-mono text-muted-foreground text-xs uppercase tracking-wider">
				{label}
			</span>
			<div className="text-balance">
				{children ?? <span className="text-muted-foreground">[ {hint} ]</span>}
			</div>
		</div>
	);
}
