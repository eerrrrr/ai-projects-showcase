# Workflow progress-line motion

**Date:** 2026-07-26

## Change

- Added one video-style progress track that runs continuously from the first workflow node to the final node.
- Clicking `How it works` starts the existing autoplay sequence unchanged.
- The green fill travels continuously from the top to the end over the complete autoplay duration.
- Removed the separate green inset line from the left edge of the active row; the central progress track now carries the motion and state by itself.
- Replaced the abrupt conditional panel mount with a persistent accordion shell that eases height, opacity, background, and an 8px vertical offset using `cubic-bezier(.22,1,.36,1)`.
- Clicking a row directly still jumps to that row and pauses autoplay.
- `prefers-reduced-motion` disables the timed animation and displays the active connector as complete.

## Architecture

- `STEP_DWELL_MS` is now exported from `useWorkflowWalkthrough.ts`, so the visual timer and state-machine timer share one source of truth.
- A lightweight `runId` restarts the CSS progress animation when `How it works` is clicked again.
- `WorkflowWalkthrough.tsx` renders one decorative, aria-hidden track around the entire workflow list.
- Closed evidence panels remain in the document structure at zero height with `aria-hidden="true"`, allowing the previous and next panels to crossfade and resize without a layout snap.
- CSS owns the animation. No scroll, wheel, IntersectionObserver, or animation library was added.

## Verification

- `npm run build`: passed.
- `git diff --check`: passed.
- Banned-pattern scan: only pre-existing explanatory comments remain.
- Live verification confirmed:
  - exactly one progress track is rendered;
  - the track spans the complete workflow list, including the expanded evidence panel;
  - the green fill continues while autoplay advances to step 2;
  - the active row has `box-shadow: none`;
  - the total animation duration remains derived from `3600ms × stage count`.
- Live transition sampling confirmed inactive panels return to zero height and opacity while the next panel reaches its full height without leaving multiple panels open.
- `prefers-reduced-motion` removes the accordion and row transitions.
- Visual screenshot inspection confirmed the line is uninterrupted from the first node to the final node.

## Deployment

- Not committed.
- Not pushed.
- `docs/` not rebuilt.
