# Scroll-end momentum correction

**Date:** 2026-07-26  
**Status:** Superseded by
`UPDATE_REPORT_2026-07-26_NATIVE_SCROLL_ROLLBACK.md`. A later physical-device
recording showed that even correctly detected gesture boundaries could not make
programmatic page settling feel continuous with native input.

## Input reviewed

Reviewed `20260726-0156-16.2746663.mp4` frame by frame:

- duration: `26.766633s`
- resolution: `1890 × 1218`
- frame rate: `30fps`

The recording showed the page reaching correct individual boundaries but then
continuing or reversing through sequences such as System 04 → 05 → 04 → 03.
This disproved the previous assumption that a `200ms` pause in `scroll` events
meant the physical trackpad gesture had ended.

## Root cause

The previous implementation used a timeout to infer the end of a gesture.
Trackpad momentum can pause and resume while the same physical gesture is still
active, so residual momentum was occasionally recorded as a new gesture after
the programmatic settle completed. That could trigger another adjacent-page
decision without a genuinely new user action.

Official platform guidance confirms this:

- Chrome's `scrollend` documentation explicitly says timeout strategies detect
  a pause rather than the end of a scroll and can fire while a finger is still
  down:
  https://developer.chrome.com/blog/scrollend-a-new-javascript-event
- MDN defines `scrollend` as firing only after pending scroll-position updates
  and the user's gesture have both completed:
  https://developer.mozilla.org/en-US/docs/Web/API/Document/scrollend_event
- WebKit documents that macOS momentum continues through synthetic wheel events
  and that the traditional event model does not expose trackpad scrolling
  phases reliably:
  https://webkit.org/blog/4017/scroll-snapping-with-css-snap-points/

## What changed

Only `src/hooks/useSectionSettle.ts` changed in this correction.

- Modern browsers now use the native document `scrollend` event before making
  any page-step decision.
- Feature detection follows Chrome's official recommendation:
  `'onscrollend' in window`.
- The `200ms` debounce remains only as an old-browser fallback.
- The fallback is deliberately conservative:
  - it may perform a nearby boundary settle;
  - it never performs the directional one-gesture page step, because a timeout
    cannot reliably identify one physical gesture.
- All prior safety exits remain: no action while a project is expanded or a
  walkthrough is active, and no action under reduced motion.

## Why CSS Scroll Snap was not added

Official sources recommend native CSS Scroll Snap for true compositor-owned
pagination, but this project has already reproduced accessibility and
interaction failures with page-level snapping. The standing banned-pattern
rule therefore remains intact: no `scroll-snap-type` or `scroll-snap-align`
was reintroduced.

## Verification

- `npm run build`: passed with zero TypeScript or Vite errors.
- The in-app test browser reports no native `scrollend` support, so it exercised
  the fallback branch.
- Strong fallback test:
  - began with System 01 at `top: 88px`;
  - applied one `420px` inertial-style scroll;
  - settled at System 02, `top: 88px`;
  - remained there through `4,000ms`;
  - System 03 remained at `top: 752px`, proving no residual double-step.
- Previous forward, reverse, and walkthrough-protection tests remain valid for
  the shared target-selection and animation code.
- Browser console: zero errors.
- Banned-pattern scan: only the two pre-existing explanatory comments matched.

## Browser support boundary

Chrome documents native `scrollend` support from Chrome 114. Modern Chrome,
Firefox, and current Safari use the accurate branch. Older browsers retain
smooth proximity settling but intentionally do not promise one-roll pagination.

## Pending

- Re-test the corrected native `scrollend` branch in the user's physical Chrome
  browser and trackpad/mouse environment.
- No commit, push, `docs/` rebuild, or deployment has been performed.
