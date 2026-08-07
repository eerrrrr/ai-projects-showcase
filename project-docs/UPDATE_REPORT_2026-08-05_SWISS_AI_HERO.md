---
title: V2 Swiss hero + substantial Job Screening section — update report
date: 2026-08-05
branch: redesign/ui-v2
commit: not committed
---

# Swiss recruiter-first hero + Job Screening section (`/ai`)

## What was built

Followed the approved plan (`C:\Users\erinw\.claude\plans\rippling-scribbling-shore.md`)
after a round of explicit corrections. Scope: `/ai` only.

- **Hero**: `SwissHero.tsx` — the approved Gemini hero image (cardboard
  "AI Workflow Starter Pack" box), full-bleed, exact approved copy
  ("Erin Wong / AI Workflow Systems / Human-reviewed automation, data
  pipelines and reusable decision systems."), 4 clickable hotspots mapped
  to real `project.id`s, tiny whole-image parallax (rotateX ≤0.6°,
  rotateY ≤0.9°, translate ≤3px), `prefers-reduced-motion` support, and
  4 restrained numbered Swiss links as the mobile fallback (not pill chips).
- **Substantial Job Screening section**: `FeaturedCaseSection.tsx` —
  renders directly on `/ai` right after the hero: title, value line, key
  figures, Problem, Workflow sequence (actor-typed), a called-out
  human-review point, Result (including the safe-failure line), and a
  "View full case study" link. Not hidden behind a click-through.
- **Compact overview**: `SwissOverview.tsx` — the other 6 projects as
  tiles, ordered by tier/index, each with a real anchor id so hotspot
  clicks land correctly.
- **Reusable case-study page**: `CaseStudyLayout.tsx` +
  `src/pages/CaseStudyPage.tsx`, routed at `/ai/:projectId`. Only
  `job-application-filter` (the real `project.id` — not an invented slug)
  is wired to a built-out page; any other id gets a "not yet available,
  back to overview" state instead of a broken page. Verified live.
- **Routing**: `App.tsx`'s `/ai` route now renders `AiPortfolioV2Page`
  instead of `AiLandingPage`; `AiLandingPage.tsx` is untouched on disk —
  rollback is reverting one line.

## Corrections from the prior planning round, all implemented and verified

1. The older "process-automation framing" restructure plan was not
   executed — confirmed via `git diff --stat` showing zero changes to
   `projects.json`/`page-content.json`/`types.ts`.
2. Job Screening is substantial and inline on `/ai`, not hidden behind a
   route — verified live (screenshot).
3. Case-study route uses the real id: `/ai/job-application-filter` —
   verified it resolves; verified the old invented slug
   `/ai/job-screening-validation` correctly falls back to "not available"
   rather than breaking.
4. Hero copy is the exact approved text, stored in
   `src/data/v2HeroContent.ts`, not written into `page-content.json` —
   verified via DOM text extraction.
5. Mobile fallback is 4 numbered Swiss-style links, not pill chips —
   verified via mobile-viewport screenshot.
6. Hero motion values match the approved spec exactly — implemented as
   specified, code-verified.
7. No changes to verified figures, project descriptions, tier metadata,
   or actor typing anywhere — confirmed via `git diff --stat`.

## Verified live (Puppeteer, this session)

- `/ai` desktop (1400×1000): hero renders correctly, exact copy, 4
  hotspots present.
- Hotspot click → real `scrollIntoView` to the correct project section
  (measured: target landed 31px from viewport top, not a popup, not a
  route change).
- `/ai/job-application-filter`: full case-study renders with real data
  (Decision/Limitation/Failure handled all present, correct "next
  project" link).
- `/ai/job-screening-validation` (the old wrong slug): degrades to "not
  yet available" instead of breaking.
- Mobile (390×844): no horizontal overflow, 4 numbered links visible and
  correctly styled, hover labels correctly hidden.
- `/`, `/architecture`, `/about`: all still return 200 / render real
  content — unaffected by this change.
- `npm run build`: zero TypeScript errors. Only pre-existing chunk-size
  warning (from the unrelated 3D gateway's three.js bundle).
- `git diff --stat` on `projects.json`/`page-content.json`/`types.ts` and
  on the gateway/architecture/about pages: zero changes.

## Verified by code inspection only (not live-tested)

- `prefers-reduced-motion` handling: both the JS gate
  (`useReducedMotion()` in `SwissHero.tsx`) and the CSS
  `@media (prefers-reduced-motion: reduce)` fallback in `hero.css` are
  present and correctly wired, but the Puppeteer tooling available in
  this session doesn't expose CDP-level media-feature emulation, so this
  wasn't confirmed against an actual OS-level "reduce motion" toggle.
  Worth a manual check in a real browser before treating this as fully
  verified.

## Files changed

```
Modified:
  src/App.tsx                          (route swap, 2 new imports)
  project-docs/DESIGN.md               (filled in with real values)
  project-docs/MOTION_SPEC.md          (filled in with real values)

Added:
  project-docs/CLAUDE_RECRUITER_V2_FULL_BUILD_BRIEF.md
  public/media/v2/ai-workflow-hero.png (copy of D:\Download\Gemini_gi13qr.png)
  public/media/v2/ai-workflow-hero.webp (generated, 38KB vs 1.1MB PNG)
  src/data/heroHotspots.ts
  src/data/v2HeroContent.ts
  src/components/v2/SwissHero.tsx
  src/components/v2/FeaturedCaseSection.tsx
  src/components/v2/SwissOverview.tsx
  src/components/v2/CaseStudyLayout.tsx
  src/pages/AiPortfolioV2Page.tsx
  src/pages/CaseStudyPage.tsx
  src/styles/v2/tokens.css
  src/styles/v2/hero.css
  src/styles/v2/case-study.css

Untouched (confirmed via git diff --stat):
  src/data/projects.json
  src/data/page-content.json
  src/data/types.ts
  src/pages/AiLandingPage.tsx  (still present, rollback target)
  src/pages/HomeGatewayPage.tsx, ArchitecturePage.tsx, AboutPage.tsx
  src/components/gateway/**
  docs/  (build output, not touched)
  main branch
```

## Not done this pass (explicitly out of scope)

- No case-study pages for the other 6 projects — compact tiles only.
- No fix to the 3D gateway's popup+route click pattern at `/`.
- No commit, no push.

## Next step

Waiting for visual approval before any commit.
