# PORTFOLIO V2 — Canonical Visual Prototype Build Prompt v4

## Status

This is the **single living specification for the next visual prototype pass** of the `/ai` route.

It supersedes, for this pass only:

- `PORTFOLIO_V2_CANONICAL_LIVING_BUILD_PROMPT_V3.md`
- `PORTFOLIO_V2_CANONICAL_LIVING_BUILD_PROMPT_V3_1.md`
- `CLAUDE_HERO_WORKFLOW_CORRECTION_V3_2.md`
- all earlier one-off Hero, tooltip, workflow-card and scroll prompts

Do not append the older prompts back into the build. Preserve the approved logic recorded below, then implement this document as one coherent system.

This pass is deliberately **visual-first**:

> Build the complete page structure, motion grammar and seven-system prototype so the user can judge the whole experience in a real browser before the final content-editing pass.

Do not commit, push or deploy.

---

# 0. Working location and safety

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
- existing case-study routes;
- `src/data/projects.json`;
- `src/data/page-content.json`;
- `src/data/types.ts`;
- verified project titles, figures, limitations and failure statements;
- the approved high-resolution Hero image;
- the current 11 verified software targets;
- the current plain-RAF proximity engine, smoothstep logic and hysteresis;
- keyboard accessibility;
- the fact that no click is required in the Hero;
- the current Pass H v3.2 Hero framing and side-blend as the baseline;
- the existing project stage data as the only detailed workflow source.

Do not:

- install Taste Skill;
- install Motion, Framer Motion, GSAP, Lenis, Three.js, React Three Fiber or Spline;
- add a second scrolling library;
- add `scroll-snap-type`;
- intercept or cancel wheel/trackpad events;
- create card cut-outs, overlay PNGs, masks for individual cards or a clean plate;
- invent a Codex card;
- invent project-tool relationships;
- rewrite verified facts;
- delete evidence because the page looks long;
- use `taskkill /F /IM node.exe`;
- kill unrelated Node processes;
- change routes;
- commit;
- push;
- deploy.

If a dev server must be restarted, identify and stop only the process started for this project.

---

# 1. Design read

## 1.1 Audience

Primary:

- recruiter;
- hiring manager;
- creative-technology lead;
- operations / AI-workflow lead;
- design-aware technical reviewer.

They need to understand within seconds:

```text
who Erin is
→ what kind of systems she builds
→ how those systems work
→ where AI helps
→ where a person decides
→ what evidence proves the system is real
```

## 1.2 Atmosphere

The interface should feel:

```text
architectural studio
+ editorial systems catalogue
+ tactile physical object world
+ precise Swiss information design
+ restrained interactive exhibition
```

It must not feel like:

```text
SaaS dashboard
AI startup template
technical documentation dump
generic bento grid
game menu
children's collectible-card interface
Behance case-study clone
```

## 1.3 Design dials

Use these values as binding art direction:

```text
DESIGN_VARIANCE: 7 / 10
MOTION_INTENSITY: 7 / 10
VISUAL_DENSITY: 4 / 10
```

Interpretation:

- **Variance 7**: asymmetric and editorial, but still governed by one 12-column grid.
- **Motion 7**: clearly alive and spatial, but every movement has a cause.
- **Density 4**: recruiter-readable; complete evidence exists, but only the relevant layer is visible.

## 1.4 Professional motion grammar extracted from the reference videos

The supplied references consistently work because they use:

1. **One organising metaphor**
   - key set;
   - room;
   - pegboard;
   - object field;
   - editorial catalogue.

2. **Stable context**
   - the whole environment stays understandable;
   - only the current target or chapter changes state.

3. **Cause-based motion**
   - pointer approach identifies;
   - selection focuses;
   - scroll advances;
   - opening a project reveals evidence.

4. **Camera or page movement before decorative object movement**
   - a small camera nudge feels physical;
   - a random floating sticker does not.

5. **Two reading modes**
   - spatial / visual introduction;
   - calm editorial evidence.

6. **A clear return or continuation path**
   - no dead-end modal;
   - no confusing second “Enter” click;
   - ordinary scrolling always remains available.

7. **Consistent motion family**
   - restrained ease-out;
   - no bounce;
   - no elastic overshoot;
   - no unrelated animation style between sections.

Apply those principles to Erin's existing object scene and content. Do not copy the references' rooms, colours or branded visual identities.

---

# 2. Existing implementation truth

The following is already working and must be preserved unless this document explicitly narrows the presentation:

- one real Hero image only;
- no isolated card overlay image;
- one requestAnimationFrame proximity loop;
- smooth distance strength;
- target hysteresis;
- 11 verified tool targets;
- no click-to-pin;
- no Hero project navigation;
- keyboard focus support;
- no permanent markers;
- no `SYSTEMS` Hero-navigation link;
- Hero navigation is:
  - `LINKEDIN ↗`
  - `GITHUB ↗`
  - `VISUAL PORTFOLIO ↗`
- Pass H v3.2 uses height-led image geometry and a photographic left/right blend;
- current proximity visual ceiling is approximately:
  - scene scale `1.006`;
  - directional nudge within approximately `2px`;
  - very small warm focus veil;
- Project 01 already has compact workflow nodes and one shared detail area;
- project stage data remains the source of truth;
- the current build has no extra animation package.

Do not restart the Hero redesign from zero.

---

# 3. The one unavoidable image-geometry rule

The source image has a fixed ratio:

```text
2782 / 1536 = 1.8111979167
```

A fixed-ratio image cannot simultaneously:

```text
show every source pixel
+ fill every possible browser ratio
+ show no surrounding extension
```

The correct professional compromise is already established:

- preserve the complete **vertical** image extent;
- keep the top and bottom source edges;
- keep the full Figma and Python piles;
- centre the height-led source image;
- extend ultra-wide side space with the matched photographic studio field;
- feather the source-image side boundaries;
- allow only expendable far-left/far-right peripheral cropping on narrower screens.

This pass must **not** replace that compromise with `contain` bars or `cover` cropping.

---

# 4. Final page sequence

The `/ai` route remains one normal vertical document.

The user should perceive separate pages, not one continuous text list:

```text
PAGE 00 — HERO / OBJECT FIELD

PAGE 01 — MANIFESTO
Exploring how human judgment...

PAGE 02 — SELECTED SYSTEMS
Old-site-style 01–07 ruled index

PAGE 03 — SYSTEM 01
Job Screening Validation Workflow

PAGE 04 — SYSTEM 02
Investment Reasoning Learning Database

PAGE 05 — SYSTEM 03
Source-to-Figma Data Visualization Pipeline

PAGE 06 — SYSTEM 04
AI Output Review & Debug Memory System

PAGE 07 — SYSTEM 05
Method of Loci

PAGE 08 — SYSTEM 06
AI-Assisted Video Pipeline

PAGE 09 — SYSTEM 07
Blender + ComfyUI

PAGE 10 — SUPPORTING INFRASTRUCTURE

PAGE 11 — CLOSING / CREDIBILITY NOTE
```

The route structure remains:

```text
/ai
/ai#system-01
/ai#system-02
...
/ai#system-07
```

Do not create eleven routes.

---

# 5. One continuous tabletop material world

The complete route must feel like one extended physical surface.

Use the measured Hero edge family as the source of truth. Current confirmed starting values:

```css
:root {
  --v2-ink: #17130f;
  --v2-ink-soft: rgba(23, 19, 15, 0.66);
  --v2-ink-faint: rgba(23, 19, 15, 0.42);

  --v2-studio-top: #eae0d7;
  --v2-table: #dcd3cc;
  --v2-table-soft: #ded5ce;
  --v2-table-deep: #d5cbc4;

  --v2-rule: rgba(78, 58, 43, 0.18);
  --v2-rule-strong: rgba(78, 58, 43, 0.36);
  --v2-accent: #b85d38;

  --v2-page-pad: clamp(24px, 4.2vw, 72px);
  --v2-content-max: 1520px;

  --v2-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --v2-ease-soft: cubic-bezier(0.22, 1, 0.36, 1);
}
```

Measure again only if the current approved PNG changed.

Page surface:

```css
.v2-aiPage {
  position: relative;
  width: 100%;
  min-height: 100%;
  overflow-x: clip;
  color: var(--v2-ink);
  background:
    linear-gradient(
      to bottom,
      var(--v2-studio-top) 0,
      var(--v2-table) 100svh,
      var(--v2-table-soft) 300svh,
      var(--v2-table-deep) 760svh,
      var(--v2-table-soft) 100%
    );
}
```

Rules:

- no opaque section rectangles;
- no pale-yellow project block;
- no white horizontal gap;
- no rounded outer page;
- sections are transparent;
- hierarchy comes from type, rules, spacing and motion;
- the surface extends behind the footer;
- no green decorative blob copied from the prototype recording.

---

# 6. PAGE 00 — Hero narrow correction

## 6.1 Preserve the Pass H v3.2 framing

Do not replace the current height-led source-canvas and side-blend implementation unless a genuine regression is found.

The source canvas remains full-height:

```css
.v2-hero__sourceCanvas {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 50%;
  height: 100%;
  width: auto;
  aspect-ratio: 2782 / 1536;
  transform: translateX(-50%);
  transform-origin: center;
}
```

Keep the broader photographic left/right mask and the matched studio gradients already implemented in Pass H.

Do not:

- use `min(...)` contain geometry;
- show flat side bars;
- use `max(...)` cover geometry;
- crop the bottom piles;
- crop the top loose cards;
- use a blurred duplicate image as side fill.

## 6.2 Very small bottom feather

Add only a narrow transition into PAGE 01.

It must not hide or soften the Figma/Python piles.

```css
.v2-hero::after {
  content: "";
  position: absolute;
  z-index: 30;
  left: 0;
  right: 0;
  bottom: 0;
  height: 16px;
  pointer-events: none;
  background:
    linear-gradient(
      to bottom,
      rgba(220, 211, 204, 0),
      rgba(220, 211, 204, 0.16)
    );
}
```

Maximum height: `18px`.

Do not create a large fog band.

## 6.3 Hero entry

Use the same ease family across image, identity and navigation.

```css
@keyframes v2-hero-scene-in {
  from {
    opacity: 0;
    transform: scale(1.008);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes v2-hero-copy-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

Timing:

```text
scene:     760–860ms
name:      580–680ms
subtitle:  +80ms delay
nav:       +160ms delay
```

No word-by-word title animation.

## 6.4 Proximity behaviour

Preserve the current single RAF engine.

The visual values remain restrained but clearly visible:

```text
scene scale:         1 → 1.006
directional nudge:   maximum ±2px
outer warm veil:     approximately 2–2.5%
title scale:         1 → 1.0025
```

No individual card transform.

No card lift.

No card rotation.

No bounce.

The scene focus, veil and annotation all use the same active-target coordinates and strength.

## 6.5 Slight title response

`ERIN WONG` may breathe with the scene, but it must not move toward a tool.

Update one CSS custom property from the existing RAF loop:

```ts
heroElement.style.setProperty(
  "--hero-focus-strength",
  currentStrength.toFixed(4),
);
```

CSS:

```css
.v2-hero__identity {
  transform-origin: left top;
  transform:
    scale(
      calc(
        1 + var(--hero-focus-strength, 0) * 0.0025
      )
    );
  transition: transform 120ms linear;
}
```

If the RAF already directly writes transforms, use that architecture rather than creating a second loop.

## 6.6 Remove pure tool-name labels

Do not show:

```text
N8N
FIGMA MAKE
CLAUDE CODE
PYTHON
```

The physical card already contains the tool identity.

Only show **verified project usage**.

Examples:

```text
03 / SOURCE-TO-FIGMA
DATA VISUALIZATION PIPELINE
```

```text
01 / JOB SCREENING
VALIDATION WORKFLOW
```

For a tool used in several verified systems:

```text
USED ACROSS 04 SYSTEMS
01 / JOB SCREENING VALIDATION
03 / SOURCE-TO-FIGMA
04 / OUTPUT REVIEW
+1 MORE
```

Do not display more than three project rows beside a card.

Never invent a mapping.

If a target's mapping is not verified, allow the camera-focus response but render no annotation.

## 6.7 Local usage annotation, not corner inspector

Retire the lower-left shared Inspector from visible desktop presentation.

Keep the existing data, but render the current usage annotation near the active card.

The annotation lives in the source-canvas coordinate system but outside the scaled image layer so its text remains crisp:

```tsx
<div className="v2-hero__sourceCanvas">
  <div className="v2-hero__sceneFocus">
    <img ... />
    <div className="v2-hero__veil" />
  </div>

  <div className="v2-hero__hotspotLayer">
    ...
  </div>

  <div className="v2-hero__annotationLayer">
    <HeroUsageAnnotation
      target={activeTarget}
      strength={visualStrength}
    />
  </div>
</div>
```

Target data:

```ts
export type HeroToolTarget = {
  id: string;
  xPercent: number;
  yPercent: number;
  radiusXPercent: number;
  radiusYPercent: number;
  accessibleLabel: string;

  annotation?: {
    offsetXPercent: number;
    offsetYPercent: number;
    align: "start" | "center" | "end";
    usageLead?: string;
    projectRows: Array<{
      number: string;
      title: string;
    }>;
  };
};
```

One generic component handles all tools.

No per-tool rendering branch.

Position:

```tsx
const annotationStyle = {
  "--annotation-x": `${target.xPercent}%`,
  "--annotation-y": `${target.yPercent}%`,
  "--annotation-dx": `${target.annotation.offsetXPercent}%`,
  "--annotation-dy": `${target.annotation.offsetYPercent}%`,
} as React.CSSProperties;
```

```css
.v2-heroUsage {
  position: absolute;
  left: var(--annotation-x);
  top: var(--annotation-y);

  width: min(230px, 17vw);

  transform:
    translate(
      calc(-50% + var(--annotation-dx)),
      calc(-100% + var(--annotation-dy))
    );

  opacity: var(--annotation-opacity, 0);
  pointer-events: none;

  color: var(--v2-ink);
  text-align: left;
}

.v2-heroUsage__lead,
.v2-heroUsage__row {
  display: block;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  text-transform: uppercase;
}

.v2-heroUsage__lead {
  font-size: 9px;
  letter-spacing: 0.07em;
  color: var(--v2-ink-soft);
}

.v2-heroUsage__row {
  margin-top: 4px;
  font-size: clamp(9px, 0.72vw, 11px);
  font-weight: 650;
  line-height: 1.18;
  letter-spacing: 0.025em;
}
```

Do not use:

- white tooltip rectangle;
- rounded tooltip;
- drop-shadow panel;
- large leader line;
- annotation over the box title;
- annotation directly covering the physical card.

## 6.8 Progressive annotation reveal

The annotation must begin before the pointer touches the card.

Use proximity strength:

```text
strength < 0.18:
hidden

0.18–0.45:
first usage row appears

0.45–0.72:
remaining verified rows appear

> 0.72:
full opacity
```

The label reverses smoothly when the pointer moves away.

```css
.v2-heroUsage {
  transition:
    opacity 150ms var(--v2-ease-soft),
    transform 180ms var(--v2-ease-soft);
}

.v2-heroUsage[data-visible="true"] {
  opacity: 1;
}
```

When switching between nearby central tools:

- fade the old annotation out for approximately `90ms`;
- update the text;
- fade the new annotation in for approximately `140ms`;
- preserve the current hysteresis so it does not flash between cards.

No click is required.

---

# 7. PAGE 01 — standalone Manifesto

The manifesto is its own page.

Exact text:

```text
Exploring how human judgment
and AI capabilities shape
better ways of researching,
deciding, creating and learning.
```

Do not place `SELECTED SYSTEMS` on this page.

Do not place a project list on this page.

Do not place a rounded card around the sentence.

Component:

```tsx
export function ManifestoPage() {
  const lines = [
    "Exploring how human judgment",
    "and AI capabilities shape",
    "better ways of researching,",
    "deciding, creating and learning.",
  ];

  return (
    <section
      id="approach"
      className="v2-manifesto v2-storyPage"
      aria-labelledby="v2-manifesto-title"
    >
      <div className="v2-storyPage__stage">
        <div className="v2-manifesto__grid">
          <p className="v2-manifesto__index">01 / APPROACH</p>

          <h2 id="v2-manifesto-title" className="v2-manifesto__statement">
            {lines.map((line, index) => (
              <span
                key={line}
                className="v2-manifesto__line"
                style={{ "--line-index": index } as React.CSSProperties}
              >
                {line}
              </span>
            ))}
          </h2>
        </div>
      </div>
    </section>
  );
}
```

Layout:

```css
.v2-manifesto__grid {
  width: min(100%, var(--v2-content-max));
  height: 100%;
  margin-inline: auto;
  padding: clamp(44px, 7vh, 88px) var(--v2-page-pad);

  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: clamp(16px, 2vw, 32px);
  align-content: center;
}

.v2-manifesto__index {
  grid-column: 1 / span 2;
  margin: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 10px;
  letter-spacing: 0.07em;
  color: var(--v2-ink-soft);
}

.v2-manifesto__statement {
  grid-column: 3 / span 9;
  margin: 0;

  font-size: clamp(44px, 6vw, 94px);
  font-weight: 650;
  line-height: 0.98;
  letter-spacing: -0.052em;
}

.v2-manifesto__line {
  display: block;
}
```

Entry motion, once only:

```css
.v2-manifesto__line {
  opacity: 0;
  transform: translateY(18px);
}

.v2-manifesto.is-visible .v2-manifesto__line {
  animation:
    v2-line-in 620ms var(--v2-ease-out) forwards;
  animation-delay:
    calc(var(--line-index) * 85ms);
}

@keyframes v2-line-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

Do not animate characters individually.

---

# 8. PAGE 02 — old-site-style Selected Systems index

This page returns to the old site's strongest information structure.

It contains:

```text
SELECTED SYSTEMS

01  Job Screening Validation Workflow
    n8n / Notion validation gate / Safe failure

02  Investment Reasoning Learning Database
    Python / SQLite / Source-first

03  Source-to-Figma Data Visualization Pipeline
    Notion / Figma handoff / Human review

04  AI Output Review & Debug Memory System
    Rule-based gate / Phrase scan / Debug memory

05  Method of Loci
    Python / Gemini AI / SQLite

06  AI-Assisted Video Pipeline
    ffmpeg / Resolve API / Privacy pass

07  Blender + ComfyUI
    Blender / ComfyUI / Wan2.1
```

No manifesto paragraph is repeated here.

Component:

```tsx
type SystemIndexItem = {
  number: string;
  title: string;
  signals: string[];
  anchor: string;
};

export function SelectedSystemsIndex({
  systems,
}: {
  systems: SystemIndexItem[];
}) {
  return (
    <section
      id="selected-systems"
      className="v2-systemIndex v2-storyPage"
      aria-labelledby="selected-systems-title"
    >
      <div className="v2-storyPage__stage">
        <div className="v2-systemIndex__inner">
          <header className="v2-systemIndex__header">
            <p>02 / INDEX</p>
            <h2 id="selected-systems-title">Selected systems</h2>
          </header>

          <ol className="v2-systemIndex__list">
            {systems.map((system) => (
              <li key={system.number}>
                <a
                  className="v2-systemIndex__row"
                  href={`#${system.anchor}`}
                >
                  <span className="v2-systemIndex__number">
                    {system.number}
                  </span>

                  <span className="v2-systemIndex__title">
                    {system.title}
                  </span>

                  <span className="v2-systemIndex__signals">
                    {system.signals.join(" / ")}
                  </span>

                  <span className="v2-systemIndex__arrow" aria-hidden="true">
                    ↓
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
```

Styles:

```css
.v2-systemIndex__inner {
  width: min(100%, var(--v2-content-max));
  height: 100%;
  margin-inline: auto;
  padding: clamp(40px, 6vh, 72px) var(--v2-page-pad);

  display: grid;
  grid-template-rows: auto 1fr;
}

.v2-systemIndex__header {
  display: grid;
  grid-template-columns: minmax(64px, 2fr) minmax(0, 10fr);
  gap: clamp(18px, 2vw, 34px);
  align-items: baseline;
  padding-bottom: clamp(28px, 4vh, 48px);
}

.v2-systemIndex__header p {
  margin: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 10px;
  letter-spacing: 0.07em;
  color: var(--v2-ink-soft);
}

.v2-systemIndex__header h2 {
  margin: 0;
  font-size: clamp(42px, 5vw, 78px);
  line-height: 0.95;
  letter-spacing: -0.048em;
}

.v2-systemIndex__list {
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--v2-rule-strong);
}

.v2-systemIndex__row {
  display: grid;
  grid-template-columns:
    minmax(44px, 0.7fr)
    minmax(260px, 5.3fr)
    minmax(260px, 4.8fr)
    minmax(20px, 0.4fr);

  gap: clamp(14px, 2vw, 30px);
  align-items: baseline;

  min-height: clamp(66px, 7.6vh, 94px);
  padding-block: clamp(14px, 1.8vh, 22px);

  border-bottom: 1px solid var(--v2-rule);
  color: inherit;
  text-decoration: none;

  transition:
    color 160ms var(--v2-ease-soft),
    border-color 160ms var(--v2-ease-soft);
}

.v2-systemIndex__number,
.v2-systemIndex__signals,
.v2-systemIndex__arrow {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 10px;
  letter-spacing: 0.045em;
  color: var(--v2-ink-soft);
}

.v2-systemIndex__title {
  font-size: clamp(18px, 1.7vw, 28px);
  line-height: 1.08;
  transition: transform 180ms var(--v2-ease-soft);
}

.v2-systemIndex__row:hover .v2-systemIndex__title,
.v2-systemIndex__row:focus-visible .v2-systemIndex__title {
  transform: translateX(5px);
}

.v2-systemIndex__row:hover,
.v2-systemIndex__row:focus-visible {
  border-color: var(--v2-rule-strong);
}

.v2-systemIndex__row:focus-visible {
  outline: 1px solid var(--v2-ink);
  outline-offset: 4px;
}
```

No rounded project cards.

No thumbnail grid.

No permanent project buttons.

---

# 9. Desktop chapter rail

After PAGE 02, show a restrained right-side chapter navigator on large desktop only.

```text
00
01
02
03
04
05
06
07
```

It is not a navbar box.

It is not visible over the Hero or Manifesto.

It shows the active chapter.

Component:

```tsx
export function ChapterRail({
  activeId,
  systems,
}: {
  activeId: string | null;
  systems: SystemIndexItem[];
}) {
  return (
    <nav
      className="v2-chapterRail"
      aria-label="System chapters"
    >
      {systems.map((system) => (
        <a
          key={system.anchor}
          href={`#${system.anchor}`}
          aria-current={
            activeId === system.anchor ? "location" : undefined
          }
          className="v2-chapterRail__link"
        >
          {system.number}
        </a>
      ))}
    </nav>
  );
}
```

```css
.v2-chapterRail {
  position: fixed;
  z-index: 50;
  top: 50%;
  right: clamp(14px, 1.6vw, 28px);
  translate: 0 -50%;

  display: grid;
  gap: 12px;
}

.v2-chapterRail__link {
  position: relative;
  width: 28px;
  padding-block: 3px;

  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 9px;
  color: var(--v2-ink-faint);
  text-align: right;
  text-decoration: none;
}

.v2-chapterRail__link::before {
  content: "";
  position: absolute;
  top: 50%;
  right: 35px;
  width: 0;
  height: 1px;
  background: var(--v2-ink);
  transition: width 180ms var(--v2-ease-soft);
}

.v2-chapterRail__link[aria-current="location"] {
  color: var(--v2-ink);
}

.v2-chapterRail__link[aria-current="location"]::before {
  width: 18px;
}
```

Hide below `1200px`.

Use IntersectionObserver only to update `activeId`.

Do not use a scroll event for this.

```ts
export function useActiveChapter(ids: string[]) {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((item): item is HTMLElement => Boolean(item));

    const observer = new IntersectionObserver(
      (entries) => {
        const candidates = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top) -
              Math.abs(b.boundingClientRect.top),
          );

        const next = candidates[0]?.target.id;
        if (next) setActiveId(next);
      },
      {
        root: null,
        rootMargin: "-35% 0px -55% 0px",
        threshold: [0, 0.01, 0.2, 0.5],
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}
```

---

# 10. Rolling page structure

The desired effect is:

```text
current chapter is stable
→ user scrolls
→ current chapter recedes slightly
→ next chapter rises from below
→ next chapter becomes stable
```

This is not scroll snap.

This is not wheel hijacking.

This is not one automatic jump per wheel tick.

Use native scrolling plus sticky stages.

## 10.1 Base structure

```tsx
export function StoryPage({
  id,
  className = "",
  children,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`v2-storyPage ${className}`}
    >
      <div className="v2-storyPage__stage">
        {children}
      </div>
    </section>
  );
}
```

```css
.v2-storyPage {
  position: relative;
  min-height: 132svh;
}

.v2-storyPage__stage {
  position: sticky;
  top: 0;
  height: 100svh;
  overflow: clip;
  transform-origin: 50% 42%;
}
```

## 10.2 Scroll-driven enhancement

Use CSS view timelines only as progressive enhancement.

Do not require them for content access.

```css
@supports (animation-timeline: view()) {
  .v2-storyPage {
    view-timeline-name: --v2-page;
    view-timeline-axis: block;
  }

  .v2-storyPage__stage {
    animation-name: v2-page-roll;
    animation-duration: 1ms;
    animation-fill-mode: both;
    animation-timing-function: linear;
    animation-timeline: --v2-page;
    animation-range: entry 0% exit 100%;
  }

  @keyframes v2-page-roll {
    0% {
      opacity: 0.72;
      transform: translateY(8svh) scale(0.992);
    }

    18% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }

    68% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }

    100% {
      opacity: 0.64;
      transform: translateY(-2.4svh) scale(0.985);
    }
  }
}
```

The next section naturally paints over the prior stage because it comes later in the document and shares the same continuous surface.

Do not add a white card behind the stage.

## 10.3 Fallback

When `animation-timeline: view()` is unsupported:

- keep sticky page structure;
- use ordinary scrolling;
- optionally apply a one-time entry reveal using the existing reveal hook or IntersectionObserver;
- do not simulate scroll progress with a high-frequency JavaScript scroll handler.

## 10.4 Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .v2-storyPage {
    min-height: auto;
  }

  .v2-storyPage__stage {
    position: relative;
    top: auto;
    height: auto;
    min-height: 100svh;
    opacity: 1;
    transform: none;
    animation: none !important;
  }
}
```

## 10.5 Mobile

Under `760px`:

```css
.v2-storyPage {
  min-height: auto;
}

.v2-storyPage__stage {
  position: relative;
  top: auto;
  height: auto;
  min-height: 100svh;
  overflow: visible;
  transform: none;
  animation: none;
}
```

Mobile uses ordinary vertical reading.

---

# 11. Reusable system presentation model

Do not create seven separate content implementations.

Create one presentation adapter over existing project data.

```ts
export type SystemPresentation = {
  number: string;
  anchor: string;
  tier: "featured" | "supporting" | "learning";

  title: string;
  value: string;

  sequence: string[];
  signals: string[];

  proofItems: Array<{
    value: string;
    label: string;
  }>;

  humanDecision?: string;
  outcome?: string;
  limitation?: string;
};
```

The presentation adapter may contain approved concise wording, but full evidence and detailed stages continue to come from existing data.

Do not duplicate the long case-study truth into a second JSON file.

---

# 12. Approved first-glance system content

Use this visible layer.

## 12.1 System 01

```text
01
Job Screening Validation Workflow

Validate inconsistent task records before any Notion write.

INTAKE → NORMALIZE → VALIDATE → MAP → HUMAN REVIEW → REPORT

Signals:
n8n / Notion validation gate / Safe failure

Human decision:
Only READY records may proceed; NEEDS_REVIEW and BLOCKED records wait for a person.

Outcome:
Six test records reached three honest review states. The live write failed safely when permission was missing.
```

## 12.2 System 02

```text
02
Investment Reasoning Learning Database

Capture investment reasoning as evidence without copying final opinions.

SOURCE INBOX → EVIDENCE TIER → REASONING → SKILL REVIEW

Signals:
Python / SQLite / Source-first

Human decision:
AI extracts the reasoning structure; the user decides whether it becomes a reusable skill.
```

Do not invent a numeric proof that is not already present in the project data.

## 12.3 System 03

```text
03
Source-to-Figma Data Visualization Pipeline

Turn reviewed sources into structured visual communication.

COLLECT → FIND ANGLE → STRUCTURE → FIGMA OUTPUT

Signals:
Notion / Figma handoff / Human review

Human decision:
A person approves the communication angle and final visual hierarchy.
```

## 12.4 System 04

```text
04
AI Output Review & Debug Memory System

Check AI output, record failures and reuse the lesson.

EXTRACT → CHECK → SCAN → LOG LESSON

Signals:
Rule-based gate / Phrase scan / Debug memory

Human decision:
Automation surfaces risks; a person decides whether the output is safe to reuse.
```

## 12.5 System 05

```text
05
Method of Loci

Convert saved archives into a searchable offline knowledge base.

ZIP INBOX → IMPORT → AI EXTRACT → SYNC → DATABASE

Signals:
Python / Gemini AI / SQLite

Verified proof:
860 AI extracts
175 posts
3.5 months hands-off
```

## 12.6 System 06

```text
06
AI-Assisted Video Pipeline

Approve the edit plan before privacy-sensitive rendering begins.

INGEST → PRIVACY → TRIAGE → HUMAN APPROVAL → BUILD CUT → EXPORT

Signals:
ffmpeg / Resolve API / Privacy pass

Human decision:
Nothing renders until a person approves the privacy pass and edit plan.
```

Use only the verified production count already in project data.

## 12.7 System 07

```text
07
Blender + ComfyUI

Use 3D control to guide local AI video generation.

GREYBOX → DEPTH → GENERATE → GRADE → FINISH → RELEASE

Signals:
Blender / ComfyUI / Wan2.1

Human decision:
The 3D scene defines controllable motion; a person selects, grades and releases the result.
```

Use only the verified content-track / master claims already in project data.

---

# 13. System chapter visual structure

Every system chapter uses:

```text
LEFT 4 COLUMNS
simple old-site-style system summary

RIGHT 8 COLUMNS
compact n8n-like workflow
```

Do not return to:

```text
large heading
+ two long paragraphs
+ six paragraph cards
+ horizontal scrollbar
```

Component skeleton:

```tsx
export function SystemChapter({
  project,
  presentation,
}: {
  project: Project;
  presentation: SystemPresentation;
}) {
  return (
    <section
      id={presentation.anchor}
      className={`v2-systemPage v2-storyPage is-${presentation.tier}`}
      aria-labelledby={`${presentation.anchor}-title`}
    >
      <div className="v2-storyPage__stage">
        <div className="v2-systemPage__grid">
          <SystemSummary
            project={project}
            presentation={presentation}
          />

          <div className="v2-systemPage__workflow">
            <WorkflowDiagram
              stages={project.stages}
              presentation={presentation}
            />
          </div>

          <SystemEvidence
            presentation={presentation}
          />
        </div>
      </div>

      <SystemCaseNotes
        project={project}
        presentation={presentation}
      />
    </section>
  );
}
```

## 13.1 Chapter grid

```css
.v2-systemPage__grid {
  width: min(100%, var(--v2-content-max));
  height: 100%;
  margin-inline: auto;
  padding:
    clamp(40px, 6vh, 72px)
    var(--v2-page-pad)
    clamp(30px, 5vh, 58px);

  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-template-rows: minmax(0, 1fr) auto;
  column-gap: clamp(16px, 2vw, 30px);
  row-gap: clamp(24px, 4vh, 44px);
}

.v2-systemSummary {
  grid-column: 1 / span 4;
  grid-row: 1;
  align-self: center;
}

.v2-systemPage__workflow {
  grid-column: 5 / span 8;
  grid-row: 1;
  align-self: center;
  min-width: 0;
}

.v2-systemEvidence {
  grid-column: 1 / -1;
  grid-row: 2;
}
```

At widths under `1120px`:

```css
.v2-systemPage__grid {
  grid-template-rows: auto 1fr auto;
}

.v2-systemSummary {
  grid-column: 1 / -1;
  grid-row: 1;
  display: grid;
  grid-template-columns: minmax(120px, 2fr) minmax(0, 10fr);
  gap: 24px;
}

.v2-systemPage__workflow {
  grid-column: 1 / -1;
  grid-row: 2;
}

.v2-systemEvidence {
  grid-row: 3;
}
```

## 13.2 Left summary

```tsx
export function SystemSummary({
  project,
  presentation,
}: {
  project: Project;
  presentation: SystemPresentation;
}) {
  return (
    <header className="v2-systemSummary">
      <div className="v2-systemSummary__numberBlock">
        <p className="v2-systemSummary__number">
          {presentation.number}
        </p>

        <p className="v2-systemSummary__tier">
          {presentation.tier === "featured"
            ? "Featured proof"
            : presentation.tier === "supporting"
              ? "Supporting system"
              : "Learning lab"}
        </p>
      </div>

      <div className="v2-systemSummary__body">
        <h2 id={`${presentation.anchor}-title`}>
          {presentation.title}
        </h2>

        <p className="v2-systemSummary__value">
          {presentation.value}
        </p>

        <p className="v2-systemSummary__sequence">
          {presentation.sequence.join(" → ")}
        </p>

        <p className="v2-systemSummary__signals">
          {presentation.signals.join(" · ")}
        </p>

        <div className="v2-systemSummary__actions">
          <button
            type="button"
            className="v2-textAction"
            data-replay-workflow
          >
            Replay workflow ↻
          </button>

          {project.caseStudyPath ? (
            <a
              className="v2-textAction"
              href={project.caseStudyPath}
            >
              Read case notes ↓
            </a>
          ) : null}
        </div>
      </div>
    </header>
  );
}
```

Styles:

```css
.v2-systemSummary__number {
  margin: 0;
  font-size: clamp(72px, 8vw, 132px);
  font-weight: 650;
  line-height: 0.78;
  letter-spacing: -0.075em;
}

.v2-systemSummary__tier {
  margin: 16px 0 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 9px;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--v2-ink-soft);
}

.v2-systemSummary h2 {
  max-width: 12ch;
  margin: clamp(24px, 4vh, 46px) 0 0;
  font-size: clamp(32px, 3.8vw, 62px);
  font-weight: 650;
  line-height: 0.96;
  letter-spacing: -0.045em;
}

.v2-systemSummary__value {
  max-width: 34ch;
  margin: 22px 0 0;
  font-size: clamp(16px, 1.35vw, 21px);
  line-height: 1.35;
  color: var(--v2-ink-soft);
}

.v2-systemSummary__sequence {
  max-width: 38ch;
  margin: 26px 0 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 10px;
  line-height: 1.55;
  letter-spacing: 0.045em;
  text-transform: uppercase;
}

.v2-systemSummary__signals {
  max-width: 38ch;
  margin: 18px 0 0;
  font-size: 11px;
  line-height: 1.5;
  color: var(--v2-ink-soft);
}

.v2-systemSummary__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 22px;
  margin-top: 30px;
}

.v2-textAction {
  appearance: none;
  border: 0;
  border-bottom: 1px solid var(--v2-rule-strong);
  padding: 0 0 5px;
  background: transparent;
  color: inherit;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 10px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
}
```

Do not use pill tags.

Do not use a large green button.

---

# 14. Workflow diagram

## 14.1 First-glance node content

Each visible node shows only:

```text
01
INTAKE
n8n
SCRIPT
```

or:

```text
05
HUMAN REVIEW
Decision gate
HUMAN
```

The paragraph belongs in one shared detail area.

## 14.2 View adapter

Derive this from the existing detailed stage data:

```ts
export type WorkflowStageView = {
  number: string;
  shortTitle: string;
  actor: "script" | "ai" | "human" | "output" | "3d";
  tool?: string;
  microOutcome: string;
  fullDescription: string;
};
```

Do not create a new detailed truth source.

## 14.3 Component skeleton

```tsx
export function WorkflowDiagram({
  stages,
  presentation,
}: {
  stages: ProjectStage[];
  presentation: SystemPresentation;
}) {
  const views = React.useMemo(
    () => createWorkflowStageViews(stages, presentation),
    [stages, presentation],
  );

  const {
    rootRef,
    activeIndex,
    setActiveIndex,
    playedCount,
    replay,
  } = useWorkflowPlayback(views.length);

  const activeStage = views[activeIndex] ?? views[0];

  return (
    <section
      ref={rootRef}
      className="v2-workflow"
      aria-label={`${presentation.title} workflow`}
    >
      <header className="v2-workflow__header">
        <p>How it works</p>
        <p>
          {views.length} stages
          {views.some((stage) => stage.actor === "human")
            ? " · human decision"
            : ""}
        </p>
      </header>

      <div
        className="v2-workflow__track"
        style={
          {
            "--stage-count": views.length,
          } as React.CSSProperties
        }
      >
        {views.map((stage, index) => (
          <React.Fragment key={stage.number}>
            <button
              type="button"
              className="v2-workflowNode"
              data-visible={index < playedCount}
              data-active={index === activeIndex}
              data-actor={stage.actor}
              aria-expanded={index === activeIndex}
              onPointerEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
            >
              <span className="v2-workflowNode__number">
                {stage.number}
              </span>

              <span className="v2-workflowNode__title">
                {stage.shortTitle}
              </span>

              <span className="v2-workflowNode__meta">
                {stage.tool ?? stage.actor}
              </span>

              <span className="v2-workflowNode__actor">
                {stage.actor}
              </span>
            </button>

            {index < views.length - 1 ? (
              <span
                className="v2-workflowConnector"
                data-visible={index + 1 < playedCount}
                aria-hidden="true"
              />
            ) : null}
          </React.Fragment>
        ))}
      </div>

      <div
        className="v2-workflow__detail"
        aria-live="polite"
      >
        <p className="v2-workflow__detailIndex">
          {activeStage.number} / {activeStage.shortTitle}
        </p>

        <p
          key={`${presentation.number}-${activeStage.number}`}
          className="v2-workflow__detailText"
        >
          {activeStage.fullDescription}
        </p>
      </div>

      <button
        type="button"
        className="v2-workflow__replay"
        onClick={replay}
      >
        Replay workflow ↻
      </button>
    </section>
  );
}
```

## 14.4 Playback hook

No animation dependency.

Use one controlled timer chain per visible workflow and clean it up.

```ts
export function useWorkflowPlayback(stageCount: number) {
  const reducedMotion = usePrefersReducedMotion();

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [playedCount, setPlayedCount] = React.useState(
    reducedMotion ? stageCount : 0,
  );

  const rootRef = React.useRef<HTMLElement | null>(null);
  const timersRef = React.useRef<number[]>([]);
  const hasPlayedRef = React.useRef(false);

  const clearTimers = React.useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const run = React.useCallback(() => {
    clearTimers();

    if (reducedMotion) {
      setPlayedCount(stageCount);
      setActiveIndex(0);
      return;
    }

    setPlayedCount(0);
    setActiveIndex(0);

    for (let index = 0; index < stageCount; index += 1) {
      const timer = window.setTimeout(() => {
        setPlayedCount(index + 1);
        setActiveIndex(index);
      }, 140 + index * 180);

      timersRef.current.push(timer);
    }

    const settleTimer = window.setTimeout(() => {
      setActiveIndex(0);
    }, 140 + stageCount * 180 + 420);

    timersRef.current.push(settleTimer);
  }, [clearTimers, reducedMotion, stageCount]);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || hasPlayedRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasPlayedRef.current) return;

        hasPlayedRef.current = true;
        run();
        observer.disconnect();
      },
      {
        rootMargin: "-18% 0px -22% 0px",
        threshold: 0.18,
      },
    );

    observer.observe(root);

    return () => {
      observer.disconnect();
      clearTimers();
    };
  }, [clearTimers, run]);

  const replay = React.useCallback(() => {
    hasPlayedRef.current = true;
    run();
  }, [run]);

  return {
    rootRef,
    activeIndex,
    setActiveIndex,
    playedCount,
    replay,
  };
}
```

Integrate `rootRef` into the workflow root.

Do not autoplay infinitely.

## 14.5 Workflow styles

```css
.v2-workflow {
  position: relative;
  min-width: 0;
}

.v2-workflow__header {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--v2-rule-strong);
}

.v2-workflow__header p {
  margin: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 9px;
  letter-spacing: 0.065em;
  text-transform: uppercase;
  color: var(--v2-ink-soft);
}

.v2-workflow__track {
  display: flex;
  align-items: center;
  min-width: 0;
  padding-block: clamp(30px, 5vh, 54px);
}

.v2-workflowNode {
  flex: 1 1 0;
}

.v2-workflowConnector {
  flex: 0 0 clamp(10px, 1.8vw, 28px);
}

.v2-workflowNode {
  position: relative;
  min-width: 0;
  min-height: 112px;
  padding: 14px 14px 12px;

  border: 1px solid var(--v2-rule);
  background: rgba(255, 255, 255, 0.055);
  color: inherit;
  text-align: left;

  opacity: 0;
  transform: translateY(10px) scale(0.985);

  transition:
    opacity 360ms var(--v2-ease-out),
    transform 420ms var(--v2-ease-out),
    border-color 160ms var(--v2-ease-soft),
    background 160ms var(--v2-ease-soft);
}

.v2-workflowNode[data-visible="true"] {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.v2-workflowNode[data-active="true"] {
  z-index: 2;
  border-color: var(--v2-accent);
  background: rgba(255, 255, 255, 0.16);
}

.v2-workflowNode[data-actor="human"] {
  border-style: dashed;
}

.v2-workflowNode__number,
.v2-workflowNode__meta,
.v2-workflowNode__actor {
  display: block;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 9px;
  line-height: 1.2;
  letter-spacing: 0.045em;
  text-transform: uppercase;
  color: var(--v2-ink-soft);
}

.v2-workflowNode__title {
  display: block;
  margin-top: 20px;
  max-width: 12ch;
  font-size: clamp(13px, 1.15vw, 17px);
  font-weight: 700;
  line-height: 1.06;
}

.v2-workflowNode__meta {
  margin-top: 12px;
}

.v2-workflowNode__actor {
  margin-top: 4px;
}

.v2-workflowNode[data-actor="human"]
  .v2-workflowNode__actor {
  color: var(--v2-accent);
}

.v2-workflowConnector {
  display: block;
  height: 1px;
  background: var(--v2-rule-strong);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 340ms var(--v2-ease-out);
}

.v2-workflowConnector[data-visible="true"] {
  transform: scaleX(1);
}

.v2-workflow__detail {
  display: grid;
  grid-template-columns: minmax(90px, 1.5fr) minmax(0, 6.5fr);
  gap: 24px;
  min-height: 116px;
  padding-top: 20px;
  border-top: 1px solid var(--v2-rule);
}

.v2-workflow__detailIndex {
  margin: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 9px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--v2-ink-soft);
}

.v2-workflow__detailText {
  max-width: 680px;
  margin: 0;
  font-size: clamp(15px, 1.25vw, 20px);
  line-height: 1.42;
  animation: v2-detail-in 180ms var(--v2-ease-soft);
}

@keyframes v2-detail-in {
  from {
    opacity: 0;
    transform: translateY(3px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.v2-workflow__replay {
  margin-top: 16px;
  border: 0;
  border-bottom: 1px solid var(--v2-rule-strong);
  padding: 0 0 4px;
  background: transparent;
  color: var(--v2-ink-soft);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 9px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
```

The track must not create a horizontal scrollbar.

At `1120px`, the summary moves above and the workflow gains full width.

At mobile, use a vertical track.

---

# 15. Evidence strip

Every chapter ends with a concise proof / decision / outcome line.

Maximum three items.

```tsx
export function SystemEvidence({
  presentation,
}: {
  presentation: SystemPresentation;
}) {
  const items = [
    ...presentation.proofItems,
    presentation.humanDecision
      ? {
          value: "Human decision",
          label: presentation.humanDecision,
        }
      : null,
    presentation.outcome
      ? {
          value: "Outcome",
          label: presentation.outcome,
        }
      : null,
  ]
    .filter(Boolean)
    .slice(0, 3);

  return (
    <dl className="v2-systemEvidence">
      {items.map((item) => (
        <div
          className="v2-systemEvidence__item"
          key={`${item.value}-${item.label}`}
        >
          <dt>{item.value}</dt>
          <dd>{item.label}</dd>
        </div>
      ))}
    </dl>
  );
}
```

```css
.v2-systemEvidence {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 0;
  border-top: 1px solid var(--v2-rule-strong);
}

.v2-systemEvidence__item {
  min-height: 104px;
  padding: 16px 18px 12px 0;
}

.v2-systemEvidence__item + .v2-systemEvidence__item {
  padding-left: 18px;
  border-left: 1px solid var(--v2-rule);
}

.v2-systemEvidence dt {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 9px;
  letter-spacing: 0.065em;
  text-transform: uppercase;
  color: var(--v2-ink-soft);
}

.v2-systemEvidence dd {
  max-width: 38ch;
  margin: 10px 0 0;
  font-size: clamp(13px, 1.05vw, 17px);
  line-height: 1.36;
}
```

Do not add a paragraph below every number if the label is already sufficient.

---

# 16. Complete evidence and case notes

Do not delete detailed content.

First-glance chapter:

```text
number
title
one-line value
short sequence
signals
compact workflow
human decision
outcome
```

Deep evidence:

- existing full case-study route where available;
- otherwise a native `<details>` following the sticky stage.

```tsx
export function SystemCaseNotes({
  project,
}: {
  project: Project;
}) {
  if (project.caseStudyPath) return null;

  return (
    <details className="v2-caseNotes">
      <summary>Open full case notes</summary>
      <FullProjectEvidence project={project} />
    </details>
  );
}
```

Opening case notes must return the page to ordinary document flow around that content. Do not trap the notes inside a 100svh overflow container.

---

# 17. Supporting infrastructure page

One final ruled page after System 07:

```text
SUPPORTING INFRASTRUCTURE

Debug Memory Infrastructure
Records bugs, lessons and checks for future reuse.
Dry-run by default

Auto-Typesetting Cover Tool
Turns structured text into exportable poster and cover layouts.
PNG · SVG · JSON

Finance-style Exception Review
Tests source → classify → human-review logic on a mock invoice dataset.
8 mock invoices · 6 exception types · 0 auto-resolved
```

Use a table-like editorial list, not three dashboard cards.

---

# 18. Closing page

Closing copy:

```text
Erin Wong
AI workflow systems

Figures are taken from project logs,
databases and local files.

Code walkthroughs and live demos
available on request.
```

Keep it inside the same surface family.

No unrelated CTA banner.

No newsletter.

No contact-form card.

---

# 19. Responsive behaviour

## Desktop ≥ 1200px

- full-height Hero;
- all 11 verified tool targets;
- local usage annotations;
- Manifesto full page;
- full ruled index;
- right-side chapter rail;
- sticky rolling chapters;
- 4/8 chapter grid;
- horizontal workflow nodes.

## Medium 760–1199px

- preserve Hero vertical extent;
- side blend remains;
- title reduces smoothly;
- chapter rail hidden;
- chapter summary moves above workflow under `1120px`;
- workflow uses full content width;
- no horizontal scrollbar.

## Mobile < 760px

Hero:

- static image;
- no pointer proximity;
- no floating usage annotation;
- retain accessible numbered project links;
- title first;
- image below;
- full image art-directed for portrait.

Manifesto:

- normal flow;
- statement remains large but readable.

Index:

- number;
- title;
- signals below;
- thin rules.

Chapters:

- no sticky rolling effect;
- ordinary vertical flow;
- large number;
- summary;
- vertical workflow;
- shared detail below active node;
- evidence items stacked.

```css
@media (max-width: 759px) {
  .v2-systemIndex__row {
    grid-template-columns: 38px minmax(0, 1fr);
  }

  .v2-systemIndex__signals {
    grid-column: 2;
  }

  .v2-systemIndex__arrow {
    display: none;
  }

  .v2-systemPage__grid {
    height: auto;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    padding-block: 48px;
  }

  .v2-systemSummary,
  .v2-systemPage__workflow,
  .v2-systemEvidence {
    grid-column: 1;
    grid-row: auto;
  }

  .v2-workflow__track {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0;
  }

  .v2-workflowConnector {
    width: 1px;
    height: 24px;
    margin-left: 24px;
    transform: scaleY(0);
    transform-origin: top center;
  }

  .v2-workflowConnector[data-visible="true"] {
    transform: scaleY(1);
  }

  .v2-systemEvidence {
    grid-template-columns: 1fr;
  }

  .v2-systemEvidence__item + .v2-systemEvidence__item {
    padding-left: 0;
    border-left: 0;
    border-top: 1px solid var(--v2-rule);
  }
}
```

---

# 20. Accessibility

Required:

- semantic headings in document order;
- Hero hotspots are focusable controls with descriptive accessible names;
- focus reveals the same usage information as pointer proximity;
- index rows are anchors;
- active chapter rail uses `aria-current="location"`;
- workflow nodes are buttons;
- active workflow detail uses `aria-live="polite"`;
- replay is a real button;
- reduced motion preserves all information;
- no information is pointer-only;
- focus ring is visible;
- anchor destinations use `scroll-margin-top`.

```css
[id^="system-"] {
  scroll-margin-top: 16px;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
  }

  .v2-hero__sceneFocus,
  .v2-heroUsage,
  .v2-storyPage__stage,
  .v2-workflowNode,
  .v2-workflowConnector {
    animation: none !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

# 21. Performance

- one Hero image;
- no duplicate scene image;
- no card overlay files;
- one Hero RAF loop;
- no React render on every raw pointer event;
- React state changes only when target identity changes;
- IntersectionObserver for:
  - active chapter;
  - one-time workflow play;
  - one-time manifesto reveal;
- CSS transforms and opacity only for rolling movement;
- no direct `window.addEventListener("scroll", ...)` for animation;
- no wheel interception;
- lazy-load lower project media;
- do not lazy-load the Hero image;
- cancel all timers and observers;
- no animation package installation.

Do not add `content-visibility: auto` to sticky chapter wrappers until anchor and sticky behaviour is verified, because browser containment can interfere with sticky positioning.

---

# 22. Files and component structure

Inspect existing names first and reuse current components where possible.

Recommended:

```text
src/
├── components/
│   └── v2/
│       ├── SwissHero.tsx
│       ├── HeroUsageAnnotation.tsx
│       ├── ManifestoPage.tsx
│       ├── SelectedSystemsIndex.tsx
│       ├── ChapterRail.tsx
│       ├── StoryPage.tsx
│       ├── SystemChapter.tsx
│       ├── SystemSummary.tsx
│       ├── SystemEvidence.tsx
│       ├── WorkflowDiagram.tsx
│       └── SystemCaseNotes.tsx
├── data/
│   ├── projects.json
│   ├── heroToolTargets.ts
│   └── systemPresentation.ts
├── hooks/
│   ├── useActiveChapter.ts
│   ├── useWorkflowPlayback.ts
│   └── usePrefersReducedMotion.ts
└── styles/
    └── v2/
        ├── tokens.css
        ├── hero.css
        ├── story-pages.css
        ├── system-index.css
        ├── system-chapter.css
        └── workflow.css
```

Do not duplicate a component that already exists under a slightly different name. Refactor the current implementation.

---

# 23. Implementation order

This is one visual prototype pass, but perform it in this internal order:

## Step 1 — Snapshot current state

Record:

- current changed files;
- current local URL;
- current Hero target count;
- current build result.

Do not commit.

## Step 2 — Narrow Hero refinement

Only:

- bottom feather;
- title micro-scale;
- usage-only annotation near target;
- all verified tool targets use one generic annotation component;
- no lower-left visible Inspector;
- no geometry restart.

Run Hero manually before continuing.

## Step 3 — Build Manifesto page

Confirm it is visually independent.

## Step 4 — Build Selected Systems index

Use the exact old-site titles and signals.

## Step 5 — Build reusable rolling page shell

Test:

- Hero → Manifesto;
- Manifesto → Index;
- Index → one empty chapter shell.

Confirm ordinary scrolling remains native.

## Step 6 — Build reusable SystemChapter

Connect Project 01 first to confirm the 4/8 composition.

## Step 7 — Generalise 01–07

Render all seven systems from existing project data plus the presentation adapter.

Do not hand-code seven unrelated pages.

## Step 8 — Workflow system

Generalise the compact node component and playback to every system.

## Step 9 — Supporting infrastructure and closing

## Step 10 — QA and stop

Do not begin the final copy-editing pass.

The purpose is to judge the complete visual and motion system first.

---

# 24. Visual acceptance checklist

## Hero

1. Hero touches the complete viewport.
2. No white outer frame.
3. No flat side bars.
4. Top and bottom source extents remain.
5. Figma and Python piles remain complete.
6. No blurred duplicate scene.
7. No permanent markers.
8. No `SCROLL TO EXPLORE`.
9. No pure tool-name label.
10. Usage annotation appears near the current card.
11. Annotation begins before pointer reaches the card.
12. Annotation fades away smoothly.
13. No click is required.
14. All 11 verified targets share one interaction engine.
15. Blank cards remain inert.
16. `ERIN WONG` responds only with a tiny scale.
17. No central-card flicker.

## Page sequence

18. Hero is followed by an independent Manifesto page.
19. Manifesto is followed by an independent Selected Systems page.
20. Selected Systems uses a ruled old-site-style list.
21. The seven systems are not presented as one plain document list.
22. Each project feels like a page.
23. The next project rises while the prior project recedes.
24. Wheel and trackpad remain native.
25. No scroll snap.
26. No hijacking.

## System chapters

27. Project number is a major visual element.
28. Left summary remains concise.
29. Right workflow is immediately understandable.
30. No paragraph inside every node.
31. Only one node detail is expanded.
32. No horizontal scrollbar.
33. Nodes reveal one by one.
34. Connectors reveal in sequence.
35. Hover/focus changes active node without layout shift.
36. Full evidence remains available.
37. All seven systems render.
38. Tier hierarchy remains.
39. Verified figures are unchanged.

## Material and Swiss layout

40. One tabletop surface continues to the footer.
41. No sudden yellow/white section.
42. One 12-column system governs alignment.
43. Type is flush-left and readable.
44. Asymmetry feels deliberate, not random.
45. Thin rules organise the page.
46. No dashboard cards.
47. No pill cloud.
48. No generic bento grid.

## Responsive and accessibility

49. 1440 × 900 works.
50. 1366 × 768 works.
51. 1280 × 720 works.
52. 390 × 844 works.
53. Mobile has no horizontal overflow.
54. Mobile does not depend on pointer hover.
55. Keyboard reveals Hero usage.
56. Keyboard operates workflow nodes.
57. Reduced motion preserves content.
58. Build has zero TypeScript errors.

---

# 25. Required deliverables

After implementation, return:

1. exact localhost `/ai` URL;
2. changed files;
3. files intentionally untouched;
4. build result;
5. Hero target count;
6. confirmation that no card overlay or duplicated scene image is rendered;
7. screenshots:
   - 1440 × 900 Hero;
   - 1366 × 768 Hero;
   - 1280 × 720 Hero;
   - 390 × 844 Hero;
   - Manifesto desktop;
   - Selected Systems desktop;
   - System 01 desktop;
   - System 02 desktop;
   - System 01 mobile;
8. a **real browser recording**, approximately 25–40 seconds:
   - Hero pointer approach across at least three tools;
   - smooth disappearance when leaving;
   - scroll Hero → Manifesto → Index;
   - jump or scroll into System 01;
   - roll from System 01 into System 02;
   - workflow sequential reveal;
   - hover between two workflow nodes;
9. remaining visual uncertainties;
10. confirmation that the development server remains running.

Do not substitute computed transform values for the real browser recording.

Do not commit.

Do not push.

Do not deploy.

---

# 26. One-line execution instruction

After saving this file under `project-docs`, execute only:

```text
Read project-docs/PORTFOLIO_V2_CANONICAL_VISUAL_PROTOTYPE_PROMPT_V4.md in full.

Implement the complete Visual Prototype Pass exactly as specified.

Preserve the current Pass H v3.2 Hero framing and existing RAF proximity engine.
Do not restart the Hero design.

Build the full sequence:
Hero → Manifesto → Selected Systems → rolling Systems 01–07 → Supporting Infrastructure → Closing.

Keep localhost running.
Stop after screenshots and a real browser recording.
Do not commit, push or deploy.
```
