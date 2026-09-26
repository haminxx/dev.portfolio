import { Core } from "@tomo/api";

export default function Home() {
	return <main className="p-32 antialiased">{Core.VERSION}</main>;
}
