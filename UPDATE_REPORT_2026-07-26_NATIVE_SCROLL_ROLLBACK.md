# Native scroll rollback

**Date:** 2026-07-26  
**Status:** Implemented and locally verified; pending user physical-device review.

## Input reviewed

Reviewed `20260726-0212-39.8508214.mp4` frame by frame:

- duration: `36.299966s`
- resolution: `1720 × 1256`
- frame rate: `30fps`

The recording showed repeated corrections between Selected systems, the
manifesto, and Systems 01–03. Individual page targets were mathematically
correct, but the user's native inertial movement and the programmatic settle
animation remained two separate motion systems. The result still felt delayed,
reversing, and controlled by the page rather than by the user.

## Decision

Stop pursuing PPT-style whole-page pagination for this document.

This site contains variable-height project content, expandable details, and
interactive walkthrough rows. Whole-page settling is structurally mismatched
with that reading model. Apple-style polish should come from continuous native
scrolling, sticky composition where useful, restrained reveals, and the existing
continuous ambient field—not from moving the viewport after the user's gesture.

## What changed

Used the existing rollback switches:

- `ENABLE_SOFT_PAGE_HANDOFF = false`
- `ENABLE_SECTION_SETTLE = false`

Both hooks return before attaching listeners. No scroll code was deleted, making
the rollback easy to inspect and reverse, but no active JavaScript now moves the
viewport during wheel or trackpad scrolling.

## What remains

- Native browser momentum and deceleration.
- Smooth anchor-link navigation from `html { scroll-behavior: smooth; }`.
- Passive accent-section observation.
- Continuous Plasma shape, opacity, color, and flow progress.
- Project expansion, walkthrough autoplay, and auto-zip behavior.

## Verification

- `npm run build`: passed with zero TypeScript or Vite errors.
- Hero natural-scroll test:
  - applied `420px` scroll input;
  - after `1.8s`, remained at `scrollY: 420`;
  - Selected systems remained naturally `301px` below the viewport top;
  - no automatic Hero → systems jump.
- Project natural-scroll test:
  - began with System 01 at `top: 88px`;
  - applied `300px` scroll input;
  - after `2.2s`, System 01 remained at `-212px` and System 02 at `452px`;
  - no page settle, pullback, or automatic advance.
- Browser console: zero errors.
- Banned-pattern scan remained clean apart from the two pre-existing explanatory
  comments.
- No project, workflow, data, or ambient-background implementation changed.

## Recommended next motion direction

If more Apple-like motion is desired after this rollback is approved:

1. Keep viewport movement entirely native.
2. Add small scroll-linked opacity/translate transitions to section contents,
   not to the page position.
3. Consider a sticky evidence panel inside individual featured projects only.
4. Keep all transitions reversible and disabled under reduced motion.

## Pending

- User physical-device review.
- No commit, push, `docs/` rebuild, or deployment has been performed.
