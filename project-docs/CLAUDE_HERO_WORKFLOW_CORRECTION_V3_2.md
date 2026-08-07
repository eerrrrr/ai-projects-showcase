# CLAUDE CODE — Hero + Workflow Correction Pass v3.2

(Saved verbatim from the user's pasted spec, 2026-08-06. The sandbox: links in
the originating message weren't reachable from this session, so this is the
authoritative copy. See `UPDATE_REPORT_2026-08-06_PASS_H_W_V3_2.md` for what was
actually implemented and verified against it.)

## Status

This correction supersedes the conflicting Hero and Workflow instructions in:

- `PORTFOLIO_V2_CANONICAL_LIVING_BUILD_PROMPT_V3_1.md`
- `CLAUDE_GATE_1_1_FRAMING_CORRECTION_PROMPT.md`

Do not append the old rules back into this pass.

The latest recorded build was reviewed frame by frame. It confirms that Gate 1.1
solved the bottom crop but created three new regressions:

1. the contained source image now exposes obvious flat side bands on wide windows;
2. the proximity zoom has become too weak or visually absent, while the tool text
   appears in a remote lower-left Inspector instead of next to the physical card;
3. the Project 01 workflow still presents six paragraph-heavy cards at the same
   time instead of behaving like a connected n8n-style node sequence.

This is a correction pass, not a new visual direction.

---

## 1. Preserve the parts that are already correct

Preserve:

- the approved high-resolution Hero PNG;
- one real Hero image only;
- no extracted card PNGs;
- no clean plate;
- no duplicated card pixels;
- the existing 11 verified tool targets;
- the fact that the unclear card behind Comfy is not labelled Codex;
- the existing requestAnimationFrame proximity architecture;
- smoothstep / distance strength logic;
- hysteresis between tightly grouped tools;
- no click requirement;
- keyboard accessibility;
- the removal of the `SYSTEMS` navigation item;
- the Hero title and subtitle;
- the continuous tabletop colour family;
- all verified project data and figures;
- the existing stage descriptions as the source of truth;
- the frozen V1 and all unrelated routes.

Keep the Hero navigation as:

```text
LINKEDIN ↗
GITHUB ↗
VISUAL PORTFOLIO ↗
```

Do not restore:

- `SYSTEMS`;
- `SCROLL TO EXPLORE`;
- project markers;
- project hotspot numbers;
- the old bottom-left project rail;
- click-to-pin;
- popup cards;
- permanent labels.

---

## 2. What the latest implementation got wrong

### 2.1 `contain` produced visible left and right image boundaries

The current source image is visibly narrower than an ultra-wide viewport. A flat
CSS fill appears at both sides. Even when the colours are numerically close, the
photo has a two-dimensional studio falloff and subtle texture, so a flat
extension still looks like a poster placed inside a webpage.

The user does not want: `flat band | contained photograph | flat band`

The user wants: `one uninterrupted full-window studio field`

At the same time, the upper and lower parts of the source photograph should
remain visible and the Figma Make and Python/SQLite piles must not be cut at
the bottom.

### 2.2 The interaction explanation moved to the wrong location

The latest video shows tool names and project usage in the lower-left corner.
That location is disconnected from the selected physical object. The user
expects a game-like selection response:

```text
mouse approaches a card
→ the camera gently focuses
→ a compact annotation appears beside or above that card
→ mouse moves away
→ the annotation disappears
```

No click should be required.

### 2.3 The proximity motion is too weak

The scene now looks almost static. The earlier Figma Make proof had a more
noticeable but still restrained focus response. The zoom must be visible enough
that a person immediately notices the selected area, but it must still read as
a camera adjustment rather than an extracted sticker moving independently.

### 2.4 The workflow is still six text cards

The current Project 01 workflow shows all six long descriptions inside narrow
boxes simultaneously. That is not an n8n-like workflow. It is a row of
documentation cards. The intended experience is:

```text
node 01 appears
→ connector draws
→ node 02 appears
→ connector draws
→ node 03 appears
...
```

After the sequence finishes, all compact nodes remain visible, but only one
stage description is expanded at a time.

---

## 3. Required implementation scope

Implement only:

### Pass H — Hero framing and proximity correction

- seamless full-window Hero;
- preserve the top and bottom source-image extent;
- remove obvious left/right image seams;
- restore smooth proximity zoom;
- move annotations from the lower-left corner to the active card;
- apply the same interaction grammar to all verified cardboard tool targets.

### Pass W — Project 01 workflow proof

- rebuild only Project 01 workflow presentation;
- compact connected nodes;
- sequential reveal;
- one active detail area;
- no paragraph inside every visible node.

Do not redesign Systems 02–07 during this pass. Do not rewrite verified project
content during this pass. Do not commit, push or deploy.

---

## 4. Hero framing: full viewport without visible side bars

### 4.1 Retire the Gate 1.1 geometry

Retire `width: min(100vw, calc(100dvh * 1.8111979167));` as the final solution
— it preserves every pixel but exposes obvious side boundaries on wide screens.
Also do not return to the previous `max(...)` cover rule, which cuts the
upper/lower image area.

### 4.2 Correct priority

1. the Hero stage always fills the full viewport;
2. the source photograph always keeps its full vertical extent on desktop;
3. the important named tool clusters remain visible;
4. only expendable far-left and far-right peripheral pixels may be cropped on
   narrower desktop screens;
5. ultra-wide leftover width is extended as a seamless studio field, not shown
   as flat bars.

Use height-led geometry on desktop:

```css
.v2-hero {
  position: relative;
  width: 100%;
  height: 100svh;
  min-height: 680px;
  overflow: hidden;
  isolation: isolate;
}

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

Do not scale the source image by viewport width after this calculation.

### 4.3 Seamless side extension

Do not use a flat solid colour beside the source image. Build the stage
background from the real image's measured studio tones:

```css
.v2-hero {
  --hero-top: #ebe1d9;
  --hero-mid: #e5dbd4;
  --hero-bottom: #dcd3cc;
  background:
    radial-gradient(ellipse 92% 88% at 50% 13%, rgba(249,244,239,0.96) 0%, rgba(238,229,222,0.96) 50%, rgba(220,211,204,1) 100%),
    linear-gradient(to bottom, var(--hero-top), var(--hero-mid) 58%, var(--hero-bottom));
}
```

Before keeping these values, measure the current approved PNG again. Adjust the
three stops only if the actual border samples support the change.

Blend the sharp source image into the stage at its left and right edges:

```css
.v2-hero__sourceCanvas {
  -webkit-mask-image: linear-gradient(to right,
    transparent 0%, rgba(0,0,0,0.28) 2.5%, rgba(0,0,0,0.82) 5.5%,
    #000 8%, #000 92%, rgba(0,0,0,0.82) 94.5%, rgba(0,0,0,0.28) 97.5%, transparent 100%);
  mask-image: linear-gradient(to right,
    transparent 0%, rgba(0,0,0,0.28) 2.5%, rgba(0,0,0,0.82) 5.5%,
    #000 8%, #000 92%, rgba(0,0,0,0.82) 94.5%, rgba(0,0,0,0.28) 97.5%, transparent 100%);
}
```

The blend must be broad and photographic. Do not create a vertical hard line, a
rectangular image border, a shadow around the source image, a blurred full
duplicate of the Hero, duplicated/mirrored cards in the side extension, or a
flat beige strip. If the mask removes too much of a visible edge card at a
normal 16:9 viewport, reduce the fully transparent range, not the central solid
range.

### 4.4 Narrow desktop behaviour

Keep source height equal to Hero height; centre it; allow only the distant
left/right edge pixels to crop; do not crop the central box, Power BI, Figma
Make, Python/SQLite, Comfy, or the central top stack. Do not shrink the image to
create letterboxing.

### 4.5 Mobile behaviour

```css
.v2-hero { min-height: auto; height: auto; }
.v2-hero__sourceCanvas {
  position: relative; top: auto; left: auto;
  width: 100%; height: auto; aspect-ratio: 2782/1536;
  transform: none; mask-image: none; -webkit-mask-image: none;
}
```
Keep the existing mobile title, subtitle and numbered project links. No
proximity interaction on coarse pointer.

---

## 5. Proximity interaction: visible, local and smooth

### 5.1 Remove the fixed lower-left Inspector

Retire it for desktop pointer interaction. The annotation must be spatially
associated with the active tool card. Only one annotation may be visible at a
time. Keyboard focus must use the same local annotation.

### 5.2 Keep the single-image camera model

Do not move, rotate or scale an individual card. Use the complete source image,
one whole-scene focus layer, one local radial veil, one local annotation. The
card remains part of the photograph.

### 5.3 Required proximity response

```text
outer zone   → no text yet, only an almost imperceptible camera preparation
middle zone  → tool name appears near the card
inner zone   → camera focus reaches full strength, project usage line appears
```

On pointer leave: annotation fades out → veil clears → scene returns smoothly to
scale 1. No click, pin or second action.

### 5.4 Restore a visible camera focus

```text
rest scale: 1
full proximity scale: 1.006
absolute maximum: 1.007
```
Add a restrained target-facing translation: translateX max 3.5px, translateY
max 2.5px. No rotation, no bounce, no overshoot. Use the active target as the
transform origin, on a layer separate from the one responsible for centring.

### 5.5 Smooth the focus coordinates, not only the scale

Interpolate strength, focus x, focus y, shift x, shift y, veil opacity,
annotation opacity — elapsed-time-based exponential interpolation:

```ts
function damp(current: number, target: number, smoothingMs: number, deltaMs: number) {
  const alpha = 1 - Math.exp(-deltaMs / smoothingMs);
  return current + (target - current) * alpha;
}
const ENTER_SMOOTHING_MS = 105;
const EXIT_SMOOTHING_MS = 180;
const ORIGIN_SMOOTHING_MS = 135;
const LABEL_SMOOTHING_MS = 120;
```
Exit should be slightly slower than entry. One requestAnimationFrame loop. No
React render on every pointer frame.

### 5.6 Proximity zones

```ts
const rawStrength = inverseSmoothstep(1.15, 0.18, distance);
```
```text
strength < 0.16        annotation hidden
0.16–0.48               tool name only
0.48–1                  tool name + concise verified usage
```
Release only after the pointer moves beyond a larger outer radius. Keep
hysteresis so central stacked cards do not flicker.

### 5.7 Local radial focus

At full strength: selected area unchanged/slightly brighter; outer scene
receives ~2.5–3.5% warm dimming; no hard spotlight ring, no blur patch, no
white glow.

```css
.v2-hero__veil {
  background: radial-gradient(
    ellipse calc(var(--focus-radius-x)*1%) calc(var(--focus-radius-y)*1%)
    at calc(var(--focus-x)*1%) calc(var(--focus-y)*1%),
    rgba(0,0,0,0) 0%, rgba(63,45,33,0.006) 42%, rgba(63,45,33,0.03) 100%);
  opacity: var(--veil-opacity);
  pointer-events: none;
}
```

### 5.8 Annotation must sit beside or above the card

```ts
type HeroToolTarget = {
  id: string; label: string; xPercent: number; yPercent: number;
  radiusX: number; radiusY: number;
  annotationSide: "top" | "left" | "right" | "bottom";
  annotationOffsetX: number; annotationOffsetY: number;
  summary?: string; projectUsage: string[];
};
```
Anchor computed from the real source-canvas rectangle, clamped to stay inside
the visible Hero. Default placement per card: Figma Make above; Python/SQLite
above/upper-left; Power BI above; Comfy above/upper-right; Claude Code
right/upper-right; n8n right/below (avoid covering box print); Copilot
above/right; Notion left; OpenAI left; MS Office left/below; SQLite above. The
label must never jump to the lower-left page corner.

### 5.9 Annotation visual design

Compact Swiss physical annotation, not a large tooltip — semi-transparent
background with blur, 1px border, max-width ~250px, name in mono/bold uppercase,
usage line(s) below in a smaller muted size. Max two project rows beside a card,
`+N MORE SYSTEMS` when needed. Optional short 12–20px leader tick, no long line
crossing the scene.

### 5.10 Disappearance

Annotation opacity → 0 within ~180–220ms; scene scale → 1 within ~320–420ms;
veil clears within ~260–340ms. Cancel any pending label-depth timer when the
active target changes or clears. No delayed text flash.

### 5.11 Reduced motion

No scene scale, no translation, no animated origin movement; annotation still
appears beside the focused/hovered target; veil may appear immediately at
maximum 2%; keyboard access remains.

---

## 6. Apply the same interaction grammar to all verified cardboard targets

Do not tune eleven unrelated animation systems. All verified targets share the
same damp function, strength calculation, scale ceiling, veil, annotation
component, enter/exit timing, and keyboard behaviour. Only x/y, radius,
annotation side/offset, and verified usage copy vary. Test every registered
target manually. Interaction must not depend on clicking.

---

## 7. Project 01 workflow: n8n-like sequential node field

### 7.1 Retire the current paragraph cards

The first visible state must look like a workflow:
`[01 INTAKE] → [02 NORMALIZE] → [03 VALIDATE] → [04 MAP] → [05 HUMAN REVIEW] → [06 REPORT]`
— not six simultaneous paragraphs.

### 7.2 Preserve one source of truth

Use the existing `project.stages`. Do not create a second manually maintained
workflow dataset. Derive a view model; keep `fullDescription` (the existing
`stage.body`) intact.

### 7.3 Compact n8n-like node

Each visible node: number, short title, tool, actor only — no paragraph.
Precise rectangular node, max 3px radius, visible input/output ports, thin
connector, warm tabletop/paper colours; Human node gets the restrained accent
colour; Output node may use a stronger border.

### 7.4 Nodes reveal one by one

```text
01 appears and becomes active → connector 01–02 draws → 02 appears and becomes active → ...
```
Node entrance ~280–360ms, gap ~70–100ms, connector draw ~220–300ms, gap
~70–100ms, total sequence ~3.0–4.2s. After the sequence: all six nodes remain
visible; active state returns to node 01 (or remains at 06, per visual review).
One IntersectionObserver + one managed timer/RAF sequence, cleaned up on
unmount; does not restart every time the user scrolls by.

### 7.5 Active detail: one description at a time

Stable detail area below the node track showing the active node's full
description. Pointer hover or keyboard focus selects a node and replaces the
detail content; content crossfades; no paragraph slides across the screen; no
repeat of the full description inside every node.

### 7.6 Connector design

Thin 1–1.25px line with a small directional arrow/route, no decorative glow, no
dashed looping line, no line crossing node text. Slightly curved Bézier
preferred for a 3×2 layout.

### 7.7 Layout

Large desktop: six nodes in one row. Medium desktop: 3+3. Mobile: vertical
01→02→...→06, detail below the active node or below the full vertical track.

### 7.8 Manual control

Small `REPLAY WORKFLOW ↻` text control, not a large play button. Manual
node hover/focus stops the automatic progression and gives control to the user.

### 7.9 Reduced motion

Reveal all nodes and connectors immediately; no sequential entrance; active
detail starts at node 01; node hover/focus still works.

---

## 8. Continuous tabletop surface

One page-level background gradient; Hero and project sections transparent; no
separate yellow rectangle immediately below the Hero; no visible horizontal
colour seam; separation via spacing/typography, not a background switch;
reduce excessive empty space between Hero and Project 01 title; wider content
column, not a fixed narrow one.

---

## 9. Acceptance tests (40 total)

Covers: Hero framing (1–11: no flat bars at 1920×800, full first-screen fill,
top/bottom extent visible, no cropped card piles, all named clusters
recognisable, no rectangular boundary, no duplicated/mirrored cards, SYSTEMS and
SCROLL TO EXPLORE remain absent); Hero proximity (12–25: visible gentle zoom,
scale 1.006–1.007 at full strength, smooth return, no click required, local
annotation beside/above the card not in a page corner, same behaviour across
Power BI/Python-SQLite/Comfy/Claude Code/n8n without flicker, one annotation at
a time, no individual card image layer, keyboard focus shows the same local
annotation, reduced motion removes scene zoom); Workflow (26–36: no six-
paragraph initial state, sequential node/connector reveal, sequence runs once,
all six nodes remain after completion, one description shown at a time, hover/
focus changes the active detail, Human Review visually distinguishable but not
loud, reduced motion shows all nodes immediately, mobile vertical flow, existing
verified stage content remains available); Scope (37–40: Systems 02–07 untouched,
project JSON/verified figures untouched, no new dependency, no commit/push/
deploy).

## 10. Required return

Changed files; exact Hero geometry used; exact edge-blending CSS; exact
proximity scale/translation limits; annotation position logic and offsets for
all 11 targets; confirmation the fixed lower-left Inspector is no longer used on
desktop; Project 01 node reveal timing; screenshots at 1920×800/1440×900/
1366×768/1280×720/390×844; a real local preview URL with the server kept
running; any remaining visible side seam or target collision.

Stop after Pass H and Pass W. Do not continue into Systems 02–07. Do not commit,
push or deploy.
