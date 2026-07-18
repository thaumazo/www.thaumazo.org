# Kenstack Simplification Review — Round 2 (full sweep)

Instructions for the implementing agent. Read `kenstack/agents.md` first and obey its Change Threshold, Directness Gate, and Preserve Existing Capabilities rules. Kenstack is a shared submodule consumed by multiple host sites: do not change public export signatures, remove exports, or alter runtime behavior. Keep each item as a separate, narrow patch; run `tsc` and lint after each. Paths are relative to `kenstack/`.

**Context:** Round 1 (overlay dedup, Sheet/overlayStack, shared upload flow, mediaUpload variants, mentions single-root, small fixes) is already implemented and sitting uncommitted in the working tree. This round covers the rest of the codebase, which has now been swept in full. Commit round 1 before starting these.

**Pre-existing worktree flag:** four modified files are unrelated to any review item — `src/admin/List/Footer.tsx`, `src/admin/pageEditor/fields.ts`, `src/modules/siteSettings/fields.ts`, `src/db/tables/media/index.ts`. Confirm these are the owner's own in-progress work and commit them separately.

---

## 1. `src/fields/server/mediaList.ts`: remove dead multi-key generality

`loadMedia` (lines ~95–151) and `saveMedia` (lines ~153–293) are module-private and each take `media: Record<string, MediaConfig>` plus (for save) `values: MediaValues`, loop over entries, and build a keyed result record. Their **only** caller is `mediaListField`, which always wraps a single config as `{ [key]: media }` and immediately unwraps `values[key] ?? []`. The record shape, the loops, and the keyed returns are unreachable generality — a textbook Directness Gate case (wrap → loop → unwrap).

**Do:** change both to take one `MediaConfig` (and for `saveMedia`, one `z.output<typeof mediaListSchema>` value) and return the array directly. Delete the `MediaValues` type if it becomes unused. No exported surface changes; the inner reconciliation logic (added/removed/moved/metadata diffing) must not change.

**Verify:** type-check; in the admin, load a record with a media-list field, then add, remove, reorder, and edit captions in one save; confirm the row set and sort orders in the join table match pre-change behavior.

### Codex adversarial review

**Verdict: agree.** This is private, unreachable generality in the current code: `mediaListField` constructs a one-key record, `loadMedia`/`saveMedia` loop over that one entry, and the caller immediately unwraps the same key. The suggested simplification is above the Directness Gate as long as the reconciliation logic and returned media-list value stay byte-for-byte equivalent in shape.

---

## 2. Delete/Restore button duplication (two files, fix each internally)

**`src/admin/List/DeleteButton.tsx`:** `DeleteButton` and `RestoreButton` contain byte-identical ~40-line `useMutation` configs (optimistic remove of selected items, rollback on error, invalidate on success) differing only in `mode: inTrash ? "permanent" : "trash"` vs `mode: "restore"` — plus a byte-identical selection-count `<Badge>` JSX blob.

**`src/admin/Edit/Header/DeleteButton.tsx`:** same story with the Edit-flavored mutation (setStatusMessage, removeQueries, `router.push(listPath)`), duplicated between its own `DeleteButton` and `RestoreButton`, differing only in `mode`.

**Do:** in each file, extract one private hook — e.g. `useRemoveMutation(mode: "trash" | "permanent" | "restore")` — holding the shared mutation config, and in the List file a private `SelectionCountBadge` component. Do **not** unify across the two files: the List version does optimistic cache surgery and the Edit version navigates away; those are different behaviors that only look similar.

**Verify:** delete, permanent-delete, and restore from both the list view and the edit header; confirm optimistic removal + rollback on a forced error in the list, and redirect-to-list from edit.

### Codex adversarial review

**Verdict: agree, within each file only.** The duplicated mutation bodies are real, and the recommendation correctly avoids unifying the list and edit versions across files. In the list file, a shared selection-count badge is also justified because the JSX is duplicated and tied to the same selected-count state. Keep the `mode` calculation local to each button so trash/permanent/restore labels and disabled states remain obvious.

---

## 3. Picker/Combobox: shared `moveHighlight`

`PickerTrigger` (`src/forms/controls/Picker.tsx`, lines ~302–327) and `ComboboxInput` (`src/forms/controls/Combobox.tsx`, lines ~269–296) each define a `moveHighlight(direction)` walking items past disabled entries with the same `dropdownSide === "top"` inversion and modulo wrap. The only difference is the starting index when nothing is highlighted: Picker starts from the selected item, Combobox from the first/last item.

**Do:** add `moveHighlight(direction: 1 | -1, initialIndex: number)` to the Picker context value (or export a helper from Picker.tsx) and have both call sites use it, passing their own starting index. Keep it in the Picker file — these two components are one subsystem (Combobox is built on Picker and re-exports its parts).

**Verify:** keyboard navigation in a Select (Picker) and a Combobox, including disabled options, wrap-around at both ends, and a dropdown flipped to `top`.

### Codex adversarial review

**Verdict: agree, with one signature nuance.** The duplicate navigation loop is real and belongs in the Picker subsystem. The suggested `initialIndex: number` parameter works, but each caller must compute it per key event: Picker uses the selected index for both directions, while Combobox uses `0` for ArrowDown and `count - 1` for ArrowUp. Do not introduce a generic helper outside Picker/Combobox.

---

## 4. JSON request prologue duplicated three times

The content-type check + `request.json()` + plain-object validation prologue appears in `src/api/pipeline.ts` (lines ~77–98), `src/api/multiPipeline.ts` (lines ~15–35), and `src/admin/api/index.ts` `runAdminPipeline` (lines ~57–78), with slightly divergent status codes (400 vs 415 for bad content type — multiPipeline and admin use 415, pipeline uses 400).

**Do:** add one helper in `src/api` (e.g. exported from `pipeline.ts` or a sibling): `readJsonBody(request)` returning `{ json } | { response: NextResponse }`. Use it in all three. Preserve each caller's current status codes exactly — parameterize the content-type status or return the code the caller passes; do not "fix" the 400/415 divergence in this patch (note it for the owner instead).

**Verify:** type-check; hit an admin API route with wrong content type, invalid JSON, and non-object JSON and confirm identical status codes and messages as before.

### Codex adversarial review

**Verdict: disagree as written; do not implement in this pass.** The duplication is real, but the recommendation is slightly stale/incorrect about current behavior. `pipeline.ts` catches JSON parse errors and returns a 400 response; `multiPipeline.ts` and `admin/api/index.ts` call `request.json()` without a catch, so malformed JSON currently throws through rather than returning the same structured response. A shared `readJsonBody` helper would either change behavior in two callers or require behavior knobs that dilute the simplification. This should wait for an explicit owner decision on whether to standardize malformed-JSON handling across all pipeline entry points.

---

## 5. `src/fields/server/image.ts`: duplicated attach/replace block

Inside `prepareImageSave`, the select-existing path (lines ~139–151) and the upload path (lines ~192–207) push an identical `afterSave` closure: set new media to `attached` (with metadata), then set `oldMediaId` to `removed`. Factor a private `attachMediaAfterSave(mediaId, oldMediaId, metadata)` returning that closure, used by both branches. Small win (~15 lines) but this is careful auth-adjacent media state logic, so the patch must be mechanical — no behavior reordering.

**Verify:** replace an image with a library image and with a fresh upload; confirm old media rows flip to `removed` and new ones to `attached`.

### Codex adversarial review

**Verdict: agree, but keep it mechanical.** The duplicated `afterSave` closure is real and private. A tiny helper returning the same callback improves directness only if it preserves the exact ordering: attach/update the new media row first, then mark the old media row removed when present. Do not alter the selected-image metadata-only path where the media ID is unchanged.

---

## Explicitly reviewed and left alone (full-sweep additions)

Round 1's leave-alone list stands (`lib/*`, `hooks/*`, pipeline internals, `querySchema.ts`, `admin/module.ts`, Picker positioning, field factories). Newly reviewed this round and also left alone:

- `src/components/Sidebar.tsx` — vendored shadcn/ui sidebar; stock third-party code, don't customize. (Worth knowing: it already imports `@radix-ui/react-slot`, so if the deferred round-1 "slot helper" slice for Dialog/Sheet/Popover triggers is ever picked up, `Slot` is available without a new dependency.)
- `src/admin/table.ts` — type-heavy `defineTable` generics are a real typed public boundary; the plumbing earns its keep.
- `src/fields/records/saveRecord.ts`, `src/list/server.ts`, `src/admin/queries/list.ts` — dense core workflow; every step traced to real behavior (revisions, audit, revalidation, cached default-query path).
- `src/admin/List/List.tsx` — drag-reorder + optimistic swap logic is coherent; no above-threshold cuts.
- `src/forms/Field.tsx`, `Form.tsx`, `context.tsx`, and the per-kind field wrappers (`InputField`, `PhoneField`, etc.) — thin, purposeful layers.
- `src/api/fetcher.ts`, `src/forms/MarkdownEditor/Toolbar.tsx`, `src/lib/attachments.ts`, `src/modules/users/scripts/create-admin-user.ts` — fine as-is.
- `src/auth/**` — forgotPassword/resetPassword handlers have minor structural repetition (rate-limit counters, timing-normalized responses), but `agents.md` forbids changing auth logic unasked, and the repetition is timing/security-sensitive. Do not touch without explicit owner sign-off.
- `src/fields/server/index.ts` `getDefaultServerField` — an if-chain that could be a lookup map, but it's clear and typed; below threshold.

## Suggested order

1 → 2 → 3 → 5 → 4. Items 1–3 and 5 are internal-only with no cross-file API impact. Item 4 touches the API layer's request handling, so do it last with the status-code verification. None of these require browser-wide regression passes beyond the per-item checks listed.

## Implementation progress

- **2026-07-18:** Codex adversarial review added for all Round 2 items. Agreed with items 1, 2, 3, and 5. Disagreed with item 4 as written because `multiPipeline.ts` and `admin/api/index.ts` do not currently catch malformed JSON parse failures, so a shared `readJsonBody(...)` helper would either change behavior or need awkward caller-specific knobs. Implemented item 1 in `src/fields/server/mediaList.ts`: `loadMedia` and `saveMedia` now take one `MediaConfig` and return the media-list array directly, removing the private one-key record wrapper/unwrap path. `npx tsc --noEmit --project tsconfig.json` passes in `kenstack/`.
- **2026-07-18:** Implemented item 2 inside the two owning files only. `src/admin/List/DeleteButton.tsx` now has one private `useRemoveMutation(...)` for list optimistic removal/rollback and one `SelectionCountBadge`; `src/admin/Edit/Header/DeleteButton.tsx` now has one private `useRemoveMutation(...)` for edit remove/restore, status messages, cache cleanup, invalidation, and redirect. No cross-file abstraction was introduced. `npx tsc --noEmit --project tsconfig.json` and `npm run lint -- src/admin/List/DeleteButton.tsx src/admin/Edit/Header/DeleteButton.tsx src/fields/server/mediaList.ts` pass in `kenstack/`.
- **2026-07-18:** Implemented item 3 in the Picker subsystem. `PickerContext` now exposes `moveHighlight(direction, initialIndex)` with the shared disabled-item skipping, dropdown-side inversion, and wraparound behavior. `PickerTrigger` passes the selected index for both arrows; `ComboboxInput` passes `0` for ArrowDown and `items.length - 1` for ArrowUp to preserve its old first/last starting behavior. `npx tsc --noEmit --project tsconfig.json` and `npm run lint -- src/forms/controls/Picker.tsx src/forms/controls/Combobox.tsx` pass in `kenstack/`.
- **2026-07-18:** Implemented item 5 in `src/fields/server/image.ts` with a private `attachMediaAfterSave(...)` helper used by the selected-image replacement path and fresh-upload path. The unchanged-image metadata-only path remains separate. The helper preserves the original attach/update-new-media-first, remove-old-media-second ordering. `npx tsc --noEmit --project tsconfig.json` and `npm run lint -- src/fields/server/image.ts` pass in `kenstack/`; Prettier was run on touched Round 2 files only.
- **2026-07-18:** Final automated checks for the agreed Round 2 implementation pass in `kenstack/`: `npx tsc --noEmit --project tsconfig.json`, `npm run lint`, touched-file `npx prettier --check`, and `git diff --check`. Item 4 remains intentionally unimplemented pending an owner decision on whether malformed JSON should be standardized across pipeline entry points.
- **2026-07-18:** Follow-up TypeScript compatibility fix for non-strict host projects: `defineTable` and `defineFields` boolean generic defaults now use `false` instead of `undefined`. With `strictNullChecks` off, `undefined` can satisfy `[TFlag] extends [true]`, which made omitted `publicId`/`seo` flags appear enabled in the host app. Re-ran `npx tsc --noEmit --project tsconfig.json` in `kenstack/` and root `npx tsc --noEmit --project tsconfig.json --incremental false`; both pass.
- **2026-07-18 (original reviewer, final sign-off):** All four diffs verified line-by-line against the acceptance criteria. Items 1, 2, 3, 5 approved. Item 4 pushback conceded: verified in code that `pipeline.ts` catches JSON parse errors (structured 400) while `multiPipeline.ts` and `admin/api/index.ts` let malformed JSON throw through — my original write-up wrongly assumed status codes were the only divergence. Two commit-message notes: (a) List `useRemoveMutation` now filters the optimistic cache by the mutation `variables` instead of the closed-over `selected` — same values at every call site, strictly safer against stale closures; (b) Edit Delete's no-op `onMutate` was dropped — behavior-neutral. One optional nit, no action required: in `saveMedia` the upload loop's `const [media]` row shadows the new `media: MediaConfig` parameter (shadowing pre-existed; renaming the row to `mediaRow` would read better). **Owner decision queued for item 4:** whether malformed JSON at `multiPipeline`/admin endpoints should return `pipeline.ts`-style structured 400s instead of throwing to a generic 500; the byte-identical prologue shared by just those two files could then be extracted behavior-preservingly. Round 2 is complete and ready to commit as separate patches.
