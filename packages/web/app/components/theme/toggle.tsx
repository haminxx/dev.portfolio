import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "~/components/theme/provider";

const cycle = { light: "dark", dark: "system", system: "light" } as const;
const icons = { light: Sun, dark: Moon, system: Monitor };

export function ModeToggle() {
	const { theme, setTheme } = useTheme();
	const Icon = icons[theme];

	return (
		<button
			type="button"
			onClick={() => setTheme(cycle[theme])}
			className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
		>
			<Icon size={12} strokeWidth={2.5} />
		</button>
	);
}
