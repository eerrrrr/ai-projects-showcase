# /ai Portfolio Redesign — Complete Current System State

**Generated:** 2026-08-07, on request, for external review.
**Branch:** `redesign/ui-v2`, HEAD at `48ec38c`.
**Purpose:** this is not a summary or a claim of what works — it is the literal
current code, values, and known unresolved gaps, so someone other than me can
look at it and judge independently.

---

## 1. What this branch actually contains

```
git diff --stat ea133b1 HEAD   (ea133b1 = last commit before this session's work)
147 files changed, 14174 insertions(+), 190 deletions(-)
```

Commits on this branch from this session, in order:

```
8eac657  wip: checkpoint AI workflow portfolio redesign 2026-08-06
d538991  polish: unify portfolio motion and page handoffs
29b752e  fix: stabilize chapter roll and evidence flow
dba7f10  style: lighten workflow node fill and evidence table to white/transparent
48ec38c  polish: slow down workflow diagram cadence and entrance animations
```

`main` is untouched at `8ab8ebe`. Nothing has been merged or deployed. The
live public site (`https://eerrrrr.github.io/ai-projects-showcase/`) is the
OLD version and reflects none of this work.

---

## 2. Page structure (what actually renders, in order)

`src/pages/AiPortfolioV2Page.tsx` renders, top to bottom:

```
<SwissHero />                                    — own separate system, see §4
<StoryPage id="approach">                         <ManifestoPage />
<StoryPage id="selected-systems">                 <SelectedSystemsIndex />
<StoryPage id="system-01"> ... <StoryPage id="system-07">   × 7, one per project.json entry
<StoryPage id="supporting-infrastructure">        <SupportingInfrastructurePage />
<StoryPage id="closing">                          <ClosingPage />
```

Confirmed live via DOM query this session: all 11 `[data-chapter-id]` sections
(everything except Hero) are mounted and reachable, no horizontal overflow at
1440px or 390px.

---

## 3. The page-roll engine — `src/hooks/useChapterRollState.ts`

This is the current, full, unabridged logic. One module-level singleton
(not React Context), shared by every `StoryPage`/`SystemChapter` instance:

```ts
type Listener = () => void

const listeners = new Set<Listener>()
let activeId: string | null = null
let isScrolling = false
let engineStarted = false
let scrollSettleTimer: number | null = null

function notify() {
  listeners.forEach((listener) => listener())
}

function startEngine() {
  if (engineStarted) return
  engineStarted = true

  let rafId: number | null = null
  let dirty = true

  const onScroll = () => {
    dirty = true
    if (!isScrolling) {
      isScrolling = true
      notify()
    }
    if (scrollSettleTimer) window.clearTimeout(scrollSettleTimer)
    scrollSettleTimer = window.setTimeout(() => {
      isScrolling = false
      notify()
    }, 220)
  }

  const tick = () => {
    if (dirty) {
      dirty = false
      const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter-id]'))
      if (sections.length > 0) {
        const viewportCenter = window.innerHeight / 2
        let nearestIndex = 0
        let nearestDist = Infinity
        const centers = sections.map((el) => {
          const rect = el.getBoundingClientRect()
          return rect.top + rect.height / 2
        })
        centers.forEach((center, i) => {
          const dist = Math.abs(center - viewportCenter)
          if (dist < nearestDist) { nearestDist = dist; nearestIndex = i }
        })
        const nearestId = sections[nearestIndex].dataset.chapterId ?? null
        if (nearestId !== activeId) { activeId = nearestId; notify() }
        sections.forEach((el, i) => {
          const stage = el.querySelector<HTMLElement>('.v2-storyPage-stage')
          if (!stage) return
          const state = i < nearestIndex ? 'before' : i > nearestIndex ? 'after' : 'active'
          if (stage.dataset.storyState !== state) stage.dataset.storyState = state
        })
      }
    }
    rafId = requestAnimationFrame(tick)   // ← runs every frame via rAF
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  rafId = requestAnimationFrame(tick)
}

export function useChapterRollState(chapterId: string) {
  const reducedMotion = useReducedMotion()
  const [, forceRender] = useState(0)
  useEffect(() => {
    if (reducedMotion) return
    startEngine()
    const listener = () => forceRender((n) => n + 1)
    listeners.add(listener)
    return () => listeners.delete(listener)
  }, [reducedMotion])
  if (reducedMotion) return { isActive: true, isScrolling: false }
  return { isActive: activeId === chapterId, isScrolling }
}
```

**Design:** exactly one chapter is ever "active" (nearest viewport centre).
All others are `before`/`after` by index. `isScrolling` is a single shared
flag, true immediately on scroll, false 220ms after the last scroll event.

**Dependency you should know about:** the whole engine's `activeId`
computation runs inside `requestAnimationFrame`. If the browser tab is
backgrounded/hidden, `requestAnimationFrame` stops firing entirely (this is
standard browser behavior, not a bug in this code) — and `activeId` freezes
at whatever it last was. This has happened repeatedly during my own testing
this session (see §7).

The corresponding CSS (`story-pages.css`):

```css
.v2-storyPage-stage {
  position: sticky;
  top: 0;
  min-height: 100svh;
  transform: translateY(0);
  opacity: 1;                          /* never changes — see below */
  transition: transform 440ms var(--motion-ease-out);
}
.v2-storyPage-stage[data-story-state='before'] { transform: translateY(10px); }
.v2-storyPage-stage[data-story-state='active'] { transform: translateY(0); }
.v2-storyPage-stage[data-story-state='after']  { transform: translateY(-8px); }
```

History on this specific point: an earlier version of this file used
`opacity: 0.62` (before) / `1` (active) / `0.90` (after), plus continuous
scroll-scrubbed `scale`. That was identified as the cause of a "long grey
page" complaint and was removed entirely — opacity is now always `1` in
every state. Only a small `translateY` communicates position.

---

## 4. Hero — `src/components/v2/SwissHero.tsx` + `hero.css` (frozen, unchanged since the last Hero-specific pass)

Separate system from the StoryPage engine above. Full current constants:

```ts
const REACH_OUTER = 1.15          // normalised distance where proximity strength starts
const REACH_INNER = 0.18          // normalised distance where strength reaches 1
const RELEASE_DISTANCE = 1.5      // current target released once its own distance exceeds this
const SWITCH_RATIO = 0.82         // a new target must be ~18% closer to steal focus
const MAX_SCENE_SCALE_DELTA = 0.008   // scene scale ceiling: 1.008 at strength 1
const MAX_TRANSLATE_X = 3         // px, scene translate toward active target
const MAX_TRANSLATE_Y = 2
const MAX_VEIL_STRENGTH = 0.025   // local dimming veil, 2.5% max
const MAX_IDENTITY_SHIFT_X = 1.5  // ERIN WONG's own tiny translate, px
const MAX_IDENTITY_SHIFT_Y = 1
const VEIL_RADIUS_MULTIPLIER = 1.8
const TAU_ENTER_MS = 105          // exponential smoothing, entering a target
const TAU_EXIT_MS = 180           // leaving a target
const TAU_ORIGIN_MS = 135         // focus x/y smoothing
const TAU_LABEL_ENTER_MS = 110    // annotation fade in
const TAU_LABEL_EXIT_MS = 320     // annotation fade out
```

Title micro-response (in `hero.css`, folded into the `v2-hero-identity-in`
keyframe's `to` state because CSS animation `fill-mode:both` overrides any
separately-declared `transform`):

```css
transform: scale(calc(1 + var(--hero-focus-strength, 0) * 0.0025));
```
→ ceiling 1.0025 (0.25%) at full strength.

Bottom feather: `clamp(28px, 3.5vh, 40px)` desktop, `clamp(20px, 3vh, 28px)`
mobile. Side blend mask: `@media (min-aspect-ratio: 16/9)` (widened from the
original `19/9` after a real seam was found at 2498×1190).

11 registered tool targets in `src/data/heroToolTargets.ts`. Annotation
placement (`positionAnnotation()` in SwissHero.tsx) computes the true card
edge from `radiusXPercent`/`radiusYPercent` before applying each target's
small offset — this was a real bug fix (offsets were previously added
directly to the card's centre point, putting annotations inside the cards
for most targets).

**Live-measured this session** (before the tab went hidden): at full
proximity strength on Figma Make, `getComputedStyle` returned exactly
`scale(1.008)` on the scene and `scale(1.0025)` on the identity block —
matching the constants above precisely.

---

## 5. Workflow diagram — `src/components/v2/WorkflowDiagram.tsx`

Full current timing constants:

```ts
const WORKFLOW_SETTLE_DELAY = 260     // ms after becoming active before autoplay starts
const WORKFLOW_STEP_MS = 1200         // ms between each node activating
const DETAIL_UPDATE_DELAY_MS = 220    // ms the detail-rail text lags the node activation
```

CSS transition durations (`workflow-diagram.css`):

```css
.v2-workflow-connector { transition: transform 420ms ease, ... }
.v2-flowNode            { transition: opacity 460ms ..., transform 460ms ... }
entrance stagger (TSX)  : i * 140ms per node
.v2-workflow-detail-content animation: 280ms
.v2-evidenceInspector-panel animation: 320ms (system-chapter.css)
```

**Gating logic** (the actual state machine, current code):

```ts
useEffect(() => {
  if (reducedMotion) { setHasEntered(true); setActiveNodeId(nodes[0].id); return }

  if (!isActive) {
    clearTimers(); userControlRef.current = false; wasActiveRef.current = false
    setActiveNodeId(nodes[0].id)
    return
  }

  const justBecameActive = !wasActiveRef.current
  wasActiveRef.current = true

  if (isScrolling) { clearTimers(); return }

  if (!justBecameActive && hasEntered) return   // already played this visit

  const settleTimer = setTimeout(() => { setHasEntered(true); runSequence() }, WORKFLOW_SETTLE_DELAY)
  return () => clearTimeout(settleTimer)
}, [isActive, isScrolling, reducedMotion, hasEntered, ...])
```

Plain-language: autoplay only starts once this chapter is THE single active
one (from §3's engine) AND the page isn't scrolling, after a 260ms settle.
Scrolling cancels pending timers immediately. Leaving the chapter resets
everything to node 1 so a return visit replays cleanly. Hovering/focusing a
node takes manual control until Replay is clicked or the chapter is
re-entered.

Node/connector visual entrance (opacity/translateY fade-in) happens **once
per component lifetime** (`hasEntered` never resets to false) — separate
from the repeating highlight-cycle (`activeNodeId`), which DOES restart on
every re-entry.

`isActive`/`isScrolling` default to `true`/`false` when not supplied — this
is why the standalone `/ai/job-application-filter` case-study page
(`CaseStudyLayout.tsx`) and the unused, superseded `FeaturedCaseSection.tsx`
still work: they call `<WorkflowDiagram workflow={...} />` with no props,
outside any `StoryPage` context.

---

## 6. Evidence panel — `src/components/v2/EvidenceInspector.tsx`

```ts
export function EvidenceInspector({ entries, isActive }) {
  const [activeKey, setActiveKey] = useState<string | null>(null)
  useEffect(() => { if (!isActive) setActiveKey(null) }, [isActive])
  ...
  // click a tab: current === label ? close : open (replaces whatever was open)
}
```

Exactly one panel can be open at a time — enforced by the component's own
`activeKey` state (a single value, not a set), not just CSS. Content comes
from `buildEvidenceEntries()` in `src/data/systemChapterContent.ts`, which
maps each project's real fields:

```
problemHtml → "Problem"        (falls back to goalHtml → "Goal" if absent)
workflowHtml → "Implementation" (falls back to methodHtml → "Method")
human-actor stages / decisionHtml → "Human decision" (omitted if neither exists)
resultShortHtml / resultHtml → "Result"
failureHandledHtml → "Failure handled" (omitted if absent)
limitationHtml → "Limitations" (omitted if absent)
```

Live-verified this session via real clicks: Problem opens with real content
→ clicking Implementation closes Problem and opens Implementation → clicking
the open tab again closes it, panel count returns to 0.

Visual: 3-column × 2-row selector grid, transparent background (was tan,
changed on request), border-based grid lines, active tab uses
`--v2-accent-soft` fill + accent-colored bottom border.

---

## 7. Known, disclosed, unresolved limitation — testing environment

Multiple times this session, the Puppeteer-controlled browser tab entered
`document.hidden = true` / `visibilityState = "hidden"`. Standard browser
behavior stops `requestAnimationFrame` entirely while a tab is hidden. Since
**both** the Hero proximity engine (§4) and the chapter-roll engine (§3) run
on `requestAnimationFrame`, this has repeatedly blocked me from getting
fresh live numeric proof of timing/handoff behavior in the same session I
built or changed it — I could not always re-verify smoothness the same turn
I wrote it and said so.

What still works while hidden: `setTimeout`-based logic (the workflow's own
step sequencing), all click handlers (the evidence panel), DOM queries, and
screenshots. What doesn't: anything driven by `requestAnimationFrame`
(engine's `activeId`, Hero's own animation loop).

I flagged this every time it happened rather than claim verification I
didn't have. If a fix "should" work per the code but wasn't re-confirmed
live that same turn, that is why.

---

## 8. Requests received but never fully specified

Two messages this session referenced a "previous prompt" with items named
only by title, never pasted in full:

- chapter white-gap fix
- narrow Hero top feather (separate from the existing 28–40px bottom
  feather — this would be a *new* treatment, not yet built)
- workflow slowed to 1200ms — **this one WAS eventually given a number and
  is implemented** (§5)
- last node not jumping back to node 01 — **not implemented**; current code
  explicitly resets to node 1 after the sequence ends (see `runSequence`'s
  `endId` timeout in §5)
- mobile workflow in two columns — **not implemented**; current mobile
  behavior is single-column (CSS Grid `auto-fit` naturally collapses to 1
  column under ~300px per node)
- "Evidence Quick read / Full notes" — **not implemented**; current
  implementation is the 6-tab exclusive selector in §6, which may not be
  what was actually asked for under that name
- Manifesto word-by-word reveal — **not implemented**; current reveal is
  line-by-line (4 lines, ManifestoPage.tsx), not word-by-word

I did not guess at these rather than risk building the wrong thing a second
time. They remain open.

---

## 9. Everything that has been live-verified this session (not just code-reviewed)

- Hero: proximity engine values match constants exactly via `getComputedStyle`
- Hero: annotation appears before direct hover, no card/box-text overlap
  (measured via bounding-rect math, not eyeballed)
- Hero: annotation exit fades to ~0 opacity, no stale-text flash
- Hero: all 6 required viewports (1920×800 → 390×844), no crop, no overflow
- Page structure: all 11 `data-chapter-id` sections mounted, correct order
- Page structure: Approach and Selected Systems occupy disjoint viewport
  ranges (measured rects, zero overlap)
- All 7 System chapters: correct title, correct node count matching source
  stage count, correct evidence-tab count matching which fields actually
  exist per project, correct key figure, case-notes link present
- Evidence panel: exclusive open/close, real content, verified via actual
  click events and DOM reads
- No horizontal overflow at 1440px or 390px, checked via
  `scrollWidth === clientWidth`
- Supporting Infrastructure: all 3 real items render with correct text
- Closing: both footer lines + 3 external links, no blank tail after content
- Build: `npm run build` (`tsc -b && vite build`) clean at every commit
  listed in §1

## 10. Everything NOT independently re-verified this session (code-reviewed only)

- Exact workflow node-to-node cadence at the new 1200ms value (blocked by §7)
- Cross-chapter evidence auto-close while actively scrolling between two
  chapters (the mechanism is `isActive`-gated and code-correct, but a live
  scroll-through was blocked by §7 the one time I tried it)
- Keyboard-only navigation through the whole page sequence
- `prefers-reduced-motion` end-to-end (each file has the correct CSS/JS
  branches; not run through an actual emulated-media test this session)

---

If something in here still doesn't match what you're seeing in the browser,
that's the more useful thing to tell me than "make it better" — a specific
mismatch between this document and the real behavior is something I can
actually chase down.
