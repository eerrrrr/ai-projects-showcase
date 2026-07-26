# Section rail navigation — 2026-07-26

## Goal

Replace the attempted page-by-page feeling with a professional, ordered
chapter indicator that does not control normal page scrolling.

## Pattern

Implemented a **Vertical Chapter Navigation / Section Rail**, not a task
progress indicator:

- nine ordered links: Cover, Selected systems, and seven projects;
- current project indicated by number, colour and a longer rule;
- Cover and Selected systems receive their own current states;
- Selected systems cards link to the same project anchors used by the rail;
- native anchor navigation;
- `aria-current="location"` on the active project;
- visible keyboard focus;
- compact `01 / 07` counter below `1350px`;
- rail remains available from the cover onward.
- Follow-up visual pass enlarged the wide-screen rail by roughly 35%:
  `11px` labels/numbers, `28px` link targets, `34px` resting rules, and an
  `80px` current rule. The compact breakpoint remains unchanged.
- Final external-link placement: Visual Portfolio and GitHub remain in the
  sticky top navigation at every viewport width. Both use accent green and
  an `11px` Extra Bold (`800`) treatment for stronger first-visit visibility.
  The temporary rail-above
  placement was removed so the chapter rail has one job: in-page navigation.
- Final CTA hierarchy: Visual Portfolio is the single filled accent action in
  the header; LinkedIn and GitHub use matching Extra Bold outline actions.
  All three links remain available, but only the visual portfolio receives
  filled primary emphasis. This replaces repeated font-weight escalation with
  shape, contrast, and whitespace while preserving anchor-link semantics.
- Final header order is `Systems → LinkedIn → GitHub → Visual Portfolio`, so
  the single filled primary action sits at the right edge as the visual
  endpoint of the navigation group.
- Navigation cue decision: there is one labelled `View systems` cue at the
  bottom centre of the cover. It is not repeated on every section because the
  chapter rail already provides direct section navigation, and repeated
  down-arrows would incorrectly imply slide-controlled scrolling.
- The desktop cover cue sits `10px` above the viewport edge; the mobile cue
  remains in normal flow.

## Scroll contract

- `html { scroll-behavior: auto; }`
- no wheel listener;
- no `preventDefault()` for scrolling;
- no `scrollTo()` or `scrollIntoView()` in the rail;
- no scroll snap;
- IntersectionObserver only updates the highlighted link.

## Professional references

- Adobe Spectrum Side Navigation:
  https://spectrum.adobe.com/page/side-navigation/
- GOV.UK Contents List:
  https://design-guide.publishing.service.gov.uk/components/content-list/
- W3C `aria-current` technique:
  https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA26
- USWDS Step Indicator guidance (used to avoid incorrectly presenting the
  projects as completed/pending task steps):
  https://designsystem.digital.gov/components/step-indicator/

## Verification

- `npm run build` — passed.
- `git diff --check` — passed.
- Nine rail links rendered.
- Cover produced `aria-current="location"` and the compact `Cover` label.
- Selected systems produced `aria-current="location"` and the compact
  `Systems` label.
- System 01 produced `aria-current="location"` and `01 / 07`.
- System 07 produced `aria-current="location"` and `07 / 07`.
- Clicking the System 01 card updated the URL, content position, rail current
  link, and compact counter together.
- Hash navigation placed the project below the sticky header.
- A test scroll requested `7077px` and settled at exactly `7077px`.
- No commit, push, merge, or deployment was performed.
