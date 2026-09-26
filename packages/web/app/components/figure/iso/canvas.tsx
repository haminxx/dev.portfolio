import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

export function Canvas({ label, children }: { label: string; children: ReactNode }) {
	return (
		<MotionConfig reducedMotion="user">
			<svg
				role="img"
				aria-label={label}
				viewBox="-130 -108 260 180"
				className="h-auto w-full"
				fill="none"
				strokeWidth={1}
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				{children}
			</svg>
		</MotionConfig>
	);
}
