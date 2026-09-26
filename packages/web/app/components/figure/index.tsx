import { Activity as ActivityComponent } from "./activity";
import { AlwaysOn as AlwaysOnComponent } from "./always-on";
import { Iso as IsoNamespace } from "./iso";
import { Isolated as IsolatedComponent } from "./isolated";
import { Root as RootComponent } from "./root";
import { Shared as SharedComponent } from "./shared";

export namespace Figure {
	export const Root = RootComponent;
	export const Activity = ActivityComponent;
	export const AlwaysOn = AlwaysOnComponent;
	export const Shared = SharedComponent;
	export const Isolated = IsolatedComponent;
	export import Iso = IsoNamespace;
}
