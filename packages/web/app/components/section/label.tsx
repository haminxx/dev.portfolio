export function Label({ index, children }: { index: number; children: string }) {
	return (
		<span className="font-mono text-muted-foreground text-xs uppercase tracking-wider">
			<span className="text-blue-600 dark:text-blue-400">{String(index).padStart(2, "0")}</span>{" "}
			{children}
		</span>
	);
}
