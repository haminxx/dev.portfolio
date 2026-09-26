import { type LinkProps, Link as RouterLink } from "react-router";

export function Link({ prefetch = "viewport", ...props }: LinkProps) {
	return <RouterLink prefetch={prefetch} {...props} />;
}
