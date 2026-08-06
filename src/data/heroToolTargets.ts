// Hero "Tool Target Registry" — generalised camera-focus/proximity model
// (see PORTFOLIO_V2_INTERACTION_AND_WORKFLOW_BUILD_PROMPT.md's 3rd
// interaction-correction pass). Replaces heroToolUsage.ts's ToolCluster
// registry (5 grouped hotspot buttons, click-to-pin) entirely — every
// individually visible, individually NAMED card on the box/table is now
// its own continuous proximity target; blank/unlabelled cardboard pieces
// are never targets.
//
// Coordinates are CENTER points (not top-left corners, unlike the old
// registry) with an elliptical reach radius, both as percentages of the
// hero's source-ratio cover canvas (2782x1536) — visually estimated
// directly from the real pixels via a percent-gridline overlay crop, the
// same "measured from the actual image, not guessed" method used
// throughout this project. `figma-make`'s centre keeps the exact value
// already live-verified in the previous pass (37 / 84.5) rather than a
// fresh, slightly less precise re-estimate — everything else here is
// newly measured, since no other card was ever isolated individually
// before this pass.
//
// Tool→project relationships are verified against projects.json's own
// `overviewChips`/`tags` fields (the project's real declared stack) plus
// direct text search across every prose field — not guessed. See the
// per-target comments below for exactly which field each claim traces to.
// Cards with zero verified mentions anywhere in projects.json (Power BI,
// Copilot, OpenAI, MS Office) are registered as real proximity targets —
// they are genuinely printed, named software cards, so they still deserve
// the same quiet focus response — but their Inspector content is the bare
// name only, no invented usage claim.

export interface ProjectUsageRef {
  /** Two-digit project index, matches projects.json's real `index` field. */
  number: string
  title: string
}

export interface HeroToolTarget {
  id: string
  label: string
  xPercent: number
  yPercent: number
  radiusXPercent: number
  radiusYPercent: number
  accessibleLabel: string
  usageSummary?: string
  projectUsage?: ProjectUsageRef[]
  /**
   * Local-annotation placement (Hero+Workflow correction pass v3.2):
   * which side of the card's own on-screen position the annotation
   * anchors to, plus a small px nudge — replaces the single fixed
   * lower-left Inspector, which read as disconnected from the physical
   * card it described. `side` picks the anchor edge; offsets are added
   * on top after clamping to the visible Hero, so a card near the frame
   * edge never gets pushed off-screen.
   */
  annotationSide: 'top' | 'left' | 'right' | 'bottom'
  annotationOffsetX: number
  annotationOffsetY: number
}

export const heroToolTargets: HeroToolTarget[] = [
  {
    // Card reads "Figma Make" — top of its own small pile, bottom-left.
    // Centre re-confirmed via a fine 2%-gridline crop this pass (measured
    // 36-37 / 83-84.5) — matches the value already live-tested in the
    // previous camera-focus pass almost exactly, so kept unchanged rather
    // than nudged for a sub-1% difference.
    id: 'figma-make',
    label: 'Figma Make',
    xPercent: 37,
    yPercent: 84.5,
    radiusXPercent: 7,
    radiusYPercent: 9,
    accessibleLabel: 'Figma Make — used in Source-to-Figma Data Visualization Pipeline',
    // moss-content-factory's overviewChips includes 'Figma handoff'; its
    // own case-study title is exactly this project.
    projectUsage: [{ number: '03', title: 'Source-to-Figma Data Visualization Pipeline' }],
    annotationSide: 'top',
    annotationOffsetX: 0,
    annotationOffsetY: -12,
  },
  {
    // Card reads "n8n" — white card with a red node-graph icon, on top of
    // the box, below Claude Code.
    id: 'n8n',
    label: 'n8n',
    xPercent: 52.5,
    yPercent: 63,
    radiusXPercent: 5.5,
    radiusYPercent: 6,
    accessibleLabel: 'n8n — used in Job Screening Validation Workflow',
    // job-application-filter's overviewChips includes 'n8n' directly.
    projectUsage: [{ number: '01', title: 'Job Screening Validation Workflow' }],
    // Right side, nudged down — avoids covering the box's own printed
    // "AI Workflow" text directly above it.
    annotationSide: 'right',
    annotationOffsetX: 10,
    annotationOffsetY: 6,
  },
  {
    // Card reads "Claude Code" — grey/tan card with an orange starburst
    // icon, on top of the box.
    id: 'claude-code',
    label: 'Claude Code',
    xPercent: 54.5,
    yPercent: 54.5,
    radiusXPercent: 5.5,
    radiusYPercent: 6.5,
    accessibleLabel: 'Claude Code — used across this portfolio for building, debugging and documentation',
    // Portfolio-wide meta-claim about how the site itself was built, not
    // a project-stage tool — same framing already approved in the
    // retired ToolCluster registry, carried over unchanged. Not a per-
    // project usedIn list, since no single project's own data field
    // names Claude Code as part of its stack.
    usageSummary: 'Used across this portfolio for building, debugging and documentation.',
    annotationSide: 'right',
    annotationOffsetX: 10,
    annotationOffsetY: -8,
  },
  {
    // Card reads "Notion" — white card, part of the stacked pile.
    id: 'notion',
    label: 'Notion',
    xPercent: 47.5,
    yPercent: 42,
    radiusXPercent: 6.5,
    radiusYPercent: 4,
    accessibleLabel: 'Notion — used in 3 systems',
    // job-application-filter (tags: 'Notion'), moss-content-factory
    // (overviewChips: 'Notion'), investment-research-system (resultHtml:
    // "Kept Notion as a view layer, not the source of truth" — a real,
    // if deliberately limited, verified usage).
    projectUsage: [
      { number: '01', title: 'Job Screening Validation Workflow' },
      { number: '02', title: 'Investment Reasoning Learning Database' },
      { number: '03', title: 'Source-to-Figma Data Visualization Pipeline' },
    ],
    annotationSide: 'left',
    annotationOffsetX: -10,
    annotationOffsetY: 0,
  },
  {
    // Card reads "OpenAI" (partly hidden behind Notion/MS Office in the
    // stack — "penAI" visible). No project's overviewChips/tags/prose
    // names OpenAI anywhere in projects.json — decorative, name only,
    // per the explicit "do not invent mappings" instruction.
    id: 'openai',
    label: 'OpenAI',
    xPercent: 44.5,
    yPercent: 47,
    radiusXPercent: 5.5,
    radiusYPercent: 4,
    accessibleLabel: 'OpenAI',
    annotationSide: 'left',
    annotationOffsetX: -10,
    annotationOffsetY: 4,
  },
  {
    // Card reads "MS Office" (mostly hidden, "MS Offic..." visible). No
    // verified project mention — decorative, name only.
    id: 'ms-office',
    label: 'MS Office',
    xPercent: 45.5,
    yPercent: 51,
    radiusXPercent: 5.5,
    radiusYPercent: 4,
    accessibleLabel: 'MS Office',
    annotationSide: 'left',
    annotationOffsetX: -10,
    annotationOffsetY: 10,
  },
  {
    // Card reads "Copilot" — top of the small stacked pile above the box.
    // No verified project mention — decorative, name only.
    id: 'copilot',
    label: 'Copilot',
    xPercent: 48,
    yPercent: 36,
    radiusXPercent: 6,
    radiusYPercent: 5,
    accessibleLabel: 'Copilot',
    annotationSide: 'top',
    annotationOffsetX: 0,
    annotationOffsetY: -12,
  },
  {
    // Card reads "Power BI" — white card, left of the box. Already
    // documented in the retired registry as having no verified project
    // use; unchanged this pass.
    id: 'power-bi',
    label: 'Power BI',
    xPercent: 28,
    yPercent: 64,
    radiusXPercent: 7,
    radiusYPercent: 7,
    accessibleLabel: 'Power BI',
    annotationSide: 'top',
    annotationOffsetX: 0,
    annotationOffsetY: -12,
  },
  {
    // Card reads "Comfy" (the printed card itself says "Comfy", not
    // "ComfyUI" — label below uses the literal printed text; the verified
    // project relationship still refers to the project's own real title,
    // which does say "ComfyUI"). blender-comfyui-previs's overviewChips
    // includes 'ComfyUI' directly.
    id: 'comfy',
    label: 'Comfy',
    xPercent: 73,
    yPercent: 65,
    radiusXPercent: 5,
    radiusYPercent: 6,
    accessibleLabel: 'Comfy — used in Blender + ComfyUI',
    projectUsage: [{ number: '07', title: 'Blender + ComfyUI' }],
    annotationSide: 'top',
    annotationOffsetX: 0,
    annotationOffsetY: -12,
  },
  {
    // Card reads "Python — Basic" — blue card, bottom-right pile.
    id: 'python-basic',
    label: 'Python',
    xPercent: 66.5,
    yPercent: 90.5,
    radiusXPercent: 6.5,
    radiusYPercent: 7.5,
    accessibleLabel: 'Python — used in 2 systems',
    // investment-research-system + method-of-loci overviewChips both
    // include 'Python' directly.
    projectUsage: [
      { number: '02', title: 'Investment Reasoning Learning Database' },
      { number: '05', title: 'Method of Loci' },
    ],
    // Regression repair: 'top' cleared Python's own card correctly once
    // positionAnnotation() was fixed to measure from the real edge, but
    // Python's card sits directly below-left of SQLite's — pushing the
    // annotation "up" (clear of Python) landed it squarely on top of the
    // neighbouring SQLite card instead, confirmed live via bounding-rect
    // overlap. 'left' opens into genuinely empty tabletop space (nothing
    // else registered in that direction from this card).
    annotationSide: 'left',
    annotationOffsetX: -10,
    annotationOffsetY: 0,
  },
  {
    // Card reads "SQLite" — olive/tan card, behind Python — Basic.
    id: 'sqlite',
    label: 'SQLite',
    xPercent: 73,
    yPercent: 84,
    radiusXPercent: 6,
    radiusYPercent: 6,
    accessibleLabel: 'SQLite — used in 2 systems',
    // Same two projects' overviewChips both also include 'SQLite'.
    projectUsage: [
      { number: '02', title: 'Investment Reasoning Learning Database' },
      { number: '05', title: 'Method of Loci' },
    ],
    annotationSide: 'top',
    annotationOffsetX: 0,
    annotationOffsetY: -12,
  },
  // Deliberately NOT registered: the light card behind "Comfy" (partly
  // hidden, reads "...urtex" — NOT "Codex", which is what this target
  // list was originally assumed to include). Cropped and zoomed this
  // pass to check: the visible fragment doesn't match any real software
  // name, and most of the card is physically hidden under Comfy. Per the
  // "when a mapping is uncertain, do not invent" instruction, this is
  // left out entirely rather than mislabelled — flagged in the update
  // report as an open item, not silently dropped.
]
