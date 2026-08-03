# Portfolio V2 Design System

Status: TEMPLATE — not filled in yet. Fill this in after Figma frames are
approved (see `FIGMA_HANDOFF.md`), using the actual approved values, not
placeholders. This file's job is so a future Claude Code session can
implement V2 components correctly without re-reading every Figma frame
from scratch each time.

## Typography

```
Display:
Heading:
Body:
Caption:
Metadata / mono:
```

## Color

```
Background:
Surface:
Ink (primary text):
Ink (secondary text):
Accent:
Accent (per-tier, if tier gets a color signal):
  Tier 1 (Featured proof):
  Tier 2 (Supporting system):
  Tier 3 (Learning lab):
Actor colors (if the Script/AI/Human/Output distinction stays
color-coded rather than label-only):
  sys:
  ai:
  human:
  out:
```

## Spacing scale

```
xs:
sm:
md:
lg:
xl:
section (vertical rhythm between major sections):
```

## Grid

```
Desktop: columns / max-width / gutter
Tablet:
Mobile:
```

## Motion

See `MOTION_SPEC.md` for full detail — summary values only here:

```
Default duration:
Default easing:
Page-transition duration:
Reduced-motion fallback:
```

## Components

For each, note: what content field(s) it renders, what states it has,
and its responsive behavior at each breakpoint.

```
Navigation
FeaturedProjectPreview
CompactProjectRow
ActorLabel
WorkflowStage
EvidenceBlock
MediaBlock
CaseNotes
Footer
```

## Visual rules (carry over from the brief, keep or revise deliberately)

- Real media leads every featured case.
- Tier 1 receives dominant visual weight; Tier 2/3 stay compact.
- Actor labels (Script/AI/Human/Output) remain visible but secondary.
- No new card pattern introduced without approval.
- Compact content shows by default; expanded case-notes stay behind a
  deliberate reveal, not auto-expanded.
