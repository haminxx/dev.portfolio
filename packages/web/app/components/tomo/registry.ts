export type ImageMeta = {
	path: string;
	alt: string;
	color: string;
	width: number;
	height: number;
};

export const images = {} as const satisfies Record<string, ImageMeta>;

export type ImageName = keyof typeof images;
