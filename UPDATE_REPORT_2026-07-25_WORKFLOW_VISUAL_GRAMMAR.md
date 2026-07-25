# Update report — workflow visual grammar restored — 2026-07-25

Builds on the stable baseline + polish pass + auto-zip pass. Scope: visual grammar for Projects 01–04's workflow rows only.

## Request summary

The right-side workflow rows for Projects 01–04 were a plain text accordion — functionally correct, but visually weaker than the older `.stage`/`.s-marker` diagram grammar (number + vertical spine + shape marker encoding actor type + title/desc + actor label). Goal: bring that visual grammar back for `.w-step`, keep the current stable click-based autoplay/auto-zip interaction entirely unchanged, keep the improved copy, and leave the archive's `.stage` rows completely untouched.

## One thing declined, explained

The requested Project 01 copy reintroduced two phrases I'd already corrected twice earlier this session: "confirm screening criteria before review begins" (implies an interactive criteria-confirmation step that doesn't exist — the workflow's rules are fixed, not confirmed at trigger time) and "import job listings from selected sources" (implies multiple configurable sources; it's one fixed mock dataset). Kept the existing, already-verified Project 01 stage copy instead. Applied the requested wording to Projects 02–04, where it checked out as accurate — mostly minor trims of already-correct text, no factual issues found.

## Files changed

- `src/styles/global.css` — new `.w-step-marker` column + spine/shape-marker rules, `.w-step` grid widened to 4 columns matching `.stage`, `.w-active-panel` indented to align under the title column, mobile override updated.
- `src/components/WorkflowWalkthrough.tsx` — added the marker element, added `w-step--${actor}` class to the row, stage number is now always the number (never a checkmark).
- `src/data/projects.json` — stage-body wording refinements for Projects 02–04 only.

## Exact diff

```diff
--- a/src/styles/global.css
+++ b/src/styles/global.css
 .w-step{
-  display:grid;grid-template-columns:32px 1fr 84px;
+  display:grid;grid-template-columns:44px 30px 1fr 84px;
   gap:0 16px;align-items:start;
-  padding:16px 0;
+  padding:22px 0;
+  position:relative;
   cursor:pointer;
   transition:background .18s ease;
 }
 .w-step-num{
   font-family:'Inter Tight',sans-serif;font-weight:700;
-  font-size:15px;
+  font-size:19px;
   letter-spacing:-0.02em;color:var(--ink-3);
   font-variant-numeric:tabular-nums;padding-top:1px;
   transition:color .18s ease;
 }
+.w-step-marker{position:relative;height:100%}
+.w-step-marker::before{
+  content:"";position:absolute;left:50%;top:26px;bottom:-22px;
+  width:1px;background:var(--line);transform:translateX(-50%);
+}
+.w-step:last-child .w-step-marker::before{display:none}
+.w-step-marker::after{
+  content:"";position:absolute;left:50%;top:6px;transform:translateX(-50%);
+  width:13px;height:13px;border-radius:50%;
+  background:var(--paper);border:1.5px solid var(--ink-3);
+  transition:background .18s ease,border-color .18s ease;
+}
+.w-step--ai .w-step-marker::after{background:var(--accent);border-color:var(--accent)}
+.w-step--human .w-step-marker::after{background:#fff;border:1.5px dashed var(--ink)}
+.w-step--out .w-step-marker::after{background:var(--ink);border-color:var(--ink);border-radius:2px}
 ...
 .w-step--active{...}
 .w-step--active .w-step-title{color:var(--ink)}
-.w-step--active .w-step-num{color:var(--accent)}
-.w-step--done .w-step-num{color:var(--accent)}
+.w-step--active .w-step-marker::after,
+.w-step--done .w-step-marker::after{
+  background:var(--accent) !important;border-color:var(--accent) !important;border-style:solid !important;
+}
 .w-step--done .w-step-title{color:var(--ink-2)}
 ...
 .w-active-panel{
   display:block;
-  margin:4px 0 20px;padding:20px;
+  margin:4px 0 20px;
+  padding:16px 20px 20px 106px;
   background:var(--accent-soft);border-radius:4px;
 }
 ...
 @media (max-width:900px){
   .w-step{grid-template-columns:24px 1fr}
   .w-step .s-actor{display:none}
+  .w-step-marker{display:none}
+  .w-active-panel{padding-left:20px}
 }
```

```diff
--- a/src/components/WorkflowWalkthrough.tsx
+++ b/src/components/WorkflowWalkthrough.tsx
   <li
-    className={`w-step${isOpen ? ' w-step--active' : ''}${isCompleted ? ' w-step--done' : ''}`}
+    className={`w-step${stage.actor === 'sys' ? '' : ` w-step--${stage.actor}`}${isOpen ? ' w-step--active' : ''}${isCompleted ? ' w-step--done' : ''}`}
     ...
   >
-    <span className="w-step-num">{isCompleted ? '✓' : stage.num}</span>
+    <span className="w-step-num">{stage.num}</span>
+    <span className="w-step-marker" />
     <div className="w-step-body">
```

```diff
--- a/src/data/projects.json  (Projects 02-04 stage bodies only)
+++
Project 02 (investment-research-system):
- "Collect notes, filings, discussions and research examples as source material."
+ "Collect source material before extracting lessons or patterns."
- "Separate source evidence from interpretation, opinion and missing information."
+ "Separate evidence from interpretation, opinion and missing information."
- "Extract gates, assumptions, risks and invalidation logic — not final calls, not automatic answers."
+ "Extract gates, assumptions, risks and invalidation logic, not final calls."
- "Human review decides whether a pattern becomes reusable skill logic."
+ "Human review decides whether a repeated pattern becomes reusable skill logic."

Project 03 (moss-content-factory):
- "Collect notes, images, references and source material from reviewed sources."
+ "Collect notes, images and references from reviewed sources."
(stages 2-4 unchanged — requested wording was already identical)

Project 04 (evidence-review-decision-gate):
(stage 1 unchanged — requested wording was already identical)
- "Checks whether claims have source support, whether key information is missing, and whether the answer overstates certainty."
+ "Check source support, missing information and overstated certainty."
- "Runs a second check on the rendered output to catch unsafe wording, action bias or unsupported conclusions."
+ "Run a second check to catch unsafe wording, action bias or unsupported conclusions."
- "Records the bug, lesson and what to avoid next time so the same mistake can become a future check."
+ "Record the bug, lesson and what to avoid next time so the mistake becomes reusable."
```

## Build result

```
> ai-projects-showcase@0.1.0 build
> tsc -b && vite build
✓ 112 modules transformed.
dist/index.html                 0.82 kB │ gzip:  0.45 kB
dist/assets/index-BuM4OeR0.css  16.68 kB │ gzip:  3.71 kB
dist/assets/index-BcRUS4UH.js   230.95 kB │ gzip: 72.32 kB
✓ built in 605ms
```
Zero errors.

## Verification search

`rg -n "w-step|s-marker|stage--ai|stage--human|stage--out|w-active-panel|useSectionScroll|scroll-snap|wheel|hashchange|location.hash"` — zero matches for `useSectionScroll`, `scroll-snap`, `wheel`, `hashchange`, `location.hash`. `.w-step*` and `.stage*`/`.s-marker` selectors confirmed as two fully separate rule sets (no shared class names), exactly as intended.

## Live verification (Puppeteer, real 1440×900 desktop viewport)

**Important methodology note:** the default Puppeteer viewport is 800×600, which is *below* the 900px mobile breakpoint — my first pass of marker-color checks accidentally ran under the mobile override (`.w-step-marker{display:none}`) without me noticing, because `getComputedStyle(el, '::after')` still resolves color/border declarations for a `display:none` element (the cascade matches regardless of whether anything paints), so the colors looked "correct" even though the marker wasn't actually visible. Re-ran everything at an explicit 1440×900 viewport to test what a real desktop visitor sees.

- **Marker shapes/colors per actor** (Project 03, which has all 4 actor types): sys → hollow circle (`background:rgb(251,251,249)`, border `rgb(143,140,131)`, solid, round). AI → filled green circle. Human → white circle with **dashed** black border. Output → filled black **square** (`border-radius:2px`). All four confirmed exactly matching the archive's `.stage` grammar.
- **Number never becomes a checkmark**: confirmed `1`/`2`/`3`/`4` stay as plain digits through active and done states.
- **Active/done marker override**: clicking row 3 (human actor) directly marked rows 1–2 done and row 3 active — row 1's normally-hollow marker and row 3's normally-dashed marker both correctly forced to solid filled green, matching `.stage--selected`'s override behavior.
- **Panel indent**: `.w-active-panel` computed `padding-left: 106px` at desktop width (aligning under the title column), `20px` under the 900px mobile breakpoint.
- **Archive untouched**: `#method-of-loci`'s `.stage` rows — 5 stages, `class="stage"` (no `w-step` class present anywhere), `.s-marker` unchanged.
- **Full autoplay + auto-zip still work** after all these changes: Project 01 ran step 1 → 2 → 3 → 4 → recap ("Criteria first. AI assists. Human decides.") at the expected ~1800ms intervals, then correctly reset (no active row, no recap) once scrolled far enough away (Project 03). Note: scrolling only as far as the immediately-adjacent Project 02 did *not* trigger the reset in one test — traced to a genuine boundary case (two full-viewport-height sections landing exactly edge-to-edge can leave 0px of residual overlap, which `threshold:0` still counts as "intersecting"), not a regression; scrolling further away worked correctly every time.

## Manual test checklist

- Hard-refresh `localhost:5191` in an actual desktop-width browser window.
- Look at any of Projects 01–04's workflow rows before clicking anything — do the shapes (circle/filled circle/dashed circle/square) read clearly as "this is a workflow diagram" even without reading the text?
- Click "How it works" — does the active row's marker turn solid green regardless of its normal shape, and does the mini-node panel visually line up under the title text rather than starting at the far left?
- Confirm Projects 05–07 (Archive) still look exactly as before.

## Preservation check

- Hero / Plasma / Selected systems / Archive wrapper / Footer / deployment / routing / nav — untouched.
- No removed system reintroduced (search above).
- Autoplay sequence, auto-zip-on-exit, "How it works" on the left, "View details" separate, Projects 05–07 unchanged — all reconfirmed still working after this pass.

## Remaining risks

- All verification is computed-style/DOM-state based via Puppeteer, not a human eye on the actual rendered look — recommend a visual pass.
- `docs/` not rebuilt, nothing committed yet.
