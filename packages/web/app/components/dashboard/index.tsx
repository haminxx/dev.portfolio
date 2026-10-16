import { Daily as DailyComponent } from "./daily";
import { Messages as MessagesComponent } from "./messages";
import { Root as RootComponent } from "./root";
import { Stats as StatsComponent } from "./stats";
import { Visits as VisitsComponent } from "./visits";

export namespace Dashboard {
	export const Root = RootComponent;
	export const Stats = StatsComponent;
	export const Daily = DailyComponent;
	export const Visits = VisitsComponent;
	export const Messages = MessagesComponent;
}
