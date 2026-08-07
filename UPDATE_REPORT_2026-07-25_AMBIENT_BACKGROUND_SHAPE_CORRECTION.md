# Update report — ambient background correction: extend the shape, not a color fill

**Date:** 2026-07-25
**Branch:** `motion/soft-section-handoff`
**Scope:** `AmbientBackground.tsx` (removed the flat tint layer), `global.css`
(`--ambient-opacity` values corrected + `.ambient-bg-tint` rule removed). No scroll
hook, no workflow hook, `Plasma.jsx` untouched.

## Starting state (printed per protocol)

```
$ git branch --show-current
motion/soft-section-handoff
$ git status --short
 M src/App.tsx
 M src/components/Hero.tsx
 M src/styles/global.css
?? UPDATE_REPORT_2026-07-25_GLOBAL_AMBIENT_BACKGROUND.md
?? src/components/AmbientBackground.tsx
```
(This is the previous, uncommitted ambient-background pass — corrected in place, not
re-checkpointed, since it's the exact same uncommitted work being fixed.)

## What was actually wrong

You were right that the previous version read as a flat pale-green wash rather than the
original Hero's soft organic shapes continuing downward. Tracing the actual cause (not
just re-tuning numbers): the previous version applied **two compounding effects** that
together flattened the shape into a uniform tint:

1. **A separate flat color-tint layer** (`.ambient-bg-tint`) — a `position:absolute;
   inset:0` div with `background-color:var(--accent)` at `opacity:.5`,
   `mix-blend-mode:soft-light`, covering the **entire viewport rectangle uniformly**,
   layered on top of the canvas. This is what actually produced the "whole page tinted
   green" perception — it has no shape at all, it's a flat rectangle.
2. **Double-dimming**: Plasma's own internal `opacity` prop (0.22, baked into the
   shader's alpha blending — this is what gave the original Hero screenshot its look)
   was then *additionally* multiplied by a CSS `opacity` on the wrapping `.ambient-bg`
   div (0.30 at Hero). The combined effective strength was far dimmer than the original
   Hero ever was, and washed out whatever shape contrast remained.

## What changed

**`AmbientBackground.tsx`** — removed the `<div className="ambient-bg-tint" />` layer
entirely. The component now renders only the canvas wrapper, with Plasma's props
completely unchanged from the original Hero usage (`color="#1f7a55"`, `opacity={0.22}`,
`scale={1.25}`).

**`global.css`** — `--ambient-opacity` values corrected so Hero is **undimmed** (`1`,
identical to the original single-section version — no extra multiplication on top of
Plasma's own internal opacity), fading progressively through the rest of the page:

```
hero: 1        systems: 0.55   system01: 0.4    system02/03: 0.34
system04: 0.28  system05: 0.26  system06: 0.22   system07: 0.2
footer: 0.1
```

`.ambient-bg-tint` CSS rule deleted. The per-section green hue-shift you asked to keep
("tint the plasma shape, not fill the section background") already lives correctly in
the separate, working `--accent` variable used by project numbers/chips/buttons — that
mechanism is untouched and still shifts hue per section on its own; this component no
longer duplicates it as a background fill.

## Guardrails honored

- Exactly one `<canvas>` on the page — confirmed via
  `document.querySelectorAll('canvas').length === 1`.
- `useSoftPageHandoff.ts`, `useSectionSettle.ts`, `useAccentSection.ts`,
  `useWorkflowWalkthrough.ts`, `ProjectCard.tsx`, and `Plasma.jsx` all show **zero diff**
  (`git diff --stat` against each — empty).
- `rg` for every banned pattern — clean, only pre-existing comments.

## Build & verification

`npm run build` — 0 errors.

**Live Puppeteer checks, 1440x900:**
- Hero: matches the original good screenshot almost exactly — large soft organic mint
  shapes, white dominant, text fully crisp.
- Selected systems: mostly white, soft shape wisps visible only at the corners/edges,
  all 7 cards' chips fully legible, no flat wash anywhere.
- System 01 with "How it works" open: a faint shape visible only at the far edges of the
  viewport; the entire workflow panel, chips, and recap area are clean white and fully
  readable.
- Footer: background nearly gone, all text crisp.
- Mobile (390x844): `.ambient-bg` still correctly hidden, unaffected by this change.

## Not touched

`ProjectCard.tsx`, `WorkflowWalkthrough.tsx`, `useWorkflowWalkthrough.ts`,
`useSectionSettle.ts`, `useSoftPageHandoff.ts`, `Plasma.jsx`, Selected systems card
structure, project copy, `main` branch, deployment/`docs/` (not rebuilt).

**Not committed, not pushed** — awaiting your visual approval.
