# Update report — global ambient background (Hero → whole site, subtle green grading)

**Date:** 2026-07-25
**Branch:** `motion/soft-section-handoff`
**Scope:** one new component (`AmbientBackground.tsx`), `Hero.tsx` (Plasma moved out),
`App.tsx` (mount point + a new `.page-content` stacking wrapper), `global.css`
(`--ambient-opacity` variable + `.ambient-bg*` rules + one background removal on
`.hero-cover`). No scroll hook, no workflow hook, no ProjectCard logic touched.

## Starting state (printed per protocol)

```
$ git branch --show-current
motion/soft-section-handoff
$ git status --short
(empty — clean)
```

**Pre-edit `rg` scan** (`Plasma|canvas|background|data-accent-section|--accent|prefers-reduced-motion|useAccentSection|useSoftPageHandoff|useSectionSettle`):
confirmed exactly one existing Plasma consumer (`Hero.tsx`, scoped to `.hero-plasma`),
the accent-scale CSS variables and `useAccentSection.ts` from the prior pass, and no
existing ambient/global-background code anywhere.

## What was built

**`src/components/AmbientBackground.tsx`** (new) — the single Plasma canvas for the
whole site, mounted once in `App.tsx`, before everything else:
```tsx
export function AmbientBackground() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return (
    <div className="ambient-bg" aria-hidden="true">
      <div className="ambient-bg-canvas">
        <Plasma color="#1f7a55" speed={reducedMotion ? 0.02 : 0.35} direction="forward"
                scale={1.25} opacity={0.22} mouseInteractive={false} />
      </div>
      <div className="ambient-bg-tint" />
    </div>
  )
}
```
Plasma's own props never change per section — all section grading is pure CSS.

**`Hero.tsx`** — its own `.hero-plasma` + `<Plasma>` instance removed entirely (moved to
the global layer above).

**`global.css`**:
- `--ambient-opacity` added to `:root` and to each existing `:root[data-accent-section="..."]`
  block (same mechanism as the accent-scale feature from the prior pass — no new JS),
  plus a new `:root[data-accent-section="footer"]` block (previously uncovered):
  `hero 0.30 → systems 0.16 → system01 0.12 → system02/03 0.11 → system04/05 0.10 → system06/07 0.09 → footer 0.05`.
- `.ambient-bg` (`position:fixed;inset:0`, the single canvas layer) / `.ambient-bg-canvas`
  / `.ambient-bg-tint` (a `background-color:var(--accent)` wash, `mix-blend-mode:soft-light`,
  giving the actual per-section hue shift, reusing the already-working `--accent` variable).
- `.page-content` — a new wrapper around literally everything else (Nav through Footer),
  `position:relative;z-index:1`.
- `.hero-cover` no longer sets its own `background:var(--paper)`.

## Three real bugs found and fixed during verification — not just "implemented and assumed working"

The first working build produced **zero visible background** anywhere, including Hero.
Screenshots showed a flat page. Rather than report the feature as done, this was
isolated properly:

**Bug 1 — a stray diagnostic hypothesis, ruled out.** Suspected Plasma's own internal
`IntersectionObserver`-gated render-pause was racing the very first layout pass (mounted
this early, as a fixed full-viewport layer). Delaying the `<Plasma>` mount by one
`requestAnimationFrame` tick did **not** fix it — this hypothesis was wrong. Reverted
that workaround; the final code does not contain it.

**Bug 2 — confirmed real: `z-index:-1` on a `position:fixed` ancestor broke this WebGL
canvas's compositing.** Isolated by a controlled single-variable test: reverted Hero to
its exact original structure, then changed only `position` (absolute → fixed) and only
`z-index` (0 → -1) one at a time while screenshotting each state.
`position:fixed` + `z-index:0` → renders correctly. `position:fixed` + `z-index:-1` →
completely blank (confirmed via `gl.readPixels()`: every sampled pixel was `[0,0,0,0]`,
no WebGL error, context not lost — the draw calls were happening, the compositor just
never displayed the result). Fixed by using `z-index:0` for `.ambient-bg` and adding
`.page-content{position:relative;z-index:1}` around all real content instead, so the
ambient layer still reliably sits behind everything without either side needing a
negative z-index.

**Bug 3 — confirmed real, and the actual remaining blocker: `.hero-cover`'s own opaque
`background:var(--paper)`.** Once Hero moved into the new `.page-content` stacking
context (z-index 1, above the ambient layer at z-index 0), Hero's own solid background
color painted directly over the ambient layer wherever Hero's box existed — nothing to
do with WebGL at all, just ordinary CSS painting order. Confirmed by temporarily setting
`.hero-cover`'s background to `transparent` via devtools-equivalent override: the ambient
texture immediately appeared underneath. Fixed by removing that background declaration
from `.hero-cover` (checked `.systems-overview`, `.project`, and `footer` — none of them
have their own opaque background, so this was the only section affected).

All three bugs and the exact isolation steps that found them are preserved here rather
than silently smoothed over, per this project's standing "print what was actually wrong"
discipline.

## Guardrails honored

- Exactly one `<canvas>` on the page at all times — confirmed via
  `document.querySelectorAll('canvas').length === 1`.
- `useSoftPageHandoff.ts`, `useSectionSettle.ts`, `useAccentSection.ts`,
  `useWorkflowWalkthrough.ts`, and `ProjectCard.tsx` all show **zero diff** (`git diff
  --stat` against each — empty) — nothing about scroll, settle, accent-section
  detection, or workflow state was touched.
- `AmbientBackground` never calls `scrollTo`, never reads/writes workflow or expand
  state, never mounts a second canvas.
- `rg` for every banned pattern — clean, only pre-existing comments.
- Mobile: `.ambient-bg{display:none}` at the existing mobile breakpoint and in
  `@media print`, replacing the two spots that used to say `.hero-plasma{display:none}`
  — same established behavior, just renamed to match the new class.

## Reduced motion

`AmbientBackground` still always renders (matching Hero's own pre-existing, explicitly
requested-twice choice — see the comment this carried over from `Hero.tsx`), but under
`prefers-reduced-motion: reduce`: Plasma's `speed` prop drops from `0.35` to `0.02`
(near-static), and the CSS opacity/color transitions on `.ambient-bg`/`.ambient-bg-tint`
switch to `transition:none` (instant instead of eased) via the existing
`@media (prefers-reduced-motion:reduce)` block pattern already used elsewhere in this
file. Verified by code inspection only — this session's Puppeteer setup has no way to
force that media query, same limitation noted in the prior two reports.

## Build & verification

`npm run build` — 0 errors (verified at each step of the debugging process above, not
just the final one).

**Live Puppeteer checks, 1440x900, after the fix:**
- Hero: ambient texture visible, soft and organic, text fully legible (`h1`/tagline
  unaffected).
- Selected systems: all 7 cards' chips remain crisp and readable against the faint wash
  — specifically checked per your request.
- System 01 with "How it works" open: workflow rows, mini-node chips, and the
  "Roadmap recap" panel all stayed fully readable — specifically checked per your
  request. Autoplay still ran correctly (step 4 active, recap visible) — unaffected by
  any of this pass's changes.
- Mobile (390x844): `.ambient-bg` correctly hidden, layout unaffected.

## Not touched

`ProjectCard.tsx`, `WorkflowWalkthrough.tsx`, `useWorkflowWalkthrough.ts`,
`useSectionSettle.ts`, `useSoftPageHandoff.ts` scroll logic, auto-zip logic, Selected
systems card structure, project copy, `main` branch, deployment/`docs/` (not rebuilt).

**Not committed, not pushed** — awaiting your visual approval, per instruction.
