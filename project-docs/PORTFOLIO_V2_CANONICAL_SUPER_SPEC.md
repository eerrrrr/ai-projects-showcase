# PORTFOLIO V2 — CANONICAL SUPER SPEC
## One conflict-free living specification for Claude Code

**Project:** Erin Wong — AI Workflow Systems Portfolio V2  
**Target route:** `/ai`  
**Working folder:** `D:\ai-test\ai-projects-showcase-v2`  
**Branch:** `redesign/ui-v2`  
**Status:** authoritative living specification  
**Date reconciled:** 2026-08-06  

---

# 0. AUTHORITY, USE AND NON-NEGOTIABLE PROCESS

This document is the **only authoritative specification** for the Portfolio V2 `/ai` rebuild.

It reconciles and supersedes all conflicting instructions contained in:

- `PORTFOLIO_V2_CANONICAL_LIVING_BUILD_PROMPT_V3.md`;
- `PORTFOLIO_V2_CANONICAL_LIVING_BUILD_PROMPT_V3_1.md`;
- `CLAUDE_GATE_1_1_FRAMING_CORRECTION_PROMPT.md`;
- `CLAUDE_HERO_WORKFLOW_CORRECTION_V3_2.md`;
- `PORTFOLIO_V2_CANONICAL_VISUAL_PROTOTYPE_PROMPT_V4.md`;
- earlier Hero mask, card-overlay, clean-plate, 3D, tooltip, Inspector, click-to-pin and scroll prompts;
- later reports that describe implementation values but were never visually approved.

## 0.1 Maintain one living file

Before editing code:

1. Find the current canonical V2 living specification under `project-docs/`.
2. Replace or update that same canonical file with this document.
3. Do **not** create V5, V6, another Gate prompt, a correction prompt, or a report that silently becomes a new specification.
4. Reports may document evidence, but they may not override this file.
5. Every future approved change must update this same living specification in place.

## 0.2 Execute by gates, not by invisible full rebuild

This document contains the complete final system, but implementation remains gated:

```text
Gate 0  Audit and reconcile the actual current code
Gate 1  Hero finalisation
Gate 2  Manifesto + Selected Systems
Gate 3  Reusable rolling chapter engine + System 01
Gate 4  Systems 02–07
Gate 5  Supporting Infrastructure + Closing + full QA
```

After reading this file for the first time, execute **Gate 0 only**, return the audit, and stop.

Do not claim a Gate is complete because code exists or a computed CSS value changed. A visual feature is complete only when its required browser evidence exists.

## 0.3 Evidence labels

Use these exact evidence labels in every audit/report:

```text
VERIFIED IN REAL RECORDING
VERIFIED IN STATIC SCREENSHOT
VERIFIED PROGRAMMATICALLY ONLY
CODE PRESENT, NOT VISUALLY VERIFIED
NOT IMPLEMENTED
REGRESSION
UNKNOWN
```

A computed transform is not motion proof. A settled before/after screenshot is not motion proof. A hidden automation tab whose `requestAnimationFrame` loop is paused cannot verify pointer motion.

## 0.4 No commit, push or deploy

Until the user explicitly approves later:

- do not commit;
- do not push;
- do not deploy;
- do not merge to `main`;
- do not modify GitHub Pages deployment files.

If the development server must be restarted, stop only the process created for this project. Never use:

```text
taskkill /F /IM node.exe
```

---

# 1. SOURCE HIERARCHY

When two sources disagree, use this order.

## 1.1 Visual and interaction authority

1. This canonical super specification.
2. The user’s latest explicit written correction.
3. The approved high-resolution Hero image, natural size `2782 × 1536`.
4. The latest real browser recording and screenshots of the current `/ai` implementation.
5. Reference videos and contact sheets, used for **motion grammar only**, not copied literally.
6. Older prompts and reports, used only to understand why a decision was made.

## 1.2 Content authority

Read in this order:

1. `CONTENT_EXPORT_FOR_REDESIGN_2026-07-26.md`;
2. `SITE_TEXT_DUMP_2026-07-21.md`, when present;
3. `src/data/projects.json`;
4. `src/data/page-content.json`;
5. `src/data/types.ts`;
6. existing V1 components and case-study routes;
7. the old live portfolio: `https://eerrrrr.github.io/ai-projects-showcase/`.

Do not invent missing figures, tool relationships, outcomes, failures or achievements.

## 1.3 Engineering boundaries

Read before implementation:

- `project-docs/REDESIGN_CONTRACT.md`;
- current V2 components and styles;
- existing Hero/proximity/workflow reports;
- current project stage data;
- current routing and V1/V2 switching logic.

The redesign contract remains binding:

- V2 replaces the presentation and visual storytelling layer only;
- verified content and figures are not marketing copy to rewrite;
- tier labels and actor typing remain meaningful data;
- progressive disclosure remains deliberate;
- V1 stays intact and functional.

---

# 2. FINAL CONFLICT RESOLUTION

The following decisions supersede every earlier conflicting version.

| Topic | Final binding decision | Retired alternatives |
|---|---|---|
| Hero image | Two uses of the **same complete Hero image**: low-prominence cover fill behind a sharp complete primary frame | cover-only crop; contain-only flat bars; isolated card PNGs; clean plate; per-card masks |
| Primary image | Exact source ratio, complete and uncropped, sharp, visually dominant | cropping top/bottom card piles; stretching; old low-resolution WebP |
| Background fill | Same full image, `cover`, softly blurred/scaled, visible only as atmospheric extension | flat side bands; obvious second image; broad fog patches; card cut-outs |
| Hero interaction | Pointer proximity, no click required, one shared engine | click-to-pin; project markers; numbered hotspots; permanent labels |
| Scene movement | Camera/attention response applied to the whole sharp scene | independent card lift, rotation, bounce or fake 3D extraction |
| Motion tuning | Default target `scale 1.008`, tune only within `1.006–1.010`; absolute ceiling `1.012`; directional translation normally `2–3px`, absolute ceiling `4px` | imperceptible values accepted without recording; `scale 1.014+`; `7px/5px` shifts |
| Hero title response | scale `1.0015–1.0035`, absolute ceiling `1.004`; translation max `1.5px/1px` | title scale `1.02`; title chasing individual cards |
| Annotation | Verified project usage only, transparent metadata near the selected object | bare tool names; white tooltip box; fixed lower-left Inspector; large project panel |
| Annotation exit | Smooth reversal and complete removal, roughly `260–320ms` | instant disappearance; delayed stale text flash |
| Bottom transition | Short photographic dissolve, effective height `28–40px`, no spacer; mobile `20–28px` | hard seam; 16px line that remains visible; 64px fog plus large dead zone |
| Page flow | Native vertical scroll with page-like sticky handoffs on desktop | mandatory scroll snap; wheel interception; full scroll hijacking |
| Manifesto | Its own full page before the index | Hero directly entering System 01; manifesto mixed with project list |
| Selected Systems | Its own old-site-style ruled index page | generic card grid; first chapter beginning in same viewport |
| Chapters | Full chapter for Systems 01–07 | System 01 detailed while 02–07 remain thin summary rows |
| Workflow | Compact nodes + one stable detail rail + responsive wrapping | paragraph inside every node; permanent horizontal scrollbar; clipped final node |
| Long evidence | “Zip” by progressive disclosure, never delete | full text wall by default; arbitrary copy removal |
| Dependencies | Keep current plain RAF architecture; no new animation/scroll/3D dependency | installing Motion, GSAP, Lenis, Three.js, R3F, Spline or Taste Skill |
| Top navigation | `LINKEDIN ↗`, `GITHUB ↗`, `VISUAL PORTFOLIO ↗` | restoring `SYSTEMS`; restoring `SCROLL TO EXPLORE` |
| Unclear upper-right card | Never call it Codex; preserve current verified registry only | inventing a Codex target or project relationship |

## 2.1 Motion values are visual targets, not success claims

The ranges above are starting values. Tune inside the allowed range only after a real active-browser recording.

Do not solve weak visual hierarchy by increasing global zoom beyond the ceiling. First check:

- whether the transform is applied to the correct layer;
- whether strength is actually changing;
- whether the active tab is visible;
- whether the focus veil is present;
- whether annotation placement makes the selection understandable;
- whether the scene and title transforms are being overridden by an entry animation or `fill-mode`.

---

# 2A. CURRENT VISUAL BASELINE REVIEWED

Use the latest available real recording as the initial audit baseline:

```text
20260806-0723-01.3641245.mp4
27.80 seconds
2482 × 1184
30 fps
```

The contact-sheet review confirms that the current implementation is no longer the earliest one-section prototype, but it is still not a finished rebuild:

- the Hero static composition is substantially cleaner and now reads as one studio field;
- Approach and Selected Systems pages exist;
- System 01 has a large-number/left-rail direction and compact workflow nodes;
- the recording does not prove smooth proximity acquisition, target handoff or annotation exit;
- usage annotation remains visually tiny in the available still proof and needs object-specific placement QA;
- the Hero-to-Approach dissolve and page spacing still require direct review rather than a CSS-value claim;
- the page-like roll between major stages is not clearly demonstrated in the recording;
- System 01 long evidence still risks reading as documentation when expanded by default;
- Systems 02–07 are not proven in the same full chapter depth;
- workflow final-node safety, responsive wrapping and the absence of inner horizontal overflow remain acceptance items.

Do not assume these points remain unchanged. Gate 0 must inspect the actual current code and running browser, but this recording prevents the audit from incorrectly describing the site as the much older pre-Manifesto version.

---

# 3. DESIGN READ

## 3.1 Audience

The primary viewers are:

- recruiters;
- hiring managers;
- creative-technology leads;
- operations and AI-workflow leads;
- design-aware technical reviewers.

Within seconds they must understand:

```text
who Erin is
→ what kind of systems she builds
→ how the systems work
→ where AI assists
→ where a person decides
→ what evidence proves the systems are real
```

## 3.2 Final experience

The portfolio must feel like:

```text
architectural studio
+ tactile object catalogue
+ precise Swiss editorial publication
+ restrained interactive exhibition
+ credible technical evidence
```

It must not feel like:

```text
SaaS dashboard
AI startup template
technical documentation dump
generic bento grid
game menu
children’s collectible-card interface
Behance clone
glassmorphism demo
```

## 3.3 Design dials

These dials are binding art direction, adapted from the useful framework in Taste Skill without installing it:

```text
DESIGN_VARIANCE: 7 / 10
MOTION_INTENSITY: 7 / 10
VISUAL_DENSITY: 4 / 10
```

Interpretation:

- **Variance 7:** asymmetric, editorial and memorable, but aligned to one grid.
- **Motion 7:** clearly alive and spatial, but every motion has a cause.
- **Density 4:** recruiter-readable first glance; complete evidence remains accessible.

## 3.4 Motion grammar learned from the references

Borrow these principles:

1. One organising metaphor: the AI Workflow Starter Pack and surrounding tool piles.
2. Stable context: the object world remains understandable while one target or chapter changes state.
3. Cause-based motion: approach identifies, focus clarifies, scroll advances, disclosure reveals evidence.
4. Camera/page movement before decorative object movement.
5. Two reading modes: spatial cover, then calm editorial evidence.
6. Clear continuation path: ordinary scrolling always works.
7. One motion family: restrained ease-out, no bounce, no elastic overshoot.
8. Object meaning and interaction meaning stay connected.

Do not copy:

- the reference palettes;
- their black UI;
- their exact rooms, pegboards or keyrings;
- their game controls;
- their modal-heavy navigation;
- their full 3D camera systems.

---

# 4. SCOPE AND SAFETY

Work only in:

```text
D:\ai-test\ai-projects-showcase-v2
branch: redesign/ui-v2
route: /ai
```

Preserve:

- frozen V1;
- `main`;
- `backup/ui-v1-2026-08-03`;
- `/`;
- `/architecture`;
- `/about`;
- current case-study routes;
- current content JSON and types;
- verified figures, limitations and honest failure statements;
- tier labels;
- actor typing (`sys`, `ai`, `human`, `out`);
- the current 11 verified Hero targets unless the current registry proves a different count;
- the existing single RAF proximity architecture, smoothstep and hysteresis;
- keyboard and reduced-motion support;
- normal scrolling.

Do not:

- install Taste Skill;
- install Motion, Framer Motion, GSAP, Lenis, Three.js, React Three Fiber or Spline;
- add a second scroll system;
- add mandatory `scroll-snap-type`;
- cancel wheel or trackpad events;
- create clean plates or isolated card assets;
- restore obsolete mask debug images;
- add project-tool mappings that are not verified;
- silently shorten or “improve” verified copy;
- change deployment configuration;
- alter unrelated routes.

---

# 5. FINAL PAGE SEQUENCE

The route remains one normal vertical document, but major sections feel like pages rolling into each other:

```text
00 / COVER
01 / APPROACH
02 / SELECTED SYSTEMS
03 / SYSTEM 01
04 / SYSTEM 02
05 / SYSTEM 03
06 / SYSTEM 04
07 / SYSTEM 05
08 / SYSTEM 06
09 / SYSTEM 07
10 / SUPPORTING INFRASTRUCTURE
11 / CLOSING
```

The URL remains `/ai`. Project destinations use anchors:

```text
/ai#system-01
...
/ai#system-07
```

Do not create eleven new routes.

---

# 6. GLOBAL VISUAL SYSTEM

## 6.1 Colour and material

Use one continuous warm tabletop/editorial world from Hero to footer.

```css
:root {
  --v2-ink: #171512;
  --v2-muted: #6f675f;
  --v2-faint: #91877d;
  --v2-accent: #c75b35;

  --v2-hero-edge-bottom: #dcd3cc;
  --v2-table-light: #f2ece7;
  --v2-table-mid: #ebe4de;
  --v2-paper: #e8e1dc;
  --v2-paper-deep: #ded5ce;

  --v2-rule: rgb(23 21 18 / 0.16);
  --v2-rule-strong: rgb(23 21 18 / 0.34);

  --v2-page-pad: clamp(22px, 4.2vw, 72px);
  --v2-content-max: 1520px;
  --v2-reading-width: 68ch;

  --v2-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --v2-ease-soft: cubic-bezier(0.22, 1, 0.36, 1);
}
```

The page is lighter than the current dark beige implementation:

```css
.v2-page {
  color: var(--v2-ink);
  overflow-x: clip;
  background:
    linear-gradient(
      180deg,
      var(--v2-table-light) 0%,
      var(--v2-table-mid) 22%,
      var(--v2-paper) 58%,
      var(--v2-paper-deep) 100%
    );
}
```

Rules:

- major sections are normally transparent;
- no yellow project rectangle;
- no white horizontal break;
- no green decorative blob;
- no visible outer website frame;
- no rounded chapter container;
- no generic glass or shadow panels;
- no unexplained blank zone above approximately `18vh`;
- intentional full-page negative space is allowed only when it belongs to the composition.

## 6.2 Grid

Use one 12-column grid:

```css
.v2-grid {
  width: min(calc(100% - 2 * var(--v2-page-pad)), var(--v2-content-max));
  margin-inline: auto;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: clamp(12px, 1.5vw, 24px);
}
```

Use deliberate asymmetry, not random offsets.

## 6.3 Typography

Use the existing project/system sans stack. Do not add or distribute font files.

```text
Hero identity
font-size: clamp(64px, 7.8vw, 112px)
font-weight: 700
line-height: 0.84
letter-spacing: -0.055em

Manifesto
font-size: clamp(46px, 6.2vw, 104px)
line-height: 0.92
letter-spacing: -0.045em

Chapter number
font-size: clamp(76px, 10vw, 170px)
line-height: 0.78

Chapter title
font-size: clamp(36px, 4vw, 72px)
line-height: 0.95

Body
font-size: 16–18px desktop
line-height: 1.48–1.6
max-width: 68ch

Metadata
font-size: 10–12px
restrained tracking
```

The project number precedes the title visually and semantically.

---

# 7. PAGE 00 — HERO

## 7.1 Required layer model

Use the same approved Hero image for both photographic layers. This is allowed because it is a complete-scene composition, not a card cut-out.

```text
Hero
├── atmospheric fill image (same full source)
├── exact-ratio primary frame
│   ├── scene-focus layer
│   │   ├── sharp full image
│   │   └── focus veil
│   ├── hotspot layer
│   └── crisp annotation layer
├── identity typography
├── navigation
└── bottom feather
```

Suggested component structure:

```tsx
<section className="v2-hero" aria-labelledby="v2-hero-title">
  <img
    className="v2-hero__fill"
    src={heroSrc}
    alt=""
    aria-hidden="true"
  />

  <div className="v2-hero__primaryFrame">
    <div className="v2-hero__sceneFocus">
      <img className="v2-hero__image" src={heroSrc} alt={heroAlt} />
      <div className="v2-hero__focusVeil" aria-hidden="true" />
    </div>

    <div className="v2-hero__hotspots">...</div>
    <div className="v2-hero__annotations">...</div>
  </div>

  <HeroIdentity />
  <HeroNavigation />
  <div className="v2-hero__bottomFeather" aria-hidden="true" />
</section>
```

## 7.2 Full viewport without destroying the image

A fixed-ratio image cannot simultaneously fill every ratio, show every pixel and leave no extra area. Resolve this with the two-layer composition.

```css
.v2-hero {
  --hero-ratio: 1.8111979167;
  position: relative;
  height: 100svh;
  min-height: 680px;
  overflow: hidden;
  isolation: isolate;
  background: var(--v2-table-light);
}

.v2-hero__fill {
  position: absolute;
  inset: -4%;
  width: 108%;
  height: 108%;
  object-fit: cover;
  transform: scale(1.04);
  filter: blur(20px) saturate(0.86) contrast(0.94);
  opacity: 0.44;
  pointer-events: none;
  user-select: none;
}

.v2-hero__primaryFrame {
  position: absolute;
  z-index: 2;
  left: 50%;
  bottom: 0;
  width: min(100vw, calc(100svh * var(--hero-ratio)));
  aspect-ratio: 2782 / 1536;
  transform: translateX(-50%);
}

.v2-hero__sceneFocus,
.v2-hero__image,
.v2-hero__focusVeil,
.v2-hero__hotspots,
.v2-hero__annotations {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.v2-hero__image {
  display: block;
  object-fit: fill;
  pointer-events: none;
  user-select: none;
}
```

The primary frame has the exact source ratio, so `object-fit: fill` does not distort it. All hotspots use this same coordinate frame.

### Edge continuity

The fill layer must look like atmosphere, not a second scene. The sharp frame stays fully opaque through the meaningful central area.

Only on genuinely wide viewports, soften the outer `1.5–2.5%` of the primary frame so its studio background merges into the fill. Do not fade central cards or top/bottom content.

```css
@media (min-aspect-ratio: 19 / 9) {
  .v2-hero__sceneFocus {
    -webkit-mask-image: linear-gradient(
      90deg,
      transparent 0%,
      #000 2.2%,
      #000 97.8%,
      transparent 100%
    );
    mask-image: linear-gradient(
      90deg,
      transparent 0%,
      #000 2.2%,
      #000 97.8%,
      transparent 100%
    );
  }
}
```

Tune the blur/opacity using screenshots. Reject the result if:

- duplicated cards are visibly readable in the fill;
- side areas look like fog patches;
- a hard vertical seam remains;
- the primary image loses dominance;
- top or bottom piles are cropped.

## 7.3 Hero copy and navigation

Preserve exactly:

```text
ERIN WONG
AI WORKFLOW SYSTEMS
PROCESS THINKING · DATA VISUALIZATION · HUMAN-REVIEWED AI WORKFLOWS
```

Navigation:

```text
LINKEDIN ↗
GITHUB ↗
VISUAL PORTFOLIO ↗
```

Do not restore:

- `SYSTEMS`;
- `SCROLL TO EXPLORE`;
- a scroll arrow replacement;
- project marker numbers;
- a bottom-left project rail.

## 7.4 Hero entry motion

Use block motion, not per-character animation.

```text
scene
opacity 0 → 1
scale 1.006 → 1
duration 760–860ms

ERIN WONG
opacity 0 → 1
translateY 18px → 0
blur 5px → 0
duration 650–760ms

AI WORKFLOW SYSTEMS
delay 90ms
translateY 10px → 0
opacity 0 → 1

secondary line
delay another 70ms
translateY 8px → 0
opacity 0 → 1

navigation
fades last
```

Easing:

```css
cubic-bezier(0.16, 1, 0.3, 1)
```

No bounce or overshoot.

## 7.5 Shared proximity engine

Keep one RAF loop. Do not update React state every frame.

Each target retains:

```ts
type HeroTarget = {
  id: string;
  xPercent: number;
  yPercent: number;
  radiusXPercent: number;
  radiusYPercent: number;
  accessibleLabel: string;
  annotation?: HeroUsageAnnotationData;
};
```

### Distance and strength

Use elliptical distance in the exact primary-frame coordinate system:

```ts
const dx = (pointerX - targetX) / targetRadiusX;
const dy = (pointerY - targetY) / targetRadiusY;
const distance = Math.sqrt(dx * dx + dy * dy);

const raw = 1 - smoothstep(INNER_DISTANCE, OUTER_DISTANCE, distance);
```

Approach begins before the pointer touches the printed card.

Preserve hysteresis:

```ts
const RELEASE_DISTANCE = 1.5;
const SWITCH_RATIO = 0.82;
```

A new nearby target does not replace the current one unless it is meaningfully closer.

### Overshoot-free interpolation

Use time-correct exponential interpolation:

```ts
const alpha = 1 - Math.exp(-response * deltaSeconds);
current += (target - current) * alpha;
```

Use a slower release than acquire for a soft exit, without delayed stale state.

### Final visual range

```text
Default maximum scene scale: 1.008
Permitted tuning range: 1.006–1.010
Absolute ceiling: 1.012

Default directional translation: 2–3px toward the target
Absolute ceiling: 4px per axis

Outer warm dimming: 1.8–2.8%
No hard spotlight circle
No white glow
No local blur patch
```

Use the same active coordinates and strength for:

- scene transform origin;
- scene translation direction;
- radial focus veil;
- annotation reveal;
- title micro-response.

No individual card transform. No rotation. No lift. No bounce.

## 7.6 Hero title micro-response

The identity is alive but remains aligned.

```text
scale range: 1.0015–1.0035
absolute ceiling: 1.004
translation: max 1.5px horizontal / 1px vertical
subtitle opacity: 0.86 → 1
```

Do not use `scale(1.02)`.

Do not make the title chase each card. It may respond to overall focus strength and a very small pointer direction only.

## 7.7 Focus veil

Use one radial gradient centred on the active target:

```css
.v2-hero__focusVeil {
  --focus-x: 50%;
  --focus-y: 50%;
  opacity: var(--focus-strength, 0);
  pointer-events: none;
  background:
    radial-gradient(
      ellipse 28% 24% at var(--focus-x) var(--focus-y),
      rgb(255 250 245 / 0) 0%,
      rgb(255 250 245 / 0) 34%,
      rgb(58 39 27 / 0.008) 66%,
      rgb(58 39 27 / 0.026) 100%
    );
}
```

The selected area is not recoloured. The rest of the scene is only slightly de-emphasised.

## 7.8 Usage-only annotation

The physical card already names the tool. Never display a standalone heading such as:

```text
N8N
FIGMA MAKE
CLAUDE CODE
PYTHON
```

Display verified project usage only:

```text
01 / JOB SCREENING
VALIDATION WORKFLOW
```

or:

```text
USED ACROSS 01 · 03 · 04
```

For multiple verified relationships, show no more than three short rows, then `+1 MORE` if the source supports it.

Decorative/unverified targets may receive camera focus but no annotation.

### Registry data

```ts
type HeroUsageAnnotationData = {
  preferredPlacement: "above" | "right" | "below" | "left";
  offsetXPercent: number;
  offsetYPercent: number;
  align: "start" | "center" | "end";
  rows: Array<{
    number: string;
    title: string;
  }>;
};
```

One generic component handles every tool. No per-tool render branches.

### Placement

- anchor to the target’s rendered screen position;
- use reviewed per-target offsets;
- prefer clean negative space `12–20px` above the card;
- flip to another side if it would hit the image edge, title/nav, box lettering or another important object;
- clamp inside a safe Hero inset;
- keep text outside the scaled scene layer so it stays crisp;
- never cover the physical card;
- never use a fixed page corner.

Typography:

```text
10–11px
medium/semibold
warm dark ink
2–3 short lines maximum
line-height 1.18–1.28
transparent background
```

Do not use:

- white or cream tooltip rectangle;
- rounded background;
- border;
- backdrop blur;
- large shadow;
- large leader line.

A minimal text-shadow halo may be used only when necessary for legibility:

```css
text-shadow:
  0 1px 3px rgb(242 236 231 / 0.9),
  0 0 8px rgb(242 236 231 / 0.65);
```

### Progressive reveal

```text
strength < 0.16
hidden

0.16–0.42
first verified usage row begins to appear

0.42–0.72
remaining supported rows appear

> 0.72
full state
```

Motion:

```text
enter: opacity 0 → 1, translateY 3px → 0, 150–190ms
exit: reverse over 260–320ms
nearby target handoff: old out ~90ms, update, new in ~140ms
```

Cancel pending annotation timers when the target changes. No text flash after dismissal.

### Accessibility

The hotspot’s accessible name contains the tool and usage even though the visual annotation omits the repeated tool name.

Keyboard focus triggers the full usage state. Escape or blur clears it. The annotation must not obscure meaningful content, and no essential information may exist only in the hover annotation.

## 7.9 Bottom transition

The bottom edge must dissolve into the Manifesto without a hard line or a fog band.

```css
.v2-hero__bottomFeather {
  position: absolute;
  z-index: 20;
  left: 0;
  right: 0;
  bottom: -1px;
  height: clamp(28px, 3.5vh, 40px);
  pointer-events: none;
  background:
    linear-gradient(
      to bottom,
      rgb(232 225 220 / 0) 0%,
      rgb(232 225 220 / 0.12) 32%,
      rgb(232 225 220 / 0.52) 72%,
      var(--v2-paper) 100%
    );
}
```

The Manifesto begins immediately after the Hero. Remove redundant Hero bottom padding, spacer elements and excessive Manifesto top padding.

Acceptance:

- no hard horizontal edge;
- no visible blur rectangle;
- no large empty fog band;
- complete Figma and Python piles remain visible;
- the first Manifesto composition begins without dead space.

---

# 8. SHARED TEXT MOTION

Create one reusable reveal system for:

- `ERIN WONG`;
- Hero subtitle blocks;
- small top-left labels such as `01 / APPROACH` and `02 / INDEX`;
- Manifesto lines;
- `Selected systems`;
- every chapter number;
- every chapter title;
- `Supporting infrastructure`;
- the closing statement.

Do not animate every paragraph.

Suggested API:

```tsx
<RevealGroup once stagger={70}>
  <RevealLine>...</RevealLine>
  <RevealLine>...</RevealLine>
</RevealGroup>
```

Entry language:

```text
opacity 0 → 1
translateY 0.5em → 0
optional blur 3px → 0
duration 620–820ms
stagger 60–90ms
easing cubic-bezier(0.16, 1, 0.3, 1)
```

Small metadata labels use a smaller movement and shorter duration:

```text
translateY 6px → 0
opacity 0 → 1
420–560ms
```

Use `IntersectionObserver` for once-per-view entry. Do not create one observer per individual character.

Reduced motion renders content immediately with no translation, scale or blur.

---

# 9. PAGE-BY-PAGE ROLLING ENGINE

## 9.1 Principle

The user scrolls normally. Major pages feel separate because the incoming stage rises and settles while the outgoing stage recedes.

Do not:

- use mandatory scroll snap;
- intercept wheel/trackpad input;
- force `scrollIntoView` during ordinary scrolling;
- add a smooth-scroll library;
- lock the document.

## 9.2 Desktop structure

```tsx
<section ref={rootRef} className="v2-storyPage">
  <div className="v2-storyPage__stage">
    {children}
  </div>
</section>
```

```css
.v2-storyPage {
  position: relative;
  min-height: 125svh;
}

.v2-storyPage__stage {
  position: sticky;
  top: 0;
  min-height: 100svh;
  overflow: clip;
  transform:
    translateY(var(--story-y, 0))
    scale(var(--story-scale, 1));
  opacity: var(--story-opacity, 1);
  transform-origin: center top;
}
```

## 9.3 Scroll progress

Use one passive scroll listener plus RAF for all visible story pages, or one shared manager. Do not create an uncontrolled RAF loop per section.

For each section:

```ts
const progress = clamp(
  -rect.top / Math.max(1, rect.height - window.innerHeight),
  0,
  1,
);

const enter = smoothstep(0.0, 0.22, progress);
const exit = smoothstep(0.72, 1.0, progress);

const yVh = lerp(7, 0, enter) + lerp(0, -4, exit);
const scale = lerp(0.992, 1, enter) * lerp(1, 0.987, exit);
const opacity = lerp(0.35, 1, enter) * lerp(1, 0.72, exit);
```

Write CSS variables directly to the stage:

```ts
stage.style.setProperty("--story-y", `${yVh}vh`);
stage.style.setProperty("--story-scale", scale.toFixed(4));
stage.style.setProperty("--story-opacity", opacity.toFixed(4));
```

Keep the stable middle phase readable. Do not create theatrical zooms.

## 9.4 Progressive enhancement and fallback

Use `position: sticky` and JS variables as the default because the current project already uses JavaScript state and needs precise cross-browser QA.

Do not rely exclusively on CSS scroll-driven animations. They may be added later only as progressive enhancement after the base implementation passes all target browsers.

If JS fails, every stage remains visible in normal document flow.

## 9.5 Mobile/tablet

Below the chosen breakpoint, disable sticky stage transforms:

```css
@media (max-width: 759px), (prefers-reduced-motion: reduce) {
  .v2-storyPage {
    min-height: auto;
  }

  .v2-storyPage__stage {
    position: relative;
    min-height: auto;
    transform: none !important;
    opacity: 1 !important;
    overflow: visible;
  }
}
```

Tablet may reduce the effect or use normal flow when the sticky composition causes clipping.

## 9.6 Active chapter rail

After Selected Systems, show an understated desktop rail:

```text
01
02
03
04
05
06
07
```

- synchronize with the current chapter using `IntersectionObserver`;
- hide on small screens;
- do not add the word `SYSTEMS` to Hero navigation;
- use a short rule/weight change for the active item;
- rail links are keyboard accessible;
- clicking a rail item uses normal anchor navigation and focuses the destination heading.

---

# 10. PAGE 01 — APPROACH / MANIFESTO

This is its own full page before Selected Systems.

Exact text:

```text
Exploring how human judgment
and AI capabilities shape
better ways of researching,
deciding, creating and learning.
```

Layout:

- small animated `01 / APPROACH` label;
- large asymmetric Swiss statement;
- controlled width;
- lighter warm paper surface;
- no rounded card;
- no project list;
- no excessive top blank band;
- final line must not be clipped at the viewport bottom.

Suggested grid:

```text
label: columns 2–3
statement: columns 4–11
```

Motion:

- line-by-line reveal;
- each line moves from `0.55em` below;
- 60–90ms stagger;
- 650–820ms duration;
- outgoing block rises slightly as the index page takes over.

---

# 11. PAGE 02 — SELECTED SYSTEMS

This is its own full page. The first project must not begin halfway through the same viewport.

Header:

```text
02 / INDEX
Selected systems
```

Preserve the tidy ruled list logic from the old site:

```text
01  Job Screening Validation Workflow
    n8n / Notion validation gate / Safe failure

02  Investment Reasoning Learning Database
    Python / SQLite / Source-first

03  Source-to-Figma Data Visualization Pipeline
    Notion / Figma handoff / Human review

04  AI Output Review & Debug Memory System
    Rule-based gate / Phrase scan / Debug memory

05  Method of Loci — automated document-ingestion pipeline
    Python / Gemini AI / SQLite

06  AI-Assisted Video Pipeline — “decide before render”
    ffmpeg / Resolve API / Privacy pass

07  Blender + ComfyUI — controllable AI video on free local models
    Blender / ComfyUI / Wan2.1
```

Derive exact text from the existing content sources rather than maintaining a new duplicate dataset.

## 11.1 Index row design

Each row contains:

```text
number
project title
verified keyword line
arrow
```

Use thin rules. No rounded row background.

Interaction:

- title and keyword line sharpen together on hover/focus;
- arrow translates only `3–5px`;
- rule contrast strengthens slightly;
- no large row shift;
- click/tap jumps to the chapter;
- keyboard focus is visible;
- active chapter can be reflected after the viewer moves into chapters.

Heading and rows use the shared reveal system. Rows may stagger `45–70ms`.

---

# 12. SYSTEM CHAPTER ENGINE — APPLY TO ALL 01–07

Every system receives the same complete chapter depth. Do not retain a compact `SwissOverview` list for Systems 02–07.

## 12.1 Chapter intro composition

Desktop uses a 4:8 grid:

```text
left rail: 4 columns
right workflow field: 8 columns
```

### Left rail

Include:

```text
SYSTEM 01 · FEATURED PROOF
01
Project title
One-line value/outcome
Short workflow summary
Verified tags
READ CASE NOTES →
```

The large number precedes the title.

Keep this rail concise. Do not place the long Problem/Implementation paragraphs here.

### Right workflow field

Show compact workflow nodes and one stable detail rail. Give the field a minimum `32px` internal safe inset. The final node must be fully visible.

## 12.2 Evidence layer

Preserve all supported content:

```text
verified figures
Problem
Implementation / Workflow
Human decision
Result
Limitations / honest failure
supporting evidence
case-notes link
```

Default view shows:

- concise value/outcome;
- workflow;
- most important verified evidence;
- honest failure/limitation when it changes the meaning.

Long evidence is collapsed under semantic disclosure or the existing case-study route.

## 12.3 “Zip the detail” definition

```text
compress the default view
preserve the full evidence
reveal it on demand
```

Do not delete detail.

Use semantic `<details>` / `<summary>` where appropriate:

```tsx
<details className="v2-caseNotes">
  <summary>Read case notes</summary>
  <div className="v2-caseNotes__content">...</div>
</details>
```

Long paragraphs:

```css
max-width: 68ch;
```

No evidence paragraph may run across the full page width.

## 12.4 Tier hierarchy

Preserve the existing editorial tiers:

```text
Systems 01–04: Featured proof
System 05: Supporting system
Systems 06–07: Learning lab
```

All seven still receive full chapters. Tier affects emphasis, not whether a project is reduced to a row.

---

# 13. WORKFLOW DIAGRAM

## 13.1 First-glance node content

Each node shows only:

```text
number
short title
tool
actor
```

Do not place the full explanation in every node.

The active node’s explanation appears in one stable detail rail below the complete workflow.

## 13.2 Sequential reveal

When the workflow enters the viewport:

1. reveal node 01;
2. draw its connector;
3. reveal node 02;
4. continue in sequence;
5. move the active highlight with the reveal;
6. after the last node, settle on node 01;
7. hover/focus takes over immediately;
8. `REPLAY WORKFLOW ↻` restarts the sequence.

Final cadence:

```text
node interval: 380–480ms
node reveal duration: 280–340ms
connector draw: aligned with the same interval
detail transition: 180–240ms
```

Do not reveal all nodes in under one second while the highlight continues cycling for several seconds.

## 13.3 Responsive smart layout

Never use a permanently visible inner horizontal scrollbar.

```text
>= 1440px
one horizontal row only if every node and final safe inset fit

1100–1439px
six-stage workflow: 3 × 2
four/five-stage workflow: layout chosen for readable node width

768–1099px
2-column grid

mobile
one vertical sequence
```

A width adapter may use `ResizeObserver` or container queries already supported by the project. Do not add a dependency.

Requirements:

- minimum `32px` field inset;
- final node fully visible;
- connectors adapt when rows wrap;
- no `overflow: hidden` that cuts nodes;
- no meaning-destroying title truncation;
- no horizontal scrollbar in the final layout;
- detail rail remains below all nodes;
- actor colours remain subtle;
- hover/focus changes active node without layout shift.

## 13.4 Actor language

Preserve data values:

```text
sys
ai
human
out
```

Visual labels may read:

```text
SCRIPT
AI
HUMAN
OUTPUT
```

Human is distinct using the warm accent, not alarm red. Output may use stronger dark contrast.

## 13.5 Keyboard and replay

- every node is a semantic button;
- arrow keys may move between adjacent nodes when implemented correctly;
- Enter/Space selects;
- focus is visible;
- replay is a button;
- reduced motion reveals all nodes immediately and keeps manual node inspection.

---

# 14. SYSTEM CONTENT REQUIREMENTS

Use the old portfolio/local sources as the narrative source of truth. The summaries below are first-level structure only, not permission to discard deeper content.

## System 01 — Job Screening Validation Workflow

```text
Value
Validate inconsistent task records before any Notion write.

Sequence
INTAKE → NORMALIZE → VALIDATE → MAP → HUMAN REVIEW → REPORT

Key story
Input arrives in inconsistent forms.
The workflow normalises and validates it before mapping any Notion payload.
READY, NEEDS_REVIEW and BLOCKED remain honest human-review states.
A live write failure is shown as a safe failure, not fake success.
```

Preserve exact verified figures and all existing Problem, Implementation, Human decision, Result and limitation content from source.

## System 02 — Investment Reasoning Learning Database

```text
Value
Learn reasoning structure, not final opinions.

Sequence
SOURCES → EVIDENCE → REASONING → SKILL REVIEW
```

Preserve verified source counts, traceable facts, written skills, risk logic and human-gated reasoning from source.

## System 03 — Source-to-Figma Data Visualization Pipeline

```text
Value
Turn reviewed sources into visual communication.

Sequence
SOURCES → ANGLE → CONTENT BLOCKS → FIGMA OUTPUT
```

Preserve logged records, batch runs, source-backed content structure, Figma handoff and human approval from source.

## System 04 — AI Output Review & Debug Memory System

```text
Value
Check AI output before reuse.

Sequence
AI OUTPUT → EVIDENCE CHECK → RISK SCAN → DEBUG MEMORY
```

Preserve the independent checks, fixed bug, phrase scan and reusable lesson logic from source.

## System 05 — Method of Loci

```text
Value
Turn saved archives into a searchable offline knowledge base.

Sequence
INBOX → IMPORT → AI EXTRACT → SYNC → DATABASE
```

Preserve verified extracts, posts, assets, hands-off duration and local/searchable architecture from source.

## System 06 — AI-Assisted Video Pipeline

```text
Value
Decide the edit before render.

Sequence
INGEST → PRIVACY → TRIAGE → HUMAN APPROVAL → BUILD → EXPORT
```

Preserve the decide-before-render principle, privacy pass, edit plan, human approval and verified production evidence.

## System 07 — Blender + ComfyUI

```text
Value
Use a 3D control layer to guide local AI video generation.

Sequence
GREYBOX → DEPTH → AI GENERATE → GRADE → FINISH → RELEASE
```

Preserve local-model, controllable-motion, graded-master and content-track evidence from source.

## 14.1 Content mapping audit

Before rendering all chapters, produce a mapping table:

```text
Project id
Title
Tier
Value field
Figure fields
Workflow source
Stage count
Actor types
Problem source
Implementation source
Human-decision source
Result source
Limitation/failure source
Case-study route
```

Any missing source is reported. Do not fill it with generic marketing prose.

---

# 15. SUPPORTING INFRASTRUCTURE

Create a dedicated editorial page for:

```text
Debug Memory Infrastructure
Auto-Typesetting Cover Tool
Finance-style Exception Review
```

For each show:

- category;
- title;
- one-line function;
- one verified proof/detail;
- relationship to the seven systems.

Use a clean three-column or asymmetric editorial composition. No rounded product cards.

Do not restore removed personal/hacker-flavoured infrastructure items unless the current content source explicitly includes them and the user approves.

---

# 16. CLOSING PAGE

Finish deliberately and calmly with the exact verified source/date note from the content source, including the meaning of:

```text
Erin · figures taken from project logs, databases and local files
Code walkthroughs & live demos available on request
```

Do not invent a new date or stronger claim.

---

# 17. RESPONSIVE BEHAVIOUR

Test at minimum:

```text
1920 × 800
1440 × 900
1366 × 768
1280 × 720
921 × 1400
390 × 844
```

## 17.1 Desktop

- Hero fills the viewport through the two-layer visual world;
- complete primary image remains visible;
- title and nav do not collide;
- page-like sticky handoffs work;
- chapter layout is 4:8;
- workflow fits without clipping;
- chapter rail is available.

## 17.2 Medium/tall desktop and tablet

- complete primary image remains visible;
- do not enlarge until side cards disappear;
- title/nav remain readable;
- sticky motion may be reduced;
- chapter grid may stack;
- workflow wraps before clipping;
- no giant close-up crop on `921 × 1400`.

## 17.3 Mobile

- no proximity dependence;
- no pointer camera motion;
- Hero title/subtitle appear first;
- complete Hero image renders in normal flow;
- numbered project index is available;
- chapter pages stack vertically;
- workflow nodes are vertical;
- all evidence remains accessible;
- no horizontal overflow;
- no sticky page transforms that trap or clip content.

Suggested mobile Hero change:

```css
@media (max-width: 759px) {
  .v2-hero {
    height: auto;
    min-height: 0;
    overflow: visible;
  }

  .v2-hero__fill,
  .v2-hero__hotspots,
  .v2-hero__annotations,
  .v2-hero__focusVeil {
    display: none;
  }

  .v2-hero__primaryFrame {
    position: relative;
    left: auto;
    bottom: auto;
    width: 100%;
    transform: none;
  }
}
```

Adapt to the current DOM and preserve title/nav order.

---

# 18. ACCESSIBILITY

Meet these requirements:

- semantic heading order;
- exact alt text for the Hero;
- decorative fill image has empty alt and `aria-hidden`;
- hotspots are buttons with precise accessible names;
- keyboard focus triggers the same usage state;
- Escape/blur clears active Hero state;
- visible focus indicator;
- index rows are links;
- chapter destination heading receives focus after keyboard navigation;
- workflow nodes and replay are keyboard accessible;
- `<details>` summaries are keyboard accessible;
- no essential content exists only on hover;
- no focus is obscured by sticky layers;
- `prefers-reduced-motion` is respected.

## 18.1 Hover/focus annotations

Because hover/focus content can create accessibility problems:

- keep annotations small and non-obscuring;
- place them in negative space;
- include the same information in the hotspot accessible name;
- support Escape for keyboard focus;
- do not require a user to hover the annotation itself to understand essential content;
- do not close keyboard content on a timer.

## 18.2 Reduced motion

Under `prefers-reduced-motion: reduce`:

- remove Hero scene scaling and directional translation;
- remove title micro-scale;
- remove sticky page transforms and cross-page scaling;
- reveal large text immediately or use opacity only;
- reveal workflow nodes immediately;
- preserve annotations on keyboard focus without movement;
- preserve all content and navigation.

---

# 19. PERFORMANCE

- animate primarily `transform` and `opacity`;
- use filter only for brief, small entry blur, not continuous full-page blur animation;
- keep one Hero proximity RAF loop;
- use one shared story-scroll RAF manager;
- use passive pointer and scroll listeners;
- avoid React state updates every frame;
- write CSS custom properties directly;
- batch reads before writes;
- avoid repeated `getBoundingClientRect()` in unbounded pointer loops;
- cache the primary-frame rect and refresh on resize/scroll as needed;
- clean up listeners, timers, observers and RAF handles;
- use `will-change` only on elements that genuinely animate, and remove it when no longer useful;
- lazy-load below-fold media where appropriate;
- do not reduce approved Hero quality;
- do not create giant duplicated DOM content.

Use DevTools performance recording when motion appears rough. Check for layout and paint work instead of guessing.

---

# 20. FILE AND COMPONENT PLAN

Audit actual filenames first. Prefer the existing V2 structure rather than duplicating it.

Expected reusable pieces:

```text
src/components/v2/
  SwissHero.tsx
  HeroUsageAnnotation.tsx
  RevealGroup.tsx
  StoryPage.tsx
  ManifestoPage.tsx
  SelectedSystemsIndex.tsx
  ChapterRail.tsx
  SystemChapter.tsx
  WorkflowDiagram.tsx
  EvidenceDisclosure.tsx
  SupportingInfrastructurePage.tsx
  ClosingPage.tsx

src/data/
  heroToolTargets.ts
  workflowDiagram.ts or current stage adapter

src/styles/v2/
  tokens.css
  hero.css
  reveal.css
  story-pages.css
  selected-systems.css
  system-chapter.css
  workflow-diagram.css
  evidence.css
```

Do not create duplicate components when the current implementation already contains a correct reusable equivalent.

Files that normally remain untouched:

```text
src/data/projects.json
src/data/page-content.json
src/data/types.ts
V1 components
unrelated routes
deployment files
```

A presentation-only field may be added only when the existing sources genuinely cannot express required layout metadata such as reviewed annotation offsets. Do not use presentation fields to rewrite facts.

---

# 21. IMPLEMENTATION GATES

## Gate 0 — audit and canonical reconciliation

Do not edit code.

Return a table with:

```text
Requirement
Canonical requirement
Actual current implementation
Verified running result
Keep
Correct
Source of truth
Status
```

Audit:

1. Hero viewport fill;
2. complete primary image;
3. atmospheric fill;
4. side continuity;
5. bottom feather;
6. dead space before Manifesto;
7. Hero entry motion;
8. subtitle motion;
9. title micro-response;
10. proximity before hover;
11. hysteresis;
12. focus veil;
13. target handoff;
14. target exit;
15. usage-only annotation;
16. annotation offsets for every supported target;
17. decorative targets;
18. keyboard Hero;
19. mobile Hero;
20. reduced motion;
21. Manifesto page;
22. Manifesto reveal;
23. Selected Systems page;
24. ruled index;
25. index interaction;
26. active-section sync;
27. page rolling;
28. chapter rail;
29. System 01 depth;
30. Systems 02–07 depth;
31. 4:8 layout;
32. number before title;
33. concise left rail;
34. final workflow node clipping;
35. workflow overflow;
36. responsive wrapping;
37. sequential nodes;
38. sequential connectors;
39. stable detail rail;
40. replay;
41. zipped detail;
42. old-site content preservation;
43. verified figures;
44. Supporting Infrastructure;
45. Closing;
46. shared title motion;
47. continuous lighter background;
48–53. all required viewports;
54. keyboard;
55. reduced motion;
56. build errors;
57. commit/push/deploy status.

Stop after the audit.

## Gate 1 — Hero finalisation

Implement only:

- two-layer composition;
- exact complete primary frame;
- atmospheric edge fill;
- short bottom feather;
- title/subtitle entry;
- title micro-response;
- shared proximity states;
- usage-only annotation near objects;
- keyboard/mobile/reduced motion.

Provide real evidence and stop.

## Gate 2 — Manifesto + Selected Systems

Implement:

- distinct Approach page;
- distinct ruled Index page;
- shared title motion;
- correct spacing;
- index hover/focus/jump;
- no System 01 in the same viewport as the index composition.

Provide evidence and stop.

## Gate 3 — rolling engine + System 01

Implement:

- reusable StoryPage;
- chapter rail;
- final 4:8 SystemChapter;
- smart workflow layout;
- sequential workflow;
- stable detail rail;
- progressive evidence;
- full System 01 content.

Provide evidence and stop.

## Gate 4 — Systems 02–07

Migrate every supported content field to the approved SystemChapter template. Do not leave summaries.

Provide evidence for at least Systems 02 and 07 plus a content mapping report, then stop.

## Gate 5 — supporting pages and final QA

Implement:

- Supporting Infrastructure;
- Closing;
- cross-page polish;
- all responsive/accessibility/performance corrections;
- final recording and screenshots.

Do not commit, push or deploy.

---

# 22. REQUIRED VISUAL PROOF

Static screenshots alone are insufficient for motion.

Save evidence under one stable folder, for example:

```text
project-docs/screenshots/v2-final/
```

At each Gate provide:

- before screenshot;
- after screenshots at required breakpoints;
- contact sheet;
- real browser recording;
- exact local URL;
- remaining uncertainty.

## 22.1 Gate 1 recording

A visible active browser tab, approximately `15–20s`, showing:

1. load and title entry;
2. pointer approaching Figma Make before direct hover;
3. progressive usage annotation;
4. handoff from Figma Make to n8n;
5. movement to a third verified tool;
6. leaving the target region;
7. complete annotation fade-out;
8. beginning to scroll through the bottom dissolve.

## 22.2 Final recording

Approximately `30–45s`, showing:

- Hero approach across at least three targets;
- smooth disappearance;
- Hero → Approach → Index;
- index interaction and jump;
- System 01 → System 02 page roll;
- workflow sequential reveal;
- hover/focus between workflow nodes;
- evidence disclosure;
- responsive/mobile sample when practical.

If the automation browser becomes hidden and pauses RAF, use a normal visible browser recorder. If recording is technically impossible, provide a deterministic timestamped frame sequence and mark motion unverified. Do not pretend a GIF of settled states proves smoothness.

---

# 23. ACCEPTANCE CHECKLIST

Do not call the rebuild complete until all are true.

## Hero

- [ ] complete primary image visible;
- [ ] viewport filled by the same visual world;
- [ ] no obvious side bars;
- [ ] no duplicated readable background objects;
- [ ] no hard left/right seam;
- [ ] no hard bottom seam;
- [ ] no dead gap before Approach;
- [ ] ERIN WONG entry motion exists;
- [ ] subtitle entry motion exists;
- [ ] title micro-response is restrained and visible in recording;
- [ ] all verified targets respond before direct hover;
- [ ] central targets do not flicker;
- [ ] exit is smooth and complete;
- [ ] annotation is usage-only;
- [ ] annotation is near the object and readable;
- [ ] no fixed-corner Inspector;
- [ ] no tooltip rectangle;
- [ ] no bare tool-name label;
- [ ] no click required;
- [ ] no card cut-out or independent card transform.

## Story pages

- [ ] Approach is a complete independent page;
- [ ] Selected Systems is a complete independent page;
- [ ] chapters feel page-by-page while normal scroll remains;
- [ ] all large titles and top-left labels use the shared reveal language;
- [ ] background is lighter and continuous;
- [ ] no page text is clipped at viewport bottom.

## Chapters

- [ ] number precedes every title;
- [ ] all Systems 01–07 have full chapters;
- [ ] no system is reduced to a thin row;
- [ ] left rail is concise;
- [ ] workflow field does not clip the final node;
- [ ] no inner horizontal scrollbar;
- [ ] nodes and connectors reveal in the same cadence;
- [ ] one stable detail rail;
- [ ] hover/focus has no layout shift;
- [ ] long evidence is compressed, not deleted;
- [ ] old-site content and verified figures remain;
- [ ] limitations and honest failures remain.

## Supporting and closing

- [ ] Supporting Infrastructure is a dedicated editorial page;
- [ ] all three approved infrastructure items are present;
- [ ] Closing uses the verified source/date language;
- [ ] footer remains in the same material world.

## Responsive/accessibility/performance

- [ ] all six viewport tests pass;
- [ ] no horizontal page overflow;
- [ ] mobile content is complete;
- [ ] mobile does not depend on hover;
- [ ] keyboard interaction works;
- [ ] focus is visible and unobscured;
- [ ] reduced motion works;
- [ ] no essential hover-only content;
- [ ] zero TypeScript errors;
- [ ] no new animation/scroll/3D dependency;
- [ ] no unrelated Node process killed;
- [ ] not committed, pushed or deployed.

---

# 24. REQUIRED RETURN FORMAT AFTER EACH GATE

```text
1. Gate name and status
2. What was wrong before
3. What changed
4. Changed files
5. Files intentionally untouched
6. Content sources used
7. Exact local URL
8. Screenshot paths
9. Recording path
10. Desktop behaviour
11. Mobile behaviour
12. Reduced-motion behaviour
13. Keyboard behaviour
14. Evidence labels for every visual claim
15. Remaining known issues
16. Confirmation: not committed, not pushed, not deployed
```

---

# 25. ONLINE RESEARCH BASIS

The implementation rules above were checked against current primary/authoritative references:

1. **High-performance animation:** prefer `transform` and `opacity`; avoid properties that trigger layout/paint; use `will-change` sparingly and verify with DevTools.  
   `https://web.dev/articles/animations-guide`

2. **Intersection Observer:** use it for asynchronous visibility/entry/active-section detection rather than repeatedly measuring every element in unbounded loops. It does not replace exact pixel progress calculations.  
   `https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API`

3. **Reduced motion:** respect the operating-system preference and remove/reduce non-essential interaction and scroll animation while preserving content.  
   `https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion`

4. **Animation from interaction:** users must be able to avoid non-essential motion that can cause distraction or vestibular symptoms.  
   `https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html`

5. **Hover/focus content:** additional content should not obscure the page, should be keyboard-compatible and dismissible where required; essential information must not depend on hover.  
   `https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html`

6. **Taste Skill:** useful principles are design-read first, explicit variance/motion/density dials, anti-default discipline and pre-flight QA. The skill is not installed because its generic defaults and GSAP skeletons are not automatically appropriate for this existing codebase.  
   `https://github.com/Leonxlnx/taste-skill/blob/main/skills/taste-skill/SKILL.md`

7. **Old live portfolio:** used only as the content/story sequence source of truth.  
   `https://eerrrrr.github.io/ai-projects-showcase/`

---

# 26. FIRST EXECUTION INSTRUCTION

After saving this complete file as the existing canonical living specification under `project-docs/`, execute only:

```text
Read project-docs/PORTFOLIO_V2_CANONICAL_SUPER_SPEC.md in full.

Treat it as the only authoritative specification.
Do not merge values from V3, V3.1, V3.2, V4 or later reports.

Perform Gate 0 only.
Audit the actual current /ai code and running browser against every Gate 0 item.
Return the required audit table and proposed file scope.

Do not edit code.
Do not create another spec.
Do not restart the dev server unless it is not running.
Do not commit, push or deploy.
Stop after the audit and wait for review.
```

