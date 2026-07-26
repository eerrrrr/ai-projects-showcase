# Apple-style page settle

**Date:** 2026-07-26  
**Status:** Superseded by
`UPDATE_REPORT_2026-07-26_SCROLLEND_MOMENTUM_CORRECTION.md` after the user's
physical-device recording exposed residual-momentum misclassification.

## Input reviewed

Reviewed `20260726-0130-56.5816441.mp4` (16.3 seconds, 1868 × 1244,
30 fps). The sections reached the correct final positions, but their last
alignment felt like a sudden correction rather than a controlled acceleration,
deceleration, and landing.

## What changed

Only `src/hooks/useSectionSettle.ts` was changed for motion behavior.

- Replaced browser-controlled `scrollTo({ behavior: "smooth" })` with an
  explicit `requestAnimationFrame` animation.
- Added an `850ms` cubic ease-in-out curve.
- Expanded the local magnetic settle zone from `18%` to `28%` of viewport
  height.
- Added a guarded one-gesture page step:
  - the gesture must begin within `16px` of an already-settled boundary;
  - it must travel at least `8%` of viewport height;
  - it can move only to the immediately adjacent page.
- Added the manifesto buffer (`#systems-statement`) to the ordered page targets.
- Added user-interruption detection. If fresh input moves the viewport more than
  `6px` away from the last animation-applied position, the animation releases
  control immediately.

## Safety model retained

- No `scroll-snap`.
- No `preventDefault`.
- No wheel-event interception.
- No `scrollIntoView`.
- No workflow state reads or writes.
- No content skipping: a page step can only target the adjacent boundary.
- Fully disabled under `prefers-reduced-motion: reduce`.
- Fully suppressed while a project is expanded or any walkthrough step is
  active.

## Verification

- `npm run build`: passed with zero TypeScript or Vite errors.
- Forward page step:
  - started with System 01 at `top: 88px`;
  - one `120px` downward scroll gesture;
  - observed intermediate positions during the easing;
  - finished with System 02 at `top: 88px`.
- Reverse page step:
  - one `120px` upward gesture from System 02;
  - finished with System 01 at `top: 88px`.
- Walkthrough protection:
  - started System 01 “How it works”;
  - confirmed `.w-step--active`;
  - scrolled downward and waited beyond the settle duration;
  - viewport remained at the user's natural position and did not page-step.
- Banned-pattern scan: only the two pre-existing explanatory comments matched.
- Protected files other than the explicitly requested `useSectionSettle.ts`
  remained unchanged.

## Pending

- User review with a physical mouse/trackpad in the real browser.
- No commit, push, `docs/` rebuild, or deployment has been performed.
