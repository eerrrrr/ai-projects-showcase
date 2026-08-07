# Portfolio V2 Motion Spec

Status: **partially filled — `/ai` hero + hotspot motion, implemented and
verified.** Not from Figma (none exists for this yet, per the build-now
decision) — these are the real values shipped in
`src/components/v2/SwissHero.tsx` / `src/styles/v2/hero.css`. Reconcile
against Figma if/when frames exist.

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

## Implemented — `/ai` hero + hotspots

```
Hero whole-image parallax (pointermove-driven):
  rotateX:    <= 0.6deg
  rotateY:    <= 0.9deg
  translate:  <= 3px
  duration:   320ms
  easing:     ease-out
  trigger:    pointermove over the hero frame; resets to 0 on pointerleave
  note:       ONE transform on the whole image — no independent/fake
              per-card movement, no tilting-card illusion

Hotspot hover/focus:
  halo + label fade-in: 160-180ms ease
  no layout shift

Hotspot click (press feedback):
  scale(0.97), ~150-200ms, then releases

Hotspot click → section scroll:
  native scrollIntoView({ behavior: 'smooth', block: 'start' })
  trigger:  ONLY a deliberate click/keyboard-activate on a hotspot or a
            mobile numbered link — never automatic, never scroll-position-
            driven. This is the corrected pattern from this project's own
            history (object = directory, click = brief reaction + scroll,
            never a popup card) and it does not violate the "no
            scrollIntoView-driven forced navigation" V1 rule above, since
            that rule is about scroll *causing* navigation — here a click
            causes scroll, which is the reverse and explicitly approved.

Reduced-motion fallback:
  what changes: parallax fully disabled (both a JS gate via
                 useReducedMotion() and a CSS
                 @media (prefers-reduced-motion: reduce) fallback that
                 forces transform:none as defense in depth)
  what stays:    hotspots remain fully functional (focusable buttons,
                 visible focus ring), click still scrolls to the target
                 (or jumps instantly per the browser's own reduced-motion
                 scroll behavior — no custom override needed)
  verified:      by code inspection (JS conditional + CSS media query both
                 present and correct); NOT live-tested under an actual
                 OS-level reduced-motion toggle — the available Puppeteer
                 tooling in this session doesn't expose CDP media-feature
                 emulation. Worth a manual check in a real browser with
                 "Reduce motion" enabled before calling this fully verified.
```

## Per-component motion notes

```
Navigation:                 no motion, static.
SwissHero:                  see above.
FeaturedCaseSection:        no motion — reads as static text/sequence,
                             consistent with "no long text visible all at
                             once" being handled by page layout/length,
                             not reveal animation, this pass.
SwissOverview:               no motion.
CaseStudyLayout:             no motion.
```
