# Content-layer scroll motion — 2026-07-26

## Request

Improve the page's sense of flow without restoring page snapping, wheel
interception, or any mechanism that changes the browser's scroll destination.

## Implemented

- Kept page scrolling fully native.
- Turned the large systems statement into a desktop-only sticky content moment.
- Centred the statement block horizontally and aligned its visual centre to the
  viewport centre during the sticky interval, while keeping the copy itself
  left-aligned.
- Increased the statement section to `112vh` so the copy has real breathing
  room and enough distance to remain sticky briefly.
- Added CSS view-timeline reveals for:
  - the systems statement;
  - project metadata;
  - project content;
  - supporting-infrastructure content.
- Limited movement to `14–24px` with opacity changes.
- Preserved the existing IntersectionObserver reveal as the fallback for
  browsers without view timelines.
- Disabled the new motion for `prefers-reduced-motion`.
- Kept the statement non-sticky on mobile.

## Deliberately not used

- no `wheel` interception;
- no `preventDefault()` for scrolling;
- no `scrollTo()` or `scrollIntoView()` for layout progression;
- no CSS `scroll-snap`;
- no page-by-page/PPT controller;
- no workflow state coupled to scroll position.

## Technical basis

- MDN: `animation-timeline: view()` creates an anonymous view progress timeline.
  https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline
- Chrome: scroll-driven animations run from scroll/view progress without a
  JavaScript scroll listener.
  https://developer.chrome.com/docs/css-ui/scroll-driven-animations
- WebKit: Safari 26 supports CSS scroll-driven animations.
  https://webkit.org/blog/17333/webkit-features-in-safari-26-0/

## Verification

- `npm run build` — passed.
- `git diff --check` — passed.
- Local browser supports `animation-timeline: view()`.
- Statement container measured `806px` high at the verification viewport.
- Sticky statement held around the viewport's visual centre across several
  native scroll positions.
- Follow-up centring pass measured the statement at `632px` on a `1280px`
  viewport centre (`640px`), and `360px` on a `720px` viewport centre (`360px`).
- Requested/settled scroll positions matched:
  - `1792 / 1792`
  - `1852 / 1852`
  - `1932 / 1932`
  - `2012 / 2012`
- No commit, push, merge, or deployment was performed.
