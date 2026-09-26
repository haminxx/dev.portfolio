import { cn } from "~/lib/utils";
import {
	type Dash,
	dashes,
	type Fill,
	fills,
	points,
	type Tone,
	tones,
	type Vec3,
} from "./project";

export function Shape({
	points: vs,
	tone = "line",
	fill = "paper",
	dash = "solid",
}: {
	points: readonly Vec3[];
	tone?: Tone;
	fill?: Fill;
	dash?: Dash;
}) {
	return (
		<polygon
			points={points(vs)}
			className={cn(tones[tone], fills[fill])}
			strokeDasharray={dashes[dash]}
		/>
	);
}
