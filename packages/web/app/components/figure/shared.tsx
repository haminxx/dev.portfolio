import { Iso } from "./iso";

export function Shared() {
	return (
		<Iso.Canvas label="Laptops come and go from one shared computer while an agent keeps working">
			<Iso.Member
				at={[-7, -7]}
				link={[
					[-4, -5.9, 0],
					[-1.5, -5.9, 0],
					[-1.5, -3.5, 0],
				]}
			/>
			<Iso.Box at={[-3.5, -3.5, 0]} size={[7, 7, 1.2]} />
			<Iso.Window at={[-2.8, -2.8, 1.2]} size={[3.2, 2.6]} />
			<Iso.Window at={[0.9, -2.8, 1.2]} size={[1.9, 2.6]} accent />
			<Iso.Window at={[-2.8, 0.4, 1.2]} size={[5.6, 2.4]} />
			<Iso.Member
				at={[5.5, -4]}
				delay={2}
				link={[
					[3.5, -2.9, 0],
					[5.5, -2.9, 0],
				]}
			/>
			<Iso.Member
				at={[-4.5, 6]}
				delay={4}
				link={[
					[0, 3.5, 0],
					[0, 7, 0],
					[-1.5, 7, 0],
				]}
			/>
		</Iso.Canvas>
	);
}
