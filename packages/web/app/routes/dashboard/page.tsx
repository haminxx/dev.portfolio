import { Guest, Owner } from "@tomo/api";
import { useState } from "react";
import { Dashboard } from "~/components/dashboard";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import { Google } from "~/components/svgs/google";
import { Text } from "~/components/text";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { Spinner } from "~/components/ui/spinner";
import { useAnalyticsAccess, useAnalyticsDashboard } from "~/hooks/use-analytics";
import { signIn, signOut, useSession } from "~/lib/auth";

export function meta() {
	return [{ title: `Dashboard · ${Owner.Name}` }, { name: "robots", content: "noindex" }];
}

function Gate({ signedIn }: { signedIn: boolean }) {
	const [isRedirecting, setIsRedirecting] = useState(false);

	async function continueWithGoogle() {
		setIsRedirecting(true);
		try {
			await signIn.social({ provider: "google", callbackURL: "/dashboard" });
		} catch (error) {
			setIsRedirecting(false);
			throw error;
		}
	}

	return (
		<div className="flex max-w-sm flex-col">
			<Text.Heading>Owner only</Text.Heading>
			<Text.Subtext>
				{signedIn
					? "This account cannot see the visitor dashboard."
					: `Sign in as ${Owner.Name} to see who has been visiting.`}
			</Text.Subtext>
			<div className="h-8" />
			<Button disabled={isRedirecting} onClick={continueWithGoogle} size="lg" variant="secondary">
				{isRedirecting ? (
					<>
						<Spinner />
						Redirecting...
					</>
				) : (
					<>
						<Google className="size-4" />
						Continue with Google
					</>
				)}
			</Button>
			{signedIn ? (
				<button
					className="mt-4 w-fit cursor-pointer text-muted-foreground text-sm underline underline-offset-4"
					onClick={() => void signOut()}
					type="button"
				>
					Sign out
				</button>
			) : null}
		</div>
	);
}

function Loading() {
	return (
		<div className="flex flex-col gap-6">
			<Skeleton className="h-24 w-full rounded-2xl" />
			<Skeleton className="h-40 w-full rounded-2xl" />
			<Skeleton className="h-64 w-full rounded-2xl" />
		</div>
	);
}

export default function DashboardPage() {
	const { data: session } = useSession();
	const access = useAnalyticsAccess();
	const owner = access.data?.owner === true;
	const dashboard = useAnalyticsDashboard(owner);
	const signedIn = Boolean(session?.user && session.user.id !== Guest.UserId);

	return (
		<div className="mx-auto flex min-h-svh w-full max-w-5xl flex-col px-5">
			<Header.Site />
			<main className="my-10 flex grow flex-col gap-8">
				{access.isPending ? (
					<Loading />
				) : owner ? (
					<>
						<div className="flex items-end gap-4">
							<div>
								<Text.Heading>Visitors</Text.Heading>
								<Text.Subtext>
									Consented visits only, updating live. Signed in as {session?.user.email}.
								</Text.Subtext>
							</div>
							<div className="grow" />
							<Button onClick={() => void signOut()} size="sm" variant="secondary">
								Sign out
							</Button>
						</div>
						{dashboard.isPending ? (
							<Loading />
						) : dashboard.error ? (
							<p className="text-destructive text-sm">{dashboard.error.message}</p>
						) : dashboard.data ? (
							<Dashboard.Root data={dashboard.data} />
						) : null}
					</>
				) : (
					<Gate signedIn={signedIn} />
				)}
			</main>
			<Footer.Site />
		</div>
	);
}
