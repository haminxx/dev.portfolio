import { Box } from "./box";
import { Line } from "./line";
import type { Vec3 } from "./project";

export function Server({
	at: [x, y, z],
	size: [w, d, h],
	accent = false,
}: {
	at: Vec3;
	size: Vec3;
	accent?: boolean;
}) {
	const rows = Array.from({ length: Math.floor((h - 0.5) / 1.5) }, (_, i) => z + 1 + i * 1.5);
	return (
		<g>
			<Box at={[x, y, z]} size={[w, d, h]} tone={accent ? "accent" : "line"} accent={accent} />
			{rows.map((row) => (
				<g key={row}>
					<Line
						points={[
							[x + w, y + 0.5, row],
							[x + w, y + d - 1.4, row],
						]}
						tone={accent ? "accent" : "line"}
					/>
					<Line
						points={[
							[x + w, y + d - 0.9, row],
							[x + w, y + d - 0.5, row],
						]}
						tone="accent"
					/>
				</g>
			))}
		</g>
	);
}
