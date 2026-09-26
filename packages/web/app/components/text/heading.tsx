import type { ReactNode } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

export function Heading({ children, className }: { children: ReactNode; className?: string }) {
	return <h1 className={cn("text-3xl font-[450] tracking-tight", className)}>{children}</h1>;
}

export function HeadingSkeleton({ className }: { className?: string } = {}) {
	return <Skeleton className={cn("h-9 w-48", className)} />;
}
