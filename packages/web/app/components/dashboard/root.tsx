import type { Analytics } from "@tomo/api";
import { Daily } from "./daily";
import { Messages } from "./messages";
import { Stats } from "./stats";
import { Visits } from "./visits";

function Group({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<section className="flex flex-col gap-3">
			<h2 className="font-[450] text-sm tracking-tight">{title}</h2>
			{children}
		</section>
	);
}

export function Root({ data }: { data: Analytics.Dashboard }) {
	return (
		<div className="flex flex-col gap-10">
			<Stats data={data} />
			<Group title="Last 30 days">
				<Daily days={data.daily} />
			</Group>
			<Group title="Recent visits">
				<Visits visits={data.visits} />
			</Group>
			<Group title="Messages">
				<Messages messages={data.messages} />
			</Group>
		</div>
	);
}
