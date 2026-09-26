import type { ReactNode } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

export function Subtext({ children, className }: { children: ReactNode; className?: string }) {
	return <p className={cn("mt-3 text-muted-foreground text-sm", className)}>{children}</p>;
}

export function SubtextSkeleton({ className }: { className?: string } = {}) {
	return <Skeleton className={cn("mt-3 h-4 text-sm w-64", className)} />;
}
