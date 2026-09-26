import { Core } from "@tomo/api";
import { Text } from "~/components/text";
import { Theme } from "~/components/theme";

export default function HomePage() {
	return (
		<main className="mx-auto flex min-h-svh max-w-6xl flex-col px-4 py-20 sm:px-16">
			<header className="flex items-center justify-between">
				<span className="font-[450] tracking-tight">{Core.NAME}</span>
				<Theme.Toggle />
			</header>
			<div className="flex flex-1 flex-col justify-center">
				<Text.Heading>{Core.NAME}</Text.Heading>
				<Text.Subtext>
					{Core.DESCRIPTION} <span className="font-mono">v{Core.VERSION}</span>
				</Text.Subtext>
			</div>
		</main>
	);
}
