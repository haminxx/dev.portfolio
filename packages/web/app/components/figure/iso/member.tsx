import { Laptop } from "./laptop";
import { Line } from "./line";
import type { Vec2, Vec3 } from "./project";
import { Switch } from "./switch";

export function Member({
	at,
	link,
	delay = 0,
}: {
	at: Vec2;
	link: readonly Vec3[];
	delay?: number;
}) {
	return (
		<g>
			<Switch
				delay={delay}
				on={<Line points={link} tone="accent" flow />}
				off={<Line points={link} tone="muted" dash="dashed" />}
			/>
			<Switch delay={delay} on={<Laptop at={at} active />} off={<Laptop at={at} />} />
		</g>
	);
}
