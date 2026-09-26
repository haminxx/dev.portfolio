import { Core } from "@tomo/api";
import { Text } from "~/components/text";
import { Theme } from "~/components/theme";
import { Tomo } from "~/components/tomo";

export default function HomePage() {
	return (
		<main className="mx-auto flex min-h-svh max-w-6xl flex-col px-4 py-20 sm:px-16">
			<header className="flex items-center justify-between">
				<Tomo.Link
					to="/"
					aria-label={`${Core.NAME} home`}
					className="text-foreground transition hover:opacity-70 focus-visible:opacity-70 focus-visible:outline-none"
				>
					<Tomo.Logo className="size-6" />
				</Tomo.Link>
				<Theme.Toggle />
			</header>
			<div className="flex flex-1 flex-col justify-center">
				<Text.Heading>{Core.DESCRIPTION}</Text.Heading>
				<Text.Subtext>
					{Core.NAME} <span className="font-mono">v{Core.VERSION}</span>
				</Text.Subtext>
			</div>
		</main>
	);
}
