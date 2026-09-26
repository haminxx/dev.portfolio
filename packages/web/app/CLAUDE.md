# Web app

## Primitives

Prefer our wrappers over the underlying libraries — they set sensible defaults (e.g. `Tomo.Link` defaults to `prefetch="viewport"`) and give us a single place to change behavior app-wide. App-wide primitives live in the `Tomo` namespace (`~/components/tomo`).

- Prefer `Tomo.Link` over react-router's `Link`.
- Prefer `Tomo.Image` over `<img>` for static art (register it in `tomo/registry.ts`).
- Use `Tomo.Logo` for the logo mark; it always renders the light version (paper fill, black stroke) regardless of theme. Source art lives in `docs/brand/`; the favicon (`public/favicon.svg`) is a copy of `docs/brand/logo-light.svg`.
- Prefer `Text` (`~/components/text`) over raw heading/paragraph elements.
- Use `Form.TextField` / `Form.TextareaField` with `react-hook-form` + `zod` for forms.
- Use `User.Avatar` for people (falls back to a `BoringAvatar` seeded by id).
- Call the API through `hono` (`~/lib/hono`) with `@tanstack/react-query`; surface failures with `errorMessage`.
- Use `cn` (`~/lib/utils`) for merging class names — not template literals.
- Fonts: `font-sans` (Geist) and `font-mono` (Berkeley Mono). There is no serif.
- Colors: the palette is [Flexoki](https://stephango.com/flexoki). Use the `/flexoki` skill to look up exact hex values and theme roles rather than guessing.

## Layout

- Conditional content (form validation errors, banners) must not grow a fixed-height layout. Instead of margins (`mt-*`), use flex spacer divs (`<div className="h-16 flex-auto" />`) inside a fixed-height column — they render at their basis height normally and shrink to absorb the extra content. Bias which gap gives first with `shrink-[N]`.
- To let spacers on both sides of a `<form>` share one flex pool, give the form `className="contents"` so its children become direct flex items of the column.
