import { Box } from "./box";
import { rect, type Vec2 } from "./project";
import { Shape } from "./shape";

export function Phone({ at: [x, y], active = false }: { at: Vec2; active?: boolean }) {
	return (
		<g>
			<Box at={[x, y, 0]} size={[1.6, 3, 0.3]} tone={active ? "line" : "muted"} />
			<Shape
				points={rect([x + 0.2, y + 0.3, 0.3], [1.2, 2.4])}
				tone={active ? "accent" : "muted"}
				fill={active ? "accent" : "none"}
			/>
		</g>
	);
}
