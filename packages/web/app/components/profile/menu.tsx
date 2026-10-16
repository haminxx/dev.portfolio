import { Guest, Owner } from "@tomo/api";
import { ChartNoAxesColumn, LogOut, Shield } from "lucide-react";
import { Google } from "~/components/svgs/google";
import { Tomo } from "~/components/tomo";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { User } from "~/components/user";
import { useAnalyticsAccess } from "~/hooks/use-analytics";
import { signIn, signOut, useSession } from "~/lib/auth";

/** The owner's profile chip. The visitor dashboard hangs off it, for him only. */
export function Menu() {
	const { data: session } = useSession();
	const access = useAnalyticsAccess();
	const user = session?.user.id === Guest.UserId ? undefined : session?.user;
	const owner = access.data?.owner === true;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				aria-label={`${Owner.Name} profile`}
				className="flex h-9 shrink-0 items-center gap-2 rounded-xl pr-2.5 pl-1 text-sm outline-none transition hover:bg-muted data-[state=open]:bg-muted"
			>
				<User.Avatar
					id={owner && user ? user.id : Owner.Name}
					image={owner ? (user?.image ?? null) : null}
					name={Owner.Name}
					size="sm"
				/>
				<span className="font-[450]">{Owner.Name}</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-60" sideOffset={8}>
				<DropdownMenuLabel className="flex flex-col gap-0.5 py-3">
					<span className="font-medium text-foreground text-sm">{Owner.Name}</span>
					<span className="truncate font-normal text-muted-foreground text-xs">
						{owner ? (user?.email ?? Owner.Email) : Owner.Email}
					</span>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{owner ? (
					<DropdownMenuItem asChild>
						<Tomo.Link to="/dashboard">
							<ChartNoAxesColumn />
							Visitors
						</Tomo.Link>
					</DropdownMenuItem>
				) : null}
				<DropdownMenuItem asChild>
					<Tomo.Link to="/privacy">
						<Shield />
						Privacy
					</Tomo.Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				{user ? (
					<DropdownMenuItem onSelect={() => void signOut()} variant="destructive">
						<LogOut />
						Sign out
					</DropdownMenuItem>
				) : (
					<DropdownMenuItem
						onSelect={() => void signIn.social({ provider: "google", callbackURL: "/dashboard" })}
					>
						<Google className="size-4" />
						Sign in with Google
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
