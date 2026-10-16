import type { Analytics } from "@tomo/api";

function today(daily: Analytics.Daily[]) {
	const day = new Date().toISOString().slice(0, 10);
	return daily.find((entry) => entry.day.slice(0, 10) === day);
}

export function Stats({ data }: { data: Analytics.Dashboard }) {
	const now = today(data.daily);
	const cards = [
		{ label: "Visits", value: data.totals.visits },
		{ label: "Unique visitors", value: data.totals.visitors },
		{ label: "Visits today", value: now?.visits ?? 0 },
		{ label: "Visitors today", value: now?.unique_visitors ?? 0 },
	];

	return (
		<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
			{cards.map((card) => (
				<div className="rounded-2xl border p-4" key={card.label}>
					<p className="text-muted-foreground text-xs">{card.label}</p>
					<p className="mt-1 font-[450] text-2xl tabular-nums tracking-tight">{card.value}</p>
				</div>
			))}
		</div>
	);
}
