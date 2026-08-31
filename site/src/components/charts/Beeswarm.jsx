import { useMemo, useState } from 'react'
import { fmt, niceTicks } from './chartUtils.js'
import { ChartTooltip } from './ChartUI.jsx'
import { useTooltip } from './useTooltip.js'
import './charts.css'

const W = 700
const ROW_H = 62
const PAD_TOP = 12
const AXIS_H = 42
const PAD_RIGHT = 26
const DOT_R = 2.6
const BAND = ROW_H - 16 // vertical room a row's swarm may occupy

/** Sequential ramp standing in for SHAP's blue→red category scale. */
const RAMP = ['#7d9cb5', '#9a93b8', '#b98aa8', '#c2705c']

function rampColor(t) {
  if (!Number.isFinite(t)) return RAMP[0]
  const scaled = Math.max(0, Math.min(1, t)) * (RAMP.length - 1)
  const i = Math.min(RAMP.length - 2, Math.floor(scaled))
  const f = scaled - i
  const [a, b] = [RAMP[i], RAMP[i + 1]].map((h) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ])
  const mix = a.map((c, k) => Math.round(c + (b[k] - c) * f))
  return `rgb(${mix.join(',')})`
}

/**
 * Lays a row's points out as a swarm: bucket by x pixel, then fan each
 * bucket symmetrically around the centre line so density reads as width.
 */
function swarm(points, xOf) {
  const buckets = new Map()
  const placed = []
  for (const p of points) {
    const px = xOf(p.s)
    const key = Math.round(px / (DOT_R * 2))
    const n = buckets.get(key) ?? 0
    buckets.set(key, n + 1)
    // 0, +1, -1, +2, -2 … keeps the swarm centred as it grows.
    const step = Math.ceil(n / 2) * (n % 2 === 0 ? 1 : -1)
    const dy = step * DOT_R * 1.85
    placed.push({ ...p, px, dy: Math.max(-BAND / 2, Math.min(BAND / 2, dy)) })
  }
  return placed
}

/**
 * SHAP summary (beeswarm) plot. One row per feature, one dot per record.
 * `data`: { features: [{ feature, meanAbs, categories, nCategories, points: [{s, c}] }] }
 * s = SHAP value; c indexes into the row's `categories` array for colour and label.
 */
export default function Beeswarm({
  data,
  labelWidth = 168,
  axisTitle = 'SHAP value (impact on model output)',
  ariaLabel,
}) {
  const { containerRef, tip, show, hide } = useTooltip()
  const [locked, setLocked] = useState(null)

  const { rows, ticks, H, x } = useMemo(() => {
    const all = data.features.flatMap((f) => f.points.map((p) => p.s))
    const t = niceTicks(Math.min(...all), Math.max(...all), 7)
    const [lo, hi] = [t[0], t[t.length - 1]]
    const plotW = W - labelWidth - PAD_RIGHT
    const xOf = (v) => labelWidth + ((v - lo) / (hi - lo)) * plotW
    return {
      rows: data.features.map((f) => ({ ...f, placed: swarm(f.points, xOf) })),
      ticks: t,
      H: PAD_TOP + data.features.length * ROW_H + AXIS_H,
      x: xOf,
    }
  }, [data, labelWidth])

  const plotBottom = PAD_TOP + rows.length * ROW_H
  // A locked category dims every dot outside it, so one group is traceable.
  const active = locked ?? (tip ? { feature: tip.feature, label: tip.label } : null)

  return (
    <div className="chart-wrap" ref={containerRef}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel}>
        {ticks.map((t) => (
          <line
            key={t}
            className="chart-grid-line"
            x1={x(t)}
            x2={x(t)}
            y1={PAD_TOP}
            y2={plotBottom}
          />
        ))}
        <line className="chart-zero-line" x1={x(0)} x2={x(0)} y1={PAD_TOP} y2={plotBottom} />

        {rows.map((row, i) => {
          const cy = PAD_TOP + i * ROW_H + ROW_H / 2
          return (
            <g key={row.feature}>
              <text className="chart-label-text" x={labelWidth - 12} y={cy} textAnchor="end" dy="0.32em">
                {row.feature}
              </text>
              {row.placed.map((p, k) => {
                const label = row.categories[p.c]
                const dim =
                  active && !(active.feature === row.feature && active.label === label)
                const isActive =
                  active && active.feature === row.feature && active.label === label
                return (
                  <circle
                    key={k}
                    cx={p.px}
                    cy={cy + p.dy}
                    r={isActive ? DOT_R + 0.8 : DOT_R}
                    fill={rampColor(row.nCategories > 1 ? p.c / (row.nCategories - 1) : 0)}
                    opacity={dim ? 0.12 : 0.78}
                    style={{ cursor: 'pointer' }}
                    onMouseMove={(e) =>
                      show(e, {
                        feature: row.feature,
                        label,
                        title: row.feature,
                        rows: [
                          ['Category', label],
                          ['SHAP value', fmt(p.s, 3)],
                          ['Direction', p.s >= 0 ? 'Raises predicted risk' : 'Lowers predicted risk'],
                        ],
                        note: 'Click to keep this category highlighted',
                      })
                    }
                    onMouseLeave={hide}
                    onClick={() =>
                      setLocked((cur) =>
                        cur && cur.feature === row.feature && cur.label === label
                          ? null
                          : { feature: row.feature, label },
                      )
                    }
                  />
                )
              })}
            </g>
          )
        })}

        <line className="chart-grid-line" x1={labelWidth} x2={W - PAD_RIGHT} y1={plotBottom} y2={plotBottom} />
        {ticks.map((t) => (
          <text key={t} className="chart-axis-text" x={x(t)} y={plotBottom + 18} textAnchor="middle">
            {fmt(t, 1)}
          </text>
        ))}
        <text className="chart-axis-title" x={labelWidth + (W - labelWidth - PAD_RIGHT) / 2} y={H - 6} textAnchor="middle">
          {axisTitle}
        </text>
      </svg>

      {locked && (
        <button type="button" className="chart-toggle__btn chart-reset" onClick={() => setLocked(null)}>
          Clear “{locked.label}” highlight
        </button>
      )}

      <ChartTooltip tip={tip} />
    </div>
  )
}
