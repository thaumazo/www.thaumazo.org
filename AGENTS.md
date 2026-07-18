# Project Instructions

This site uses Kenstack from `kenstack/`. Before making code changes, read and follow the shared Kenstack instructions in `kenstack/agents.md`.

## Next.js

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Training data can be stale; the local docs are the source of truth.

## Site-specific notes

- Keep site-specific modules, pages, and migrations in the root project.
- Keep reusable CMS/admin behavior in `kenstack/`.
- Do not modify `.env*` files.
- Keep patches narrow and avoid unrelated refactors.
- During site review, check that `src/app/sitemap.ts` and `src/app/robots.ts` still match the current public page structure and indexing rules.
