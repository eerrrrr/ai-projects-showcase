// Gate B — "Tool Usage Map" registry.
//
// Replaces the retired project-hotspot model (see the "Correction (post
// Gate A.2)" section in PORTFOLIO_V2_LIVING_HERO_PROMPT.md): the hero
// objects are software tools, several used across multiple projects
// (Claude Code most obviously), so they do not map 1:1 to a single
// project. Each cluster instead lists the real projects (verified against
// projects.json) it's actually used in, or an empty `usedIn` for a
// portfolio-wide tool with just a usage summary.
//
// Coordinates are re-measured against the CURRENT hi-res source image
// (public/media/v2/ai-workflow-hero.png, 2782x1536) — visually estimated
// from the actual pixels, not reused from the old 1366x768 image's
// hotspot set (object positions differ between the two images).

export interface ToolCluster {
  id: string
  label: string
  /** Portfolio-wide usage line, shown when `usedIn` is empty. */
  usageSummary?: string
  /** Real project titles this tool is verified to be used in. */
  usedIn: string[]
  // Percentages of the scene frame's own box (2782x1536 source ratio).
  xPercent: number
  yPercent: number
  wPercent: number
  hPercent: number
  /**
   * Optional richer annotation override (used for the Figma proof).
   * Falls back to the generic label + "Used in: <projects>" format built
   * from `usedIn` when absent.
   */
  annotationLines?: string[]
  /**
   * Camera-led selection model (Figma proof only, see
   * PORTFOLIO_V2_INTERACTION_AND_WORKFLOW_BUILD_PROMPT.md — now on its
   * 2nd motion-correction pass). Current implementation ("camera-focus
   * illusion", 2nd pass): hover/pin never touch the real image pixels —
   * SwissHero.tsx applies a restrained `scale()` to a dedicated focus
   * layer, `transform-origin`'d at this cluster's own coordinates
   * (xPercent+wPercent/2, yPercent+hPercent/2), plus a radial-gradient
   * focus veil centred on the same point. Hover shows only a minimal
   * single-line label; pin (after a short delay) reveals the full
   * annotation. A 1st-pass attempt used a separate alpha-masked overlay
   * PNG per cluster (duplicating the card as a second image layer) — that
   * approach is retired (see the removed `overlay` field, still present
   * in git history) because a second image layer over the real pixels
   * carries its own mask-edge risk regardless of how tightly it's
   * trimmed. The other clusters keep the original Gate B behaviour
   * (hover reveals the full annotation immediately, no scene movement) —
   * this flag opts a cluster into the different model rather than
   * changing the shared behaviour for all.
   */
  cameraLed?: boolean
  /** Minimal hover-only label, shown before the full annotation reveals. */
  hoverLabel?: string
}

export const heroToolClusters: ToolCluster[] = [
  {
    id: 'claude-code-stack',
    label: 'Claude Code',
    usageSummary: 'Used across the portfolio for building, debugging and documentation.',
    usedIn: [],
    xPercent: 40,
    yPercent: 30,
    wPercent: 20,
    hPercent: 24,
  },
  {
    id: 'n8n',
    label: 'n8n',
    usedIn: ['Job Screening Validation Workflow'],
    xPercent: 47,
    yPercent: 54,
    wPercent: 12,
    hPercent: 11,
  },
  {
    id: 'figma-make',
    label: 'Figma Make',
    usedIn: ['Source-to-Figma Data Visualization Pipeline'],
    xPercent: 29,
    yPercent: 74,
    wPercent: 16,
    hPercent: 21,
    // Alpha-masked overlay generated via Python/Pillow from the real
    // A separate alpha-masked overlay PNG (public/media/v2/hero-overlays/
    // figma-make-overlay.png) was built and used here for the 1st motion-
    // correction pass, then retired in the 2nd pass — no image layer
    // duplicates this card anymore; SwissHero.tsx now applies a
    // transform-origin'd scale + radial-gradient veil directly to the
    // real Hero image instead (see the `cameraLed` doc comment above).
    // The PNG asset itself is left on disk, unreferenced, rather than
    // deleted.
    // "USED IN" removed per the motion-correction pass — the project
    // index + title already make the relationship clear without it.
    annotationLines: ['03', 'SOURCE-TO-FIGMA', 'DATA VISUALIZATION PIPELINE'],
    cameraLed: true,
    hoverLabel: 'FIGMA MAKE',
  },
  {
    id: 'python-sqlite',
    label: 'Python + SQLite',
    usedIn: ['Investment Reasoning Learning Database', 'Method of Loci'],
    xPercent: 60,
    yPercent: 70,
    wPercent: 16,
    hPercent: 25,
  },
  {
    id: 'comfy-codex',
    label: 'ComfyUI + Codex',
    usedIn: ['Blender + ComfyUI', 'AI-assisted media experiments'],
    xPercent: 65,
    yPercent: 44,
    wPercent: 16,
    hPercent: 23,
  },
]

// Power BI (left pile) and the loose blank cards stay decorative —
// no verified public project uses Power BI, so no hotspot is created for
// it, per the instruction not to infer/invent tool-project relationships.
