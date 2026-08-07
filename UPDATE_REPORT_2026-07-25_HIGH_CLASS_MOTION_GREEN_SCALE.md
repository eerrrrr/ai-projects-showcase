# Update report — Pass 2: high-class motion, green accent scale, proof-placeholder cleanup

**Date:** 2026-07-25
**Branch:** `motion/soft-section-handoff`, built on top of checkpoint commit `4c0b651`
("Checkpoint systems structure before full motion polish")
**Scope:** proof-placeholder fallback, a new scroll-stop settle hook (all systems + footer),
a new passive accent-section detector, CSS accent-scale variables, and a nav-offset
correctness fix to the already-accepted Hero↔Systems hook. No workflow state, no
Selected-systems structure, no copy meaning touched.

## Starting state (printed per protocol)

```
$ git branch --show-current
motion/soft-section-handoff
$ git log --oneline -1
4c0b651 Checkpoint systems structure before full motion polish
$ rg -n "useSoftPageHandoff|addEventListener\('wheel|addEventListener\('scroll|scrollTo|scrollIntoView|scroll-snap|activeStep|setExpanded|StageMedia|Proof capture to be added|useWorkflowWalkthrough" src
```
Confirmed the checkpoint existed before any edit in this pass — working tree was clean at
`4c0b651`. Scan confirmed exactly one wheel listener (`useSoftPageHandoff`), zero scroll
listeners yet, the "Proof capture to be added." string existed in exactly one place
(`StageMedia.tsx`), and no scroll-snap anywhere.

**Also checked before designing anything**: `public/case-media/` contains only
`README.txt` files in each of the 4 folders that ever had an `image` path referenced —
**zero real screenshots exist anywhere on the site**, for any of the 7 systems. This
matters: the placeholder problem isn't specific to Systems 05-07, it's universal. Good
thing this was checked before assuming a narrower fix.

## A. Proof placeholder replaced with an honest, quiet fallback

`StageMedia.tsx` rewritten: shows the real image if one exists and loads; otherwise, if
the stage has a `caption` (already-written, human-approved copy — not new proof), shows
it as one quiet line via a new `.stage-evidence-note` class; otherwise renders **nothing**
— no box, no border, no apology text. The large dashed "Proof capture to be added." box
and its CSS rule (`.stage-media-placeholder`) are gone.

The suggested example numbers in the original request ("4 pass · 2 language-risk · 2
reject-location · 1 missing-data") were **not used** — that exact breakdown doesn't exist
anywhere in `projects.json` (the verified data is just `keyNumber: "9"` +
`keyLabel: "mock listings screened · 4 review states · 0 silent drops"`), so writing it
would have been inventing unverified proof, which the request itself said not to do.
Every stage's existing `caption` (where present) is reused verbatim instead — zero new
numbers or claims introduced anywhere.

## B. Section settle extended past Hero↔Systems — new, separate hook

`useSoftPageHandoff` (the accepted Pass-0 pilot) is **unchanged in its core logic** —
still exclusively owns the Hero↔Selected-systems handoff via wheel interception. A new,
independent hook, `useSectionSettle.ts`, handles everything from Selected systems onward:

- Listens to passive `scroll` events only — **never** `preventDefault`, **never**
  intercepts wheel input.
- Debounces 200ms after scrolling actually stops, then checks whether the viewport
  landed within ~18% of a viewport-height of a tracked boundary (each of the 7 `.project`
  sections + the footer). If so, nudges to that exact boundary; otherwise does nothing.
- Skips entirely whenever `.project:not(.project--collapsed)` (a system's "View details"
  is open) or `.w-step--active` (a "How it works" step is open) exists anywhere on the
  page — detected via existing CSS state classes only, so this hook never reads or
  writes any workflow/expand state itself.
- `ENABLE_SECTION_SETTLE` feature flag; disabled entirely under
  `prefers-reduced-motion: reduce`.

**Why Selected systems isn't itself a settle target**: `useSoftPageHandoff` already owns
arriving there — including it here too would mean two hooks racing for the same
boundary. This hook's tracked list starts at System 01.

## C. Green accent scale — passive detector + CSS variables only

New `useAccentSection.ts`: a **read-only** `IntersectionObserver` that watches Hero,
Selected systems, each of the 7 `.project` sections, and the footer, and stamps
`data-accent-section="..."` on `<html>` for whichever is currently most centered. It
never calls `scrollTo`, never touches React state, never reads workflow/expand state —
purely a CSS hook-up.

`global.css` gained a new `--accent-rgb` variable (used only by the existing
`.w-step--active` faint background tint, which was previously a hardcoded
`rgba(30,107,78,.03)` matching the *old* single default accent — now it correctly
follows the active section too) plus 9 `:root[data-accent-section="..."]` blocks, one per
section, each overriding `--accent`/`--accent-rgb`/`--accent-soft` with the palette you
supplied:

```
hero:#1f6f55  systems:#1e6b4e  system01:#176b50  system02:#155d45
system03:#14766f  system04:#5f7352  system05:#557044  system06:#6f7042  system07:#217a68
```

Kept deliberately narrow in scope, per "apply only to..." / "do not apply to...":
- Added `transition:color/background-color/border-color/box-shadow .7s ease` only to the
  handful of selectors that render `--accent` as a **persistent** (non-hover-gated)
  color: `.mono--accent`, `.how-it-works-btn`, `.w-step-marker::after`, `.w-step--active`,
  `.w-recap`, `.w-recap-takeaway`.
- **Did not** slow down hover-triggered transitions (chip hover, nav link hover, etc.) —
  those keep their existing fast ~0.15-0.18s feel. A slow transition belongs on an
  ambient, scroll-driven shift; hover feedback should stay responsive. Verified this
  didn't accidentally happen (see Verification below).
- Did not touch `--ink`/`--ink-2`/`--ink-3`/body text/headings — confirmed `h1` and
  `body` computed color stayed `rgb(17,17,16)` regardless of accent section.
- Did not add `--accent-line` — no existing CSS rule would have consumed it, and adding
  an unused variable is dead weight, not a real feature.
- `--accent-soft` does vary per section too (per your variable list), but the 9 values
  are all extremely close pale tints (e.g. `#e9f1ec` vs `#e7efe9`) — deliberately, so
  hover backgrounds don't create a jarring "striped" page as you scroll, just a whisper
  of warmth shift.

## D. Section rhythm — one real correctness fix, not a redesign

Investigating the "Selected systems / System 01 overlap" symptom led to a genuine bug,
not just a spacing question: the sticky nav (`position:sticky`, 56px tall) was never
accounted for in either hook's landing math. `.project` already has its own
`scrollMarginTop: 88px` for anchor-link jumps, but `window.scrollTo({top: X})` **ignores
CSS scroll-margin entirely** — so `useSoftPageHandoff`'s existing Hero→Systems handoff
was landing with Selected systems' heading flush at `rect.top: 0`, tucked slightly under
the translucent nav.

Fixed by adding a shared `NAV_OFFSET = 88` constant (matching `.project`'s own value) to
both `useSoftPageHandoff.ts` and `useSectionSettle.ts`, so every handoff/settle now rests
a section 88px below the viewport top — the same breathing room a normal anchor click
already gets. This also required updating `useSoftPageHandoff`'s `atSystemsTop`/`pastHero`
checks to compare against the new resting position (88px) instead of 0 — re-verified both
directions still work correctly after the change (see below).

No `min-height`/padding values were changed — `.systems-overview` and `.project` both
already use `min-height: calc(100vh - 56px)`, which is appropriate; the actual "half a
section on screen" symptom was a landing-position bug, not a sizing one, so that's what
got fixed.

## Guardrails honored

- No `preventDefault` anywhere in `useSectionSettle` or `useAccentSection` — confirmed by
  reading both files; only `useSoftPageHandoff` (already-accepted) calls it, unchanged.
- No content skipped — `useSectionSettle`'s targets are every single system in order,
  never more than one boundary away.
- No workflow state read or written by either new hook — confirmed via `rg` (matches for
  `activeStep`/`setExpanded` are only inside `useWorkflowWalkthrough.ts`/`ProjectCard.tsx`
  themselves, not the motion hooks).
- `rg -n "useSectionScroll|scroll-snap|scrollIntoView|location\.hash|hashchange|PLAY|PREVIOUS|NEXT|RESTART" src` — clean, only pre-existing comments.

## Build & verification

`npm run build` — 0 errors throughout every step of this pass.

**Live tests, Puppeteer at 1440x900.** Two of this pass's mechanisms
(`window.scrollTo({behavior:'smooth'})` actually animating, and `IntersectionObserver`
firing) are exactly the two APIs this session's Puppeteer harness has already been shown
to handle inconsistently (`document.hidden` stuck `true` even with `headless:false` —
documented in the two prior reports). Rather than re-litigate that limitation, each
mechanism was verified at the layer that's actually deterministic in this harness:

| What | How verified | Result |
|---|---|---|
| `useSoftPageHandoff` Hero→Systems, with new nav offset | Real wheel dispatch + scrollY read | Lands at `rect.top: 88` exactly (was `0` before this pass's fix) |
| `useSoftPageHandoff` Systems→Hero | Real wheel dispatch + scrollY read | Returns to `scrollY: 0` |
| `useSectionSettle` decision logic | Patched `window.scrollTo` to record calls (bypasses the animation-ticking flakiness, proves the *decision*) | Positioned 60px short of System 01's resting spot → correctly called `scrollTo({top: 1703.04, behavior:'smooth'})`, exactly System 01's true resting position |
| `useSectionSettle` — deep mid-section | Same call-recording technique | Zero calls — correctly does nothing |
| `useSectionSettle` — suppressed during "How it works" | Started Project 01's walkthrough, then positioned near System 02's boundary | Zero calls — correctly suppressed |
| `useSectionSettle` — suppressed while "View details" open | Expanded Project 01, positioned near System 02's boundary | Zero calls — correctly suppressed |
| Accent-scale CSS wiring | Manually set `data-accent-section` for 5 values, read `getComputedStyle` | Each resolved to exactly its assigned hex |
| Accent-scale doesn't touch readability | Read `h1`/`body` computed color while accent forced to `system05` | Stayed `rgb(17,17,16)` (`--ink`), unaffected |
| Accent-scale consistency across consumers | Read `.p-num`, `.proof-chip`, `.how-it-works-btn` computed colors together | All three matched the same section's hex exactly |
| Accent-scale live `IntersectionObserver` | Navigated + scrolled, checked `data-accent-section` | Updated itself correctly to `system07` mid-test — the observer *is* capable of firing in this harness, just not reliably on every isolated call (consistent with prior findings) |
| HOW IT WORKS still starts/completes | Clicked "How it works" | Step 1 active immediately, unaffected by any of this pass's changes |
| Proof placeholder gone | Read rendered HTML for stages with no image/caption | No `stage-media-placeholder` class exists anywhere in the built bundle (rule deleted); `.stage-evidence-note` renders in its place where a caption exists |

`rg` for every banned pattern — clean.

## Not touched this pass

Project copy/meaning, verified evidence claims, `useWorkflowWalkthrough.ts`, auto-zip
logic's own code (only benefits from `useSectionSettle`'s "don't fight an open project"
guard, doesn't need any change itself), Selected-systems card structure/chips, Hero copy,
deployment/`docs/` (not rebuilt — still pending your visual approval).

## Not committed, not pushed

Still on `motion/soft-section-handoff`, on top of the `4c0b651` checkpoint. Awaiting your
visual review before any further commit.
