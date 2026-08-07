# Codex handoff — AI Projects Showcase

**Written:** 2026-07-25, at the end of a long Claude Code session. Purpose: let Codex
(or any other agent/human) pick up this project with full context, without having seen
the conversation that produced it. Read this whole file before touching code.

---

## 1. What this project is

`D:\ai-test\ai-projects-showcase\` — a React 18 + Vite + TypeScript job-application
showcase site, live at `https://eerrrrr.github.io/ai-projects-showcase/`. It's a
Swiss-editorial-style "systems catalogue": one Hero cover, a tag-first "Selected
systems" grid (7 cards), then 7 full project write-ups each with an interactive
"How it works" walkthrough, then a small "Supporting infrastructure" section, then a
footer.

**Design language:** thin rule lines, mono labels, sparse single-accent green
(`--accent`), no drop shadows, no card tilt/glass effects, generous white space. This is
a portfolio for a job application — it must read as calm and professional, not like a
component-library tech demo.

**Repo/deploy:** GitHub repo `eerrrrr/ai-projects-showcase`. GitHub Pages deploys from
`main`'s `docs/` folder (GitHub Actions is disabled for this repo). `docs/` is build
output (`dist/*` copied in + `.nojekyll`), not documentation — never hand-edit it,
always regenerate via `npm run build` + copy.

## 2. Current git state — READ THIS FIRST

```
Branch: motion/soft-section-handoff (NOT main)
Commits on this branch beyond main:
  4c0b651  Checkpoint systems structure before full motion polish
  9ba8a72  Polish systems motion and evidence presentation
Working tree: UNCOMMITTED CHANGES PRESENT (see below)
```

**The working tree right now has uncommitted work** implementing/correcting the global
ambient background feature. The user has NOT yet visually approved this specific
uncommitted state. **Do not commit it, do not push it, and do not assume it's "done"** —
treat it as a WIP that the user is actively reviewing. If asked to continue this exact
work, first run `git status --short` and `git diff` and read the three most recent
`UPDATE_REPORT_*.md` files (see §7) to see exactly what's already been tried and why.

**This branch itself has never been merged to `main` and never pushed past commit
`9ba8a72`** (confirm with `git log origin/motion/soft-section-handoff..HEAD` before
assuming otherwise). The live GitHub Pages site still reflects whatever was last pushed
to `main` — none of this branch's work is live yet.

## 3. The standing "do not" lists — these are not suggestions

Across this entire session, several interaction models were tried, built, and **broke
the site in confirmed, reproduced ways**. They are banned, not just discouraged. Before
any commit, run:

```
rg -n "useSectionScroll|scroll-snap|scrollIntoView|location\.hash|hashchange|PLAY|PREVIOUS|NEXT|RESTART" src
```

Any match outside a code comment describing why something was removed is a regression.

**Never reintroduce:**
- `useSectionScroll` (a deleted whole-page wheel-jump controller — caused rolls "eaten,"
  workflow steps jumping to the wrong one, and a version that could trap the user inside
  a project).
- CSS `scroll-snap-type` / `scroll-snap-align` anywhere.
- A wheel listener that hijacks scroll beyond the two narrowly-scoped exceptions that
  already exist and are approved (§4).
- `scrollIntoView` triggered by wheel events.
- `IntersectionObserver`-driven workflow step selection (i.e., scroll position must
  never set `activeStep` in the workflow walkthrough).
- Hash-based auto-expand (`location.hash` opening a project's details automatically).
- Manual PLAY / PAUSE / NEXT / PREVIOUS / RESTART controls on the workflow walkthrough
  — "How it works" itself is the only entry point; clicking it again restarts from
  step 1; clicking any row directly jumps to it and pauses autoplay. That's the whole
  interaction model, deliberately.

**Never touch without being explicitly asked, and even then proceed carefully:**
- `src/components/ProjectCard.tsx` — owns `expanded`/`selectedStageNum` state, the
  auto-zip scroll-away `IntersectionObserver` (a *different*, deliberately narrow one —
  see §4), and switches between the compact walkthrough layout and the older static
  layout based on `hasWalkthrough = Boolean(valueLine && miniRoadmap && proofChips)`.
- `src/hooks/useWorkflowWalkthrough.ts` — pure click + `setTimeout` autoplay state
  machine. `STEP_DWELL_MS = 3600` (deliberately slow, tuned this session — do not drop
  back toward the original 1800ms without being asked).
- `src/components/WorkflowWalkthrough.tsx` — renders the walkthrough; row visual
  grammar (number + spine + shape marker: hollow circle=script, filled green
  circle=AI, dashed circle=human, filled square=output) deliberately mirrors the older
  static `.stage`/`.s-marker` diagram under separate `.w-step*` class names — never
  merge the two class sets.
- Selected-systems card structure (`ProofSummary.tsx`) — **tag-first only**: number,
  title, chips, "Open case →". No intro paragraph. This was explicitly tried (an
  `overviewIntro` field + paragraph render) and explicitly reverted after the user
  judged it "too busy" — don't re-add a description paragraph to these cards without a
  fresh, explicit request.
- Project copy/data in `projects.json` — every claim in this file has been individually
  fact-checked against the real underlying projects (see §6). Do not add new claims,
  numbers, or tool names without verifying them the same way first.
- `main` branch and `docs/` — deployment is a separate, explicit step the user
  authorizes by name ("go push" / "rebuild docs"), never implied by "looks good."

## 4. Architecture — what exists and why

### Scroll/motion system (three independent hooks, each narrowly scoped)

This project's scroll behavior went through a full stabilization arc (build → break →
emergency-delete → rebuild slowly, re-verifying at each step). The result is three
small, deliberately non-overlapping hooks, all called from `App.tsx`:

1. **`useSoftPageHandoff.ts`** — owns *only* the Hero ↔ Selected-systems (`#systems`)
   boundary. Listens to `wheel` (not `scroll`), calls `preventDefault()`, and does a
   single `window.scrollTo({behavior:'smooth'})` jump when the user is substantially
   within Hero and scrolls down, or is at the exact top of Selected-systems and scrolls
   up. Includes an `EDGE_TOLERANCE`/`NAV_OFFSET` (88px, matching the sticky nav height +
   breathing room) so the landing position isn't tucked under the nav. Locks for 900ms
   after triggering to prevent double-fires. Ignores wheel events originating inside
   `.project`, `.walkthrough`, `.expand-panel`, `.p-controls`, or any interactive
   element. Feature flag: `ENABLE_SOFT_PAGE_HANDOFF` (top of file).

2. **`useSectionSettle.ts`** — owns everything *from* Selected-systems downward: each
   `.project` section and the footer. Completely different mechanism from #1 —
   *passive* `scroll` listener (never `preventDefault`), debounced 200ms, and only
   nudges the viewport to the nearest section boundary if it's already within ~18% of a
   viewport-height of it after scrolling stops. Backs off entirely if a project is
   expanded (`.project:not(.project--collapsed)` exists) or a walkthrough step is open
   (`.w-step--active` exists) — checked via existing CSS state classes only, never reads
   React state directly. Feature flag: `ENABLE_SECTION_SETTLE`.

3. **`useAccentSection.ts`** — a read-only `IntersectionObserver` that stamps
   `data-accent-section="hero|systems|system01..07|footer"` onto `<html>`, purely so CSS
   can key `--accent`/`--ambient-opacity` off it. Never moves the page, never touches
   React state. Feature flag: `ENABLE_ACCENT_SCALE`.

**Why three separate hooks instead of one:** each owns a disjoint responsibility and
none of them call `scrollTo` into another's territory, so they structurally cannot
fight each other the way the single deleted `useSectionScroll` did. If asked to extend
scroll behavior further, prefer adding a fourth narrowly-scoped hook over expanding one
of these.

### Ambient background (newest feature, still being tuned — see §7)

- `src/components/AmbientBackground.tsx` — the **only** Plasma/WebGL canvas on the
  entire site. Mounted once in `App.tsx`, before everything else, `position:fixed`.
  Never duplicate this per-section or per-project.
- `src/components/Plasma.jsx` / `Plasma.d.ts` — third-party-style WebGL2 shader
  component (uses the `ogl` library). Treat with care; two confirmed, non-obvious bugs
  were found in how CSS interacts with it (see §6) before it worked correctly.
- CSS: `--ambient-opacity` (how strong the layer is, varies by
  `data-accent-section`) and `--accent`/`--accent-rgb`/`--accent-soft` (the same
  section-based green hue-shift, used independently by project numbers/chips/buttons —
  this is a *different*, already-working mechanism, not tied to the ambient canvas).
- `.page-content` — wraps literally all real page content in its own stacking context
  (`position:relative;z-index:1`) specifically so the ambient layer (`z-index:0`) can
  sit behind everything without using a negative z-index (see §6 for why that matters).

### Data model

- `src/data/projects.json` — array of 7 projects. Each has `tier` (1=Featured proof,
  2=Supporting system, 3=Learning lab) and `tierLabel`. `hasWalkthrough` (computed in
  `ProjectCard.tsx`, not stored) is true when `valueLine`/`miniRoadmap`/`proofChips` are
  all present — currently true for all 7. `overviewChips` (3-4 short tags) feed the
  Selected-systems grid card. `stages[]` each optionally have `miniNodes` (2-4 short
  phrases shown when a step is expanded) and `image`/`caption` (real screenshots — see
  §6, none currently exist for any project; `caption` alone, without `image`, renders as
  a quiet one-line "evidence note" via `StageMedia.tsx`, never a placeholder box).
- `src/data/page-content.json` / `src/data/types.ts` — nav, hero copy, section
  headings. Nav is currently 3 links: Systems, Visual Portfolio, GitHub — no "Systems
  Lab"/"Archive" concept exists anymore (see §5).

## 5. Content/IA decisions already made (don't re-litigate without being asked)

- **No "Systems Lab" / "Archive" / "Additional systems" concept.** All 7 projects are
  one catalogue. This was explicitly corrected away from an earlier "archive" framing.
- **No "System details" header block** either (most recent correction) — the four
  featured project write-ups flow directly into the remaining 3 without any
  intermediate section heading. `#flagship` exists only as an anchor id.
- **Project meta reads `SYSTEM 01 · Featured proof`**, not `PROJECT 01 / 07 · ...` — the
  `/ 07` total was deliberately removed since adding project 08 later would make it
  read as a stale template counter.
- **Selected-systems cards are tag-only**: number, title, 3-4 chips, "Open case →". No
  paragraph, no separate "quiet"/muted styling for tier 2/3 — all 7 cards render
  identically in color and form.

## 6. Hard-won debugging lessons — read before assuming something is broken

### 6a. This session's Puppeteer/headless test harness has real, confirmed flakiness

- `document.hidden` / `document.visibilityState` are inconsistent across navigations in
  this harness — sometimes `true`, sometimes `false`, for reasons not fully diagnosed.
  When `hidden`, `IntersectionObserver` callbacks and `window.scrollTo({behavior:
  'smooth'})` animations may silently never fire/tick.
- **Workaround used throughout this session:** when a live behavioral check is
  ambiguous, don't conclude "broken" from one failed observation. Either (a) re-navigate
  and retry, (b) verify the *decision logic* directly by monkey-patching the function
  under test (e.g. `window.scrollTo = (opts) => { calls.push(opts); realScrollTo(opts) }`
  and asserting on recorded calls, which sidesteps whether the animation actually ticks
  visually), or (c) take real screenshots and read them, since actual rendering (as
  opposed to JS-side event timing) has been reliable once the above traps are avoided.
- A live WebGL canvas readback via `ctx.drawImage(webglCanvas, ...)` onto a 2D canvas
  **crashed the browser tab to `about:blank`** once this session. Use `gl.readPixels()`
  directly instead if you need to inspect actual rendered pixel values — confirmed safe.

### 6b. Two confirmed, non-obvious CSS/WebGL bugs (already fixed, don't reintroduce)

1. **`z-index:-1` on a `position:fixed` WebGL canvas silently breaks its compositing**
   in this environment. Isolated by a controlled single-variable test: identical setup,
   `z-index:0` renders correctly, `z-index:-1` renders nothing (confirmed via
   `gl.readPixels()` — draw calls happen, zero GL errors, context not lost, but the
   compositor never displays the result). **Fix pattern used:** keep the ambient layer
   at `z-index:0`, and wrap all *other* real content in its own stacking context at
   `z-index:1` (`.page-content`) instead of giving the background a negative z-index.
2. **A section's own opaque CSS `background` color silently covers a `position:fixed`
   layer behind it once that section is promoted into a higher stacking context.**
   `.hero-cover` used to have `background:var(--paper)` (harmless when Plasma was a
   child of Hero, since child content always paints over a parent's own background) —
   once Plasma moved to a separate global fixed layer and Hero got wrapped in
   `.page-content` (z-index 1, above the ambient layer's z-index 0), Hero's own
   background painted directly over the ambient layer wherever Hero's box existed.
   Fixed by removing that background declaration entirely (confirmed no other section —
   `.systems-overview`, `.project`, `footer` — has this problem).

**General lesson for whoever continues this:** when a visual effect "doesn't show up"
after a structural change (moving a component, changing a wrapping element), suspect
CSS painting order / stacking context before suspecting the rendering library itself.
Isolate with single-variable tests (change exactly one CSS property, screenshot,
compare) rather than guessing multiple things at once.

### 6c. Verify-before-write discipline (applies to ALL project copy, not just code)

Every claim in `projects.json` was checked against the real underlying project files
before being written, more than once this session catching the user's own suggested
copy being inaccurate:
- Project 01 (`job-application-filter`): suggested copy claimed "Docker-based." Checked
  `package.json` (n8n is a plain npm devDependency, no Dockerfile) and the actual n8n
  workflow JSON (only `manualTrigger`+`code` nodes, zero Claude/Notion references).
  *Separately*, actual `docker ps -a`/`docker images` on the machine found real n8n
  Docker containers — but their creation dates (2025-08, 2026-01) predate this
  project's own files (2026-07) by 5-11 months. Conclusion: Docker n8n usage happened,
  but not for this project — kept "Local workflow," not "Docker."
- Two other projects' suggested tool-stack chips (Claude API usage) were checked against
  actual pipeline code and found to be manual/interactive (a human pasting into Claude
  Code), not an automated API call — chips were written to match what's actually true.

**If asked to add any new proof/stat/tool-name to this site, verify it against the real
project files first, the same way.** Don't take suggested copy (from the user or from
anywhere else) at face value.

## 7. Recent history — the last five passes, in order

Read these `UPDATE_REPORT_*.md` files at the repo root (newest first) for full detail on
exactly what was tried, what broke, and how it was fixed — they contain screenshotted
evidence and are the authoritative record, more detailed than this summary:

1. `UPDATE_REPORT_2026-07-25_SYSTEMS_UNIFIED_STRUCTURE.md` — unified nav, removed `/07`,
   extended "How it works" to all 7 systems.
2. `UPDATE_REPORT_2026-07-25_HIGH_CLASS_MOTION_GREEN_SCALE.md` — introduced
   `useSectionSettle`, `useAccentSection`, removed the "Proof capture to be added"
   placeholder box.
3. `UPDATE_REPORT_2026-07-25_GLOBAL_AMBIENT_BACKGROUND.md` — first version of the global
   Plasma background; documents the two CSS/WebGL bugs in §6b in full.
4. `UPDATE_REPORT_2026-07-25_AMBIENT_BACKGROUND_SHAPE_CORRECTION.md` — first version
   over-corrected into a flat green wash (a separate flat tint layer + double-dimmed
   opacity); this report documents removing both.
5. `UPDATE_REPORT_2026-07-25_PLASMA_VERTICAL_GROWTH_CORRECTION.md` — removed
   the "System details" header, added scroll-progress-driven vertical
   drift/stretch to the Plasma shader (`uDriftY`/`uStretch` uniforms, smoothed via lerp,
   fed by a passive scroll listener in `AmbientBackground.tsx`).
6. `UPDATE_REPORT_2026-07-25_AMBIENT_FLOW_STRONGER_GRADING.md` — pass #5's
   motion/color were judged "right direction, too subtle to notice" (not wrong, just
   weak). Increased `uDriftY`/`uStretch` magnitudes, added a third uniform `uMorph`
   (turbulence), widened the 9 per-section `--accent` hex values for clearer contrast
   (still one muted green family, checked for white-text contrast), raised
   `--ambient-opacity` outside Hero, and added a static `mask-image` on `.ambient-bg`.
7. `UPDATE_REPORT_2026-07-25_CONTINUOUS_PLASMA_GROWTH.md` — most recent, and the most
   architecturally significant of the corrections: pass #6 was judged "still feels like
   separate mist patches per section, not one field growing downward." Root cause:
   shape distortion was already a continuous function of scroll, but **opacity was
   still driven by the discrete `data-accent-section`-keyed `--ambient-opacity` CSS
   variable** (a stepped preset per section, eased over 0.9s on change) **and the
   canvas's own color never changed at all** (only nearby UI elements did). Fixed by
   moving both into the same continuous `smoothedProgress` system that already drove
   the shape, entirely inside `Plasma.jsx`'s render loop: `--ambient-opacity` was
   **removed entirely** from `global.css` (opacity is now solely the shader's own
   `uOpacity` uniform, an exponential ease from Hero-strength to a floor); a new
   `colorStops` prop on `Plasma` continuously interpolates the canvas's own hue between
   4 stops (mist green → emerald → teal → olive) using the identical progress value;
   and a new `uFlowOffset` uniform advances the flow's own phase variable (the same one
   `iTime` already drives) so scrolling further genuinely "unspools more of the flow"
   instead of just displacing a still frame. Verified with a 5-point screenshot
   sequence (0%, 18%, 40%, 65%, 100% scroll) specifically checking that each frame
   looks like a plausible in-between of its neighbors — the actual test for
   "continuous," not just "each screenshot individually looks fine."

**Current state as of this handoff:** pass #7 is implemented, built, and
Puppeteer-verified, but **not yet visually approved by the user in a real browser**.
The ambient background has now gone through four correction rounds (flat wash → fixed;
too subtle → stronger; felt like separate section patches → this pass, made genuinely
continuous). If the user reports it still doesn't look right, don't assume the previous
fix was wrong — ask specifically what's off. As of pass #7, there is **no more
per-section CSS driving the ambient layer at all** (`--ambient-opacity` no longer
exists) — everything about the background's strength/color/shape is one continuous
function of `smoothedProgress` inside `Plasma.jsx`. Any further tuning should adjust
that one function (the `floorOpacity`/decay-rate math, the `colorStops` array, or the
`uDriftY`/`uStretch`/`uMorph`/`uFlowOffset` magnitude constants) rather than reintroducing
any section-keyed branching for the background specifically. The discrete
`data-accent-section` → `--accent` system remains and is correct to keep discrete — it
only affects UI elements (numbers/chips/buttons), never the canvas.

## 8. Standing verification protocol for every future change

This is the process the user has explicitly required, repeatedly, after several early
rounds where "should work now" turned out to still be broken:

**Before editing:** print current branch, `git status --short`, and the exact current
content of whatever you're about to change. If the working tree isn't clean and you
weren't told to build on top of existing uncommitted work, stop and ask.

**After editing:**
1. `npm run build` — must be 0 errors.
2. Print the exact diff (`git diff` or per-file).
3. Run the banned-pattern scan (§3) — must be clean (only pre-existing comments).
4. Confirm (via `git diff --stat` against each) that any file you weren't asked to
   touch — especially `useSoftPageHandoff.ts`, `useSectionSettle.ts`,
   `useWorkflowWalkthrough.ts`, `ProjectCard.tsx` — shows **zero diff** unless the task
   explicitly required changing it.
5. Actually verify live — start `npm run preview` (or `npm run dev`), navigate with
   Puppeteer (or ask the user to look), and take real screenshots of whatever changed.
   Don't report "done" from build success alone.
6. Write an `UPDATE_REPORT_2026-07-25_<TOPIC>.md` (or dated for whatever day you're
   working) documenting: what changed, why, exact verification performed, and anything
   still uncertain or pending the user's own look.
7. **Never commit or push without an explicit "go commit" / "go push" from the user**,
   even if everything checks out. This has been asked for by name in every single pass
   this session.

## 9. Deploy process, if/when asked

```
npm run build
rm -rf docs && mkdir docs && cp -r dist/* docs/ && touch docs/.nojekyll
git status --short   # confirm docs/ picked up the new asset hashes
```
`docs/index.html` should reference the same JS/CSS hash as the fresh `dist/index.html`
— verify with `grep -o 'assets/index-[A-Za-z0-9]*\.\(js\|css\)' docs/index.html`. Then
commit with an explicit message and only push if told to. Remember: this branch has
never been merged to `main`, so pushing this branch alone does not update the live site
— that needs a separate, explicit conversation with the user about merging.

## 10. If the user asks you to continue the ambient background work specifically

Read `UPDATE_REPORT_2026-07-25_CONTINUOUS_PLASMA_GROWTH.md` (the most recent one) in
full first — it has the exact current architecture and constants: `uDriftY` × 0.22,
`uStretch` × 0.45, `uMorph` × 0.6, `uFlowOffset` × 4.5 (all scaled by the same
`smoothedProgress`), the `colorStops` array (`['#1f7a55', '#0e5f45', '#0c7d72',
'#5c6b35']`), and the continuous opacity formula (`floorOpacity + (opacity - floorOpacity)
* Math.exp(-4.2 * smoothedProgress)`, floor = `opacity * 0.32`). **As of this pass,
`--ambient-opacity` no longer exists anywhere** — do not reintroduce a CSS/section-keyed
opacity variable for the ambient layer; that's the exact thing that was just removed
because it read as "stepped," not continuous. Any tuning should adjust the constants
above (all in `Plasma.jsx`'s render loop) or the `colorStops` array, not add
section-branching back. Do not re-derive these from scratch; adjust from the documented
starting point, and re-verify Hero specifically stays visually unchanged at
`scrollY:0` after any tuning change (that's the one invariant that's been preserved
through every correction round so far). Also re-verify continuity specifically, not just
individual screenshots — take a sequence at ~5 scroll depths and confirm each one looks
like a plausible in-between of its neighbors, since "looks fine in isolation" is exactly
what the earlier, stepped version also achieved.
