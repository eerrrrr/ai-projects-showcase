import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import './Plasma.css';

const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 0.5, 0.2];
  return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
};

const vertex = `#version 300 es
precision highp float;
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform float uUseCustomColor;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseInteractive;
uniform float uDriftY;
uniform float uStretch;
uniform float uMorph;
uniform float uFlowOffset;
out vec4 fragColor;

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution.xy * 0.5;
  C = (C - center) / uScale + center;
  // Vertical-only stretch + offset, driven by smoothed scroll progress (see
  // Plasma's own render loop and AmbientBackground.tsx) — identical to the
  // original shape when uStretch=1, uDriftY=0 (top of page), so Hero is
  // pixel-for-pixel unchanged from before this was added.
  C.y = center.y + (C.y - center.y) * uStretch + uDriftY;

  vec2 mouseOffset = (uMouse - center) * 0.0002;
  C += mouseOffset * length(C - center) * step(0.5, uMouseInteractive);

  // uFlowOffset advances the same phase variable iTime already drives —
  // scrolling further "un-spools" more of the flow, the same way waiting
  // longer would, instead of just displacing/stretching a still frame.
  // This is what makes it read as one continuous field being travelled
  // through, not a static shape with a section-colored tint on top.
  float i, d, z, T = iTime * uSpeed * uDirection + uFlowOffset;
  vec3 O, p, S;

  for (vec2 r = iResolution.xy, Q; ++i < 60.; O += o.w/d*o.xyz) {
    p = z*normalize(vec3(C-.5*r,r.y));
    p.z -= 4.;
    S = p;
    d = p.y-T;

    p.x += .4*(1.+uMorph)*(1.+p.y)*sin(d + p.x*0.1)*cos(.34*d + p.x*0.05);
    Q = p.xz *= mat2(cos(p.y+vec4(0,11,33,0)-T));
    z+= d = abs(sqrt(length(Q*Q)) - .25*(5.+S.y))/3.+8e-4;
    o = 1.+sin(S.y+p.z*.5+S.z-length(S-p)+vec4(2,1,0,8));
  }

  o.xyz = tanh(O/1e4);
}

bool finite1(float x){ return !(isnan(x) || isinf(x)); }
vec3 sanitize(vec3 c){
  return vec3(
    finite1(c.r) ? c.r : 0.0,
    finite1(c.g) ? c.g : 0.0,
    finite1(c.b) ? c.b : 0.0
  );
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  vec3 rgb = sanitize(o.rgb);

  float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;
  vec3 customColor = intensity * uCustomColor;
  vec3 finalColor = mix(rgb, customColor, step(0.5, uUseCustomColor));

  float alpha = length(rgb) * uOpacity;
  fragColor = vec4(finalColor, alpha);
}`;

export const Plasma = ({
  color = '#ffffff',
  speed = 1,
  direction = 'forward',
  scale = 1,
  opacity = 1,
  mouseInteractive = true,
  // Optional ref (0-1, e.g. from AmbientBackground.tsx's passive scroll
  // listener) read once per frame inside this component's own render loop —
  // a plain mutable ref, not a prop value, so scrolling never triggers a
  // React re-render or re-runs this effect. Purely visual: never read
  // elsewhere, never written to by this component, never touches
  // scroll/layout/workflow state itself.
  scrollProgressRef,
  // Optional array of hex colors (2+) — if given, replaces the single
  // fixed `color` for the *animated* hue: continuously interpolated (never
  // stepped) between the two nearest stops based on the same smoothed
  // scroll progress that drives the shape distortion below, so the shape
  // and its color always change together as one thing, not "shape drifts,
  // then color separately snaps to a new section preset." Falls back to a
  // single fixed `color` (the original, unchanged behavior) when omitted.
  colorStops
}) => {
  const containerRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const containerEl = containerRef.current;

    const useCustomColor = color ? 1.0 : 0.0;
    const customColorRgb = color ? hexToRgb(color) : [1, 1, 1];
    const colorStopsRgb = colorStops && colorStops.length > 1 ? colorStops.map(hexToRgb) : null;

    const directionMultiplier = direction === 'reverse' ? -1.0 : 1.0;

    let renderer;
    try {
      renderer = new Renderer({
        webgl: 2,
        alpha: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, 2)
      });
    } catch {
      return;
    }
    const gl = renderer.gl;
    if (!gl) return;
    const canvas = gl.canvas;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    containerEl.appendChild(canvas);

    const geometry = new Triangle(gl);

    const program = new Program(gl, {
      vertex: vertex,
      fragment: fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uCustomColor: { value: new Float32Array(customColorRgb) },
        uUseCustomColor: { value: useCustomColor },
        uSpeed: { value: speed * 0.4 },
        uDirection: { value: directionMultiplier },
        uScale: { value: scale },
        uOpacity: { value: opacity },
        uMouse: { value: new Float32Array([0, 0]) },
        uMouseInteractive: { value: mouseInteractive ? 1.0 : 0.0 },
        uDriftY: { value: 0 },
        uStretch: { value: 1 },
        uMorph: { value: 0 },
        uFlowOffset: { value: 0 }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });

    const handleMouseMove = e => {
      if (!mouseInteractive) return;
      const rect = containerEl.getBoundingClientRect();
      mousePos.current.x = e.clientX - rect.left;
      mousePos.current.y = e.clientY - rect.top;
      const mouseUniform = program.uniforms.uMouse.value;
      mouseUniform[0] = mousePos.current.x;
      mouseUniform[1] = mousePos.current.y;
    };

    if (mouseInteractive) {
      containerEl.addEventListener('mousemove', handleMouseMove);
    }

    const setSize = () => {
      const rect = containerEl.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderer.setSize(width, height);
      const res = program.uniforms.iResolution.value;
      res[0] = gl.drawingBufferWidth;
      res[1] = gl.drawingBufferHeight;
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(containerEl);
    setSize();

    let raf = 0;
    let contextLost = false;
    let isVisible = true;
    let smoothedProgress = 0;
    const t0 = performance.now();

    const loop = t => {
      if (contextLost || !isVisible) return;

      // Smoothed (lerped) scroll progress, not the raw value — a fast
      // scroll never jumps the shape, it eases toward the new position
      // over several frames. 0 at the top of the page reproduces the
      // exact original shape (uDriftY 0, uStretch 1, uFlowOffset 0, hero
      // opacity/color); every visual change below is a single continuous
      // function of this one number — there is no per-section preset to
      // snap between, which is what makes this read as one field, not a
      // sequence of separate background patches.
      const targetProgress = scrollProgressRef ? scrollProgressRef.current : 0;
      smoothedProgress += (targetProgress - smoothedProgress) * 0.04;
      program.uniforms.uDriftY.value = smoothedProgress * gl.drawingBufferHeight * 0.22;
      program.uniforms.uStretch.value = 1 + smoothedProgress * 0.45;
      program.uniforms.uMorph.value = smoothedProgress * 0.6;
      program.uniforms.uFlowOffset.value = smoothedProgress * 4.5;

      // Continuous opacity: an exponential ease from the Hero-strength
      // value (the `opacity` prop, unchanged meaning) down to a floor that
      // still reads as "the same field, just quieter" rather than fading
      // to nothing — most of the drop-off happens over the first ~25% of
      // the document (Hero -> Selected systems -> early projects), then it
      // levels off gently for the rest of the scroll, instead of a linear
      // fade that would barely register until deep in the page.
      const floorOpacity = opacity * 0.32;
      program.uniforms.uOpacity.value = floorOpacity + (opacity - floorOpacity) * Math.exp(-4.2 * smoothedProgress);

      // Continuous color: interpolated between the nearest two colorStops
      // (if provided) using the exact same smoothedProgress — the shape's
      // own hue drifts in lockstep with its distortion, never stepping.
      if (colorStopsRgb) {
        const segments = colorStopsRgb.length - 1;
        const scaled = smoothedProgress * segments;
        const idx = Math.min(segments - 1, Math.floor(scaled));
        const localT = scaled - idx;
        const a = colorStopsRgb[idx];
        const b = colorStopsRgb[idx + 1];
        const custom = program.uniforms.uCustomColor.value;
        custom[0] = a[0] + (b[0] - a[0]) * localT;
        custom[1] = a[1] + (b[1] - a[1]) * localT;
        custom[2] = a[2] + (b[2] - a[2]) * localT;
      }

      let timeValue = (t - t0) * 0.001;
      if (direction === 'pingpong') {
        const pingpongDuration = 10;
        const segmentTime = timeValue % pingpongDuration;
        const isForward = Math.floor(timeValue / pingpongDuration) % 2 === 0;
        const u = segmentTime / pingpongDuration;
        const smooth = u * u * (3 - 2 * u);
        const pingpongTime = isForward ? smooth * pingpongDuration : (1 - smooth) * pingpongDuration;
        program.uniforms.uDirection.value = 1.0;
        program.uniforms.iTime.value = pingpongTime;
      } else {
        program.uniforms.iTime.value = timeValue;
      }
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };

    const handleContextLost = (e) => {
      e.preventDefault();
      contextLost = true;
      cancelAnimationFrame(raf);
    };
    const handleContextRestored = () => {
      contextLost = false;
      if (isVisible) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(loop);
      }
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    const io = new IntersectionObserver(([entry]) => {
      const wasVisible = isVisible;
      isVisible = entry.isIntersecting;
      if (isVisible && !wasVisible && !contextLost) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(loop);
      }
    }, { threshold: 0 });
    io.observe(containerEl);

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      if (mouseInteractive && containerEl) {
        containerEl.removeEventListener('mousemove', handleMouseMove);
      }
      try {
        containerEl?.removeChild(canvas);
      } catch {}
    };
  }, [color, speed, direction, scale, opacity, mouseInteractive]);

  return <div ref={containerRef} className="plasma-container" />;
};

export default Plasma;
