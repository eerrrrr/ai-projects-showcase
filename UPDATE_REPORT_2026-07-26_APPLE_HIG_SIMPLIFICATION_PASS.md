# Apple HIG simplification pass

**Date:** 2026-07-26

## Goal

Reduce cognitive load without changing the verified project claims, the continuous Plasma background, or the approved native-scroll architecture.

## Information architecture

- Moved the manifesto sentence into `Selected systems` as the section introduction.
- Removed the separate 80vh sticky manifesto screen.
- Promoted Systems 01–03 as the only full interactive case studies on the homepage.
- Reframed Systems 04–07 as concise, scannable summaries with:
  - number and tier;
  - title and one value statement;
  - compact workflow path;
  - two verified capability chips.
- Kept real anchors for all seven systems, so the Selected Systems cards and chapter rail still navigate directly to every system.
- Changed the cover cue to `Explore selected work`.

## Workflow simplification

- Changed the primary action label to `Play workflow`.
- Changed the secondary action label to `Read case notes`.
- Workflow descriptions are visually collapsed by default.
- Only the current step reveals its explanation and evidence while playing or after direct selection.
- Replaced interactive `<li role="button">` elements with native `<button>` elements inside list items.
- Preserved the continuous green progress track and 3600ms-per-step timing.

## Layout and typography

- Rebuilt Selected Systems as three larger featured cards plus four smaller secondary cards.
- Removed full-viewport minimum heights from detailed project sections.
- Raised labels, chips, actors, and controls toward a 12px minimum.
- Added a dedicated responsive layout for the concise Systems 04–07 section.
- Hid the desktop workflow track together with its markers below 900px to prevent the track crossing mobile text.

## Verification

- `npm run build`: passed.
- `git diff --check`: passed.
- Banned scroll-pattern scan: only pre-existing explanatory comments remain.
- No changes to:
  - `AmbientBackground.tsx`;
  - `Plasma.jsx`;
  - `useSoftPageHandoff.ts`;
  - `useSectionSettle.ts`;
  - `useAccentSection.ts`.
- Live desktop verification at 1280×720:
  - document height reduced from 8,226px to 5,818px;
  - page length reduced from 11.4 to 8.1 viewport heights;
  - full project cards reduced from 7 to 3;
  - compact summary rows added for Systems 04–07;
  - buttons reduced from 47 to 18;
  - remaining `[role="button"]` count is 0;
  - default visible workflow descriptions reduced to 0;
  - playing a workflow reveals exactly one description and one evidence panel;
  - no horizontal overflow;
  - chapter links for Systems 01, 03, 04, and 07 land below the sticky navigation and highlight the matching chapter;
  - all nine chapter-rail targets exist.

## Deployment

- Not committed.
- Not pushed.
- `docs/` not rebuilt.
