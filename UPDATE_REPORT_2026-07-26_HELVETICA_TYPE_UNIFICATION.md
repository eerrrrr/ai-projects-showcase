# Helvetica type unification

**Date:** 2026-07-26  
**Status:** Implemented and locally verified; pending user visual approval.

## What changed

- Removed the Google Fonts request from `index.html`.
- Added one local UI font stack in `src/styles/global.css`:
  `"Helvetica Neue", Helvetica, Arial, sans-serif`.
- Pointed body copy, display headings, navigation, labels, tags, buttons,
  workflow steps, chips, and inline code at that same stack.
- Kept the existing `.mono` class name because components use it as a semantic
  label style, but removed its separate `JetBrains Mono` face. Its uppercase,
  size, weight, and letter-spacing still preserve the editorial label hierarchy.

## Why

The previous design mixed `Inter`, `Inter Tight`, and `JetBrains Mono`. The
result had more typographic voices than the page needed. Using one Helvetica
family makes the catalogue feel calmer and more consistent without changing
content structure or interaction behavior.

## Verification

- `npm run build`: passed with zero TypeScript or Vite errors.
- Browser computed-style audit: every element reported the same font family,
  `"Helvetica Neue", Helvetica, Arial, sans-serif`.
- Browser layout check at 1265 × 720: no horizontal overflow.
- Browser console: zero errors.
- Hero screenshot inspected: heading, navigation, supporting copy, keyword row,
  and scroll cue render cleanly with the unified family.
- Google Fonts are no longer loaded; the only page stylesheet is the local
  generated Vite CSS asset.
- Banned-pattern scan: only the two pre-existing explanatory comments matched.
- Protected files (`useSoftPageHandoff.ts`, `useSectionSettle.ts`,
  `useWorkflowWalkthrough.ts`, and `ProjectCard.tsx`): zero diff.

## Files changed

- `index.html`
- `src/styles/global.css`
- `UPDATE_REPORT_2026-07-26_HELVETICA_TYPE_UNIFICATION.md`

## Pending

- User visual approval.
- No commit, push, `docs/` rebuild, or deployment has been performed.
