import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { Core } from "../api/src/core";

export default defineConfig({
	plugins: [tailwindcss(), reactRouter()],
	server: {
		port: Core.Ports.Web,
		proxy: {
			"/api": {
				target: `http://localhost:${Core.Ports.Api}`,
				changeOrigin: true,
				ws: true,
			},
		},
	},
	resolve: {
		tsconfigPaths: true,
	},
});
