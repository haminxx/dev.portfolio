import { cn } from "~/lib/utils";

export function Placeholder({ label, className }: { label: string; className?: string }) {
	return (
		<div
			className={cn(
				"flex min-h-32 items-center justify-center rounded-2xl border border-dashed p-6 font-mono text-muted-foreground text-xs",
				className,
			)}
		>
			{label}
		</div>
	);
}
