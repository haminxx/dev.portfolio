import Avatar from "boring-avatars";
import { cn } from "~/lib/utils";

type AvatarVariant =
	| "pixel"
	| "bauhaus"
	| "ring"
	| "beam"
	| "sunset"
	| "marble"
	| "geometric"
	| "abstract";

export type RootProps = {
	name: string;
	size?: number;
	variant?: AvatarVariant;
	colors?: string[];
	className?: string;
};

export function Root({ name, size, variant = "beam", colors, className }: RootProps) {
	return (
		<span
			className={cn("inline-flex shrink-0 overflow-hidden rounded-full", className)}
			style={size ? { width: size, height: size } : undefined}
		>
			<Avatar
				{...(colors ? { colors } : {})}
				{...(size ? { size } : {})}
				className="size-full"
				name={name}
				variant={variant}
			/>
		</span>
	);
}
