<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.

<!-- END:nextjs-agent-rules -->

## Code style

- Use TypeScript.
- Do not use `any`.
- Use curly braces for all conditionals.
- Prefer inferred types unless explicit types improve clarity.
- Keep patches narrow.
- Do not refactor unrelated code.
- Follow existing naming and folder conventions.

## Next.js conventions

- Use the App Router.
- Prefer Server Components by default.
- Add `"use client"` only when needed.
- Do not pass non-serializable values from server to client components.
- Keep data loading on the server unless the UI requires client-side updates.
- Use route handlers for API endpoints.

## Styling

- Use Tailwind utilities.
- Prefer existing shared components before adding new ones.
- Keep class names compatible with Prettier/Tailwind sorting.

## Database

- Use Drizzle ORM.
- Do not edit generated migrations casually.
- Do not change schema names or column names without checking existing migrations.
- Prefer explicit nullability and defaults.

## Validation

- Use Zod v4.
- Keep client and server schemas aligned.
- Use server-specific coercion only where needed.

## Testing / checks

Before finishing a code change, run the narrowest relevant checks:

- TypeScript check for type changes
- lint for style changes
- build for Next.js/runtime-sensitive changes

## Safety rules

- Do not modify `.env*` files.
- Do not change auth, billing, or migration logic unless asked.
- Do not add dependencies without asking.
- Do not reformat unrelated files.
