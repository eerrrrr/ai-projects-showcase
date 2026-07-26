# Apple HIG layout implementation

**Date:** 2026-07-26  
**Scope:** Layout hierarchy, responsive navigation, legibility, interaction affordance, and semantic structure.

## What changed

- Preserved the existing Helvetica-only visual language and the approved continuous Plasma background.
- Kept the established Hero hierarchy: 72px name, 30px discipline, 16px description.
- Replaced irregular large section gaps with a smaller, more consistent vertical rhythm.
- Reduced the manifesto section from 112vh to 80vh so the page remains breathable without feeling artificially long.
- Moved the cover navigation cue away from the physical bottom edge.
- Increased the quiet-text color contrast from approximately 3.24:1 to 5.55:1 on the paper background.
- Added a keyboard-visible skip link and a real `main` landmark.
- Added explicit labels to primary and chapter navigation.
- Changed detailed project titles from `h3` to `h2`, while keeping overview-card titles at `h3`.
- Kept the full vertical chapter rail visible at 1280px; below 1100px it becomes a compact, clickable previous/current/next controller.
- Preserved the brand and primary Visual Portfolio action on small screens instead of hiding every navigation link.
- Increased primary control heights and added consistent focus-visible treatment.
- Added `aria-expanded`, `aria-controls`, and hidden-state metadata to expandable project content.
- Added lazy loading and asynchronous decoding to future stage images.

## What deliberately did not change

- No scroll snap.
- No wheel-driven project navigation.
- No `scrollIntoView`.
- No hash-driven auto-expand.
- No changes to the Plasma shader, opacity model, or ambient-background constants.
- No changes to project claims or source data.
- No commit, push, or `docs/` deployment.

## Verification

- `npm run build`: passed.
- `git diff --check`: passed.
- Banned-pattern scan: only the two pre-existing explanatory comments remain.
- Live verification at 1280×720:
  - no horizontal overflow;
  - one `main` landmark and one keyboard skip link;
  - full vertical chapter navigation remains visible;
  - Selected Systems anchor lands at the correct top position;
  - System 01 anchor lands below the sticky navigation;
  - chapter highlight updates correctly;
  - project headings now form an H2-level catalogue;
  - `How it works` is 40px high and `View details` is 36px high on desktop;
  - `View details` correctly updates `aria-expanded` and `aria-hidden`.

## Pending user review

- Visual approval of the tighter section rhythm.
- Whether the 1280px full chapter rail feels sufficiently separated from the right edge of workflow content.
- Whether mobile should retain only Visual Portfolio in the top bar or gain a separate menu in a later pass.
