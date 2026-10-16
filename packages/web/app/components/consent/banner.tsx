import { useState } from "react";
import { toast } from "sonner";
import { Tomo } from "~/components/tomo";
import { Button } from "~/components/ui/button";
import { useConsent } from "~/hooks/use-consent";

export function Banner() {
	const { consent, decide } = useConsent();
	const [isSaving, setIsSaving] = useState(false);

	if (consent !== "unknown") return null;

	async function choose(granted: boolean) {
		setIsSaving(true);
		try {
			await decide(granted);
		} catch {
			toast.error("Could not save your choice. Please try again.");
		} finally {
			setIsSaving(false);
		}
	}

	return (
		<div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center p-3 sm:p-4">
			<div className="pointer-events-auto flex w-full max-w-xl flex-col gap-3 rounded-2xl border bg-background/90 p-4 shadow-lg backdrop-blur-md sm:flex-row sm:items-center">
				<p className="grow text-muted-foreground text-sm">
					I count visits to see who stops by — only if you say yes. Read the{" "}
					<Tomo.Link className="text-foreground underline underline-offset-4" to="/privacy">
						privacy policy
					</Tomo.Link>
					.
				</p>
				<div className="flex shrink-0 gap-2">
					<Button disabled={isSaving} onClick={() => choose(false)} size="sm" variant="secondary">
						Decline
					</Button>
					<Button disabled={isSaving} onClick={() => choose(true)} size="sm">
						Accept
					</Button>
				</div>
			</div>
		</div>
	);
}
