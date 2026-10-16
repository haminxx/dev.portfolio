type Agent = { browser: string | null; os: string | null; device: string | null };

const browsers: [RegExp, string][] = [
	[/\b(?:headlesschrome)\b/i, "Headless Chrome"],
	[/\bedg(?:e|a|ios)?\//i, "Edge"],
	[/\b(?:opr|opera)\//i, "Opera"],
	[/\bsamsungbrowser\//i, "Samsung Internet"],
	[/\bfirefox\/|\bfxios\//i, "Firefox"],
	[/\bcrios\//i, "Chrome"],
	[/\bchrome\//i, "Chrome"],
	[/\bsafari\//i, "Safari"],
];

const systems: [RegExp, string][] = [
	[/\bwindows nt\b/i, "Windows"],
	[/\b(?:iphone|ipad|ipod)\b/i, "iOS"],
	[/\bandroid\b/i, "Android"],
	[/\bmac os x\b|\bmacintosh\b/i, "macOS"],
	[/\bcros\b/i, "ChromeOS"],
	[/\blinux\b/i, "Linux"],
];

const bot = /bot|crawler|spider|crawling|preview|headless|facebookexternalhit|slurp|curl|wget/i;
const tablet = /\bipad\b|\btablet\b|\b(?:android(?!.*mobile))\b/i;
const mobile = /\bmobi\b|\bmobile\b|\biphone\b|\bipod\b|\bandroid\b/i;

function match(table: [RegExp, string][], value: string) {
	for (const [pattern, label] of table) if (pattern.test(value)) return label;
	return null;
}

/** Small hand-rolled UA parser: a dependency here would be more code than this. */
export function parse(userAgent: string | null | undefined): Agent {
	const value = (userAgent ?? "").trim();
	if (!value) return { browser: null, os: null, device: null };
	if (bot.test(value))
		return { browser: match(browsers, value), os: match(systems, value), device: "bot" };
	const device = tablet.test(value) ? "tablet" : mobile.test(value) ? "mobile" : "desktop";
	return { browser: match(browsers, value), os: match(systems, value), device };
}
