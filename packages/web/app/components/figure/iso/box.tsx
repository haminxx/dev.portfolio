import type { Tone, Vec3 } from "./project";
import { Shape } from "./shape";

export function Box({
	at: [x, y, z],
	size: [w, d, h],
	tone = "line",
	accent = false,
}: {
	at: Vec3;
	size: Vec3;
	tone?: Tone;
	accent?: boolean;
}) {
	const face = accent ? "accent" : "paper";
	const side = accent ? "accentShade" : "shade";
	return (
		<g>
			<Shape
				tone={tone}
				fill={face}
				points={[
					[x, y, z + h],
					[x + w, y, z + h],
					[x + w, y + d, z + h],
					[x, y + d, z + h],
				]}
			/>
			<Shape
				tone={tone}
				fill={face}
				points={[
					[x, y + d, z],
					[x + w, y + d, z],
					[x + w, y + d, z + h],
					[x, y + d, z + h],
				]}
			/>
			<Shape
				tone={tone}
				fill={side}
				points={[
					[x + w, y, z],
					[x + w, y + d, z],
					[x + w, y + d, z + h],
					[x + w, y, z + h],
				]}
			/>
		</g>
	);
}
