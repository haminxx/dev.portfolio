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
			<div className="h-24" />
			<div className="grid gap-12 sm:grid-cols-3 sm:gap-8">
				<Figure.Root
					title="Always on"
					description="It lives in the cloud, not on your laptop. Close the lid and your agents keep running. Pick it back up from your phone."
				>
					<Figure.AlwaysOn />
				</Figure.Root>
				<Figure.Root
					title="One computer, everyone on it"
					description="Your team and your agents share the same machine. When someone disconnects, everyone else keeps working."
				>
					<Figure.Shared />
				</Figure.Root>
				<Figure.Root
					title="Isolated workspaces"
					description="Every workspace is its own sandboxed computer. Spin up as many as you need, and nothing leaks between them."
				>
					<Figure.Isolated />
				</Figure.Root>
			</div>
			<div className="h-16" />
			<Footer.Site />
		</main>
	);
}
