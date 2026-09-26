import { Core } from "@tomo/api";
import { Theme } from "~/components/theme";

export function Site() {
	return (
		<footer className="flex items-center gap-6 py-12 text-xs">
			<span className="font-[450] text-muted-foreground">v{Core.VERSION}</span>
			<div className="grow" />
			<Theme.Toggle />
		</footer>
	);
}
