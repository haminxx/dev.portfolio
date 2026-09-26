import { motion } from "motion/react";
import type { ReactNode } from "react";

export function Float({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
	return (
		<motion.g
			animate={{ y: [0, -5, 0] }}
			transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, delay }}
		>
			{children}
		</motion.g>
	);
}
