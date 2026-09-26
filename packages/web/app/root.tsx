import { Core } from "@tomo/api";
import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";
import "./app.css";
import { Theme } from "./components/theme";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";

export const meta: Route.MetaFunction = () => [{ title: Core.NAME }];

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
				<script src="/theme-script.js" />
			</head>
			<body className="antialiased">
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return (
		<Theme.Provider>
			<TooltipProvider>
				<Outlet />
				<Toaster />
			</TooltipProvider>
		</Theme.Provider>
	);
}

export function HydrateFallback() {
	return null;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	const message = isRouteErrorResponse(error)
		? `${error.status} ${error.statusText || "Error"}`
		: "Unexpected error";
	const details =
		isRouteErrorResponse(error) && error.status === 404
			? "Page not found."
			: import.meta.env.DEV && error instanceof Error
				? error.message
				: "An unexpected error occurred.";

	return (
		<main className="mx-auto max-w-2xl p-8">
			<h1 className="text-2xl font-[450] tracking-tight">{message}</h1>
			<p className="mt-2 text-muted-foreground">{details}</p>
			{import.meta.env.DEV && error instanceof Error && error.stack && (
				<pre className="mt-6 overflow-x-auto font-mono text-xs">
					<code>{error.stack}</code>
				</pre>
			)}
		</main>
	);
}
