import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [tailwindcss(), reactRouter()],
	server: {
		port: 2300,
		proxy: {
			"/api": {
				target: "http://localhost:2301",
				changeOrigin: true,
				ws: true,
			},
		},
	},
	resolve: {
		tsconfigPaths: true,
	},
});
