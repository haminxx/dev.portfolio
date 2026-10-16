import type { Analytics } from "@tomo/api";
import { when } from "./visits";

export function Messages({ messages }: { messages: Analytics.Message[] }) {
	if (messages.length === 0) {
		return <p className="text-muted-foreground text-sm">No messages yet.</p>;
	}

	return (
		<ul className="flex flex-col gap-3">
			{messages.map((message) => (
				<li className="rounded-2xl border p-4" key={message.id}>
					<div className="flex items-baseline gap-2">
						<p className="font-[450] text-sm">{message.name ?? "Anonymous"}</p>
						{message.email ? (
							<a
								className="truncate text-muted-foreground text-xs underline underline-offset-4"
								href={`mailto:${message.email}`}
							>
								{message.email}
							</a>
						) : null}
						<span className="grow" />
						<span
							className="shrink-0 text-muted-foreground text-xs"
							title={new Date(message.created_at).toLocaleString()}
						>
							{when(message.created_at)}
						</span>
					</div>
					<p className="mt-2 whitespace-pre-wrap text-sm">{message.message}</p>
				</li>
			))}
		</ul>
	);
}
