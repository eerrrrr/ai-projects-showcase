// Hotspot regions over the V2 Swiss hero image
// (public/media/v2/ai-workflow-hero.png / .webp).
//
// Percentage-based hit regions (relative to the image's natural box, not
// pixels) so hotspots stay correctly positioned across responsive image
// sizes without any JS re-measurement of the rendered image element.
//
// Each targetProjectId is a REAL, verified `project.id` from
// src/data/projects.json — checked against the actual image content, not
// guessed. Power BI (left stack in the photo) is deliberately left out:
// no current project in projects.json uses Power BI, so it stays a purely
// decorative part of the hero image with no hotspot.

export interface HeroHotspot {
  id: string
  label: string
  targetProjectId: string
  targetIndex: number
  // Percentages of the scene frame's own box (1366x768 ratio) — 0-100.
  // The scene frame always preserves the source image ratio, so these
  // stay aligned across responsive sizes without JS re-measurement.
  xPercent: number
  yPercent: number
  wPercent: number
  hPercent: number
  // Marker position (a single point, not the whole hit region) — used
  // for the tiny "01/03/05/07" number badges. Roughly the visual center
  // of each card pile, tuned to sit ON the pile rather than in blank
  // space around it.
  markerXPercent: number
  markerYPercent: number
}

// Total project count, matches projects.json's `total` field — used for
// the shared rail's "NN / TOTAL" format.
export const HERO_PROJECT_TOTAL = 7

export const heroHotspots: HeroHotspot[] = [
  {
    id: 'center-box',
    label: 'Job Screening Validation Workflow',
    targetProjectId: 'job-application-filter',
    targetIndex: 1,
    // Center cardboard box + the Claude Code / n8n cards stacked on top.
    xPercent: 38,
    yPercent: 24,
    wPercent: 26,
    hPercent: 52,
    markerXPercent: 49.6,
    markerYPercent: 46.9,
  },
  {
    id: 'bottom-left',
    label: 'Source-to-Figma Data Visualization Pipeline',
    targetProjectId: 'moss-content-factory',
    targetIndex: 3,
    // Figma Make card stack, bottom-left of frame.
    xPercent: 28,
    yPercent: 72,
    wPercent: 16,
    hPercent: 20,
    markerXPercent: 37.3,
    markerYPercent: 84.0,
  },
  {
    id: 'bottom-right',
    label: 'Method of Loci',
    targetProjectId: 'method-of-loci',
    targetIndex: 5,
    // Python Basic / SQLite card stack, bottom-right of frame.
    xPercent: 62,
    yPercent: 70,
    wPercent: 16,
    hPercent: 22,
    markerXPercent: 69.3,
    markerYPercent: 79.7,
  },
  {
    id: 'right',
    label: 'Blender + ComfyUI',
    targetProjectId: 'blender-comfyui-previs',
    targetIndex: 7,
    // Comfy / Codex card stack, right of frame.
    xPercent: 66,
    yPercent: 42,
    wPercent: 16,
    hPercent: 22,
    markerXPercent: 72.1,
    markerYPercent: 57.3,
  },
]
