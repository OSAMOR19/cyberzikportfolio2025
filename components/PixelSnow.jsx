'use client';

import { useEffect, useMemo, useRef } from 'react';
import {
  Color,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer
} from 'three';

import { getLenis, getScrollVelocity } from '@/lib/scroll';
import './PixelSnow.css';

// ---------------------------------------------------------------------------------------------
// Tuning
// ---------------------------------------------------------------------------------------------

// Scroll speed (px/s) that produces the full warp. Measured on the home page with Lenis:
// gentle wheel scrolling ~400-800 px/s, normal scrolling ~1,000-1,700 px/s, a fast flick
// ~5,000-6,500 px/s. The curve below keeps normal scrolling a gentle speed-up (measured boost
// ~0.2-0.5, i.e. 1.2-1.5x) and lets a flick reach a clear warp (boost ~3, 4x; 5x at most).
const WARP_FULL_PX_PER_SEC = 5000;
const WARP_CURVE = 1.4;
const WARP_MAX_BOOST = 4;
const WARP_RISE = 0.16; // per 60 Hz frame, towards a higher target
const WARP_FALL = 0.08; // per 60 Hz frame, back towards rest
// How much flakes stretch along their direction of travel while warping (0 = never).
// Length factor = 1 + boost * WARP_STRETCH: a flick (boost ~3) gives ~2x-long streaks.
const WARP_STRETCH = 0.4;

// Pixel-ratio budget. The shader ray-marches up to 128 cells per pixel, so pixels are the cost.
const DPR_CAP = 1.5;
const DPR_CAP_NARROW = 1.25; // screens narrower than 768 CSS px
// The ratio the look was designed at. The shader works in device pixels, so on a 2x screen the
// field of view and flake size depend on it; uPixelScale keeps that look while we render at a
// lower ratio (each rendered pixel samples the matching point of the original 2x grid).
const LOOK_DPR_MAX = 2;

// Reduced motion shows one still frame. A flake right in front of the camera can be hundreds of
// px wide; in motion it flies past in a blink, frozen it looks like a glitch. The still frame
// skips flakes bigger than this half-size (in shader pixels), about the largest seen drifting.
const STILL_MAX_FLAKE_PX = 7;

const vertexShader = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
precision mediump float;

uniform float uTime;
uniform vec2 uResolution;
uniform float uFlakeSize;
uniform float uMinFlakeSize;
uniform float uPixelResolution;
uniform float uSpeed;
uniform float uDepthFade;
uniform float uFarPlane;
uniform vec3 uColor;
uniform float uBrightness;
uniform float uGamma;
uniform float uDensity;
uniform float uVariant;
uniform float uDirection;
uniform float uPixelScale;
uniform float uStretch;
uniform float uMaxFlakePx; // 0 = no limit

// Precomputed constants
#define PI 3.14159265
#define PI_OVER_6 0.5235988
#define PI_OVER_3 1.0471976
#define INV_SQRT3 0.57735027
#define M1 1597334677U
#define M2 3812015801U
#define M3 3299493293U
#define F0 2.3283064e-10

// Optimized hash - inline multiplication
#define hash(n) (n * (n ^ (n >> 15)))
#define coord3(p) (uvec3(p).x * M1 ^ uvec3(p).y * M2 ^ uvec3(p).z * M3)

// Precomputed camera basis vectors (normalized vec3(1,1,1), vec3(1,0,-1))
const vec3 camK = vec3(0.57735027, 0.57735027, 0.57735027);
const vec3 camI = vec3(0.70710678, 0.0, -0.70710678);
const vec3 camJ = vec3(-0.40824829, 0.81649658, -0.40824829);

// Precomputed branch direction
const vec2 b1d = vec2(0.574, 0.819);

vec3 hash3(uint n) {
  uvec3 hashed = hash(n) * uvec3(1U, 511U, 262143U);
  return vec3(hashed) * F0;
}

float snowflakeDist(vec2 p) {
  float r = length(p);
  float a = atan(p.y, p.x);
  a = abs(mod(a + PI_OVER_6, PI_OVER_3) - PI_OVER_6);
  vec2 q = r * vec2(cos(a), sin(a));
  float dMain = max(abs(q.y), max(-q.x, q.x - 1.0));
  float b1t = clamp(dot(q - vec2(0.4, 0.0), b1d), 0.0, 0.4);
  float dB1 = length(q - vec2(0.4, 0.0) - b1t * b1d);
  float b2t = clamp(dot(q - vec2(0.7, 0.0), b1d), 0.0, 0.25);
  float dB2 = length(q - vec2(0.7, 0.0) - b2t * b1d);
  return min(dMain, min(dB1, dB2)) * 10.0;
}

void main() {
  // Precompute reciprocals to avoid division
  float invPixelRes = 1.0 / uPixelResolution;
  float pixelSize = max(1.0, floor(0.5 + uResolution.x * invPixelRes));
  float invPixelSize = 1.0 / pixelSize;

  // uPixelScale maps the (capped) render grid back onto the original device-pixel grid.
  vec2 fragCoord = floor(gl_FragCoord.xy * uPixelScale * invPixelSize);
  vec2 res = uResolution * invPixelSize;
  float invResX = 1.0 / res.x;

  vec3 ray = normalize(vec3((fragCoord - res * 0.5) * invResX, 1.0));
  ray = ray.x * camI + ray.y * camJ + ray.z * camK;

  // Precompute time-based values
  float timeSpeed = uTime * uSpeed;
  float windX = cos(uDirection) * 0.4;
  float windY = sin(uDirection) * 0.4;
  vec3 camPos = (windX * camI + windY * camJ + 0.1 * camK) * timeSpeed;
  vec3 pos = camPos;

  // Warp: squash the flake test space along the direction of travel so flakes read as streaks.
  // stretchK is exactly 0 at rest, which skips this entirely.
  vec2 warpDir = vec2(cos(uDirection), sin(uDirection));
  float stretchK = uStretch / (1.0 + uStretch);

  // Precompute ray reciprocal for strides
  vec3 absRay = max(abs(ray), vec3(0.001));
  vec3 strides = 1.0 / absRay;
  vec3 raySign = step(ray, vec3(0.0));
  vec3 phase = fract(pos) * strides;
  phase = mix(strides - phase, phase, raySign);

  // Precompute for intersection test
  float rayDotCamK = dot(ray, camK);
  float invRayDotCamK = 1.0 / rayDotCamK;
  float invDepthFade = 1.0 / uDepthFade;
  float halfInvResX = 0.5 * invResX;
  vec3 timeAnim = timeSpeed * 0.1 * vec3(7.0, 8.0, 5.0);

  float t = 0.0;
  for (int i = 0; i < 128; i++) {
    if (t >= uFarPlane) break;

    vec3 fpos = floor(pos);
    uint cellCoord = coord3(fpos);
    float cellHash = hash3(cellCoord).x;

    if (cellHash < uDensity) {
      vec3 h = hash3(cellCoord);

      // Optimized flake position calculation
      vec3 sinArg1 = fpos.yzx * 0.073;
      vec3 sinArg2 = fpos.zxy * 0.27;
      vec3 flakePos = 0.5 - 0.5 * cos(4.0 * sin(sinArg1) + 4.0 * sin(sinArg2) + 2.0 * h + timeAnim);
      flakePos = flakePos * 0.8 + 0.1 + fpos;

      float toIntersection = dot(flakePos - pos, camK) * invRayDotCamK;

      if (toIntersection > 0.0) {
        vec3 testPos = pos + ray * toIntersection - flakePos;
        vec2 testP = vec2(dot(testPos, camI), dot(testPos, camJ));
        if (stretchK > 0.0) {
          testP -= warpDir * (dot(testP, warpDir) * stretchK);
        }
        vec2 testUV = abs(testP);

        float depth = dot(flakePos - camPos, camK);
        float flakeSize = max(uFlakeSize, uMinFlakeSize * depth * halfInvResX);

        // Avoid branching with step functions where possible
        float dist;
        if (uVariant < 0.5) {
          dist = max(testUV.x, testUV.y);
        } else if (uVariant < 1.5) {
          dist = length(testUV);
        } else {
          float invFlakeSize = 1.0 / flakeSize;
          dist = snowflakeDist(testP * invFlakeSize) * flakeSize;
        }

        if (dist < flakeSize && (uMaxFlakePx <= 0.0 || flakeSize * res.x <= uMaxFlakePx * depth)) {
          float flakeSizeRatio = uFlakeSize / flakeSize;
          float intensity = exp2(-(t + toIntersection) * invDepthFade) *
                           min(1.0, flakeSizeRatio * flakeSizeRatio) * uBrightness;
          gl_FragColor = vec4(uColor * pow(vec3(intensity), vec3(uGamma)), 1.0);
          return;
        }
      }
    }

    float nextStep = min(min(phase.x, phase.y), phase.z);
    vec3 sel = step(phase, vec3(nextStep));
    phase = phase - nextStep + strides * sel;
    t += nextStep;
    pos = mix(pos + ray * nextStep, floor(pos + ray * nextStep + 0.5), sel);
  }

  gl_FragColor = vec4(0.0);
}
`;

/** Frame-rate independent version of `x += (target - x) * perFrame` (perFrame tuned at 60 Hz). */
const easeFactor = (perFrame, dtMs) => 1 - Math.pow(1 - perFrame, dtMs / (1000 / 60));

/**
 * Fixed WebGL starfield. Drifts on its own clock and "warps" (speeds up, flakes streak) while
 * the page scrolls fast. Under prefers-reduced-motion it renders a single still frame.
 */
export default function PixelSnow({
  color = '#ffffff',
  flakeSize = 0.01,
  minFlakeSize = 1.25,
  pixelResolution = 200,
  speed = 1.25,
  depthFade = 8,
  farPlane = 20,
  brightness = 1,
  gamma = 0.4545,
  density = 0.3,
  variant = 'square',
  direction = 125,
  className = '',
  style = {}
}) {
  const containerRef = useRef(null);
  const materialRef = useRef(null);
  // Renders one frame when the animation loop isn't running (reduced motion, hidden tab).
  const renderIfIdleRef = useRef(null);

  // Memoize shader variant value
  const variantValue = useMemo(() => {
    return variant === 'round' ? 1.0 : variant === 'snowflake' ? 2.0 : 0.0;
  }, [variant]);

  // Memoize color conversion
  const colorVector = useMemo(() => {
    const threeColor = new Color(color);
    return new Vector3(threeColor.r, threeColor.g, threeColor.b);
  }, [color]);

  // Main Three.js setup - only runs once. Prop changes are pushed into uniforms below.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer;
    try {
      renderer = new WebGLRenderer({
        antialias: false,
        alpha: true,
        premultipliedAlpha: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: false
      });
    } catch {
      // No WebGL: keep the plain black background rather than breaking the page.
      return;
    }

    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const canvas = renderer.domElement;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(canvas);

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vector2(1, 1) },
        uFlakeSize: { value: flakeSize },
        uMinFlakeSize: { value: minFlakeSize },
        uPixelResolution: { value: pixelResolution },
        uSpeed: { value: speed },
        uDepthFade: { value: depthFade },
        uFarPlane: { value: farPlane },
        uColor: { value: colorVector.clone() },
        uBrightness: { value: brightness },
        uGamma: { value: gamma },
        uDensity: { value: density },
        uVariant: { value: variantValue },
        uDirection: { value: (direction * Math.PI) / 180 },
        uPixelScale: { value: 1 },
        uStretch: { value: 0 },
        uMaxFlakePx: { value: 0 }
      },
      transparent: true
    });
    materialRef.current = material;
    const { uniforms } = material;

    const geometry = new PlaneGeometry(2, 2);
    scene.add(new Mesh(geometry, material));

    const render = () => renderer.render(scene, camera);

    // --- Sizing ------------------------------------------------------------------------------
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    let cssW = 0;
    let cssH = 0;

    const resize = (force = false) => {
      const w = container.clientWidth;
      const visibleH = container.clientHeight;
      if (!w || !visibleH) return;
      // Touch browsers grow/shrink the viewport as their toolbars hide/show. Keep the tallest
      // height seen at this width so the field doesn't jump; the container clips the extra.
      const h = coarsePointer && w === cssW ? Math.max(cssH, visibleH) : visibleH;
      const lookRatio = Math.min(window.devicePixelRatio || 1, LOOK_DPR_MAX);
      const ratio = Math.min(lookRatio, window.innerWidth < 768 ? DPR_CAP_NARROW : DPR_CAP);
      // Display size: CSS fills the container (100% x 100%) unless we're keeping a taller field.
      canvas.style.height = h === visibleH ? '' : `${h}px`;
      if (!force && w === cssW && h === cssH && ratio === renderer.getPixelRatio()) return;

      cssW = w;
      cssH = h;
      renderer.setPixelRatio(ratio);
      renderer.setSize(w, h, false);
      uniforms.uResolution.value.set(w, h);
      uniforms.uPixelScale.value = lookRatio / ratio;
      // Resizing clears the drawing buffer; draw now so there's never a blank frame.
      render();
    };

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(container);

    // devicePixelRatio changes (window dragged to another monitor) don't always resize anything.
    let dprQuery = null;
    const onDprChange = () => {
      watchDpr();
      resize(true);
    };
    const watchDpr = () => {
      dprQuery?.removeEventListener('change', onDprChange);
      dprQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
      dprQuery.addEventListener('change', onDprChange);
    };
    watchDpr();

    // --- Animation loop ----------------------------------------------------------------------
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = reducedQuery.matches;
    let inView = true;
    let rafId = 0;
    let running = false;
    let lastNow = 0;
    let clock = 0; // accumulated, warp-scaled seconds -> uTime
    let boost = 0;

    const frame = (now) => {
      rafId = requestAnimationFrame(frame);
      // First frame after (re)starting, or a long stall: advance by one normal frame, no jump.
      const dtMs = lastNow ? Math.min(Math.max(now - lastNow, 0), 100) : 1000 / 60;
      lastNow = now;

      // Lenis reports px per frame (refresh-rate dependent); the native fallback reports px per
      // ~16.7 ms. Normalise both to px/s.
      const v = Math.abs(getScrollVelocity());
      const pxPerSec = getLenis() ? (v * 1000) / Math.max(dtMs, 4) : v * 60;
      const target =
        WARP_MAX_BOOST * Math.pow(Math.min(pxPerSec / WARP_FULL_PX_PER_SEC, 1), WARP_CURVE);
      boost += (target - boost) * easeFactor(target > boost ? WARP_RISE : WARP_FALL, dtMs);
      if (boost < 0.002) boost = 0;

      clock += (dtMs / 1000) * (1 + boost);
      uniforms.uTime.value = clock;
      uniforms.uStretch.value = boost * WARP_STRETCH;
      render();
      window.__snowDebug = { boost, pxPerSec, target, dtMs, clock }; // TEMP
    };

    const sync = () => {
      const shouldRun = !reducedMotion && inView && !document.hidden;
      if (shouldRun && !running) {
        running = true;
        lastNow = 0;
        rafId = requestAnimationFrame(frame);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    renderIfIdleRef.current = () => {
      if (!running) render();
    };

    const applyMotionPreference = () => {
      uniforms.uMaxFlakePx.value = reducedMotion ? STILL_MAX_FLAKE_PX : 0;
      if (reducedMotion) {
        // Settle into a calm still frame.
        boost = 0;
        uniforms.uStretch.value = 0;
      }
    };
    applyMotionPreference();

    const onReducedChange = () => {
      reducedMotion = reducedQuery.matches;
      applyMotionPreference();
      sync();
      if (!running) render();
    };
    reducedQuery.addEventListener('change', onReducedChange);

    // Hidden tab: stop the loop entirely and resume from the same clock when it comes back.
    document.addEventListener('visibilitychange', sync);

    // The canvas is usually position: fixed (always in view), but the component also works
    // inside normal flow, where it stops rendering while scrolled out of view.
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(container);

    resize(true); // first frame (also the reduced-motion still)
    sync();

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      dprQuery?.removeEventListener('change', onDprChange);
      reducedQuery.removeEventListener('change', onReducedChange);
      document.removeEventListener('visibilitychange', sync);
      renderIfIdleRef.current = null;
      materialRef.current = null;
      if (canvas.parentNode === container) container.removeChild(canvas);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Create the scene once; the effect below keeps uniforms in sync with props.

  // Update material uniforms when props change
  useEffect(() => {
    const material = materialRef.current;
    if (!material) return;

    material.uniforms.uFlakeSize.value = flakeSize;
    material.uniforms.uMinFlakeSize.value = minFlakeSize;
    material.uniforms.uPixelResolution.value = pixelResolution;
    material.uniforms.uSpeed.value = speed;
    material.uniforms.uDepthFade.value = depthFade;
    material.uniforms.uFarPlane.value = farPlane;
    material.uniforms.uBrightness.value = brightness;
    material.uniforms.uGamma.value = gamma;
    material.uniforms.uDensity.value = density;
    material.uniforms.uVariant.value = variantValue;
    material.uniforms.uDirection.value = (direction * Math.PI) / 180;
    material.uniforms.uColor.value.copy(colorVector);
    renderIfIdleRef.current?.();
  }, [
    flakeSize,
    minFlakeSize,
    pixelResolution,
    speed,
    depthFade,
    farPlane,
    brightness,
    gamma,
    density,
    variantValue,
    direction,
    colorVector
  ]);

  return <div ref={containerRef} className={`pixel-snow-container ${className}`} style={style} />;
}
