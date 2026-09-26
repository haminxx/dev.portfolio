import { Core } from "@tomo/api";
import { Figure } from "~/components/figure";
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
			<div className="h-24 sm:h-32" />
			<Text.Heading className="max-w-120">{Core.DESCRIPTION}</Text.Heading>
			<div className="h-8" />
			<div className="flex flex-wrap items-center gap-2">
				<Button size="lg">Log in</Button>
				<Button size="lg" variant="secondary">
					Read the docs
				</Button>
			</div>
			<div className="h-16" />
			{/* TODO: replace with a demo of the shared desktop (video or live mockup) */}
			<div className="aspect-video w-full rounded-2xl border bg-muted" />
			<div className="h-40 sm:h-56" />
			<Figure.Root title="Always on">
				<Figure.AlwaysOn />
			</Figure.Root>
			<div className="h-32 sm:h-48" />
			<Figure.Root title="One computer, everyone on it" flip>
				<Figure.Shared />
			</Figure.Root>
			<div className="h-32 sm:h-48" />
			<Figure.Root title="Isolated workspaces">
				<Figure.Isolated />
			</Figure.Root>
			<div className="h-40 sm:h-56" />
			<Footer.Site />
		</main>
	);
}
