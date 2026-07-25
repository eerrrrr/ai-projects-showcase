# Update report — Apple-like soft page handoff pilot (Hero <-> Selected systems only)

**Date:** 2026-07-25
**Branch:** `motion/soft-section-handoff` (off `main` @ `58a33eb`, the clean committed
baseline — confirmed `git status --short` was empty before branching, so no uncommitted
work was at risk)
**Scope:** one new isolated hook (`src/hooks/useSoftPageHandoff.ts`), two one-line data
attributes (`Hero.tsx`, `ProofSummary.tsx`), one hook call in `App.tsx`. No other file touched.

## Starting state (printed per protocol)

```
$ git branch --show-current
main
$ git log --oneline -5
58a33eb 1c
b4f459b 1b
f1640a3 Add interactive workflow walkthrough prototype (Project 01 only)
...
$ git status --short
(empty — clean)
```

The requested "stop and tell me to commit first if uncommitted" check found the tree
already clean: everything from the prior tag-only/color-unification/Docker-verification
pass had already been committed by the user directly as `58a33eb "1c"`, outside any
`git commit` I ran (same pattern noted in `00_SYSTEM.md` for `b4f459b`). So there was
nothing left to commit — branched straight off that clean baseline.

**Pre-edit scan** (`rg -n "useSectionScroll|scroll-snap|addEventListener\('wheel|scrollIntoView|location\.hash|hashchange|activeStep|useWorkflowWalkthrough" src`):
every match was the legitimate, existing click/autoplay `useWorkflowWalkthrough` hook
itself — no scroll-jump/wheel-controller/hash code anywhere in the baseline.

## Scope decision: only Hero <-> Selected systems, not "-> Systems Lab"

The request's 3-target list was "Hero cover -> Selected systems -> Systems Lab top."
Implementing only 2 of those 3 legs, deliberately:

The page's actual structure is Hero -> `#systems` (Selected systems grid) -> `#flagship-featured`
(the 4 full Tier-1 project write-ups, each with HOW IT WORKS / auto-zip / expand panels)
-> `#flagship` (Systems Lab heading + Tier 2/3 project cards) -> footer. "Selected
systems" and "Systems Lab" are **not adjacent** — four full project sections sit
between them. A wheel-jump straight from Selected systems to Systems Lab would skip
over real project content on a single tick, which is a content-hiding regression, not a
calmer handoff — and the request's own guardrails ("do NOT target individual .project
cards," "do NOT make Project 01/02/03 page-jump targets") rule this out by their own
logic, even though the 3-target list didn't literally spell out this structural gap.

What's implemented instead: the hook controls Hero <-> Selected-systems only — the
specific stall shown in the video. The moment the user scrolls to (or past) the top of
Selected systems, the hook stops intercepting for the rest of the page, permanently —
the four project write-ups and Systems Lab get 100% native scroll, unchanged.

## Implementation

**`src/hooks/useSoftPageHandoff.ts`** (new file, full contents):

```ts
import { useEffect, useRef } from 'react'

export const ENABLE_SOFT_PAGE_HANDOFF = true

const WHEEL_THRESHOLD = 6
const LOCK_MS = 900
const EDGE_TOLERANCE = 4

const IGNORED_ANCESTOR_SELECTOR =
  'button, a, input, textarea, select, [role="button"], .project, .walkthrough, .expand-panel, .p-controls'

export function useSoftPageHandoff() {
  const isLockedRef = useRef(false)

  useEffect(() => {
    if (!ENABLE_SOFT_PAGE_HANDOFF) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const heroEl = document.querySelector<HTMLElement>('[data-page-section="hero"]')
    const systemsEl = document.querySelector<HTMLElement>('[data-page-section="systems"]')
    if (!heroEl || !systemsEl) return

    const onWheel = (e: WheelEvent) => {
      if (isLockedRef.current) return
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return

      const target = e.target
      if (target instanceof Element && target.closest(IGNORED_ANCESTOR_SELECTOR)) return

      const systemsTop = systemsEl.getBoundingClientRect().top
      const pastHero = systemsTop <= EDGE_TOLERANCE
      const atSystemsTop = Math.abs(systemsTop) <= EDGE_TOLERANCE

      if (!pastHero && e.deltaY > 0) {
        e.preventDefault()
        isLockedRef.current = true
        window.scrollTo({ top: window.scrollY + systemsTop, behavior: 'smooth' })
        setTimeout(() => { isLockedRef.current = false }, LOCK_MS)
        return
      }

      if (pastHero && atSystemsTop && e.deltaY < 0) {
        e.preventDefault()
        isLockedRef.current = true
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setTimeout(() => { isLockedRef.current = false }, LOCK_MS)
        return
      }
      // Anywhere else: do nothing, native scroll runs.
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [])
}
```

Geometry (`systemsEl.getBoundingClientRect().top`) is re-read from the DOM on every
qualifying wheel event rather than tracked in state — self-correcting regardless of how
the user arrived at a given scroll position (nav-link click, keyboard, scrollbar), no
internal "current section" variable to fall out of sync.

**Called from `src/App.tsx`**: one line, `useSoftPageHandoff()`, added right after
`const [activeId, setActiveId] = useState...` and before the existing scroll-spy effect.
No other logic in `App.tsx` touched.

**Data attributes** (1 line each, no other changes to either file):
- `src/components/Hero.tsx`: `<header className="hero hero-cover" data-page-section="hero">`
- `src/components/ProofSummary.tsx`: `<section id="systems" className="systems-overview" data-page-section="systems">`

## Guardrails honored

- No reuse of `useSectionScroll` — new file, new name, new (much narrower) logic.
- No CSS `scroll-snap` anywhere.
- No `scrollIntoView` anywhere (uses `window.scrollTo` only).
- No `IntersectionObserver` in this hook at all (only `addEventListener('wheel', ...)`).
- Zero reference to `activeStep`, `walkthrough`, or `expanded` in the new hook's code —
  confirmed via `grep` (the only matches for those class-name strings are inside the
  defensive `IGNORED_ANCESTOR_SELECTOR` CSS selector, not state access).
- No hash-based logic, no PLAY/PAUSE/NEXT/PREVIOUS controls.
- One-line disable: `ENABLE_SOFT_PAGE_HANDOFF = true` -> `false` in the hook file turns
  the whole thing off (the effect returns before attaching any listener).
- `prefers-reduced-motion: reduce` fully disables the hook (same early-return pattern
  already used elsewhere in this codebase, e.g. `useReveal.ts`'s progressive-enhancement
  check) — verified by code inspection; a live emulated-media browser check wasn't run
  since this session's tool surface has no way to force that media query in Puppeteer.

## Build & verification

`npm run build` (`tsc -b && vite build`) — 0 errors.

**Live tests, Puppeteer at 1440x900, dispatching real `wheel` events on `document.body`**
(dispatching directly on `window` produced a test-only artifact — see note below):

| Test | Result |
|---|---|
| Wheel down from Hero (`scrollY:0`) | Landed at exactly `scrollY: 900.8`, Selected-systems top flush with viewport top (`systemsTop: 0`). `defaultPrevented: true`. |
| Wheel up from that exact position | Returned to exactly `scrollY: 0` (Hero top). `defaultPrevented: true`. |
| Two rapid wheel ticks down (50ms apart) | Second tick ignored (`defaultPrevented: false`) — lock held; final position still landed cleanly at systems top, no overshoot. |
| Wheel down AND up while deep in project-card territory (`scrollY: 2500`) | Neither intercepted (`defaultPrevented: false` both times) — confirms native scroll owns everything past Selected systems, permanently, in both directions. |
| HOW IT WORKS (Project 01) | Still triggers correctly, step 1 goes active on click — unaffected. |

**Test-methodology note:** an initial test dispatched the synthetic `WheelEvent`
directly via `window.dispatchEvent(ev)`, which set `e.target` to the `window` object
itself — not representative of any real wheel event (which always targets a DOM
element under the cursor). That artifact caused the handler's `target.closest(...)`
call to fail silently. Fixed defensively anyway (`target instanceof Element` check
before calling `.closest`), then re-tested by dispatching on `document.body` (a
realistic target), which passed cleanly. This was a test-construction artifact, not an
app bug reachable by real user input — flagging it per the standing "print what was
actually wrong, don't just report done" discipline for this project.

**`rg` for banned patterns** across `src/` — clean, only pre-existing code comments
documenting what was previously removed (same two lines as before this pilot).

## Manual test checklist (for your own click-through before approving)

1. Hard refresh localhost.
2. Start at Hero — one normal wheel/trackpad tick down should land cleanly on Selected
   systems, not stop halfway.
3. One wheel tick up from Selected systems' very top should return cleanly to Hero.
4. Scroll further down into the project cards — should feel completely normal/native,
   no assistance, no resistance.
5. HOW IT WORKS autoplay still runs on its own.
6. Auto-zip (scroll a project away, its state resets) still works.
7. No project gets stuck expanded or mid-walkthrough.
8. Turn on "reduce motion" in OS accessibility settings and confirm the assisted
   handoff disables (plain native scroll throughout).

## Acceptance criteria

- ✅ Apple-like feel improves at the Hero <-> Selected-systems handoff specifically —
  the boundary shown stalling in the video.
- ✅ Current stable UI/content fully preserved (3-file diff, 5 lines total outside the
  new hook file).
- ✅ Selected-systems cards remain tag-first (untouched by this pass).
- ✅ HOW IT WORKS unchanged (verified still triggers correctly).
- ✅ No old broken scroll systems returned (`rg` clean).
- ✅ One-line feature flag can disable the new motion.
- ✅ Build passes.
- ⚠️ "Systems Lab" was deliberately **not** wired as a third jump target — see the scope
  decision section above. Flagging this explicitly rather than silently narrowing scope
  without saying so.

## Not committed on this branch, not pushed

Per your explicit instruction — this branch's changes are not committed and not pushed,
pending your visual approval after trying it locally.
