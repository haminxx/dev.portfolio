import { Core } from "@tomo/api";
import { Theme } from "~/components/theme";

export default function HomePage() {
	return (
		<main className="mx-auto flex min-h-svh max-w-6xl flex-col px-4 py-20 sm:px-16">
			<header className="flex items-center justify-between">
				<span className="font-[450] tracking-tight">{Core.NAME}</span>
				<Theme.Toggle />
			</header>
			<div className="flex flex-1 flex-col justify-center">
				<h1 className="text-3xl font-[450] tracking-tight">{Core.NAME}</h1>
				<p className="mt-3 text-muted-foreground text-sm">
					<span className="font-serif">{Core.DESCRIPTION}</span>{" "}
					<span className="font-mono">v{Core.VERSION}</span>
				</p>
			</div>
		</main>
	);
}
