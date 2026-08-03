# Portfolio V2 Motion Spec

Status: TEMPLATE — fill in from approved Figma motion annotations /
Stitch output once available.

## Principles carried over from V1 (keep unless deliberately revised)

V1 established several hard rules about motion after repeated correction
during development — worth knowing before designing V2 motion, even if
V2 ends up looser or stricter than these:

- No scroll-hijacking beyond a narrow, explicit, user-approved pilot
  (V1's `useSoftPageHandoff` only ever intercepted wheel between two
  specific sections, nowhere else).
- No `scroll-snap`, no `scrollIntoView`-driven forced navigation, no
  `location.hash` auto-expand behavior.
- No workflow step ever gets selected *by* scrolling — step selection is
  always a deliberate click or an explicit "Play" action, never a
  scroll-position side effect.
- Autoplay (the "Play workflow" walkthrough) always respects
  `prefers-reduced-motion` — falls back to instant/no animation.
- Ambient/background motion (if V2 keeps anything like V1's Plasma
  canvas) must never reduce text readability — this was corrected
  multiple times in V1 after review.

## Values to fill in once approved

```
Page load / entrance:
  duration:
  easing:
  stagger (if elements enter in sequence):

Hover / interactive feedback:
  duration:
  easing:

Workflow step transition (active step → next step):
  duration:
  easing:

Section-to-section scroll settle (if any):
  duration:
  easing:
  trigger condition:

Reduced-motion fallback:
  what changes:
  what stays:
```

## Per-component motion notes

```
Navigation:
FeaturedProjectPreview (hover/enter):
WorkflowStage (active/inactive/done state change):
EvidenceBlock (reveal):
CaseNotes (expand/collapse):
```
