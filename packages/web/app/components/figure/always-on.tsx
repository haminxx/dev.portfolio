import { Iso } from "./iso";
import type { Vec3 } from "./iso/project";

const LAPTOP_LINK: Vec3[] = [
	[-1, 3, 0],
	[-1, 5.6, 0],
	[-4, 5.6, 0],
];
const PHONE_LINK: Vec3[] = [
	[3, 1, 0],
	[5, 1, 0],
	[5, 4, 0],
];
const PHONE_DELAY = 3;

export function AlwaysOn() {
	return (
		<Iso.Canvas label="A cloud computer keeps running while a laptop and a phone take turns connecting">
			<Iso.Switch
				on={<Iso.Line points={LAPTOP_LINK} tone="accent" flow />}
				off={<Iso.Line points={LAPTOP_LINK} tone="muted" dash="dashed" />}
			/>
			<Iso.Switch
				delay={PHONE_DELAY}
				on={<Iso.Line points={PHONE_LINK} tone="accent" flow />}
				off={<Iso.Line points={PHONE_LINK} tone="muted" dash="dashed" />}
			/>
			<Iso.Server at={[-3, -3, 0]} size={[6, 6, 7]} />
			<Iso.Line
				points={[
					[-2, 3, 5.5],
					[2, 3, 5.5],
				]}
				tone="muted"
			/>
			<Iso.Line
				points={[
					[-2, 3, 5.5],
					[2, 3, 5.5],
				]}
				tone="accent"
				draw
			/>
			<Iso.Ring center={[0, 0, 7]} radius={1.2} tone="accent" />
			<Iso.Ring center={[0, 0, 7]} radius={2.2} tone="accent" ping />
			<Iso.Switch
				on={<Iso.Laptop at={[-7, 4.5]} active />}
				off={<Iso.Laptop at={[-7, 4.5]} closed />}
			/>
			<Iso.Switch
				delay={PHONE_DELAY}
				on={<Iso.Phone at={[4.2, 4]} active />}
				off={<Iso.Phone at={[4.2, 4]} />}
			/>
		</Iso.Canvas>
	);
}
