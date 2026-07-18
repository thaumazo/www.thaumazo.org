# Kenstack Simplification Review

Instructions for the implementing agent. Read `kenstack/agents.md` first and obey its Change Threshold, Directness Gate, and Preserve Existing Capabilities rules. Kenstack is a shared submodule: do not change any public export signature, remove any export, or alter runtime behavior. Every item below is an internal refactor. Keep each item as a separate, narrow patch. Run `tsc` and lint after each. All paths are relative to `kenstack/`.

---

## 1. Deduplicate the overlay primitives (highest value)

**Files:** `src/components/Dialog.tsx`, `src/components/Sheet.tsx`, `src/components/Popover.tsx`

These three hand-rolled `<dialog>`-based primitives duplicate the same machinery nearly verbatim (~250–300 redundant lines total):

- **Controlled/uncontrolled open state** — identical `openProp ?? uncontrolledOpen` + `setOpen` callback block in all three (Dialog 57–68, Sheet 53–64, Popover 51–62).
- **`asChild` trigger/close cloning** — `Children.only` + `isValidElement` + `cloneElement` + disabled/aria-disabled guard, repeated four times (DialogTrigger, DialogClose, SheetTrigger, SheetClose) and a fifth near-copy in PopoverTrigger.
- **Open/close transition effect** — the `closeTimerRef` / `animationFrameRef` / `visibleOpen` state machine (`setVisibleOpen(false)` → delayed `dialog.close()`; `showModal()` → rAF → `setVisibleOpen(true)`) plus the cleanup effect is byte-for-byte identical in Dialog 231–292, Sheet 216–273, Popover 171–225 (Popover adds positioning calls inside it).

**Do:** extract three internal helpers (suggested: `src/components/lib/overlay.tsx`, not exported from any public barrel):

1. `useControllableOpen({ open, defaultOpen, onOpenChange })` → `[open, setOpen]`.
2. `useDialogTransition(dialogRef, open, durationMs)` → `visibleOpen`, owning the timer/rAF lifecycle and cleanup. Accept an optional `onShow(dialog)` callback so Popover can run `positionDialog` at the same points it does today.
3. A shared slot-button helper for the trigger/close `asChild` pattern, parameterized by `data-slot` value, shared aria props, and the click guard.

Public component APIs, exported names, class strings, and `data-slot`/`data-state` attributes must be unchanged. Do NOT merge the three components into one primitive, and do not remove the native-`<dialog>` approach — the header comments in Dialog/Popover explicitly require it.

**Verify:** type-check; then manually exercise a Dialog, a Sheet (each `side`), and a Popover in the admin UI — open/close animation, Escape, backdrop click, nested overlay ordering.

### Codex adversarial review

**Verdict: qualified yes, but not as the first change and not as one broad extraction.** The duplicated controlled-state and `<dialog>` transition code is real, but this item currently bundles together three different risk levels. `useControllableOpen` is low-risk. A shared trigger/close slot helper is plausible, but it needs to preserve the subtle differences between trigger and close behavior, especially Popover's toggle semantics and the disabled/`aria-disabled` guard. `useDialogTransition` is the riskiest part because Dialog and Popover are portal/mounted components, Sheet is not, and Popover's transition is coupled to positioning and autofocus.

Do this only after item 2. Start with `useControllableOpen`, then reassess whether the slot helper and transition hook still clear the Change Threshold. A bad version of this change would move complexity into a generic overlay helper while making native `<dialog>` lifecycle bugs harder to see.

---

## 2. Sheet: replace hand-rolled Escape handling with `useOverlayStack`

**File:** `src/components/Sheet.tsx` (effect at lines 275–300)

Dialog and Popover route Escape through `useOverlayStack` (`src/components/overlayStack.ts`), which maintains a stack so only the top overlay closes. Sheet instead attaches its own `document` keydown listener that closes regardless of stack position, and its backdrop `onClick` doesn't check `isTopOverlay()`. The Dialog header comment states: "Nested Escape handling belongs in useOverlayStack, not in ad hoc overlay rewrites."

**Do:** use `useOverlayStack({ onClose: ..., open })` in `SheetContent` like Dialog does, and delete the manual keydown effect. Preserve Sheet's cancel-event semantics: Sheet currently dispatches a cancelable `cancel` event on the dialog before closing (so `onCancel` handlers can prevent close) — keep that behavior by dispatching it inside the `onClose` passed to the stack. Gate the backdrop-click close on `isTopOverlay()` for consistency with Dialog.

**Verify:** Escape inside a Popover nested in a Sheet closes only the Popover; Escape again closes the Sheet; a consumer `onCancel` that calls `preventDefault` still blocks closing.

### Codex adversarial review

**Verdict: agree.** This is a correctness fix, not just simplification. Sheet has a parallel Escape path that ignores the overlay stack, while Dialog and Popover already use the shared stack. Preserving the current cancelable `cancel` event is the key requirement: the `onClose` passed to `useOverlayStack` should dispatch the same cancelable event and close only when it is not prevented. The backdrop `onClick` should also check `isTopOverlay()` so nested overlays do not leak clicks to the Sheet.

---

## 3. Extract the shared client upload flow

**Files:** `src/forms/ImageField/index.tsx` (~lines 106–224), `src/forms/MediaListField/index.tsx` (~lines 166–260)

Both fields duplicate the identical three-step upload protocol (~90 lines each): presign request via `fetcher(apiPath, { action: presignedUrlAction, filename, type, fieldname, size, ...extraData })` → S3 `PUT` with Content-Type/Content-Length headers → completion request via `uploadCompleteAction`, including the same response typings and `getUploadErrorMessage` handling.

**Do:** add `src/forms/lib/uploadMedia.ts` exporting one function, e.g.:

```ts
uploadMedia({ apiPath, fieldname, file, extraData, presignedUrlAction, uploadCompleteAction })
  → Promise<{ status: "success"; complete: UploadCompleteResult } | { status: "error"; message: string; stage: "presign" | "s3" | "complete" }>
```

It performs the three network steps and returns a discriminated result. All UI-state behavior stays in each field: ImageField keeps its FileReader preview, `form.setError` vs `setStatusMessage` split, `startUploading`/`finishUploading`, and `reset()`; MediaListField keeps `updateLocalImage` state transitions. Do not unify the two fields' differing error-display behavior — only the wire protocol. Type the completion payload once (union covering both fields' current response types, `width`/`height` etc. as `number | null | undefined`).

**Verify:** upload success, presign rejection (oversize file), and completion rejection in both fields; confirm field `onChange` payload shapes are byte-identical to today.

### Codex adversarial review

**Verdict: agree with a narrow extraction.** The shared presign -> S3 PUT -> completion protocol is real duplication. The UI behavior is not duplicated and must remain local: ImageField owns FileReader preview, `form.setError` vs status-message behavior, and reset semantics; MediaListField owns placeholder records, local upload states, object URL cleanup, and multi-file failure aggregation.

The helper should return protocol-stage results and the complete payload, not call form APIs or mutate field state. Be careful with S3 failures: ImageField currently logs response text and shows an image-specific generic message, while MediaListField handles fetch exceptions separately. The extraction is good only if each caller can preserve those exact user-facing outcomes.

---

## 4. `mediaUpload.ts`: factor duplicated webp-variant processing

**File:** `src/fields/records/mediaUpload.ts` (`completeMediaUpload`, lines ~322–401)

The `original` and `square` webp variants are produced by two nearly identical blocks (sharp pipeline → upload → metadata → dimension checks → variant object). The three "Could not determine ... dimensions" checks and the two URL constructions are part of the duplication.

**Do:** add a local helper:

```ts
async function createWebpVariant(source: Buffer, key: string, resize: sharp.ResizeOptions, webpOptions)
  → { key, url, type: "image/webp", size, width, height }
```

that renders, uploads (reuse `uploadWebpVariant`), reads metadata, and throws/returns an error if dimensions are missing. Call it twice; spread `square: true` onto the square variant. Keep the DB `variants` JSON shape exactly as-is.

**Also, same file, two micro-simplifications:**
- Replace `streamToBuffer` with `buffer` from `node:stream/consumers` and delete the local helper.
- In the `kind === "file"` branch (lines ~218–231), the `ContentLength` oversize case is already handled and the stream destroyed before the branch; simplify to: if `ContentLength` is a number, `originalStream.destroy()` and use it as `sourceSize`; else buffer the stream. Remove the second `typeof ContentLength === "number"` re-check and the now-unreachable second oversize check for the known-length path (keep the oversize check for the buffered path).

**Verify:** upload a raster image, an SVG, and a plain file through the admin; confirm variants JSON and returned payloads are unchanged.

### Codex adversarial review

**Verdict: agree, with structured-error preservation.** The variant processing duplication is meaningful and local. The helper should preserve parallelism by allowing both variants to be created/uploaded concurrently, and it should not convert today's structured `mediaUploadError(...)` paths into uncaught exceptions. In particular, missing source/original/square dimensions currently become upload error responses; keep that failure mode.

The `node:stream/consumers` replacement is a good standard-library simplification. The file-branch cleanup also looks valid because known oversize `ContentLength` is already handled before the branch; keep the buffered-path oversize check for unknown-length objects.

---

## 5. `mentions.ts`: render the popover with one React root

**File:** `src/forms/MarkdownField/mentions.ts` (`MentionPluginView`, lines ~183–608 plus helpers ~739–773)

The suggestion popover is built with manual `document.createElement`, ~40 lines of inline `style.*` assignments, and a **separate React root per avatar** (`createRoot` per option, tracked in `this.roots`, unmounted on every re-render). This mixes two rendering models and re-creates all roots on each keystroke.

**Do:** create **one** React root on `this.element` in the constructor; implement `render()` as a single `root.render(<MentionMenu {...state} />)` call where `MentionMenu` is a small component (in a sibling `.tsx` file) receiving `{ status, options, selectedIndex, trigger, onSelect, onHighlight }`. Delete `createAvatarElement`, `createLabelElement`, `createStatusElement`, `updateOptionStyles`, and the `roots`/`optionButtons` bookkeeping; replace inline style strings with Tailwind classes (the element is portaled to `document.body`, same as existing overlay content — theme CSS variables are available). Keep everything else untouched: the ProseMirror plugin lifecycle, `findMentionMatch`, fetch/debounce/cache logic, keyboard handling (it can now set state and re-render instead of mutating button styles), and positioning.

Estimated ~150 lines removed and one rendering model instead of two.

**Verify:** in a markdown field — type `@`, arrow-key selection, Enter/click insert, hover highlight, loading/error/empty states, popover repositioning on scroll, no console warnings about unmounted roots.

### Codex adversarial review

**Verdict: agree, but high-risk and last.** The current code really does mix imperative DOM rendering with one React root per avatar, and replacing that with a single root is a cleaner model. This is still a ProseMirror/Milkdown plugin boundary, so it should be treated as behavior-sensitive editor work rather than a cosmetic rewrite.

Preserve the parent `mousedown` prevention, the existing debounce/cache/abort behavior, keyboard handling, scroll/resize repositioning, and root cleanup on `destroy()`. Selection changes currently mutate button styles synchronously; the React version must still make arrow-key and hover highlight feel immediate. This should not be attempted until the smaller items are done and editor verification time is available.

---

## 6. Small, self-contained fixes

Each is a one-file change; keep them as tiny individual commits.

1. **`src/components/Popover.tsx` `getTriggerElement` (lines 413–423):** loops over every `[aria-controls]` element in the document on each reposition (including scroll events). Replace with:
   ```ts
   document.querySelector<HTMLElement>(`[aria-controls="${CSS.escape(contentId)}"]`)
   ```

   **Codex adversarial review:** Agree. This is a true local performance/readability fix with equivalent behavior, provided `CSS.escape` is available in the supported browsers for this client-only code path.

2. **`src/list/FilterControl.tsx` `getInitialValue` (lines 525–535):** its only caller (`addFilter`) early-returns unless `kind === "boolean"`, so the date-range/enum/text branches are dead. Inline `true` at the call site and delete the function.

   **Codex adversarial review:** Agree. The current caller proves the non-boolean branches are dead. This is a tiny directness win.

3. **`src/list/FilterControl.tsx` `isActiveFilterValue` (lines 504–523):** byte-identical to `hasFilterValue` in `src/list/querySchema.ts` (lines 308–327). Export `hasFilterValue` from `querySchema.ts` and import it in `FilterControl.tsx`, deleting the copy. Caveat: FilterControl currently imports only types from `querySchema`; confirm a runtime import is already present in the client bundle via `useQueryStore` before proceeding (it is expected to be — `listQuerySearchParams` is client-consumed). If not, leave the duplicate and note why.

   **Codex adversarial review:** Do not do this exactly as written without checking the bundle impact. The duplication is real, but `querySchema.ts` imports Zod and admin list metadata helpers, so making `FilterControl.tsx` take a direct runtime import from it could enlarge or couple a focused client component. There is existing client consumption of `querySchema.ts` through `useQueryStore` and admin list context, but that does not prove this import is free in every consumer graph. Prefer either leaving the duplicate or moving `hasFilterValue` into a tiny client-safe shared helper that both `querySchema.ts` and `FilterControl.tsx` import. Directly exporting it from `querySchema.ts` is only acceptable after bundle verification.

4. **`src/fields/client.tsx` `radioButtonField`/`selectField` (lines 272–321):** both duplicate the derived-enum construction `z.enum(Array.from(new Set([defaultValue, ...options.map(v => v.value)])))`. Extract a two-line local helper `enumFromOptions(defaultValue, options)` used by both.

   **Codex adversarial review:** Mild agree. This is small, local duplication with two callers in the same file. Keep the helper private, do not generalize it beyond `FieldInputOption[]`, and confirm TypeScript preserves the current inferred field option behavior. If the helper requires casts or awkward generic plumbing, the duplication is better left alone.

---

## Explicitly reviewed and left alone (do not "improve" these)

- `src/lib/*` utilities, `src/hooks/*` — already minimal.
- `src/api/pipeline.ts` / `multiPipeline.ts` — dense but direct; the `fieldsKey` split-parse is real behavior.
- `src/list/querySchema.ts` — schema-per-call construction is cheap and keeps defaults local.
- `src/admin/module.ts` — the repeated createdAt/updatedAt/deletedAt merge blocks in `defineSort`/`defineFilters` look duplicated but differ in shape (sort entries vs date-range filters); factoring them saves little and obscures the config. Below the change threshold.
- `src/forms/controls/Picker.tsx` — hand-rolled but coherent; its positioning logic differs materially from Popover's (dialog-portal-aware, flip side, height clamping), so a shared positioning utility would be a rewrite, not a simplification. Revisit only if a fourth positioning implementation appears.
- The per-kind field factories in `src/fields/client.tsx` — repetitive but each carries distinct types/defaults; a table-driven rewrite would trade type inference for brevity.

## Suggested order

Original suggested order: Items 6.1–6.4 (trivial, warm-up) → 3 → 4 → 2 → 1 → 5. Items 1 and 5 are the largest; do them last, each as its own patch with manual UI verification.

### Codex overall recommendation

Do not implement the original list straight through. The best implementation sequence is:

1. Item 2, because it fixes a real nested-overlay bug.
2. Items 6.1 and 6.2, because they are tiny and clearly above the Change Threshold.
3. Item 3, but only as a protocol helper with UI state kept in each field.
4. Item 4, preserving structured upload errors and exact variants JSON.
5. Item 6.4 only if TypeScript stays clean without casts or type ceremony.
6. Item 1 in smaller slices: first `useControllableOpen`, then possibly the slot helper, then only consider the transition helper if it stays simpler after Sheet is stack-aligned.
7. Item 5 last, with dedicated editor verification.

Do not implement item 6.3 as written unless bundle verification shows the direct `querySchema.ts` runtime import is harmless. Prefer a tiny shared helper or leave the duplicate.

---

## Final comments (original reviewer, post-Codex) — authoritative for hand-off

Adopt Codex's implementation order (2 → 6.1/6.2 → 3 → 4 → 6.4 → 1 in slices → 5). Its risk framing is sound. Specific rulings on the disputed points:

**Item 6.3 — resolved, do it as originally written.** The bundle concern is now verified against the code: `FilterControl` has exactly one consumer, `src/admin/List/Header.tsx`, which is a `"use client"` component inside the admin List graph; `src/admin/List/context.tsx` (client) and `src/list/useQueryStore.ts` (client, imported by the same graph) both already have **runtime** imports from `querySchema.ts`. The module is already in every client bundle that can render FilterControl, so exporting `hasFilterValue` from `querySchema.ts` adds zero bundle weight. Do NOT create a new shared helper file for one function — that is exactly the forwarding-module indirection `agents.md`'s Directness Gate prohibits. Import from `querySchema.ts` directly.

**Item 1 — slicing accepted, but do not drop the transition hook.** Codex is right that `useControllableOpen` should land first and that Popover couples positioning/autofocus into its effect. But the transition state machine is the majority of the duplication (~60 lines × 3, byte-identical apart from Popover's two `positionDialog` calls and `autoFocus`), so "only consider" undersells it: after Sheet is stack-aligned (item 2), extract it, keeping Popover's positioning in the existing `onShow` hook point and its `autoFocus` call in Popover's own effect. The `mounted`/portal gating stays in each component — the hook takes only `(dialogRef, open, durationMs, onShow?)` and never touches mounting, so the "Sheet is not portaled" difference is irrelevant to it. If the extracted hook needs more than one callback parameter to fit all three, stop — that is the signal Codex was worried about.

**Item 4 — concurrency note.** Today the two sharp renders are sequential and only the two S3 uploads run in `Promise.all`. If the helper combines render+upload and you call it under `Promise.all`, renders become concurrent too. That is behavior-neutral for output but doubles peak sharp memory on large images; either form is acceptable — just choose deliberately and say so in the patch description. Codex's other constraint stands: dimension failures must remain structured `mediaUploadError` responses, not thrown exceptions.

**Item 6.1 — `CSS.escape` concern is moot.** Baseline-available in all browsers this admin UI can target (everything since ~2016). Proceed.

**Items 2, 3, 5, 6.2, 6.4 — no disagreement.** Codex's added constraints (cancel-event semantics in 2, protocol-only helper in 3, structured errors in 4, immediate-feeling highlight and `destroy()` cleanup in 5, no-cast requirement in 6.4) are all correct; treat them as acceptance criteria.

One addition for whoever implements item 2: after switching Sheet to `useOverlayStack`, re-test Escape while a **Picker** (`src/forms/controls/Picker.tsx`) is open inside a Sheet — Picker also registers on the overlay stack, and it is the most common nested-overlay case in admin forms.

---

## Implementation progress

- **2026-07-18:** Implemented item 2, item 6.1, and item 6.2 in code. Sheet now imports `useOverlayStack`, dispatches the same cancelable `cancel` event from the stack close callback, and gates backdrop close on `isTopOverlay()`. Popover `getTriggerElement` now uses a direct escaped `[aria-controls="..."]` query. FilterControl now inlines `true` for newly added boolean filters and removes the dead `getInitialValue` helper. `npx tsc --noEmit --project tsconfig.json` passes in `kenstack/`; manual overlay verification still pending.
- **2026-07-18:** Implemented item 6.3 as resolved in the hand-off notes: `hasFilterValue` is now exported from `src/list/querySchema.ts` and used by `src/list/FilterControl.tsx`; the local duplicate was removed. Implemented item 6.4 with a private `enumFromOptions(...)` helper in `src/fields/client.tsx` and no casts. `npx tsc --noEmit --project tsconfig.json` passes in `kenstack/`.
- **2026-07-18:** Implemented item 3 with `src/forms/lib/uploadMedia.ts`. The helper owns only the presign -> S3 PUT -> completion protocol and returns staged protocol results; ImageField and MediaListField keep their existing preview, form error, status message, local media state, object URL, and failure aggregation behavior. `npx tsc --noEmit --project tsconfig.json` passes in `kenstack/`; manual upload verification still pending.
- **2026-07-18:** Implemented item 4 in `src/fields/records/mediaUpload.ts`. The local stream helper was replaced with `buffer` from `node:stream/consumers`, the known-length file branch now destroys the stream and reuses `ContentLength`, and raster WebP variant creation is handled by a local `createWebpVariant(...)` helper. Variant creation is intentionally sequential to avoid doubling peak Sharp memory; dimension failures still return structured `mediaUploadError(...)` responses. `npx tsc --noEmit --project tsconfig.json` passes in `kenstack/`; manual raster/SVG/file upload verification still pending.
- **2026-07-18:** Implemented the highest-value parts of item 1 with `src/components/overlay.ts`: `useControllableOpen(...)` now backs Dialog, Sheet, and Popover, and `useDialogTransition(...)` owns the shared native-dialog open/close animation lifecycle. Dialog and Popover keep mounted/portal gating in their components by passing `mounted && open`; Popover keeps positioning through the single `onShow` hook point and autofocus in its own effect. The trigger/close slot helper was not implemented because, after the state/transition extraction, the remaining cloning code differs enough by trigger vs close vs Popover toggle behavior that a shared helper no longer clearly clears the Directness Gate. `npx tsc --noEmit --project tsconfig.json` passes in `kenstack/`; manual overlay verification still pending.
- **2026-07-18:** Implemented item 5 by moving `src/forms/MarkdownField/mentions.ts` to `mentions.tsx`, adding `MentionMenu.tsx`, and rendering the suggestion popover through one React root on the existing body-portaled element. The ProseMirror plugin lifecycle, debounce/cache/abort search flow, keyboard handling, mousedown prevention, and scroll/resize positioning remain in `MentionPluginView`; the old per-avatar roots and imperative option/status DOM builders were removed. `npx tsc --noEmit --project tsconfig.json` passes in `kenstack/`; manual markdown mention verification still pending.
- **2026-07-18:** Final automated checks for the implemented code pass in `kenstack/`: `npx prettier --write` was run on touched files only, `npx tsc --noEmit --project tsconfig.json` passes, `npm run lint` passes, and `git diff --check` passes. Manual browser/admin verification remains pending for overlays, Picker-in-Sheet Escape behavior, upload success/error paths, and markdown mention interactions.
- **2026-07-18:** Review/cleanup pass after implementation: removed the unnecessary exported mention option type, avoided a type-only back-import from `MentionMenu.tsx` to `mentions.tsx`, fixed the mention menu arbitrary `calc(...)` Tailwind class to preserve CSS spaces, and made `UploadMediaCompletePayload` private to `uploadMedia.ts`. Re-ran checks: `npx tsc --noEmit --project tsconfig.json` in `kenstack/`, `npm run lint` in `kenstack/`, root `npm run lint`, root `npm run build`, and `git diff --check` in `kenstack/` all pass.
- **2026-07-18:** Browser smoke tests against the existing dev server on `localhost:3000`: homepage loaded with zero console errors; `/admin` loaded and redirected to `/admin/users` with zero console errors; the admin Filters Popover opened and closed via Escape with zero console errors; the mobile Sidebar Sheet opened and closed via Escape with zero console errors after temporarily setting a 390px viewport and resetting it. A Blog markdown editor accepted input with zero console errors, but this host does not currently pass a `mentions` config to any MarkdownField, so the mention suggestion menu itself was not reachable without adding a temporary harness. Upload success/error paths and Picker-in-Sheet nesting were not manually exercised.
