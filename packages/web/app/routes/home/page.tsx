import { Core } from "@tomo/api";
import { Footer } from "~/components/footer";
import { Text } from "~/components/text";
import { Tomo } from "~/components/tomo";
import { Button } from "~/components/ui/button";

export default function HomePage() {
	return (
		<main className="mx-auto flex min-h-svh max-w-6xl flex-col px-4 pt-20 sm:px-16">
			<header className="flex items-center">
				<Tomo.Link
					to="/"
					aria-label={`${Core.NAME} home`}
					className="text-foreground transition hover:opacity-70 focus-visible:opacity-70 focus-visible:outline-none"
				>
					<Tomo.Logo className="size-6" />
				</Tomo.Link>
			</header>
			<div className="flex flex-1 flex-col justify-center">
				<Text.Heading className="max-w-120">{Core.DESCRIPTION}</Text.Heading>
				<div className="h-8" />
				<div className="flex flex-wrap items-center gap-2">
					<Button size="lg">Log in</Button>
					<Button size="lg" variant="secondary">
						Read the docs
					</Button>
				</div>
			</div>
			<Footer.Site />
		</main>
	);
}
