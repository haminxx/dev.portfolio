# Routes

File-based routes registered in `app/routes.ts`. One folder per route; dynamic segments use `[param]` folders (e.g. `w/[workspace]/`).

## Per-route files

- `layout.tsx` — wraps child routes with `<Outlet />`. Owns persistent shell (header, nav).
- `page.tsx` — leaf route. Owns its own data fetching and loading state.
- `loading.tsx` — exports a `Loading` component (skeleton). Imported by sibling `page.tsx` and rendered while its query `isPending`.

## Optimistic loading pattern

Layouts should **not** return `null` while a query is pending. Render the parts that can be derived from the URL (nav, shell chrome) immediately; gate the `<Outlet />` or redirect on the *confirmed* result:

```tsx
const { data, isPending } = useThing();
if (!isPending && !data) return <Navigate replace to="/elsewhere" />;
return (
  <Shell>
    {isPending ? null : <Outlet />}
  </Shell>
);
```

Each leaf `page.tsx` handles its own pending state via its co-located `loading.tsx`:

```tsx
import { Loading } from "./loading";
export default function Page() {
  const { data, isPending } = useThing();
  if (isPending) return <Loading />;
  // ...
}
```

Skeletons live with the component they mirror, so loading states reuse the same sizing/spacing as the real content.
