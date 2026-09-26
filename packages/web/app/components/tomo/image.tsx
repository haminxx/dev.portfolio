import { cn } from "~/lib/utils";
import { type ImageMeta, type ImageName, images } from "./registry";

export function Image({
	name,
	className,
	children,
}: {
	name: ImageName;
	className?: string;
	children?: React.ReactNode;
}) {
	const image: ImageMeta = images[name];

	return (
		<div
			className={cn("relative overflow-hidden", className)}
			style={{
				aspectRatio: `${image.width} / ${image.height}`,
				backgroundColor: image.color,
			}}
		>
			<img
				src={image.path}
				alt={image.alt}
				width={image.width}
				height={image.height}
				className="absolute inset-0 h-full w-full object-cover"
			/>
			{children}
		</div>
	);
}
