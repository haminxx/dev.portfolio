import type { Analytics } from "@tomo/api";

function label(day: string) {
	return new Date(day).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function Daily({ days }: { days: Analytics.Daily[] }) {
	if (days.length === 0) {
		return <p className="text-muted-foreground text-sm">No visits recorded yet.</p>;
	}

	const chart = [...days].reverse();
	const peak = Math.max(...chart.map((day) => day.visits), 1);

	return (
		<div className="flex h-40 gap-1">
			{chart.map((day) => (
				<div className="flex min-w-0 grow flex-col items-center gap-2" key={day.day}>
					<div className="flex w-full grow items-end">
						<div
							className="w-full rounded-t-sm bg-primary/70 transition-all"
							style={{ height: `${Math.max((day.visits / peak) * 100, 2)}%` }}
							title={`${label(day.day)}: ${day.visits} visits, ${day.unique_visitors} visitors`}
						/>
					</div>
					<span className="w-full truncate text-center text-[10px] text-muted-foreground">
						{label(day.day)}
					</span>
				</div>
			))}
		</div>
	);
}
