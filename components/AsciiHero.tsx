'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { noise3 } from '@/lib/noise'

/** Light to dark. Every character is one step denser than the one before it. */
export const DEFAULT_RAMP =
  '.,:;i!lI?/\\|()1{}[]rcvunxzjftLCJUYXZOQ0mwqpdbkhao*#MW&8%B@'

export type AsciiHeroProps = {
  src: string
  /** Grid width. 200 to 260 reads well on desktop. */
  columns?: number
  /** Spatial frequency of the drift. Larger values make finer grain. */
  noiseScale?: number
  /** How fast the field evolves. */
  noiseSpeed?: number
  /** How far the noise can push a cell along the ramp, in luminance units. */
  noiseAmount?: number
  /** Radius of the pointer wake, in cells. */
  cursorRadius?: number
  /** How hard the pointer pushes cells down the ramp. */
  cursorStrength?: number
  /** Seconds for one full cool to warm and back again. */
  hueCycleSeconds?: number
  rampString?: string
  className?: string
}

const TARGET_FPS = 30
const FRAME_MS = 1000 / TARGET_FPS
const MAX_DPR = 1.5
const MOBILE_BREAKPOINT = 768
const MOBILE_COLUMNS = 110

/** How long a point in the pointer trail takes to settle back. */
const WAKE_MS = 800
const TRAIL_LENGTH = 22

// Colour buckets. Lightness comes from the unperturbed luminance, so a cell's
// bucket never changes and runs of identical colour can be precomputed once.
const LIGHT_BUCKETS = 24
const HUE_BUCKETS = 8
const LIGHT_MIN = 30
const LIGHT_MAX = 76
const HUE_COOL = 208
const HUE_WARM = 34

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v)

type Layout = {
  cols: number
  rows: number
  cellW: number
  cellH: number
  fontSize: number
  /** Unperturbed luminance per cell, 0 to 1, contrast stretched. */
  lum: Float32Array
  /** Ramp character codes, rebuilt each frame. */
  codes: Uint16Array
  /** Pointer influence per cell, rebuilt each frame. */
  wake: Float32Array
  /** Precomputed runs of constant colour, one entry per run. */
  runRow: Int32Array
  runStart: Int32Array
  runLen: Int32Array
  runStyle: Int32Array
  runCount: number
  /** Mean saturation of the source, mapped into the allowed band. */
  saturation: number
}

/** Red, green and blue in 0 to 255 to hue in degrees and saturation in 0 to 1. */
function hueAndSat(r: number, g: number, b: number): [number, number] {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const d = max - min
  if (d === 0) return [0, 0]
  const l = (max + min) / 2
  const s = d / (1 - Math.abs(2 * l - 1))
  let h: number
  if (max === rn) h = ((gn - bn) / d) % 6
  else if (max === gn) h = (bn - rn) / d + 2
  else h = (rn - gn) / d + 4
  return [(h * 60 + 360) % 360, s]
}

export default function AsciiHero({
  src,
  columns = 220,
  noiseScale = 0.05,
  noiseSpeed = 0.15,
  noiseAmount = 0.35,
  cursorRadius = 12,
  cursorStrength = 0.3,
  hueCycleSeconds = 90,
  rampString = DEFAULT_RAMP,
  className,
}: AsciiHeroProps) {
  const isDev = process.env.NODE_ENV === 'development'

  // In development the panel below owns the values so they can be dragged
  // live. In production this state is written once and never read.
  const [tuned, setTuned] = useState({
    columns,
    noiseScale,
    noiseSpeed,
    noiseAmount,
    cursorRadius,
    cursorStrength,
    hueCycleSeconds,
    rampString,
  })

  const active = isDev
    ? tuned
    : {
        columns,
        noiseScale,
        noiseSpeed,
        noiseAmount,
        cursorRadius,
        cursorStrength,
        hueCycleSeconds,
        rampString,
      }

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  // Values the animation loop reads every frame. Held in a ref so changing
  // them does not tear down and rebuild the loop.
  const liveRef = useRef(active)
  liveRef.current = active

  // Only these two change the grid itself, so only these restart the effect.
  const { columns: gridColumns, rampString: ramp } = active

  const rampCodes = useMemo(() => {
    const codes = new Uint16Array(ramp.length)
    for (let i = 0; i < ramp.length; i++) codes[i] = ramp.charCodeAt(i)
    return codes
  }, [ramp])

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    let layout: Layout | null = null
    let image: HTMLImageElement | null = null
    let raf = 0
    let accumulator = 0
    let lastTime = 0
    let startTime = 0
    let visible = true
    let onScreen = true
    let disposed = false

    const trail: { x: number; y: number; t: number }[] = []
    let pointerEnabled = window.innerWidth >= MOBILE_BREAKPOINT

    const fontFamily =
      getComputedStyle(document.documentElement).getPropertyValue('--font-utility').trim() ||
      'monospace'

    /** Resamples the source into the grid. Runs on resize, never per frame. */
    function build(): Layout | null {
      if (!image || !canvas || !ctx || !wrap) return null

      const rect = wrap.getBoundingClientRect()
      const width = Math.max(1, Math.round(rect.width))
      const height = Math.max(1, Math.round(rect.height))

      pointerEnabled = width >= MOBILE_BREAKPOINT
      const cols = Math.max(24, Math.round(width < MOBILE_BREAKPOINT ? MOBILE_COLUMNS : gridColumns))

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Measure the cell rather than assuming the usual 0.6 advance ratio,
      // since the loaded face decides it.
      ctx.font = `100px ${fontFamily}`
      const probe = ctx.measureText('M')
      const advanceRatio = probe.width / 100 || 0.6
      const heightRatio =
        (probe.fontBoundingBoxAscent + probe.fontBoundingBoxDescent) / 100 || 1.3

      const cellW = width / cols
      const fontSize = cellW / advanceRatio
      const cellH = fontSize * heightRatio
      const rows = Math.max(2, Math.ceil(height / cellH))

      // Cover fit, so the photograph fills the viewport rather than sitting in
      // a letterbox.
      const gridAspect = (cols * cellW) / (rows * cellH)
      const imgAspect = image.width / image.height
      let sw: number
      let sh: number
      if (imgAspect > gridAspect) {
        sh = image.height
        sw = sh * gridAspect
      } else {
        sw = image.width
        sh = sw / gridAspect
      }
      const sx = (image.width - sw) / 2
      const sy = (image.height - sh) / 2

      const off = document.createElement('canvas')
      off.width = cols
      off.height = rows
      const octx = off.getContext('2d', { willReadFrequently: true })
      if (!octx) return null
      octx.imageSmoothingEnabled = true
      octx.imageSmoothingQuality = 'high'
      octx.drawImage(image, sx, sy, sw, sh, 0, 0, cols, rows)

      const total = cols * rows
      const data = octx.getImageData(0, 0, cols, rows).data
      const lum = new Float32Array(total)
      const hues = new Float32Array(total)
      let satSum = 0
      let hueSin = 0
      let hueCos = 0

      for (let i = 0; i < total; i++) {
        const r = data[i * 4]
        const g = data[i * 4 + 1]
        const b = data[i * 4 + 2]
        lum[i] = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
        const [h, s] = hueAndSat(r, g, b)
        hues[i] = h
        satSum += s
        // Hue is circular, so the mean has to be taken on the unit circle.
        const rad = (h * Math.PI) / 180
        hueSin += Math.sin(rad) * s
        hueCos += Math.cos(rad) * s
      }

      // A percentile stretch. ASCII throws away so much detail that a source
      // sitting in the middle of the range turns to mush without it.
      const sorted = Float32Array.from(lum).sort()
      const lo = sorted[Math.floor(total * 0.02)]
      const hi = sorted[Math.floor(total * 0.98)]
      const span = hi - lo > 0.02 ? hi - lo : 1
      for (let i = 0; i < total; i++) lum[i] = clamp((lum[i] - lo) / span, 0, 1)

      const meanHue = ((Math.atan2(hueSin, hueCos) * 180) / Math.PI + 360) % 360
      const saturation = clamp(18 + (satSum / total) * 26, 18, 30)

      // Style index per cell. Lightness comes from the unperturbed luminance,
      // so this is stable for the life of the layout.
      const style = new Int32Array(total)
      for (let i = 0; i < total; i++) {
        const lb = clamp(Math.round(lum[i] * (LIGHT_BUCKETS - 1)), 0, LIGHT_BUCKETS - 1)
        // Signed distance from the mean hue, so a colour photograph keeps its
        // relative hue relationships as the whole palette rotates.
        const dev = ((hues[i] - meanHue + 540) % 360) - 180
        const hb = clamp(
          Math.round(((clamp(dev, -40, 40) + 40) / 80) * (HUE_BUCKETS - 1)),
          0,
          HUE_BUCKETS - 1,
        )
        style[i] = hb * LIGHT_BUCKETS + lb
      }

      // Collapse each row into runs of constant style. Neighbouring cells
      // usually agree, which cuts the fillText count by roughly ten times.
      const runRow = new Int32Array(total)
      const runStart = new Int32Array(total)
      const runLen = new Int32Array(total)
      const runStyle = new Int32Array(total)
      let runCount = 0
      for (let y = 0; y < rows; y++) {
        let start = 0
        let current = style[y * cols]
        for (let x = 1; x <= cols; x++) {
          const s = x < cols ? style[y * cols + x] : -1
          if (s !== current) {
            runRow[runCount] = y
            runStart[runCount] = start
            runLen[runCount] = x - start
            runStyle[runCount] = current
            runCount++
            start = x
            current = s
          }
        }
      }

      return {
        cols,
        rows,
        cellW,
        cellH,
        fontSize,
        lum,
        codes: new Uint16Array(total),
        wake: new Float32Array(total),
        runRow,
        runStart,
        runLen,
        runStyle,
        runCount,
        saturation,
      }
    }

    /** Builds the frame's palette. Only the hue moves, so this is cheap. */
    function palette(elapsed: number, saturation: number): string[] {
      const { hueCycleSeconds: cycle } = liveRef.current
      const phase = (1 - Math.cos((2 * Math.PI * elapsed) / Math.max(1, cycle))) / 2
      const base = HUE_COOL + (HUE_WARM - HUE_COOL) * phase
      const out: string[] = new Array(HUE_BUCKETS * LIGHT_BUCKETS)
      for (let hb = 0; hb < HUE_BUCKETS; hb++) {
        const dev = (hb / (HUE_BUCKETS - 1)) * 80 - 40
        const hue = (((base + dev) % 360) + 360) % 360
        for (let lb = 0; lb < LIGHT_BUCKETS; lb++) {
          const light = LIGHT_MIN + (lb / (LIGHT_BUCKETS - 1)) * (LIGHT_MAX - LIGHT_MIN)
          out[hb * LIGHT_BUCKETS + lb] = `hsl(${hue.toFixed(1)} ${saturation.toFixed(1)}% ${light.toFixed(1)}%)`
        }
      }
      return out
    }

    function draw(elapsed: number, animate: boolean) {
      if (!layout || !ctx || !canvas) return
      const { cols, rows, cellW, cellH, fontSize, lum, codes, wake } = layout
      const tune = liveRef.current
      const rampLast = rampCodes.length - 1
      if (rampLast < 0) return

      // Pointer wake. Each trail point only touches the cells inside its
      // radius, so this stays cheap regardless of grid size.
      wake.fill(0)
      if (animate && pointerEnabled && trail.length > 0) {
        const now = performance.now()
        const r = Math.max(1, tune.cursorRadius)
        const r2 = r * r
        for (let p = trail.length - 1; p >= 0; p--) {
          const point = trail[p]
          const age = now - point.t
          if (age > WAKE_MS) {
            trail.splice(0, p + 1)
            break
          }
          const strength = 1 - age / WAKE_MS
          const x0 = Math.max(0, Math.floor(point.x - r))
          const x1 = Math.min(cols - 1, Math.ceil(point.x + r))
          const y0 = Math.max(0, Math.floor(point.y - r))
          const y1 = Math.min(rows - 1, Math.ceil(point.y + r))
          for (let y = y0; y <= y1; y++) {
            const dy = y - point.y
            for (let x = x0; x <= x1; x++) {
              const dx = x - point.x
              const d2 = dx * dx + dy * dy
              if (d2 >= r2) continue
              // Cubic falloff, so the edge of the wake is soft rather than a
              // visible circle.
              const k = 1 - d2 / r2
              wake[y * cols + x] += k * k * k * strength
            }
          }
        }
      }

      const t = animate ? elapsed : 0
      const nz = tune.noiseScale
      const nt = t * tune.noiseSpeed
      const amount = tune.noiseAmount
      const push = tune.cursorStrength

      for (let y = 0; y < rows; y++) {
        const rowOffset = y * cols
        const ny = y * nz
        for (let x = 0; x < cols; x++) {
          const i = rowOffset + x
          let v = lum[i] + noise3(x * nz, ny, nt) * amount
          if (wake[i] > 0) v -= push * Math.min(wake[i], 1.4)
          v = v < 0 ? 0 : v > 1 ? 1 : v
          // Ramp runs light to dark, so a bright cell wants a low index.
          codes[i] = rampCodes[Math.round((1 - v) * rampLast)]
        }
      }

      const colours = palette(t, layout.saturation)

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${fontSize}px ${fontFamily}`
      ctx.textBaseline = 'top'
      ctx.textAlign = 'left'

      let lastStyle = -1
      for (let r = 0; r < layout.runCount; r++) {
        const style = layout.runStyle[r]
        if (style !== lastStyle) {
          ctx.fillStyle = colours[style]
          lastStyle = style
        }
        const start = layout.runRow[r] * cols + layout.runStart[r]
        const text = String.fromCharCode.apply(
          null,
          codes.subarray(start, start + layout.runLen[r]) as unknown as number[],
        )
        ctx.fillText(text, layout.runStart[r] * cellW, layout.runRow[r] * cellH)
      }
    }

    function loop(now: number) {
      raf = requestAnimationFrame(loop)
      const delta = now - lastTime
      lastTime = now
      accumulator += delta
      // Do not let a backgrounded tab bank up frames.
      if (accumulator > FRAME_MS * 3) accumulator = FRAME_MS
      if (accumulator < FRAME_MS) return
      accumulator -= FRAME_MS
      draw((now - startTime) / 1000, true)
    }

    function shouldRun() {
      return visible && onScreen && !reduceMotion.matches && !disposed
    }

    function sync() {
      if (shouldRun()) {
        if (!raf) {
          lastTime = performance.now()
          if (!startTime) startTime = lastTime
          raf = requestAnimationFrame(loop)
        }
      } else if (raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    }

    function relayout() {
      layout = build()
      if (!layout) return
      // One frame immediately, so a resize or a reduced motion preference
      // never leaves an empty canvas.
      draw(reduceMotion.matches ? 0 : (performance.now() - (startTime || performance.now())) / 1000, !reduceMotion.matches)
      sync()
    }

    let resizeTimer = 0
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(relayout, 120)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!layout || !pointerEnabled || !wrap) return
      const rect = wrap.getBoundingClientRect()
      trail.push({
        x: (event.clientX - rect.left) / layout.cellW,
        y: (event.clientY - rect.top) / layout.cellH,
        t: performance.now(),
      })
      if (trail.length > TRAIL_LENGTH) trail.shift()
    }

    const onVisibility = () => {
      visible = document.visibilityState === 'visible'
      sync()
    }

    const observer = new IntersectionObserver(
      (entries) => {
        onScreen = entries.some((entry) => entry.isIntersecting)
        sync()
      },
      { threshold: 0 },
    )
    observer.observe(wrap)

    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(wrap)

    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    reduceMotion.addEventListener('change', relayout)

    // Wait for the mono face before measuring, otherwise the cell is sized
    // against the fallback and every glyph lands off its grid.
    const img = new Image()
    img.decoding = 'async'
    img.src = src
    Promise.all([img.decode().catch(() => undefined), document.fonts.ready]).then(() => {
      if (disposed) return
      image = img
      relayout()
    })

    return () => {
      disposed = true
      if (raf) cancelAnimationFrame(raf)
      window.clearTimeout(resizeTimer)
      observer.disconnect()
      resizeObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onPointerMove)
      reduceMotion.removeEventListener('change', relayout)
    }
  }, [src, gridColumns, rampCodes])

  return (
    <div ref={wrapRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} className="block h-full w-full" />
      {isDev ? <Controls value={tuned} onChange={setTuned} /> : null}
    </div>
  )
}

/* ---------------------------------------------------------------------------
   Development only. Stripped from the production bundle by the NODE_ENV check
   at the call site above.
   --------------------------------------------------------------------------- */

type Tuning = {
  columns: number
  noiseScale: number
  noiseSpeed: number
  noiseAmount: number
  cursorRadius: number
  cursorStrength: number
  hueCycleSeconds: number
  rampString: string
}

const SLIDERS: { key: keyof Tuning; min: number; max: number; step: number }[] = [
  { key: 'columns', min: 60, max: 320, step: 2 },
  { key: 'noiseScale', min: 0.005, max: 0.3, step: 0.005 },
  { key: 'noiseSpeed', min: 0, max: 1, step: 0.01 },
  { key: 'noiseAmount', min: 0, max: 1, step: 0.01 },
  { key: 'cursorRadius', min: 0, max: 40, step: 1 },
  { key: 'cursorStrength', min: 0, max: 1, step: 0.01 },
  { key: 'hueCycleSeconds', min: 5, max: 240, step: 1 },
]

function Controls({
  value,
  onChange,
}: {
  value: Tuning
  onChange: (next: Tuning) => void
}) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // The hero sits inside a layer that is aria-hidden and does not take pointer
  // events, so the panel has to be lifted out of it to be usable at all.
  if (!mounted) return null

  return createPortal(
    <div className="face-utility fixed right-3 bottom-3 z-50 w-64 border border-rule bg-paper/95 backdrop-blur-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-2 text-ink-muted"
      >
        <span>hero controls</span>
        <span aria-hidden="true">{open ? '−' : '+'}</span>
      </button>

      {open ? (
        <div className="space-y-2 border-t border-rule px-3 py-3">
          {SLIDERS.map(({ key, min, max, step }) => (
            <label key={key} className="block">
              <span className="flex justify-between text-ink-muted">
                <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                <span>{value[key] as number}</span>
              </span>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value[key] as number}
                onChange={(e) => onChange({ ...value, [key]: Number(e.target.value) })}
                className="mt-1 w-full accent-accent"
              />
            </label>
          ))}

          <label className="block">
            <span className="text-ink-muted">ramp</span>
            <input
              type="text"
              value={value.rampString}
              onChange={(e) => onChange({ ...value, rampString: e.target.value })}
              className="mt-1 w-full border border-rule bg-paper px-2 py-1"
              spellCheck={false}
            />
          </label>

          <button
            type="button"
            className="text-ink-muted underline"
            onClick={() => console.log(JSON.stringify(value, null, 2))}
          >
            log values
          </button>
        </div>
      ) : null}
    </div>,
    document.body,
  )
}
