import { motion } from "motion/react";
import { type Dash, dashes, project, ringScale, type Tone, tones, type Vec3 } from "./project";

export function Ring({
	center,
	radius,
	tone = "line",
	dash = "solid",
	ping = false,
}: {
	center: Vec3;
	radius: number;
	tone?: Tone;
	dash?: Dash;
	ping?: boolean;
}) {
	const [cx, cy] = project(center);
	return (
		<motion.ellipse
			cx={cx}
			cy={cy}
			rx={radius * ringScale[0]}
			ry={radius * ringScale[1]}
			className={tones[tone]}
			fill="none"
			strokeDasharray={dashes[dash]}
			style={{ transformBox: "fill-box", transformOrigin: "center" }}
			{...(ping && {
				animate: { scale: [0.5, 1.2], opacity: [1, 0] },
				transition: { duration: 2.4, ease: "easeOut", repeat: Infinity },
			})}
		/>
	);
}
