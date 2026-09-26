import { motion } from "motion/react";
import { Line } from "./line";
import { rect, type Vec2, type Vec3 } from "./project";
import { Shape } from "./shape";

export function Window({
	at: [x, y, z],
	size: [w, d],
	accent = false,
}: {
	at: Vec3;
	size: Vec2;
	accent?: boolean;
}) {
	const tone = accent ? "accent" : "line";
	return (
		<motion.g
			{...(accent && {
				animate: { opacity: [1, 0.45, 1] },
				transition: { duration: 2, ease: "easeInOut", repeat: Infinity },
			})}
		>
			<Shape points={rect([x, y, z], [w, d])} tone={tone} fill={accent ? "accent" : "paper"} />
			<Line
				points={[
					[x, y + 0.5, z],
					[x + w, y + 0.5, z],
				]}
				tone={tone}
			/>
		</motion.g>
	);
}
