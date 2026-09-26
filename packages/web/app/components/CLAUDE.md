# Components

## Namespace pattern

Each component folder exports a TS `namespace` from its `index.tsx`, aggregating sibling files as members.

```tsx
// foo/index.tsx
import { Root as RootComponent } from "./root";
import { Item as ItemComponent } from "./item";

export namespace Foo {
	export const Root = RootComponent;
	export const Item = ItemComponent;
}
```

Used as `<Foo.Root />`, `<Foo.Item />`.

## Nested namespaces

Group related components under a parent folder. Parent re-exports children via `export import`:

```tsx
// workspace/index.tsx
import { List as ListNamespace } from "./list";

export namespace Workspace {
	export import List = ListNamespace;
}
```

Used as `<Workspace.List.Root />`.

## Conventions

- `root.tsx` — the main/entry component of the namespace (rendered as `<Foo.Root />`).
- One component per file, named export matching the file: `./item.tsx` → `export const Item`.
- Subcomponents (`empty.tsx`, `loading.tsx`, `error.tsx`, `actions.tsx`) live as siblings, not nested folders, unless they themselves need a namespace.
- Parent-owned layout: components style their insides only — no external sizing, positioning, or margins on their root. They stretch to fill (`h-full`, `flex-1`); the parent (usually the page) decides dimensions and placement.
- Avoid naming a route's default export the same as an imported namespace (e.g. don't `export default function Home()` if you import `Home`).
- `ui/` is shadcn-managed (`pnpm --filter @tomo/web exec shadcn add <name>`); don't hand-write components there.
- Use `cn` (`~/lib/utils`) for merging class names — not template literals.
