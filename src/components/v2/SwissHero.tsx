import { useCallback, useEffect, useRef, useState } from 'react'
import pageContent from '../../data/page-content.json'
import { heroHotspots } from '../../data/heroHotspots'
import { heroToolTargets, type HeroToolTarget } from '../../data/heroToolTargets'
import { v2HeroContent } from '../../data/v2HeroContent'
import type { PageContent } from '../../data/types'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useCoarsePointer } from '../../hooks/useCoarsePointer'

const BASE = import.meta.env.BASE_URL
const content = pageContent as PageContent

// PROXIMITY-ENGINE pass (see PORTFOLIO_V2_INTERACTION_AND_WORKFLOW_BUILD_PROMPT.md's
// 3rd interaction-correction pass). Generalises the camera-focus illusion
// approved for Figma Make (2nd pass) to every named software card, and
// replaces binary hover/click with continuous pointer PROXIMITY — no
// click required anywhere. One shared engine, one shared data registry
// (heroToolTargets.ts), one shared fixed-position Inspector — not a
// separate interaction system per card.
//
// No spring library: this project has no Motion/Framer Motion dependency
// (checked package.json directly — none installed), and the very first
// motion-correction pass already established "do not install a new
// dependency" as a standing constraint. "Critically damped spring" is
// therefore approximated with plain per-property EXPONENTIAL smoothing
// (framerate-independent via a real elapsed-time delta each animation
// frame) — mathematically incapable of overshoot/bounce by construction,
// which satisfies the "no overshoot, no bounce" requirement directly,
// even though it isn't literally a mass/spring/damper simulation. Focus
// position is smoothed slower ("heavier"), the Inspector faster ("quiet
// and quick"), matching the qualitative character requested.
// Hero+Workflow correction pass v3.2, Pass H: the previous ceiling
// (additional scale up to 1.003) read as almost imperceptible on the
// larger Pass-H Hero, and the fixed lower-left Inspector was replaced by
// a LOCAL annotation anchored to each card's own on-screen position (see
// heroToolTargets.ts's annotationSide/annotationOffsetX/Y and the
// positionAnnotation() logic below).
const REACH_OUTER = 1.15 // normalised distance where strength leaves 0 (tightened from 1.35 — the proximity should read as approaching a specific card, not a broad third of the scene)
const REACH_INNER = 0.18 // normalised distance where strength reaches 1
// Gate 1 retune: restored to the canonical spec's exact value (1.5) —
// the previous 1.4 was a small, undiscussed drift from the agreed number.
const RELEASE_DISTANCE = 1.5
const SWITCH_RATIO = 0.82 // a new target must be ~18% closer than the current one to steal focus — matches canonical spec exactly
// Gate 1 retune: the prior pass's 0.014 scale / 7px/5px translate were a
// direct response to the earlier video critique, but the canonical spec
// now supersedes those with an explicit binding range. Restored to the
// canonical default (0.008 scale, within the 0.006-0.010 tuning range,
// well under the 0.012 ceiling) and the canonical directional translate
// default (3px/2px, within the 2-3px default range, under the 4px
// ceiling per axis).
const MAX_SCENE_SCALE_DELTA = 0.008
const MAX_TRANSLATE_X = 3 // px, toward the active target, at strength 1
const MAX_TRANSLATE_Y = 2
// Gate 1 retune: tightened from 0.03 (3%) into the canonical 1.8-2.8%
// outer-dimming range.
const MAX_VEIL_STRENGTH = 0.025
// Hero identity's own tiny directional response — separate, much smaller
// ceiling than the scene's (1.5px horizontal / 1px vertical per the
// canonical spec's "Hero title micro-response" section). Derived from the
// same smoothed scene shift, scaled down, not a second independent
// pointer calculation.
const MAX_IDENTITY_SHIFT_X = 1.5
const MAX_IDENTITY_SHIFT_Y = 1
const VEIL_RADIUS_MULTIPLIER = 1.8 // local veil ellipse = target's own reach radius * this, not a full-scene wash
// Asymmetric enter/exit smoothing (no Motion/Framer Motion dependency in
// this project — checked package.json/node_modules directly, neither
// exists, and "no new dependency" has been a standing rule since the
// first motion-correction pass — so this remains plain exponential
// smoothing, just with a faster time-constant while a value is
// INCREASING toward its target than while it's decreasing, which is what
// gives entry a snappier, more noticeable engagement while exit stays
// soft and unhurried, without literally simulating a spring).
const TAU_ENTER_MS = 105
const TAU_EXIT_MS = 180
const TAU_ORIGIN_MS = 135 // focus x/y — one constant, not direction-split
// Gate 1, point 10: annotation fade-out must read as "unhurried," not an
// abrupt cutoff the instant the pointer leaves. Split into its own
// enter/exit pair (previously one constant, 120ms both ways) — entry
// stays close to the original (a little faster, so the label still
// appears promptly), exit is deliberately much slower.
const TAU_LABEL_ENTER_MS = 110
const TAU_LABEL_EXIT_MS = 320

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

function expLerp(current: number, target: number, dtMs: number, tauMs: number): number {
  const alpha = 1 - Math.exp(-dtMs / tauMs)
  return current + (target - current) * alpha
}

// Picks the enter or exit time-constant based on whether `target` is
// rising or falling relative to `current` — used for every "strength-
// derived" value (strength itself, scale, veil, translate) so engaging a
// card feels snappier than releasing it.
function dampToward(current: number, target: number, dtMs: number): number {
  const tau = target > current ? TAU_ENTER_MS : TAU_EXIT_MS
  return expLerp(current, target, dtMs, tau)
}

// Same asymmetric idea as dampToward, but with the annotation's own much
// slower exit time-constant (see TAU_LABEL_EXIT_MS above) — kept as a
// separate function rather than parameterising dampToward, since every
// other caller of dampToward intentionally shares one enter/exit pair.
function dampLabel(current: number, target: number, dtMs: number): number {
  const tau = target > current ? TAU_LABEL_ENTER_MS : TAU_LABEL_EXIT_MS
  return expLerp(current, target, dtMs, tau)
}

function distanceTo(target: HeroToolTarget, x: number, y: number): number {
  const dx = (x - target.xPercent) / target.radiusXPercent
  const dy = (y - target.yPercent) / target.radiusYPercent
  return Math.sqrt(dx * dx + dy * dy)
}

interface UsageLines {
  full: string[]
}
// Usage-only — the physical card already prints the tool's own name, so
// the annotation never repeats it as a heading. Format matches the
// approved example exactly: "01 / JOB SCREENING VALIDATION WORKFLOW",
// not "N8N" followed by a usage line.
function usageLines(target: HeroToolTarget): UsageLines {
  if (target.projectUsage && target.projectUsage.length > 0) {
    const full = target.projectUsage.slice(0, 3).map((p) => `${p.number} / ${p.title.toUpperCase()}`)
    const overflow = target.projectUsage.length - 3
    if (overflow > 0) full.push(`+${String(overflow).padStart(2, '0')} MORE SYSTEM${overflow > 1 ? 'S' : ''}`)
    return { full }
  }
  if (target.usageSummary) return { full: [target.usageSummary.toUpperCase()] }
  return { full: [] }
}

export function SwissHero() {
  const reducedMotion = useReducedMotion()
  const coarsePointer = useCoarsePointer()

  const heroSectionRef = useRef<HTMLElement | null>(null)
  const positionerRef = useRef<HTMLDivElement | null>(null)
  const sceneFocusRef = useRef<HTMLDivElement | null>(null)
  const veilRef = useRef<HTMLDivElement | null>(null)
  const annotationRef = useRef<HTMLDivElement | null>(null)

  // Continuous state lives in refs, written straight to the DOM every
  // animation frame — NOT React state, per the explicit "do not trigger a
  // React render for every raw pointermove event" instruction. React
  // state is used only for the few genuinely discrete things: which
  // target's text is displayed, and which progressive-reveal stage it's
  // showing (each changes rarely — at proximity-threshold crossings, not
  // every frame).
  const pointerRef = useRef<{ x: number; y: number } | null>(null)
  const keyboardTargetIdRef = useRef<string | null>(null)
  const activeTargetIdRef = useRef<string | null>(null)
  const smoothedRef = useRef({
    focusX: 50,
    focusY: 50,
    scale: 1,
    shiftX: 0,
    shiftY: 0,
    veil: 0,
    strength: 0,
    labelOpacity: 0,
  })
  const rafRef = useRef<number | null>(null)
  const lastFrameTimeRef = useRef<number | null>(null)
  const displayedTargetIdRef = useRef<string | null>(null)
  const revealStageRef = useRef(0)

  const [displayedTargetId, setDisplayedTargetId] = useState<string | null>(null)
  const [revealStage, setRevealStage] = useState(0)

  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const setButtonRef = useCallback(
    (id: string) => (el: HTMLButtonElement | null) => {
      if (el) buttonRefs.current.set(id, el)
      else buttonRefs.current.delete(id)
    },
    [],
  )

  // Keyboard focus/blur — native listeners, not React's onFocus/onBlur
  // props. Established fact in this codebase (see the earlier Gate B
  // debugging pass): React's synthetic onFocus never reliably fires on
  // these hotspot buttons in this app/environment; a plain
  // addEventListener('focus', ...) attached directly to the element does.
  useEffect(() => {
    const cleanups: Array<() => void> = []
    heroToolTargets.forEach((target) => {
      const el = buttonRefs.current.get(target.id)
      if (!el) return
      const handleFocus = () => {
        keyboardTargetIdRef.current = target.id
      }
      const handleBlur = () => {
        if (keyboardTargetIdRef.current === target.id) keyboardTargetIdRef.current = null
      }
      el.addEventListener('focus', handleFocus)
      el.addEventListener('blur', handleBlur)
      cleanups.push(() => {
        el.removeEventListener('focus', handleFocus)
        el.removeEventListener('blur', handleBlur)
      })
    })
    return () => cleanups.forEach((fn) => fn())
  }, [])

  // Local annotation placement — computed from the source canvas's real
  // on-screen rect + the target's own xPercent/yPercent (the same
  // coordinate math the proximity engine itself uses to find the
  // nearest card), not a fixed corner. Recomputed only when the
  // displayed target changes or the viewport resizes — NOT every
  // animation frame, since the anchor point only moves for those two
  // reasons (the card's percent position within the positioner is
  // constant; only the positioner's on-screen rect can change).
  const positionAnnotation = useCallback((target: HeroToolTarget | null) => {
    const positioner = positionerRef.current
    const annotation = annotationRef.current
    const hero = heroSectionRef.current
    if (!positioner || !annotation || !target) return
    const canvasRect = positioner.getBoundingClientRect()
    const heroRect = hero?.getBoundingClientRect()
    // Regression repair: xPercent/yPercent is the card's CENTER, not its
    // edge. The registry's small offsetX/offsetY (e.g. -12) was being
    // added directly to that CENTER point, so for any card whose own
    // on-screen half-height/half-width exceeds ~12px — which is nearly
    // all of them at real viewport sizes, since radiusXPercent/
    // radiusYPercent commonly render to 60-120px+ — the annotation landed
    // partway INSIDE the card instead of clear beside it. Confirmed via a
    // real recording showing usage text directly over the Claude Code,
    // n8n and Python/SQLite cards. Fixed by first pushing the anchor out
    // to the card's own true edge (using its real radiusXPercent/
    // radiusYPercent) before applying the registry's offset as a small
    // supplementary nudge on top of that — not the entire clearance.
    const edgeClearance = 6 // px beyond the card's own printed edge
    const cardCenterX = canvasRect.left + canvasRect.width * (target.xPercent / 100)
    const cardCenterY = canvasRect.top + canvasRect.height * (target.yPercent / 100)
    const halfWidthPx = canvasRect.width * (target.radiusXPercent / 100)
    const halfHeightPx = canvasRect.height * (target.radiusYPercent / 100)
    let anchorX = cardCenterX + target.annotationOffsetX
    let anchorY = cardCenterY + target.annotationOffsetY
    if (target.annotationSide === 'top') anchorY = cardCenterY - halfHeightPx - edgeClearance + target.annotationOffsetY
    if (target.annotationSide === 'bottom') anchorY = cardCenterY + halfHeightPx + edgeClearance + target.annotationOffsetY
    if (target.annotationSide === 'left') anchorX = cardCenterX - halfWidthPx - edgeClearance + target.annotationOffsetX
    if (target.annotationSide === 'right') anchorX = cardCenterX + halfWidthPx + edgeClearance + target.annotationOffsetX
    // Clamp the anchor point itself (not a post-layout box measurement —
    // a lighter-weight approximation using the CSS max-width as the
    // assumed box size) so the annotation never gets pushed off-screen
    // for a card near the frame edge.
    const margin = 28
    const minY = (heroRect?.top ?? 0) + 84
    const maxY = (heroRect?.bottom ?? window.innerHeight) - 40
    const clampedX = Math.min(Math.max(anchorX, margin), window.innerWidth - margin)
    const clampedY = Math.min(Math.max(anchorY, minY), maxY)
    annotation.style.left = `${clampedX}px`
    annotation.style.top = `${clampedY}px`
    const sideTransforms: Record<HeroToolTarget['annotationSide'], string> = {
      top: 'translate(-50%, calc(-100% - 4px))',
      bottom: 'translate(-50%, 4px)',
      left: 'translate(calc(-100% - 4px), -50%)',
      right: 'translate(4px, -50%)',
    }
    annotation.style.transform = sideTransforms[target.annotationSide]
  }, [])

  useEffect(() => {
    const target = displayedTargetId ? heroToolTargets.find((t) => t.id === displayedTargetId) ?? null : null
    if (!target) return
    positionAnnotation(target)
    const handleResize = () => positionAnnotation(target)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [displayedTargetId, positionAnnotation])

  // Pointer tracking — off entirely on coarse-pointer/touch devices (not
  // just hidden via CSS; the listener itself is never attached, per Phase
  // 13's "do not run pointer-proximity interaction on touch devices").
  useEffect(() => {
    if (coarsePointer) return
    const hero = heroSectionRef.current
    const positioner = positionerRef.current
    if (!hero || !positioner) return

    const handlePointerMove = (event: PointerEvent) => {
      const rect = positioner.getBoundingClientRect()
      pointerRef.current = {
        x: ((event.clientX - rect.left) / rect.width) * 100,
        y: ((event.clientY - rect.top) / rect.height) * 100,
      }
    }
    const handlePointerLeave = () => {
      pointerRef.current = null
    }

    hero.addEventListener('pointermove', handlePointerMove)
    hero.addEventListener('pointerleave', handlePointerLeave)
    return () => {
      hero.removeEventListener('pointermove', handlePointerMove)
      hero.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [coarsePointer])

  // The proximity engine itself — one continuous requestAnimationFrame
  // loop for the whole Hero (not one per card). Off entirely on
  // coarse-pointer devices.
  useEffect(() => {
    if (coarsePointer) return
    const positioner = positionerRef.current
    if (!positioner) return

    const tick = (time: number) => {
      const dt = lastFrameTimeRef.current == null ? 16 : Math.min(64, time - lastFrameTimeRef.current)
      lastFrameTimeRef.current = time

      // 1. Nearest target + its distance this frame (keyboard focus
      //    simulates full proximity to exactly one target, overriding the
      //    pointer entirely while it holds focus).
      let nearestId: string | null = null
      let nearestDistance = Infinity
      if (keyboardTargetIdRef.current) {
        nearestId = keyboardTargetIdRef.current
        nearestDistance = 0
      } else if (pointerRef.current) {
        for (const target of heroToolTargets) {
          const d = distanceTo(target, pointerRef.current.x, pointerRef.current.y)
          if (d < nearestDistance) {
            nearestDistance = d
            nearestId = target.id
          }
        }
      }

      // 2. Hysteresis — only one target may be active; switching requires
      //    the new target to be meaningfully closer, or the current one
      //    to have been left behind, so passing between close cards
      //    (the top stack especially) doesn't flicker.
      const currentId = activeTargetIdRef.current
      if (keyboardTargetIdRef.current) {
        activeTargetIdRef.current = keyboardTargetIdRef.current
      } else if (currentId == null) {
        activeTargetIdRef.current = nearestDistance < REACH_OUTER ? nearestId : null
      } else {
        const currentTarget = heroToolTargets.find((t) => t.id === currentId)
        const currentDistance =
          currentTarget && pointerRef.current
            ? distanceTo(currentTarget, pointerRef.current.x, pointerRef.current.y)
            : Infinity
        if (nearestId && nearestId !== currentId && nearestDistance < currentDistance * SWITCH_RATIO) {
          activeTargetIdRef.current = nearestId
        } else if (currentDistance > RELEASE_DISTANCE) {
          activeTargetIdRef.current = nearestDistance < REACH_OUTER ? nearestId : null
        }
        // else: hold the current target (hysteresis).
      }

      const activeId = activeTargetIdRef.current
      const activeTarget = activeId ? heroToolTargets.find((t) => t.id === activeId) ?? null : null

      // 3. Raw (unsmoothed) strength + focus point for this frame.
      let rawStrength = 0
      let rawFocusX = smoothedRef.current.focusX
      let rawFocusY = smoothedRef.current.focusY
      if (activeTarget) {
        rawFocusX = activeTarget.xPercent
        rawFocusY = activeTarget.yPercent
        if (keyboardTargetIdRef.current === activeId) {
          rawStrength = 1
        } else if (pointerRef.current) {
          rawStrength = smoothstep(REACH_OUTER, REACH_INNER, distanceTo(activeTarget, pointerRef.current.x, pointerRef.current.y))
        }
      }

      // Raw translate-toward-target — a small directional nudge, capped,
      // pointing from centre toward wherever the active target sits (so
      // an off-centre card gets brought very slightly closer to the
      // middle of the frame, "camera adjusting," not an arbitrary drift).
      let rawShiftX = 0
      let rawShiftY = 0
      if (activeTarget) {
        rawShiftX = ((50 - activeTarget.xPercent) / 50) * MAX_TRANSLATE_X * rawStrength
        rawShiftY = ((50 - activeTarget.yPercent) / 50) * MAX_TRANSLATE_Y * rawStrength
      }

      // 4. Smooth toward the raw values — instant under reduced motion
      //    (no transform/scale movement at all, per Phase 14). Strength-
      //    derived values (strength, scale, veil, shift) use asymmetric
      //    enter/exit smoothing (dampToward); focus x/y use one constant
      //    time-constant regardless of direction.
      const s = smoothedRef.current
      if (reducedMotion) {
        s.focusX = rawFocusX
        s.focusY = rawFocusY
        s.scale = 1
        s.shiftX = 0
        s.shiftY = 0
        s.veil = 0
        s.strength = rawStrength
        s.labelOpacity = activeId ? 1 : 0
      } else {
        s.focusX = expLerp(s.focusX, rawFocusX, dt, TAU_ORIGIN_MS)
        s.focusY = expLerp(s.focusY, rawFocusY, dt, TAU_ORIGIN_MS)
        s.strength = dampToward(s.strength, rawStrength, dt)
        s.scale = dampToward(s.scale, 1 + MAX_SCENE_SCALE_DELTA * rawStrength, dt)
        s.shiftX = dampToward(s.shiftX, rawShiftX, dt)
        s.shiftY = dampToward(s.shiftY, rawShiftY, dt)
        s.veil = dampToward(s.veil, MAX_VEIL_STRENGTH * rawStrength, dt)
        s.labelOpacity = dampLabel(s.labelOpacity, smoothstep(0.04, 0.2, rawStrength), dt)
      }

      // 5. Write continuous values straight to the DOM — no React render.
      positioner.style.setProperty('--focus-x', `${s.focusX}%`)
      positioner.style.setProperty('--focus-y', `${s.focusY}%`)
      positioner.style.setProperty('--focus-radius-x', `${(activeTarget ?? { radiusXPercent: 7.8 }).radiusXPercent * VEIL_RADIUS_MULTIPLIER}`)
      positioner.style.setProperty('--focus-radius-y', `${(activeTarget ?? { radiusYPercent: 8.9 }).radiusYPercent * VEIL_RADIUS_MULTIPLIER}`)
      if (sceneFocusRef.current) {
        sceneFocusRef.current.style.transform = `translate3d(${s.shiftX}px, ${s.shiftY}px, 0) scale(${s.scale})`
      }
      // Identity's own tiny directional micro-shift — same smoothed scene
      // shift, scaled down to its own much smaller ceiling (see hero.css's
      // v2-hero-identity-in keyframe, which reads these two properties).
      if (heroSectionRef.current) {
        const identityShiftX = (s.shiftX / (MAX_TRANSLATE_X || 1)) * MAX_IDENTITY_SHIFT_X
        const identityShiftY = (s.shiftY / (MAX_TRANSLATE_Y || 1)) * MAX_IDENTITY_SHIFT_Y
        heroSectionRef.current.style.setProperty('--hero-identity-shift-x', String(reducedMotion ? 0 : identityShiftX))
        heroSectionRef.current.style.setProperty('--hero-identity-shift-y', String(reducedMotion ? 0 : identityShiftY))
      }
      if (veilRef.current) veilRef.current.style.opacity = String(s.veil / MAX_VEIL_STRENGTH)
      if (annotationRef.current) {
        annotationRef.current.style.opacity = String(s.labelOpacity)
      }
      // ERIN WONG's tiny breathing scale — same strength value the rest of
      // the engine already computes, just exposed as a CSS custom
      // property for hero.css's .v2-hero-identity rule to read.
      if (heroSectionRef.current) {
        heroSectionRef.current.style.setProperty('--hero-focus-strength', String(reducedMotion ? 0 : s.strength))
      }

      // 6. Discrete content state — only touches React when it actually
      //    changes (proximity-threshold crossings, not every frame).
      //
      // Only ever display an annotation for a target with VERIFIED usage
      // (projectUsage or usageSummary) — decorative targets (Power BI,
      // Copilot, OpenAI, MS Office) still get the full camera-focus/veil
      // response above, but render no annotation at all. This also
      // removes the old "bare tool name alone" reveal stage entirely: a
      // target with usage now always shows its name TOGETHER WITH at
      // least a first usage hint from the very first visible stage,
      // never the name by itself.
      const activeHasUsage = Boolean(activeTarget && (activeTarget.projectUsage?.length || activeTarget.usageSummary))
      const nextDisplayedId = activeHasUsage ? activeId : null
      if (nextDisplayedId !== displayedTargetIdRef.current) {
        displayedTargetIdRef.current = nextDisplayedId
        setDisplayedTargetId(nextDisplayedId)
      }
      const effectiveStrength = reducedMotion ? rawStrength : s.strength
      // Canonical spec's exact thresholds: <0.16 hidden, 0.16-0.42 first
      // row, >=0.42 remaining rows / full state.
      const stage = effectiveStrength < 0.16 ? 0 : effectiveStrength < 0.42 ? 1 : 2
      if (stage !== revealStageRef.current) {
        revealStageRef.current = stage
        setRevealStage(stage)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      lastFrameTimeRef.current = null
    }
  }, [coarsePointer, reducedMotion])

  const displayedTarget = displayedTargetId ? heroToolTargets.find((t) => t.id === displayedTargetId) ?? null : null
  const lines = displayedTarget ? usageLines(displayedTarget) : { full: [] }

  return (
    <section className="v2-hero" aria-label="AI Workflow Systems overview" ref={heroSectionRef}>
      {/* Gate 1, point 1/3: softened same-image background layer, fills
          whatever viewport space the sharp height-led canvas doesn't
          reach. Purely decorative (aria-hidden, empty alt) — the real,
          described image is .v2-hero-scene below. First child + no
          z-index of its own, so it stacks beneath the nav/identity text
          (z-index 3) and the sharp scenePositioner via plain DOM order. */}
      <div className="v2-hero-bgLayer" aria-hidden="true">
        <img className="v2-hero-bgLayer-img" src={`${BASE}media/v2/ai-workflow-hero.png`} alt="" loading="eager" />
      </div>

      <nav className="v2-hero-nav" aria-label="Primary navigation">
        {/* Gate 1.1: "Systems" filtered out here, not deleted from
            page-content.json — the shared JSON content stays untouched
            per the redesign contract. It's also a genuinely dead link in
            V2's own page structure: it points at "#systems", an anchor
            id that doesn't exist anywhere in this routed page (V1's
            single-page layout is where that id lives), so this is
            removing a broken link, not just an unwanted label. */}
        {content.nav.links
          .filter((link) => link.href !== '#systems')
          .map((link) =>
          link.external ? (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
              {link.label} ↗
            </a>
          ) : (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ),
        )}
      </nav>

      <div className="v2-hero-identity">
        <h1 className="v2-hero-name">{v2HeroContent.name.toUpperCase()}</h1>
        <p className="v2-hero-tagline">{v2HeroContent.tagline.toUpperCase()}</p>
        <p className="v2-hero-focus">{v2HeroContent.focusLine.replace('\n', ' ').toUpperCase()}</p>
      </div>

      {/* HEIGHT-LED source canvas (Pass H) — height always equals the
          Hero's own height, so the source image's top and bottom edges
          are always both visible (no crop on either); width follows the
          real ratio and only its own far-left/right edges mask-blend
          into the studio background on narrower-than-source viewports.
          --focus-x/--focus-y/--focus-radius-x/-y are written every
          animation frame by the engine above; .v2-hero-sceneFocus's
          transform-origin and .v2-hero-focusVeil's gradient both read
          the same variables, so the zoom point and the veil's centre can
          never drift apart. */}
      <div className="v2-hero-scenePositioner" ref={positionerRef}>
        <div className="v2-hero-sceneFocus" ref={sceneFocusRef}>
          <img
            className="v2-hero-scene"
            src={`${BASE}media/v2/ai-workflow-hero.png`}
            alt="A handmade AI Workflow Starter Pack box surrounded by cardboard cards representing software tools used across this portfolio."
            width={2782}
            height={1536}
            loading="eager"
          />
          <div className="v2-hero-focusVeil" ref={veilRef} aria-hidden="true" />
        </div>

        {/* Invisible, individually focusable hit regions — one per named
            card, for keyboard/assistive-tech reachability only. Mouse
            users never need to land inside these exact bounds: the
            proximity engine above responds to distance across the whole
            Hero, not to hover on these elements. Clicking one does
            nothing (no onClick at all) — no click is required or
            meaningful in this model. Blank/unlabelled cardboard cards are
            deliberately NOT represented here at all. */}
        <div className="v2-tool-hotspots">
          {heroToolTargets.map((target) => (
            <button
              key={target.id}
              ref={setButtonRef(target.id)}
              type="button"
              className="v2-tool-hotspot"
              style={{
                left: `${target.xPercent}%`,
                top: `${target.yPercent}%`,
                width: `${target.radiusXPercent * 2}%`,
                height: `${target.radiusYPercent * 2}%`,
                transform: 'translate(-50%, -50%)',
              }}
              aria-label={target.accessibleLabel}
              tabIndex={0}
            />
          ))}
        </div>
      </div>

      {/* Local Tool Annotation (Pass H — replaces the fixed lower-left
          Inspector, which read as disconnected from the physical card it
          described). `position: fixed`, anchored beside/above/below the
          active card's own on-screen position via positionAnnotation()
          above — not a page-corner panel. Opacity is written every frame
          by the engine (continuous fade tied to proximity distance);
          `key={displayedTarget.id}` on the inner content remounts it on
          every target switch for a quick refresh-fade, independent of
          the outer element's own continuous fade. */}
      <div className="v2-toolAnnotation" ref={annotationRef} role="status" aria-live="polite" aria-hidden={!displayedTarget}>
        {/* Only ever rendered for a target WITH verified usage (see the
            activeHasUsage gate above). No tool-name heading at all — the
            physical card already prints its own name (e.g. "n8n"), so
            repeating "N8N" above the usage line was redundant and was the
            thing actually being read as a tooltip-style label. Stage 1
            shows the first usage line only; stage 2 reveals the rest. */}
        {displayedTarget && (
          <div className="v2-toolAnnotation-content" key={displayedTarget.id}>
            {revealStage === 1 && lines.full[0] && <span className="v2-toolAnnotation__usage">{lines.full[0]}</span>}
            {revealStage >= 2 &&
              lines.full.map((line) => (
                <span key={line} className="v2-toolAnnotation__usage">
                  {line}
                </span>
              ))}
          </div>
        )}
      </div>

      {/* Mobile fallback — no pointer-proximity interaction on touch/
          coarse-pointer devices (per Phase 13); the real, touch-friendly
          path into projects stays these numbered Swiss links. */}
      <nav className="v2-hero-mobile-links" aria-label="Jump to a featured project">
        <hr className="v2-rule" />
        {heroHotspots.map((hotspot) => (
          <a key={hotspot.id} href={`#${hotspot.targetProjectId}`} className="v2-hero-mobile-link">
            <span className="v2-section-number">{String(hotspot.targetIndex).padStart(2, '0')}</span>
            <span>{hotspot.label}</span>
          </a>
        ))}
        <hr className="v2-rule" />
      </nav>
    </section>
  )
}
