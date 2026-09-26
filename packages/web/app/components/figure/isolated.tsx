import { Fragment } from "react";
import { Iso } from "./iso";

const WORKSPACES = [-8, -2, 4];
const DIVIDERS = [-3, 3];

export function Isolated() {
	return (
		<Iso.Canvas label="Three separate workspaces, each its own computer, divided from each other">
			{DIVIDERS.map((x) => (
				<Iso.Line
					key={x}
					points={[
						[x, -6, 0],
						[x, 6, 0],
					]}
					tone="muted"
					dash="dashed"
				/>
			))}
			{WORKSPACES.map((x, i) => {
				const accent = i === 1;
				return (
					<Fragment key={x}>
						<Iso.Box
							at={[x, -2, 0]}
							size={[4, 4, 1]}
							tone={accent ? "accent" : "line"}
							accent={accent}
						/>
						<Iso.Float delay={i * 0.6}>
							<Iso.Server at={[x + 0.9, -1.1, 1]} size={[2.2, 2.2, 3]} accent={accent} />
						</Iso.Float>
					</Fragment>
				);
			})}
		</Iso.Canvas>
	);
}
