import type { ReactNode } from "react";
import { Blink } from "./blink";

export function Switch({ on, off, delay = 0 }: { on: ReactNode; off: ReactNode; delay?: number }) {
	return (
		<g>
			<Blink off delay={delay}>
				{off}
			</Blink>
			<Blink delay={delay}>{on}</Blink>
		</g>
	);
}
