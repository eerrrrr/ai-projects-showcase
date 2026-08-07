# Claude Code — Canonical Living Hero Prompt v2

## Status

This prompt replaces the previous "Swiss Masthead + Object Field" Hero
approach. Superseded, not appended — see
`AI_PORTFOLIO_REFERENCE_VIDEO_DEEP_STUDY.md` for the reasoning.

The approved visual asset remains:
```text
public/media/v2/ai-workflow-hero.png
```
Source ratio: `1366 × 768`. Target route: `/ai`. `/`, `/architecture`,
`/about`, project data and verified figures remain out of scope.

## Correction (post Gate A.2): Tool Usage Map, not Project Hotspot Map

Sections 7, 8, and 12 below describe the **original** direction — each
hero object hyperlinked 1:1 to one project, surfaced via a rail + click
scroll. That mapping was semantically wrong and has been abandoned: the
visible objects (Copilot, Notion, Claude Code, n8n, Figma Make, Python,
SQLite, ComfyUI, Codex, Power BI) are **tools**, several of which are used
across multiple projects (Claude Code most obviously). Forcing a
one-to-one link — e.g. Claude Code → only Job Screening — misrepresents
how the tools are actually used.

**Corrected model:**
```text
Hero
  ERIN WONG / AI WORKFLOW SYSTEMS / physical tool world
  hover a tool or tool cluster → see which system(s) use it
  scroll (always available) → enters project navigation

01 / SELECTED SYSTEMS (below Hero)
  the actual project index — this is where project navigation lives now,
  not the Hero itself
```

**What this changes vs. sections 7/8/12:**
- No permanent numbered circle markers on the tool objects at rest.
- No bottom-left project rail (`01/07 · TITLE · VIEW SYSTEM ↓`) — removed
  entirely, including its rule. Only `SCROLL TO EXPLORE ↓` remains at
  lower-right, purely as a scroll affordance, not tied to any single tool.
- Hotspots are re-scoped from **7 project targets** to **~5 tool
  clusters** (Claude Code/coordination stack, n8n, Figma Make,
  Python+SQLite, ComfyUI+Codex), each with an `usedIn: string[]` — some
  single-project, some multi-project, some portfolio-wide. Power BI stays
  decorative/non-interactive unless a real public project usage is
  verified.
- Click no longer scrolls to a project or does a camera-nudge. Click
  **pins** the hover annotation (toggle: click again or click elsewhere/
  Escape to unpin). Project navigation happens via normal scroll into
  `01 / SELECTED SYSTEMS`, not via the Hero's tool objects.
- Motion for annotations: hover reveal 120-180ms, very subtle optional
  whole-scene shift (max 0.5px), no per-card movement, no scene zoom, no
  4-8px "focus" translation, no rail-fill animation.

**Gate re-sequencing after this correction:**
- **Gate A.3** (done): remove the rail + circle markers, keep everything
  else from Gate A.2 (title/subtitle/scene scale/nav/scroll cue/mobile
  links) unchanged. No tool-usage annotations, no hover, no click yet.
- **Gate B (revised)**: build the typed tool-usage registry + hover/focus
  annotation reveal (transparent background, thin leader line, ≤3 lines,
  never covers the logo or the identity block).
- **Gate C (revised)**: click-to-pin/unpin behavior on annotations —
  *not* click-to-scroll-to-project (that concept is retired).
- **Gate D**: unchanged — reduced motion / responsive validation, plus
  confirming the existing mobile numbered project links still work as the
  real (and only, on mobile) path into projects.

## 1. Reset the visual assumption

Do not build "a bigger title over an image." Build an **Editorial Object
Index**: the approved physical scene is the project navigation field;
typography provides identity/structure; a shared active-project rail
explains the current target; motion is state-driven and camera-led;
clicking gives a short focus response then scrolls to the matching
section.

## 2. Principles

1. One organising metaphor — the AI Workflow Starter Pack + card piles.
2. Stable context — the scene stays understandable while one target
   becomes active.
3. Motion has cause — hover identifies, click focuses, scroll continues.
4. Two reading modes — Hero = spatial object index; below Hero = calm
   Swiss editorial evidence.
5. One state machine — Idle → Discoverable → Hover/Focus → Selected →
   Camera Nudge → Scroll Transition → Destination Focus.
6. No fake depth — the source is a flattened image; no independent
   per-card 3D movement.

## 3. Final cover hierarchy

```text
1. ERIN WONG
2. AI WORKFLOW SYSTEMS
3. PROCESS THINKING · DATA VISUALIZATION · HUMAN-REVIEWED AI WORKFLOWS
4. physical AI Workflow scene
5. shared active-project rail
6. minimal navigation
7. restrained scroll cue
```
No centred case-study composition. No heading floating disconnected above
a rectangular image. No rounded app-shell frame.

## 4. Desktop composition

Full-width Hero: `height: 100svh`, `min-height: ~680px`, warm off-white
background matching the studio tone, `overflow: hidden`,
`position: relative`. 12-column editorial grid for typography and rails.

**Identity block** — upper-left negative space:
```css
font-family: Arial, Helvetica, "Nimbus Sans L", system-ui, sans-serif;
font-size: clamp(64px, 7.8vw, 116px);
font-weight: 700;
line-height: 0.84;
letter-spacing: -0.055em;
color: #171512;
```
Position: `left: clamp(24px, 4vw, 64px); top: clamp(56px, 7vh, 82px);`.
One line on large desktop when it doesn't collide with navigation. No
handwriting, outline text, blue text, gradients, text shadows, character
animation, or distorted letter placement.

**Subtitle block** — directly below the name:
```text
AI WORKFLOW SYSTEMS
PROCESS THINKING · DATA VISUALIZATION · HUMAN-REVIEWED AI WORKFLOWS
```
Editorial metadata style: left-aligned, no panel/pill/background, max
width ~620px, primary line 13-16px, secondary 11-14px, warm-grey
secondary ink, restrained tracking, ~16-22px below the name.

## 5. Scene-frame architecture

Hotspots must NOT attach to the full Hero viewport — attach to a frame
that always preserves the source ratio, centred and bottom-anchored:
```css
.hero__sceneFrame {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: min(100vw, calc(100svh * 1.778));
  aspect-ratio: 1366 / 768;
  transform: translateX(-50%);
  transform-origin: 50% 70%;
}
.hero__scene, .hero__scene img { width: 100%; height: 100%; }
```
All hotspot percentages and markers are children of this frame — this
prevents drift when the Hero has extra background around the image.

## 6. Navigation

Top-right: `SYSTEMS`, `VISUAL PORTFOLIO ↗`, `GITHUB ↗`, `LINKEDIN ↗`.
Transparent, no navbar box, no shadow, no glass, 10-12px, restrained
letter-spacing, aligned to the Hero grid.

## 7. Project discoverability — tiny markers only

```text
01 central AI Workflow box       → Job Screening Validation Workflow
03 bottom-left Figma Make pile   → Source-to-Figma Data Visualization Pipeline
05 bottom-right Python/SQLite    → Method of Loci
07 upper-right ComfyUI/Codex     → Blender + ComfyUI
```
Power BI stays non-interactive. Rest state: ~40-55% opacity, no box,
9-11px. Hover/focus (Gate B, not built yet): full opacity, thin
rule/crosshair, local warm halo, visible focus ring. Do not place full
project titles beside every object simultaneously — that's what the
shared rail is for.

## 8. Shared active-project rail

One shared rail (lower-left/lower-centre), not per-hotspot tooltips.
Default state:
```text
01 / 07
JOB SCREENING VALIDATION WORKFLOW
VIEW SYSTEM ↓
```
On hover/focus (Gate B): same rail updates, e.g. `03 / 07 · SOURCE-TO-FIGMA
DATA VISUALIZATION PIPELINE · VIEW SYSTEM ↓`, via a restrained clip/slide
transition ~140-180ms. Thin horizontal rule, no card background, no
rounded tooltip, no description, no modal, no separate Enter button.

## 9-13. Motion (entry / idle / hover / click) — NOT this pass

Full detail preserved for later gates:
- **Entry**: name opacity+translateY 520-620ms, subtitle 80-120ms delay,
  scene opacity+scale(0.992→1) 680-820ms, nav/markers/rail fade last.
- **Idle pointer motion**: rotateX ±0.25deg, rotateY ±0.40deg, translate
  max 1px, perspective ~1500px, fine-pointer + hover only, no
  reduced-motion, gentle reset on pointer-leave, no continuous floating.
- **Hover/focus**: marker full opacity, thin line/crosshair, subtle warm
  halo, rail updates, optional ≤0.5-1px scene shift toward target.
- **Click**: lock rail, scene translates 4-8px toward target, scale
  ~1.006, rail rule fills 0→100%, 220-280ms total, then smooth scroll to
  the same-page section, focus destination heading. No modal, no popup,
  no separate Enter button, no per-card independent movement — a single
  whole-scene camera-led response.

These are documented here so Gates B/C/D can be implemented later without
re-deriving them, but **do not implement any of section 9-13 in Gate A.**

## 14. After the Hero (not this pass)

Preserve for later: `01 / SELECTED SYSTEMS` intro line, numbered
catalogue index (not rounded cards) for the overview, asymmetric
editorial grid, media/evidence-first layout. Out of scope until the Hero
itself is approved.

## 15. Responsive behaviour

- **Large desktop**: one-line `ERIN WONG`, full scene frame, top-right
  nav, markers + rail active.
- **Medium desktop**: title/nav gap reduce smoothly, scene ratio
  preserved, piles never cropped.
- **Tablet**: name may split `ERIN` / `WONG`, left-aligned, scene stays
  complete, no large floating labels.
- **Mobile**: normal document flow — name stacked, subtitle, full hero
  image, then numbered links (`01/03/05/07` + title), thin rules, no
  tilt, no hotspot dependency, no pills, direct scroll, full image
  visible.

## 16. Accessibility

Hotspots are semantic buttons with the exact project name as
`aria-label` (tiny markers are not the only accessible name). Keyboard
focus updates the rail (once Gate B exists). Visible focus state
required. Destination heading receives focus on click (Gate C). Mobile
links repeat all destinations. Respect `prefers-reduced-motion`. No
essential information hover-only.

Image alt: "A handmade AI Workflow Starter Pack box surrounded by
cardboard cards representing software tools and workflow projects."

## 17. Scope and approval gates

**Allowed to change:** `SwissHero.tsx`, Hero-scoped CSS, the hotspot
registry, shared rail, tiny markers.
**Do not change:** routes, `projects.json`, `page-content.json`,
`types.ts`, verified figures, project descriptions, inner project
sections, `/`, `/architecture`, `/about`, deployment files, `docs/`
manually. No commit, no push, no deploy.

- **Gate A — static composition** (this pass): title size, subtitle,
  image placement, nav, shared rail (default state only), marker
  positions. No motion of any kind. Capture 1440×900, 1366×768,
  1280×720, mobile. Stop if anything overlaps.
- **Gate B — hover/focus** (later): marker state, rail update, keyboard
  focus.
- **Gate C — click transition** (later): camera nudge, rail rule fill,
  direct scroll, destination focus.
- **Gate D — reduced motion/responsive** (later): no tilt, immediate
  nav, numbered mobile links, ordinary scroll.

Do not continue to inner-page redesign until the Hero is explicitly
approved through Gate D.
