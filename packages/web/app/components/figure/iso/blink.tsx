import { motion } from "motion/react";
import type { ReactNode } from "react";

const ON = [1, 1, 0, 0, 1];
const OFF = [0, 0, 1, 1, 0];

export function Blink({
	children,
	off = false,
	delay = 0,
}: {
	children: ReactNode;
	off?: boolean;
	delay?: number;
}) {
	return (
		<motion.g
			initial={{ opacity: off ? 0 : 1 }}
			animate={{ opacity: off ? OFF : ON }}
			transition={{
				duration: 6,
				times: [0, 0.45, 0.5, 0.95, 1],
				ease: "easeInOut",
				repeat: Infinity,
				delay,
			}}
		>
			{children}
		</motion.g>
	);
}
