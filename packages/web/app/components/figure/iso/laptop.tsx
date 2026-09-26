import { Box } from "./box";
import { Line } from "./line";
import type { Vec2 } from "./project";
import { Shape } from "./shape";

const W = 3;
const D = 2.2;
const T = 0.3;
const H = 2.3;
const LEAN = 0.6;

export function Laptop({
	at: [x, y],
	active = false,
	closed = false,
}: {
	at: Vec2;
	active?: boolean;
	closed?: boolean;
}) {
	const tone = active ? "line" : "muted";

	if (closed) {
		return (
			<g>
				<Box at={[x, y, 0]} size={[W, D, T * 2]} tone={tone} />
				<Line
					points={[
						[x, y + D, T],
						[x + W, y + D, T],
						[x + W, y, T],
					]}
					tone={tone}
				/>
			</g>
		);
	}

	return (
		<g>
			<Shape
				tone={tone}
				points={[
					[x, y, T],
					[x + W, y, T],
					[x + W, y - LEAN, T + H],
					[x, y - LEAN, T + H],
				]}
			/>
			<Shape
				tone={active ? "accent" : "muted"}
				fill={active ? "accent" : "none"}
				points={[
					[x + 0.3, y - 0.07, T + 0.3],
					[x + W - 0.3, y - 0.07, T + 0.3],
					[x + W - 0.3, y - LEAN + 0.07, T + H - 0.3],
					[x + 0.3, y - LEAN + 0.07, T + H - 0.3],
				]}
			/>
			<Box at={[x, y, 0]} size={[W, D, T]} tone={tone} />
		</g>
	);
}
