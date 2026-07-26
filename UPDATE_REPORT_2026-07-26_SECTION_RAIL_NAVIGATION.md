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
