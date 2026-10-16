import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { useConsent } from "~/hooks/use-consent";

const label: Record<string, string> = {
	granted: "You have allowed analytics on this browser.",
	denied: "Analytics is off on this browser. Nothing is collected.",
	unknown: "You have not made a choice yet, so nothing is collected.",
};

/** Lets a visitor change the choice they made in the banner, from the privacy page. */
export function Settings() {
	const { consent, decide } = useConsent();
	const [isSaving, setIsSaving] = useState(false);

	async function choose(granted: boolean) {
		setIsSaving(true);
		try {
			await decide(granted);
			toast.success(granted ? "Analytics allowed" : "Analytics turned off");
		} catch {
			toast.error("Could not save your choice. Please try again.");
		} finally {
			setIsSaving(false);
		}
	}

	return (
		<div className="not-typeset flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center">
			<p className="grow text-muted-foreground text-sm">{label[consent]}</p>
			<div className="flex shrink-0 gap-2">
				<Button
					disabled={isSaving || consent === "denied"}
					onClick={() => choose(false)}
					size="sm"
					variant="secondary"
				>
					Turn off
				</Button>
				<Button disabled={isSaving || consent === "granted"} onClick={() => choose(true)} size="sm">
					Allow
				</Button>
			</div>
		</div>
	);
}
