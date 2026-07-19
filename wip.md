# WIP — Bundle-size regression guard for public routes

**Current status:** the original spec below is now partly superseded. Do not implement the `.next/app-build-manifest.json` path, the `"site-settings"` sentinel, or deploy/build-script wiring from the first draft without applying the later Codex/Fable/Ken rulings. Ken has decided this guard should be a final-review check only, not part of `build:vercel`. The current implementation target is the staged `--report` script using the discovered Next 16 artifacts, followed by baseline/enforcement only after the report output is reviewed.

**Builder update:** the bundle checker implementation is now Kenstack-owned, but invocation is site-owned. The shared checker lives at `kenstack/src/admin/scripts/check-bundle.mjs`; the consuming site runs it from its own package script after `npm run build` with `npm run bundle:report`. The checker treats the current working directory as the app root, so a monorepo with multiple sites can opt in per site without Kenstack guessing which `.next` output to inspect. It must not be wired into `build:vercel`. Future baseline/enforcement work should keep reusable artifact parsing and sentinel detection in Kenstack; host-specific state, such as any committed baseline, route policy, package script, or final-review documentation, stays in the host repo.

**Dependency update:** Kenstack now declares `tsx` as a normal dependency because Kenstack is consumed directly rather than built as a standalone package, and existing Kenstack operational scripts such as `users:add-admin` spawn `tsx` at runtime.

Instructions for Codex. The original first draft treated this as **host-repo work** (thaumazo root: `scripts/`, `package.json`, a committed baseline file), but that ownership is now superseded by the builder update above. Goal: catch the exact failure class `kenstack/agents.md` warns about — the admin client registry or a dynamic-import boundary regression leaking admin/module code into public route bundles.

## What we're guarding (verified in this repo)

- `src/modules/clients.ts` is the canonical leak source: `"use client"` + `defineAdminClients` with dynamic imports of every module client (blog, contact, organizations, projects, services, site-settings, users). If the directive is removed or the import graph shifts (both failure modes documented in `agents.md`), all of those clients plus the kenstack form stack land in every public page's first load.
- Public surface: the `(site)` route group — `/`, `/blog`, `/blog/[slug]`, `/community`, `/community/[slug]`, `/contact`, `/login`, `/forgot-password`, `/reset-password`, `/organizations` (+`[slug]`), `/projects` (+`[slug]`), `/services` (+`[slug]`).
- Build is webpack (`next build --webpack`), so `.next/app-build-manifest.json` is produced, mapping each app route entry (keys like `/(site)/blog/[slug]/page`) to its complete client-file list, shared chunks included. Dev uses turbopack but that's irrelevant to the guard.
- No CI workflows exist; deploys go through the `build:vercel` script. That script is therefore the enforcement point — no CI infrastructure needed.

## Recommendation — smallest viable approach

One dependency-free Node script, `scripts/check-bundle.mjs` (~80–100 lines, `node:fs` + `node:zlib` only), run after `next build`. Two checks:

**Check 1 — per-route first-load size vs committed baseline.**
For each configured route: take its file list from `app-build-manifest.json` (match manifest keys by route suffix), de-duplicate, `gzipSync` each file from `.next/` at a fixed level (9), sum. Compare against `bundle-baseline.json` (committed at repo root). Because each route's manifest list includes the shared chunks, a leak into the root layout or shared vendor chunk shows up in every public route — no separate shared-chunk bookkeeping needed.

**Check 2 — admin sentinel scan (the precise leak detector).**
Concatenate each public route's chunk contents and search for string literals that exist only in admin-bundled code and survive minification. Use at least two, chosen from literals verified present in admin-only modules: `"site-settings"` (a registry key in `src/modules/clients.ts` — object keys survive minification) and `"Drag to reorder"` (aria-label in kenstack's admin List). Zero tolerance: any hit in a public route fails the build immediately with the offending route + sentinel named. This catches a leak even when it's small enough to slip under the size tolerance, and unlike sizes it can't drift. Document in the script that sentinels must be string literals, and re-verify them if those source strings are ever edited.

## Routes to baseline

All thirteen `(site)` routes above (one `[slug]` variant per section is what the manifest has — baseline the manifest entries, not URL instances). Also record `/admin/[...admin]` in the baseline **without a failure threshold** (report-only): it's the control — if a "fix" suddenly shrinks admin, that's worth a look too, but it must never block. `/api/*` and metadata routes (robots, sitemap) have no client bundles; skip.

## Metric to store

`bundle-baseline.json`, keyed by manifest route, storing gzipped total bytes per route (integer). Gzip rather than raw: it's proportional to what ships and stable across rebuilds of identical content (chunk hashes change filenames, not sizes). Keep the file human-diffable — one route per line — so baseline updates are reviewable in git. Update only via an explicit `node scripts/check-bundle.mjs --update`; the script must never rewrite the baseline on a normal run.

## Tolerance

Fail when a public route grows by more than **max(10 KB gzip, 5%)** over baseline; print a warning (exit 0) for smaller growth. Rationale: rebuild noise on identical sources is near-zero with webpack; ordinary feature work moves a route by a few KB; the guarded failure class is the admin registry + form stack, which is on the order of 100 KB+ gzip — a generous tolerance keeps day-to-day work friction-free while remaining an order of magnitude below the signal. No tolerance on shrinkage (never fail on smaller). Sentinel check has zero tolerance regardless of size.

## Wiring

- `package.json`: add `"check:bundle": "node scripts/check-bundle.mjs"` and change `build:vercel` to `npm run db:migrate && npm run build && npm run check:bundle`. Escape hatch: skip when `process.env.SKIP_BUNDLE_CHECK` is set (for emergency deploys), with a loud console warning.
- Failure output must be actionable: route, baseline KB, current KB, delta, and — for sentinel hits — which sentinel and which chunk file, plus a pointer to `kenstack/agents.md`'s client-registry rules.
- If `.next/app-build-manifest.json` is missing, fail with a clear message ("run `next build --webpack` first") rather than passing vacuously — this also trips if the production build is ever switched to turbopack, which is the correct moment to revisit the manifest source.

## Acceptance criteria for Codex

1. Fresh `npm run build` then `check:bundle --update` writes a plausible baseline (public routes roughly tens-to-low-hundreds of KB gzip; admin larger); a second `check:bundle` run passes clean.
2. Leak simulation: temporarily change `src/modules/clients.ts`'s dynamic imports to static imports (or remove `"use client"`), rebuild, and confirm **both** checks fire on public routes — then revert. Do not commit the simulation.
3. Tolerance simulation: confirm a warning (not a failure) on a small drift by hand-editing the baseline down a few KB.
4. No new dependencies; script is plain Node ESM; baseline committed; `SKIP_BUNDLE_CHECK` honored.
5. Keep it out of kenstack — everything lands in the host repo.

## Explicitly not recommended (considered, rejected)

- `@next/bundle-analyzer` / `size-limit` / third-party actions: new dependencies and heavier config for less precise signal than the manifest + sentinel pair.
- Parsing `next build` stdout ("First Load JS" table): format is not a contract; the manifest is.
- Per-chunk baselines: chunk hashing makes filenames unstable; per-route totals plus sentinels give the same detection without churn.
- GitHub Actions workflow: nothing else runs in CI here; the Vercel build gate is where a regression actually matters. Revisit if CI is introduced later.

## Codex adversarial findings — 2026-07-18

**Overall recommendation:** keep the bundle guard idea, but do **not** implement this exact spec yet. It needs a prototype/discovery pass first because several build-output assumptions are false against the current Next 16 webpack output.

- **Manifest source is wrong/stale.** The current production output has `.next/build-manifest.json`, but for this App Router build its `pages` map only contains `/_app`; it does not provide the per-app-route entries described above. The current route-specific client information exists in `.next/server/app/**/page_client-reference-manifest.js` and the emitted `.next/static/chunks/app/...` files. A script should discover the actual source from a fresh `npm run build` and fail clearly if neither supported shape exists. Do not hard-code `.next/app-build-manifest.json` as the only source.
- **The public route count is wrong.** There are 15 `(site)` page entries in this repo, not 13: `/`, blog index/detail, community index/detail, contact, login, forgot-password, reset-password, organizations index/detail, projects index/detail, services index/detail. Baseline the manifest/build entries that actually exist after build, but keep the configured allowlist in sync with this route set.
- **The proposed `"site-settings"` sentinel would fail today.** Current public route chunks already include `src/modules/clients.ts` and its `"site-settings"` registry key, because public pages intentionally render Kenstack admin controls/shortcuts for admins. That does not necessarily mean the full admin form/list stack has leaked into initial public execution. A zero-tolerance sentinel must target a string that is absent from the current public chunks but present when the bad static-import/client-boundary failure is simulated.
- **`"Drag to reorder"` is a better candidate than `"site-settings"`, but still must be verified against `.next/static/chunks`, not source or server bundles.** It is admin-list-specific and should not appear in public chunks in the healthy build. Re-verify after a fresh build before committing it as a sentinel.
- **Client-reference manifests are not the same as first-load payload.** Current public route client-reference manifests mention admin/page-editor modules and `src/modules/clients.ts`, but many entries have empty chunk lists or are server references. Treat those manifests as a way to find chunk files, not as direct proof that every named module ships in first-load JS.
- **Do not wire `check:bundle` into `build:vercel`.** Earlier reviewer notes considered a deploy gate, but Ken has chosen explicit final-review invocation instead. First land the script + baseline and run it manually from the final-review ritual; keep build scripts unchanged.

**Revised implementation guidance:** build a read-only prototype script first that prints route -> chunk files -> gzip total and sentinel hits from current `.next` output. Use that to choose sentinels that are zero-hit on the healthy build. Only then add baseline update/check modes and package wiring.

## Codex prototype discovery results — 2026-07-18

Ran a fresh `npm run build` on Next 16.2.6 with webpack. Build passed.

**Build artifact findings:**

- `.next/app-build-manifest.json` is **not** emitted in this repo, despite the earlier recommendation. Do not build the script around that path.
- `.next/build-manifest.json` exists, but its `pages` object only contains `/_app`. It is still useful for `rootMainFiles` shared files.
- `.next/app-path-routes-manifest.json` is the reliable map from app route key to URL, for example `"/(site)/blog/[slug]/page" -> "/blog/[slug]"`.
- `.next/server/app/**/page_client-reference-manifest.js` is the usable source for route client chunks. These files assign `globalThis.__RSC_MANIFEST[...]` and can be loaded in a sandbox to read `clientModules[*].chunks` and `entryCSSFiles`.
- Chunk paths in client-reference manifests may be URL encoded (`%5Bslug%5D`, `%5B...admin%5D`) while the filesystem paths are decoded. A script must check the direct path and a `decodeURIComponent(...)` fallback.
- Route chunk lists should include `buildManifest.rootMainFiles`, route `clientModules[*].chunks`, and `entryCSSFiles[*].path`. With CSS included, totals are larger but better approximate first-load asset cost.

**Prototype gzip totals, including root main files and route CSS:**

```text
/(site)/page                         /                    22 files  245.8 KB gzip
/(site)/blog/page                    /blog                23 files  246.7 KB gzip
/(site)/blog/[slug]/page             /blog/[slug]         24 files  252.9 KB gzip
/(site)/community/page               /community           23 files  246.7 KB gzip
/(site)/community/[slug]/page        /community/[slug]    24 files  249.4 KB gzip
/(site)/contact/page                 /contact             26 files  294.6 KB gzip
/(site)/forgot-password/page         /forgot-password     23 files  249.5 KB gzip
/(site)/login/page                   /login               23 files  250.3 KB gzip
/(site)/organizations/page           /organizations       23 files  246.7 KB gzip
/(site)/organizations/[slug]/page    /organizations/[slug] 24 files 249.4 KB gzip
/(site)/projects/page                /projects            23 files  246.7 KB gzip
/(site)/projects/[slug]/page         /projects/[slug]     24 files  248.4 KB gzip
/(site)/reset-password/page          /reset-password      23 files  247.3 KB gzip
/(site)/services/page                /services            23 files  246.7 KB gzip
/(site)/services/[slug]/page         /services/[slug]     24 files  248.4 KB gzip
/admin/page                          /admin               27 files  331.7 KB gzip
/admin/[...admin]/page               /admin/[...admin]    27 files  331.7 KB gzip
```

These numbers are plausible but too high to treat as a polished baseline until the script code is reviewed. They do confirm the guard can get stable route-level totals from current artifacts without new dependencies.

**Sentinel probe results against actual referenced route chunks:**

- Bad sentinel: `"site-settings"` appears in public route chunks today (35 public route/chunk hits). It is a registry key in the intentionally loaded admin client registry and must not be used as a zero-tolerance public-route failure.
- Bad sentinels for this purpose: `"Page Settings"`, `"Manage page search and sharing metadata."`, and `"kenstack:inline-editing"` all appear in public chunks because public pages intentionally include inline/page-editing controls for admins.
- Good current candidates: `"Drag to reorder"`, `"Unable to reorder."`, `"No results"`, `"Admin client config is required for admin list routes."`, `"useAdminList must be used within an AdminListProvider"`, `"Delete Forever"`, and `"Restore"` had zero public hits and positive admin hits after resolving encoded paths. Prefer two or three admin-list/edit-specific strings, not one string.
- Do not use source-tree `rg` results as proof. Scan only the exact route chunk files resolved from the built artifacts.

**Trigger recommendation for the expensive sentinel work:**

Do not make deep sentinel/leak checks an always-on Vercel tax yet. Add this to a separate final-review/build checklist and run it when Ken explicitly asks for a final readiness pass, such as "do a final review", "review and stage", "commit this", "commit if ready", or similar pre-commit language. Within that final-review pass, run the bundle sentinel check only when the diff touches one of these build-sensitive areas:

- `src/modules/clients.ts`, `src/modules/index.ts`, or any module client registration/dynamic import map.
- Any file that adds/removes `"use client"` in a route, layout, provider, loader, registry, or Kenstack admin/page-editor component.
- Any file that changes `next/dynamic`, `React.lazy`, dynamic `import(...)`, or lazy loader placement for Client Components.
- `src/app/**/layout.*`, `src/app/**/page.*`, `src/context/Providers.*`, public site shell/header/provider files, or the admin/page-editor controls that intentionally appear on public routes.
- `kenstack/agents.md` client-registry guidance changes, or any change whose stated goal is bundle reduction, route graph cleanup, or server/client boundary cleanup.
- Next/webpack/build config changes (`next.config.*`, `package.json` build scripts, Next major/minor upgrades, or switching production build tooling).

Recommended workflow: keep `kenstack/agents/review.md` as the normal diff-review checklist, and add a separate `kenstack/agents/final-review.md` (or equivalent host final-review note) for slow checks before commit. That final-review file should say: when Ken asks for final review/staging/commit readiness, inspect the changed files; for build-sensitive Next changes matching the trigger areas above, run `npm run build` and then the bundle discovery/check script. For ordinary Kenstack TypeScript/data/UI changes that do not touch the trigger areas, do not run the sentinel check.

**Revised implementation target for Fable/Codex:**

1. First implement `scripts/check-bundle.mjs --report` only: read the current artifact sources above, print route totals, print sentinel hits, and exit nonzero only if artifacts are missing or unreadable. No baseline and no package-script wiring yet.
2. Once `--report` is stable, add `--update` and a committed baseline.
3. Add failure thresholds and sentinel enforcement.
4. Wire/document it for final-review use only. Do not wire it into `build:vercel`.

---

# Additional reviews (same round)

## 2. Field lifecycle typing — `ServerFieldResolver` / `FieldBehavior` / `FieldSaveContext`

**Root cause, verified.** The plumbing for typed values already exists: `ServerFieldResolver<TField> = (field: TField) => ServerField<z.output<TField["zod"]>>`, and `FieldBehavior<TValue>` threads `TValue` into `save`/`preSave` contexts. It bottoms out because `FieldOption`/`DefinedField` (`src/fields/types.ts`) declare `zod: z.ZodType` — broad — so `z.output<TField["zod"]>` collapses to `unknown` for every kind-level resolver, forcing casts like `value as z.output<typeof mediaListSchema>` in `src/fields/server/mediaList.ts`.

**Recommendation — minimal, API-safe (do this now):** add an optional second generic to the resolver type:

```ts
export type ServerFieldResolver<
  TField extends DefinedField = DefinedField,
  TValue = z.output<TField["zod"]>,
> = (field: TField) => ServerField<TValue>;
```

Default preserves today's behavior for every existing use — purely additive, no host impact. Then kenstack's own resolvers opt in where they know their schema: `mediaListField(...): ServerFieldResolver<DefinedField<"media-list"> & MediaListUploadOptions, z.output<typeof mediaListSchema>>`, deleting the cast; same pattern available to `imageField`/`fileField` if their handlers ever need typed values. This is exactly `agents/typescript.md`'s "type the narrow callback/capability boundary" move.

**Not now (real project, separate approval):** threading a `TZod extends z.ZodType` generic through `FieldOption`/`DefinedField` and the client factories so _host-defined_ fields carry schema types end-to-end. Note: host fields that pass explicit `zod:` options already get partial precision via the `const TOptions` intersection; the broad case is kind-level default schemas. That project touches the whole factory surface and its `const`-generic inference — high regression risk for host call sites; needs its own slice with an inference-lock test file.

**Acceptance:** cast in `mediaList.ts` deleted; `tsc` clean in kenstack and host; no signature change visible to any current caller (the generic has a default).

### Codex adversarial finding

Agree, with one implementation constraint. This is a good narrow fix because the new generic defaults to today's behavior and lets Kenstack-owned resolvers opt into a known value type. Keep it to `ServerFieldResolver` plus one or two resolver annotations; do **not** start the larger `FieldOption`/`DefinedField` schema-generic project in the same patch. Also verify that `serverFields(...)`'s `patches` type still accepts both direct `ServerField<z.output<...>>` objects and resolver functions after the generic is added.

## 3. Malformed JSON handling — `pipeline.ts` / `multiPipeline.ts` / `admin/api/index.ts`

**Current behavior, verified.** `pipeline.ts`: content-type check → **400**; `request.json()` in try/catch → structured **400**. `multiPipeline.ts` and `admin/api/index.ts` (`runAdminPipeline`): content-type check → **415**; `request.json()` **uncaught** — malformed JSON throws, Next returns a generic 500, and `fetcher` surfaces "unexpected problem… Server error: 500" (thrown `UserFacingError`) instead of a structured error result.

**Recommendation: yes, standardize on structured 400 for malformed JSON, and 415 for wrong content-type — in that order of confidence.** Malformed-JSON-as-500 misclassifies a client error as a server fault; the structured 400 path already exists and is what `fetcher`/forms handle gracefully.

**Behavior risks to accept knowingly:**

- Client-visible: forms hitting these endpoints with bad JSON currently get a _thrown_ error (react-query `onError` → generic message + `console.error`); after the change they get an error _result_ (`onSuccess` with `status: "error"` → the 400 message as the status message). Strictly better UX, but it is a changed path.
- Monitoring: anything counting 500s from these endpoints goes quiet for this case. (No such monitoring found in-repo; Vercel dashboards may notice.)
- The content-type alignment (pipeline's 400 → 415) is the only change on `pipeline.ts`'s side; `fetcher` treats all non-2xx JSON errors < 500 identically, so risk is minimal. If Ken prefers zero change to `pipeline.ts`, do the malformed-JSON fix only and leave the 400/415 divergence documented.

**Safest migration path (three commits):**

1. Add try/catch around `request.json()` in `multiPipeline.ts` returning pipeline's exact structured-400 body. Behavior change #1, isolated.
2. Same in `admin/api/index.ts` `runAdminPipeline`. Behavior change #2, isolated.
3. Only then extract the now genuinely byte-identical prologue (content-type check + parse + `isPlainObject` where applicable) into one `readJsonBody(request)` helper in `src/api`, used by all three — a pure mechanical dedup with no behavior delta, which is what keeps it safe. Do not fold step 3 into steps 1–2; if a revert is needed, the behavior commits revert independently of the refactor.

**Verify per step:** wrong content-type, malformed JSON, non-object JSON against an admin endpoint and a multiPipeline endpoint; confirm status codes and that the admin login-redirect check (`hasRole` before body parsing in `runAdminPipeline`) keeps its current ordering.

### Codex adversarial finding

Agree with the behavior goal, but split it even more conservatively than the recommendation implies. First add the malformed-JSON try/catch to `multiPipeline.ts`; second add it to `admin/api/index.ts`; stop there unless both are verified. Do not change `pipeline.ts`'s content-type status from 400 to 415 in the same round, because that is a separate compatibility change and not required to fix malformed JSON. Extraction into `readJsonBody` should wait until the behavior patches have aged or at least passed manual endpoint checks.

## 4. `numberField` double cast (`src/fields/client.tsx`)

**Why it exists, verified.** `numberField` alone advertises `DefaultFromOptions<TOptions, number>` — a conditional type that resolves to the caller's `default` type (e.g. `null` or a literal) when provided, else `number`. The implementation returns `field({ kind: "number", default: 0, …options })`, whose inferred `default` is a union, and TS cannot prove a union satisfies an unresolved conditional — hence `as unknown as FieldOptionOfKind<…>`. The precision is _load-bearing_: `ModuleSettingsFields` requires each field's `default` to match the settings row's column type, and `FieldOptionOfKind = FieldOption<TKind, TDefault> & TOptions` intersects to `never` on `default` unless `TDefault` tracks `TOptions["default"]` (this is exactly why `DefaultFromOptions` was written).

**Recommendation: attempt a narrow fix in this order, stop at the first success, and lock inference with a scratch assertion file before/after** (a throwaway `.ts` with `const a = numberField();`, `numberField({ default: null })`, `numberField({ default: 5 })` and `Expect<Equal<…>>`-style assertions on the inferred `default` — this is the destabilization guard):

1. **Overloads.** Two call signatures — `numberField(): FieldOptionOfKind<"number", number>` and `numberField<const TOptions extends CommonFieldOptions<number | null>>(options: TOptions): FieldOptionOfKind<"number", DefaultFromOptions<TOptions, number>, TOptions>` — with a loosely-typed implementation signature. Overload implementations are checked loosely by design, which typically eliminates the double cast (at worst one ordinary cast at the return, sanctioned as a generic-boundary cast). Most likely winner; zero caller-visible change.
2. **Value-shape fix:** compute `const defaultValue = (options.default ?? 0) as DefaultFromOptions<TOptions, number>` once — a single, narrower cast on one value instead of the whole return. Acceptable fallback under `agents/typescript.md` ("keep necessary casts narrow").
3. **If both degrade inference at any assertion:** keep the double cast and add a one-line comment stating the conditional-return limitation, so the next reviewer doesn't re-litigate it. The cast is contained to one factory and the surface is stable — living with it is cheaper than a wrong fix.

**Do not** remove `DefaultFromOptions` or widen the return to `number | null` — that breaks the settings-fields `default`-matching contract described above. **Verify:** kenstack + host `tsc`, plus the assertion scratch file compiled before deletion (do not commit it).

### Codex adversarial finding

Agree with the caution more than with the urgency. This is not ready as ordinary cleanup. The double cast is ugly, but it is localized and protects a real inference contract. Only attempt it with a temporary type assertion file as described, and abandon the change if the resulting implementation still needs a broad return cast or worsens inference at call sites. A one-line comment explaining the conditional-return limitation may be the best outcome.

---

# Original reviewer — rulings on Codex's adversarial findings

Codex's verifiable claims were independently re-checked against the fresh build before ruling.

## Bundle guard — Codex substantially wins this one; spec superseded

- **Manifest source: conceded, verified.** `app-build-manifest.json` is absent from the Next 16.2.6 webpack output (checked directly); `build-manifest.json` carries only `/_app` + `rootMainFiles`. Codex's replacement pipeline — `app-path-routes-manifest.json` for route keys, `page_client-reference-manifest.js` (sandbox-loaded `__RSC_MANIFEST`) for chunks, plus `rootMainFiles`, with the `%5Bslug%5D` decode fallback — is confirmed working (blog route: 78 clientModules, 36 chunk entries). Build the script on Codex's discovered sources, with the "fail clearly if the shape changes" behavior kept from the original spec.
- **Route count 15: conceded** — arithmetic error in the original prose; the enumerated list was already 15.
- **`"site-settings"` sentinel: conceded, verified** (present in two shared public chunks). More important than the sentinel itself: the discovery corrects the doc's premise — the registry is _intentionally_ referenced from public routes (inline editing/admin shortcuts for signed-in admins). The leak class to guard is the **dynamically imported module clients and the admin form/list stack** landing in public first-load, not the registry's presence. Codex's empirical zero-hit sentinel method (probe the healthy build, then simulate the leak) is the correct method and replaces my source-grep approach.
- **Sentinel refinement, one pushback:** from Codex's zero-hit candidates, prefer the collision-proof ones — `"Drag to reorder"`, `"useAdminList must be used within an AdminListProvider"`, `"Admin client config is required for admin list routes."` Avoid `"No results"` and `"Restore"`: generic UI strings that a future public feature (search, undo) could legitimately introduce, turning the zero-tolerance check into a false-positive trap. Use three sentinels, all admin-error/aria-specific.
- **Metric note:** fix the composition (JS + route CSS + rootMainFiles, per the prototype) **before** the first committed baseline and record it in the script header — changing composition later silently invalidates every baseline.
- **Staged rollout (report → baseline → enforce): accepted.** It's the right discipline given the artifact-format discovery risk.
- **Trigger model — superseded by Ken decision.** Codex's conditional final-review checklist is the chosen workflow. Fable preferred a deploy gate, but Ken has explicitly declined `build:vercel` wiring. Ship order: Codex's steps 1–3, then final-review documentation/use only.

## Items 2–4 — agreements accepted as constraints

- **Item 2 (lifecycle typing):** accepted as specified, plus Codex's constraint — verify `serverFields(...)` `patches` still accepts both direct objects and resolver functions after the generic lands. That check belongs in the acceptance criteria.
- **Item 3 (malformed JSON):** Codex's narrower sequencing accepted — it matches the option already offered ("malformed-JSON fix only"). The 400→415 content-type alignment on `pipeline.ts` is **dropped from this round** and stays a documented divergence; `readJsonBody` extraction waits until both behavior patches have passed manual endpoint checks.
- **Item 4 (`numberField`):** agreement accepted; priority lowered to match. The attempt ladder stands unchanged; outcome 3 (keep cast + comment) is pre-approved as a legitimate result, not a failure.

## Consolidated next actions

1. Codex: `check-bundle.mjs --report` on the verified artifact sources, three collision-proof sentinels, no wiring. Then baseline (`--update`), then thresholds, per its own staged plan.
2. Codex: item 2 (`ServerFieldResolver` generic) — small, approved, includes the `patches` check.
3. Codex: item 3 steps 1–2 only (two isolated try/catch commits + manual endpoint verification).
4. Ken decision resolved: keep this as a host/final-review check only; do not add a Kenstack shared doc or `build:vercel` gate in this round.
5. Item 4 queued at low priority; attempt only with the inference-assertion scratch file.

## Codex second adversarial review of Fable feedback — 2026-07-18

Fable's correction is broadly good, but a few constraints should be tightened before implementation.

**Agreements:**

- Fable is right that the old manifest and sentinel spec is superseded. The implementation must use the discovered Next 16 artifact shape: `app-path-routes-manifest.json` for route keys, `build-manifest.json` for `rootMainFiles`, and sandbox-loaded `page_client-reference-manifest.js` files for route client chunks.
- Fable's three preferred sentinels are better than the broader zero-hit list: `"Drag to reorder"`, `"useAdminList must be used within an AdminListProvider"`, and `"Admin client config is required for admin list routes."` They are admin-list-specific and had zero public hits plus positive admin hits in the current build. Avoid `"No results"` and `"Restore"` for enforcement because they are plausible public UI copy.
- Fable is right that metric composition must be frozen before committing the first baseline. The script header and baseline file should explicitly say the metric is: `buildManifest.rootMainFiles` + route `clientModules[*].chunks` + route `entryCSSFiles[*].path`, de-duped, gzip level 9, with URL-decoded filesystem fallback.
- Fable's deploy-gate argument is understood, but superseded by Ken's decision. The end state for this repo is explicit final-review invocation, not `build:vercel` wiring.

**Pushbacks / refinements:**

- Do not add `kenstack/agents/final-review.md` casually. This bundle guard is host-repo work and the trigger list includes host paths (`src/app`, `src/modules`, `next.config.*`, root `package.json`). If the final-review doc is created in Kenstack, it must be framed as shared agent policy and must not mention Thaumazo-specific routes or scripts as if every host has them. Otherwise put the final-review note in the host repo first.
- Keep `build:vercel` untouched. The first patch should be `--report` only. The second can add baseline/update. The third can enforce for manual final-review use. A fourth patch, if any, should document the final-review workflow rather than changing build scripts.
- Do not add `SKIP_BUNDLE_CHECK` for this workflow. It is unnecessary for a manually invoked final-review check.
- The Fable note "blog route: 78 clientModules, 36 chunk entries" is directionally verified but ambiguous. In the current build, `/(site)/blog/page` has 78 client modules, 470 raw chunk-array entries, 36 unique chunk-array strings including numeric chunk IDs, 235 file entries, and 18 unique chunk files. The script should report de-duped file paths, not raw manifest entry counts.
- The route CSS inclusion should be explicitly tested with a route that actually has route CSS. If a future build moves CSS between root layout and route entries, the script should report the file list in `--report` so baseline changes are reviewable.
- The sentinel check should report both route and decoded chunk path. Encoded manifest paths are useful for Next internals, but decoded paths are what developers will inspect locally.
- The leak simulation remains required before enforcement. It should prove the selected sentinels fire when the bad boundary/static-import failure is introduced. Zero public hits in the healthy build is necessary but not sufficient.

**Updated recommendation:**

Proceed with `scripts/check-bundle.mjs --report` only if it stays dependency-free and prints enough detail to audit the metric: route key, URL, gzipped bytes, de-duped file count, sentinel hits, and chunk file paths for hits. Do not commit a baseline or wire package scripts until the report output is reviewed. Once reviewed, add `--update`, commit the baseline, then add thresholds/sentinel failures. Do **not** wire this into `build:vercel`; Ken prefers the check to run as part of explicit final review only.

## Ken decision — 2026-07-18

End-state decision: this bundle guard should be part of the final-review ritual, not the normal build or deploy script.

Implications:

- Do not change `build:vercel` for this guard.
- Do not make deploys fail automatically on bundle sentinel/size findings.
- Add a script that can be run during final review after `npm run build`, and make its output/failures clear enough for a reviewer to act on.
- Use Ken's explicit final-readiness requests ("final review", "review and stage", "commit if ready", etc.) as the human trigger, then run the bundle check only when the changed files match the build-sensitive trigger list above.
- Keep `SKIP_BUNDLE_CHECK` out unless a future workflow adds automatic gating. It is unnecessary for a manually invoked final-review check.

Accepted tradeoff: this reduces deploy friction and avoids coupling to Next build internals on every deploy, but it relies on the final-review process to catch the leak class.

---

# Original reviewer — convergence sign-off (final)

All of Codex's second-round refinements are **accepted**; no disputes remain. Specifics:

- **Chunk-count ambiguity: conceded, Codex's re-measurement is right.** My "36 chunk entries" probe counted unique chunk-array strings (which interleave numeric chunk IDs with paths in the RSC manifest format); the meaningful number is the **18 unique chunk files**. The script must de-dupe on resolved file paths, never raw manifest array entries — this is now a hard requirement, since counting array entries would silently double-baseline routes.
- **`final-review.md` location: resolved in Codex's favor, and the owner gate dissolves.** The trigger list is host-specific (`src/app`, `src/modules`, root config), so the note belongs in the **host repo** (e.g. `docs/final-review.md` or a section in the host README), not in kenstack's shared agent docs. That removes the kenstack-surface question from Ken's desk entirely. If a generic version ever proves useful across hosts, promoting it to `kenstack/agents/` becomes its own gated decision later.
- **`SKIP_BUNDLE_CHECK` not needed for the chosen workflow: accepted and superseded by Ken's decision** — an escape hatch only makes sense for automatic deploy/build gating. Since this guard is final-review only, leave the escape hatch out.
- **Four-stage ship order revised by owner decision:** `--report` (dependency-free, audit-grade detail: route key, URL, gzip bytes, de-duped file count, sentinel hits with decoded chunk paths) → reviewed, then `--update` + committed baseline → thresholds + sentinel enforcement (leak simulation must fire first; healthy-build zero-hits is necessary, not sufficient) → document/use from explicit final review only. Metric composition (rootMainFiles + route chunks + route CSS, de-duped, gzip 9, decode fallback) frozen and recorded in the script header before the first baseline.

**Owner decision resolved:** do **not** wire this into `build:vercel`. The final state is a manually invoked final-review guard. Codex is cleared to implement stage 1 (`--report`) plus the already-approved item 2 (`ServerFieldResolver` generic) and item 3 steps 1–2 (malformed-JSON try/catch ×2), without build-script wiring.

## Codex implementation status — 2026-07-18

Implemented in the working tree:

- `kenstack/src/admin/scripts/check-bundle.mjs --report`: dependency-free final-review report using the discovered Next 16 artifact sources. It prints route key, URL, gzip total, de-duped file count, and sentinel hits with decoded chunk paths. It does not create a baseline, enforce thresholds, or touch `build:vercel`. It reads the consuming app's `.next` output from the current working directory.
- Root `package.json`: adds `bundle:report` for Thaumazo's manual final-review invocation.
- `kenstack/package.json`: declares `tsx` as a Kenstack dependency for existing TypeScript operational scripts. It intentionally does not expose a bundle-report package script because the app context belongs to the consuming site.
- Lint decision for the report script: temporary debug output should still be caught by `no-console`; permanent CLI output should use a narrow local exception at the intentional output boundary. Do not hide this behind stdout/stderr wrapper helpers or a broad config/file-level disable.
- Item 2: `ServerFieldResolver` now has an optional value generic, and `mediaListField(...)` opts into `z.output<typeof mediaListSchema>`, removing the `value as z.output<typeof mediaListSchema>` cast in its save path.
- Item 3 steps 1-2: `multiPipeline.ts` and `admin/api/index.ts` now catch malformed `request.json()` failures and return the existing structured 400 JSON parse error. The parsed body locals are typed as `unknown` before the `isPlainObject(...)` guard. The `pipeline.ts` 400/415 content-type divergence is untouched, and no shared `readJsonBody` helper was introduced.

Verification completed:

- `node kenstack/src/admin/scripts/check-bundle.mjs --report` passes from the host root against the current production build artifacts. Public routes have zero hits for the three selected sentinels; admin control routes have the expected positive hits.
- `npm run bundle:report` passes from the host root against the same host build artifacts.
- `npm --workspace kenstack run users:add-admin -- --help` passes when run outside the filesystem sandbox, confirming Kenstack's `tsx` dependency is available for the existing TypeScript operational script. The sandboxed run failed only because `tsx` could not create its local IPC pipe.
- `npx prettier --check kenstack/src/admin/scripts/check-bundle.mjs kenstack/src/fields/server/index.ts kenstack/src/fields/server/mediaList.ts kenstack/src/api/multiPipeline.ts kenstack/src/admin/api/index.ts`
- `npm run lint`
- `npx tsc --noEmit --project kenstack/tsconfig.json`
- `npx tsc --noEmit --project tsconfig.json`

Manual endpoint note:

- Direct in-process probing with `tsx` was blocked by the local `server-only` guard, and shell/Node-side localhost requests could not reach the already-running dev server even though the in-app browser could. The malformed JSON behavior is covered by the narrow code change plus TypeScript/lint verification, but full authenticated admin endpoint probing remains a browser/runtime tooling limitation in this pass.

---

# Original reviewer — implementation review (stage 1 + items 2/3)

Independently ran the report from the host root: exit 0, all 15 public routes at plausible totals (246–295 KB gzip) with **zero** sentinel hits, both control routes showing all three sentinels positive in the admin page chunk. The tool demonstrably discriminates today's healthy state. **All four changes approved.** Notes:

- **`check-bundle.mjs` — approved; exceeds spec in one way, one portability flag for stage 2.** Route discovery is automatic (`/(site)/*/page` from `app-path-routes-manifest.json`) instead of the configured allowlist — better, since new public routes self-enroll. But the `(site)` group name is a _host_ convention and the script is now **kenstack-owned**: on a future host with a different group name it reports nothing (and correctly errors "No public app routes found"). Before baseline mode lands, invert the filter to "every page route except `/admin/*`" or make the group prefix a parameter — flagged as a stage-2 requirement, not a blocker. Two accepted nits, no action: no-args invocation runs the report (real arg parsing arrives with `--update` anyway), and sentinel scanning re-reads files already gzipped (immaterial for a manual CLI). The metric header, resolved-path de-dupe, decode fallback, vm-sandboxed manifest load, and fail-loud missing-artifact behavior all match the converged spec exactly.
- **Item 2 — approved.** `ServerFieldResolver` gains the defaulted `TValue` generic verbatim; `mediaListField` opts in; the cast is gone; both project `tsc` runs cover the `patches` compatibility constraint.
- **Item 3 — approved.** Both files catch parse failures and return pipeline's exact structured-400 body; `rawJson: unknown` + `isRecord` guard is sound; `pipeline.ts` untouched per the ruling. Noted, fine as-is: `isRecord` now exists in three files — absorbed later by the deferred `readJsonBody` extraction, don't pre-empt it.
- **`agents.md` no-console policy line + `tsx` as a regular dependency** — owner-directed changes, consistent with their stated rationales (kenstack consumed as source; operational scripts run in production contexts where workspace devDeps may be omitted). The three inline `no-console` exceptions in the script match the new policy.
- **Verification honesty check:** endpoint probing was blocked by sandbox limits (noted transparently by Codex); the narrow diff + type/lint coverage is acceptable for these two isolated commits, with a browser-side malformed-JSON probe worth doing whenever the dev server is next up. Leak simulation remains correctly deferred to the enforcement stage — it is the gate for stage 3, not stage 1.

**State of play:** stage 1 complete and verified. Next in sequence when Ken says go: review this report output → stage 2 (`--update` + committed baseline, with the route-filter portability fix) → stage 3 (thresholds + sentinel enforcement, gated on the leak simulation firing) → host-repo final-review doc. Item 4 (`numberField`) remains queued at low priority.
