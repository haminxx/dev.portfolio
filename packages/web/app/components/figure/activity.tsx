import { MotionConfig, motion } from "motion/react";

const PEOPLE = [0, 0, 0, 0, 0, 0, 0, 1, 3, 6, 7, 7, 5, 7, 7, 6, 5, 3, 1, 1, 0, 0, 0, 0];
const AGENTS = [4, 5, 5, 4, 5, 4, 5, 5, 4, 5, 6, 6, 5, 6, 6, 5, 5, 5, 6, 5, 5, 4, 5, 5];
const HOURS = [
	[0, "12am"],
	[6, "6am"],
	[12, "12pm"],
	[18, "6pm"],
	[24, "12am"],
] as const;

const WIDTH = 480;
const HEIGHT = 160;
const STEP = WIDTH / AGENTS.length;
const BAR = STEP - 6;
const UNIT = HEIGHT / 14;

export function Activity() {
	return (
		<MotionConfig reducedMotion="user">
			<div className="flex flex-col gap-4">
				<motion.svg
					role="img"
					aria-label="Over a day, people work in the daytime while agents keep working around the clock"
					viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
					className="h-auto w-full"
					initial="hidden"
					whileInView="shown"
					viewport={{ once: true, amount: 0.5 }}
				>
					{AGENTS.map((agents, i) => {
						const people = PEOPLE[i] ?? 0;
						const x = i * STEP + 3;
						return (
							<motion.g
								key={x}
								style={{ transformBox: "fill-box", originY: 1 }}
								variants={{
									hidden: { scaleY: 0 },
									shown: {
										scaleY: 1,
										transition: { duration: 0.6, ease: "easeOut", delay: i * 0.03 },
									},
								}}
							>
								<rect
									x={x}
									y={HEIGHT - agents * UNIT}
									width={BAR}
									height={agents * UNIT}
									rx={2}
									className="fill-blue-600 dark:fill-blue-400"
								/>
								{people > 0 ? (
									<rect
										x={x}
										y={HEIGHT - (agents + people) * UNIT}
										width={BAR}
										height={people * UNIT - 2}
										rx={2}
										className="fill-base-300 dark:fill-base-700"
									/>
								) : null}
							</motion.g>
						);
					})}
				</motion.svg>
				<div className="flex justify-between font-mono text-muted-foreground text-xs">
					{HOURS.map(([hour, label]) => (
						<span key={hour}>{label}</span>
					))}
				</div>
				<div className="flex gap-6 text-muted-foreground text-xs">
					<span className="flex items-center gap-2">
						<span className="size-2 rounded-full bg-base-300 dark:bg-base-700" />
						People
					</span>
					<span className="flex items-center gap-2">
						<span className="size-2 rounded-full bg-blue-600 dark:bg-blue-400" />
						Agents
					</span>
				</div>
			</div>
		</MotionConfig>
	);
}
