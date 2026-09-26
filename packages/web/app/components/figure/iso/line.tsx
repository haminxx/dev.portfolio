import { motion } from "motion/react";
import { type Dash, dashes, points, type Tone, tones, type Vec3 } from "./project";

export function Line({
	points: vs,
	tone = "line",
	dash = "solid",
	flow = false,
	draw = false,
}: {
	points: readonly Vec3[];
	tone?: Tone;
	dash?: Dash;
	flow?: boolean;
	draw?: boolean;
}) {
	if (flow) {
		return (
			<motion.polyline
				points={points(vs)}
				className={tones[tone]}
				fill="none"
				strokeDasharray="4 4"
				animate={{ strokeDashoffset: [0, -16] }}
				transition={{ duration: 1.2, ease: "linear", repeat: Infinity }}
			/>
		);
	}

	if (draw) {
		return (
			<motion.polyline
				points={points(vs)}
				className={tones[tone]}
				fill="none"
				initial={{ pathLength: 0 }}
				animate={{ pathLength: [0, 1, 1] }}
				transition={{ duration: 4, times: [0, 0.8, 1], ease: "easeInOut", repeat: Infinity }}
			/>
		);
	}

	return (
		<polyline
			points={points(vs)}
			className={tones[tone]}
			fill="none"
			strokeDasharray={dashes[dash]}
		/>
	);
}
