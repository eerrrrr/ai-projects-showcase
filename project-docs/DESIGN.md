# Portfolio V2 Design System

Status: **partially filled — /ai only.** These are the real, implemented
values used by `SwissHero.tsx` / `FeaturedCaseSection.tsx` /
`SwissOverview.tsx` / `CaseStudyLayout.tsx` (tokens in
`src/styles/v2/tokens.css`), not Figma-approved values — no Figma frames
exist for this yet, per the build-now decision. If Figma frames get made
later, reconcile this file against them and update; until then this file
is source-of-truth. The 3D gateway at `/` (`GATEWAY_*.md`) is separate and
not covered here.

## Typography

```
Display (hero title):   clamp(32px, 5vw, 56px), 700, letter-spacing -0.02em
Heading (case title):   clamp(28px, 4vw, 44px), 700, letter-spacing -0.015em
Body:                   16-20px, 1.5-1.55 line-height
Caption/eyebrow:        12px, mono, var(--v2-ink-3)
Metadata / mono:        var(--v2-font-mono) — reuses global.css's mono
                         stack, no new font added

Font family: var(--v2-font-ui) = reuses existing --font-ui
  ("Helvetica Neue", Helvetica, Arial, sans-serif) from global.css —
  no new/paid font introduced, per the build brief's typography rule.
```

## Color

```
Background (--v2-paper):        #f4ead9  (warm cream, sampled from the
                                            hero image background)
Surface (--v2-paper-2):         #efe2cd
Ink (--v2-ink):                 #17140f
Ink secondary (--v2-ink-2):     #55503f
Ink tertiary (--v2-ink-3):      #8a8270
Rule (--v2-rule):                #ddd0b8
Accent (--v2-accent):           #c1613a  (restrained terracotta, close to
                                            the Figma Make card's orange —
                                            NOT the saturated ComfyUI blue)
Accent soft (--v2-accent-soft): #f1e0d3
Cardboard (--v2-cardboard):     #b98a5e
Cardboard dark:                 #8b6239

No per-tier or per-actor color-coding implemented this pass — actor
distinction (Script/AI/Human/Output) is label + a subtle background tint
on the "human" stage only (--v2-accent-soft), not a full color system.
```

## Spacing scale

```
xs:      8px
sm:      16px
md:      32px
lg:      64px
xl:      112px (64px on mobile, <=720px)
section: 160px (96px on mobile)
```

## Grid

```
Desktop: 12 columns, 24px gap, max-width 1440px, margin 6vw
Mobile (<=720px): 4 columns, 16px gap, 20px fixed margin
```

## Motion

See `MOTION_SPEC.md` for full detail — summary:

```
Hero parallax:            rotateX <=0.6deg, rotateY <=0.9deg, translate <=3px
Hero parallax transition: 320ms ease-out
Hotspot press feedback:   ~150-200ms, scale(0.97)
Hotspot hover label:      160ms ease
Programmatic scroll:      native scrollIntoView({behavior:'smooth'}),
                           triggered only on deliberate hotspot click
Reduced-motion fallback:  parallax fully disabled (JS gate via
                           useReducedMotion + CSS @media fallback);
                           hotspots remain functional, click still scrolls
```

## Components (implemented this pass)

```
SwissHero            — hero image, 4 hotspots, parallax, mobile numbered
                        links. Renders v2HeroContent (exact approved copy)
                        + heroHotspots.ts data.
FeaturedCaseSection  — substantial inline Featured Proof section. Takes
                        one Project; renders problemHtml/workflowHtml/
                        stages/resultShortHtml + human-review callout +
                        "View full case study" link. Generic, reusable —
                        wired to job-application-filter only this pass.
SwissOverview        — compact tile grid for the remaining 6 projects,
                        ordered by tier/index.
CaseStudyLayout      — full case-study template (Problem/Workflow/Human-
                        review gate/Result/Failure handled/Decision/
                        Limitation/Next project). Wired to
                        job-application-filter only.
```

Not yet built: dedicated ActorLabel/WorkflowStage/EvidenceBlock/MediaBlock
as standalone components — their markup currently lives inline inside
FeaturedCaseSection/CaseStudyLayout. Worth extracting if/when a second
project gets its own full case-study page.

## Visual rules

- Real media leads: the hero photo is the first thing seen, full-bleed.
- Job Screening (Tier 1) gets full inline weight on `/ai`; the other 6
  projects stay compact-tile-only this pass.
- Actor labels (Script/AI/Human/Output) remain visible but secondary;
  only the Human stage gets a background tint callout.
- No popup/modal card pattern anywhere in this V2 work — hotspot click
  always resolves to a same-page scroll, never a popup.
