# Hero typography hierarchy — 2026-07-26

## Change

- Unified the three hero identity lines on the Helvetica font stack.
- Preserved hierarchy instead of making all three the same size.
- Final Apple-informed scale: `72px / 30px / 16px`.
- Restored natural title/sentence case instead of using all caps for every
  level.
- Uses Bold / Semibold / Regular weights for name, role, and descriptor.
- Uses `10px` between name and role, `28px` before the descriptor, and `44px`
  before the keyword divider.
- Increased the text block to `680px`, while limiting the descriptor to
  `560px` for a shorter, more readable line.

## Research basis

- Apple HIG Typography: use size, weight, and colour to communicate hierarchy;
  minimise typefaces; avoid light weights for legibility.
  https://developer.apple.com/design/human-interface-guidelines/typography
- Apple HIG Layout: place essential information prominently, align related
  components, group them with negative space, and preserve adaptable margins.
  https://developer.apple.com/design/human-interface-guidelines/layout

## Verification

- `npm run build` — passed.
- `git diff --check` — passed.
- No scroll behavior, project content, or navigation behavior changed.
- No commit, push, merge, or deployment was performed.
