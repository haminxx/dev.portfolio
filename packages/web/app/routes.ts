import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
	layout("routes/desktop/layout.tsx", [index("routes/desktop/page.tsx")]),
	route("privacy", "routes/privacy/page.tsx"),
	route("dashboard", "routes/dashboard/page.tsx"),
] satisfies RouteConfig;
