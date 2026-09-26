export type Vec2 = readonly [number, number];
export type Vec3 = readonly [number, number, number];

const X = 10 * Math.cos(Math.PI / 6);
const Y = 5;
const Z = 10;

export function project([x, y, z]: Vec3): Vec2 {
	return [(x - y) * X, (x + y) * Y - z * Z];
}

export function points(vs: readonly Vec3[]): string {
	return vs
		.map((v) =>
			project(v)
				.map((n) => n.toFixed(2))
				.join(","),
		)
		.join(" ");
}

export function rect([x, y, z]: Vec3, [w, d]: Vec2): Vec3[] {
	return [
		[x, y, z],
		[x + w, y, z],
		[x + w, y + d, z],
		[x, y + d, z],
	];
}

export const ringScale: Vec2 = [X * Math.SQRT2, Y * Math.SQRT2];

export const tones = {
	line: "stroke-foreground",
	muted: "stroke-base-300 dark:stroke-base-700",
	accent: "stroke-blue-600 dark:stroke-blue-400",
} as const;

export const fills = {
	none: "fill-none",
	paper: "fill-background",
	shade: "fill-muted",
	accent: "fill-blue-50 dark:fill-blue-950",
	accentShade: "fill-blue-100 dark:fill-blue-900",
} as const;

export const dashes = {
	solid: undefined,
	dashed: "3 3",
	dotted: "0.5 4",
} as const;

export type Tone = keyof typeof tones;
export type Fill = keyof typeof fills;
export type Dash = keyof typeof dashes;
