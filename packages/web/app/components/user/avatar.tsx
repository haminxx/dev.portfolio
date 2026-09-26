import { BoringAvatar } from "~/components/boring-avatar";
import { AvatarFallback, AvatarImage, Avatar as AvatarRoot } from "~/components/ui/avatar";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

type Size = NonNullable<React.ComponentProps<typeof AvatarRoot>["size"]>;

const skeletonSize: Record<Size, string> = {
	xs: "size-5",
	sm: "size-6",
	default: "size-8",
	lg: "size-10",
};

export function Avatar({
	id,
	name,
	image,
	size = "default",
	className,
}: {
	id?: string | null;
	name?: string | null;
	image?: string | null;
	size?: Size;
	className?: string;
}) {
	if (!id) {
		return <Skeleton className={cn("rounded-full", skeletonSize[size], className)} />;
	}

	return (
		<AvatarRoot className={className} size={size}>
			{image ? <AvatarImage src={image} alt={name ?? ""} referrerPolicy="no-referrer" /> : null}
			<AvatarFallback className="bg-transparent">
				<BoringAvatar.Root className="size-full" name={id} />
			</AvatarFallback>
		</AvatarRoot>
	);
}
