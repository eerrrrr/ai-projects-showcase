// Exact approved V2 hero copy. Deliberately NOT read from page-content.json
// — the approved wording differs from the existing heroTagline/
// focusLineHtml text there, and REDESIGN_CONTRACT.md/the plan for this
// task both say not to silently reuse old copy or edit page-content.json
// for this. Scoped to V2 only.

// Gate A.2 correction: the Hero subtitle must be the identity/positioning
// line ("Process thinking · Data visualization · Human-reviewed AI
// workflows" — a masthead tagline), not the explanatory/overview-style
// sentence that was there before ("Human-reviewed automation, data
// pipelines and reusable decision systems" — that reads as section-intro
// copy, not a cover tagline). Sourced from the existing, already-approved
// page-content.json focusLineHtml text (stripped of its HTML), not
// invented new copy.
export const v2HeroContent = {
  name: 'Erin Wong',
  tagline: 'AI Workflow Systems',
  focusLine: 'Process thinking · Data visualization ·\nHuman-reviewed AI workflows',
}
