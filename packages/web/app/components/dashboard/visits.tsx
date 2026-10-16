import type { Analytics } from "@tomo/api";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { User } from "~/components/user";

const relative = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
const steps: [Intl.RelativeTimeFormatUnit, number][] = [
	["second", 60],
	["minute", 60],
	["hour", 24],
	["day", 7],
	["week", 4.345],
	["month", 12],
];

export function when(value: string) {
	let amount = (Date.parse(value) - Date.now()) / 1000;
	for (const [unit, size] of steps) {
		if (Math.abs(amount) < size) return relative.format(Math.round(amount), unit);
		amount /= size;
	}
	return relative.format(Math.round(amount), "year");
}

function place(visit: Analytics.VisitRow) {
	const parts = [visit.city, visit.region, visit.country].filter(Boolean);
	return parts.length > 0 ? parts.join(", ") : "Unknown";
}

function device(visit: Analytics.VisitRow) {
	const parts = [visit.browser, visit.os, visit.device].filter(Boolean);
	return parts.length > 0 ? parts.join(" · ") : "Unknown";
}

export function Visits({ visits }: { visits: Analytics.VisitRow[] }) {
	if (visits.length === 0) {
		return <p className="text-muted-foreground text-sm">No visits recorded yet.</p>;
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Visitor</TableHead>
					<TableHead>Location</TableHead>
					<TableHead>When</TableHead>
					<TableHead>Device</TableHead>
					<TableHead>Page</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{visits.map((visit) => (
					<TableRow key={visit.id}>
						<TableCell>
							<div className="flex items-center gap-2">
								<User.Avatar
									id={visit.visitor?.id ?? "anonymous"}
									image={visit.visitor?.avatar_url ?? null}
									name={visit.visitor?.name ?? null}
									size="xs"
								/>
								<div className="min-w-0">
									<p className="truncate">{visit.visitor?.name ?? "Anonymous"}</p>
									{visit.visitor?.email ? (
										<p className="truncate text-muted-foreground text-xs">{visit.visitor.email}</p>
									) : null}
								</div>
							</div>
						</TableCell>
						<TableCell className="text-muted-foreground">{place(visit)}</TableCell>
						<TableCell className="text-muted-foreground whitespace-nowrap">
							<span title={new Date(visit.occurred_at).toLocaleString()}>
								{when(visit.occurred_at)}
							</span>
						</TableCell>
						<TableCell className="text-muted-foreground">{device(visit)}</TableCell>
						<TableCell className="font-mono text-xs" title={visit.referrer ?? undefined}>
							{visit.path ?? "/"}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
