import { niceTicks } from './chartUtils.js'
import { ChartTooltip } from './ChartUI.jsx'
import { useTooltip } from './useTooltip.js'
import './charts.css'

const W = 700
const H = 340
const PAD_L = 58
const PAD_R = 22
const PAD_T = 18
const PAD_B = 52

/**
 * Multi-series line chart over a numeric x-axis. Hovering a vertical band
 * reports every series' value at that x.
 *
 * `series`: [{ name, color, points: [{ x, y, label?, break? }] }]
 * A point flagged `break` starts a new path segment (used for the ITS step).
 */
export default function LineChart({
  series,
  xTicks,
  yTicks: yTicksProp,
  formatX = (v) => String(v),
  formatY = (v) => v.toFixed(2),
  formatTooltipY,
  xAxisTitle,
  yAxisTitle,
  markerX,
  markerLabel,
  showDots = true,
  showLegend = true,
  ariaLabel,
}) {
  const { containerRef, tip, show, hide } = useTooltip()

  const allPoints = series.flatMap((s) => s.points)
  const xs = allPoints.map((p) => p.x)
  const ys = allPoints.map((p) => p.y)
  const xMin = Math.min(...xs)
  const xMax = Math.max(...xs)

  const yTicks = yTicksProp ?? niceTicks(Math.min(...ys), Math.max(...ys), 5)
  const yMin = yTicks[0]
  const yMax = yTicks[yTicks.length - 1]

  const plotW = W - PAD_L - PAD_R
  const plotH = H - PAD_T - PAD_B
  const x = (v) => PAD_L + ((v - xMin) / (xMax - xMin || 1)) * plotW
  const y = (v) => PAD_T + plotH - ((v - yMin) / (yMax - yMin || 1)) * plotH

  const path = (points) =>
    points
      .map((p, i) => `${i === 0 || p.break ? 'M' : 'L'} ${x(p.x).toFixed(2)} ${y(p.y).toFixed(2)}`)
      .join(' ')

  // One hover band per distinct x, so the tooltip can report all series at once.
  const uniqueX = [...new Set(xs)].sort((a, b) => a - b)
  const bandW = plotW / Math.max(uniqueX.length, 1)
  const fmtTipY = formatTooltipY ?? formatY

  return (
    <div className="chart-wrap" ref={containerRef}>
      {showLegend && series.length > 1 && (
        <div className="chart-legend">
          {series.map((s) => (
            <span className="chart-legend__item" key={s.name}>
              <span className="chart-legend__swatch" style={{ background: s.color }} />
              {s.name}
            </span>
          ))}
        </div>
      )}

      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel}>
        {yTicks.map((t) => (
          <g key={t}>
            <line className="chart-grid-line" x1={PAD_L} x2={W - PAD_R} y1={y(t)} y2={y(t)} />
            <text className="chart-axis-text" x={PAD_L - 9} y={y(t)} textAnchor="end" dominantBaseline="central">
              {formatY(t)}
            </text>
          </g>
        ))}

        {markerX != null && (
          <>
            <line className="chart-marker-line" x1={x(markerX)} x2={x(markerX)} y1={PAD_T} y2={PAD_T + plotH} />
            {markerLabel && (
              <text
                className="chart-axis-text"
                x={x(markerX) + 6}
                y={PAD_T + 12}
                fill="var(--chart-accent)"
              >
                {markerLabel}
              </text>
            )}
          </>
        )}

        {series.map((s) => (
          <path
            key={s.name}
            d={path(s.points)}
            fill="none"
            stroke={s.color}
            strokeWidth="2.4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}

        {showDots &&
          series.map((s) =>
            s.points.map((p) => (
              <circle
                key={`${s.name}-${p.x}`}
                className="chart-point"
                cx={x(p.x)}
                cy={y(p.y)}
                r={tip?.bandX === p.x ? 5.5 : 3.5}
                fill={s.color}
              />
            )),
          )}

        {uniqueX.map((ux, i) => {
          const rows = series
            .map((s) => {
              const pt = s.points.find((p) => p.x === ux)
              return pt ? [s.name, fmtTipY(pt.y)] : null
            })
            .filter(Boolean)
          const labelPoint = allPoints.find((p) => p.x === ux && p.label)
          const payload = {
            bandX: ux,
            title: labelPoint?.label ?? formatX(ux),
            rows,
          }
          return (
            <rect
              key={ux}
              className="chart-hit"
              x={PAD_L + i * bandW}
              y={PAD_T}
              width={bandW}
              height={plotH}
              onPointerMove={(e) => show(e, payload)}
              onPointerDown={(e) => show(e, payload)}
              onPointerLeave={hide}
            />
          )
        })}

        <line className="chart-grid-line" x1={PAD_L} x2={W - PAD_R} y1={PAD_T + plotH} y2={PAD_T + plotH} />

        {(xTicks ?? uniqueX).map((t) => (
          <text key={t} className="chart-axis-text" x={x(t)} y={PAD_T + plotH + 18} textAnchor="middle">
            {formatX(t)}
          </text>
        ))}

        {xAxisTitle && (
          <text className="chart-axis-title" x={PAD_L + plotW / 2} y={H - 8} textAnchor="middle">
            {xAxisTitle}
          </text>
        )}
        {yAxisTitle && (
          <text
            className="chart-axis-title"
            transform={`rotate(-90) translate(${-(PAD_T + plotH / 2)} 14)`}
            textAnchor="middle"
          >
            {yAxisTitle}
          </text>
        )}
      </svg>
      <ChartTooltip tip={tip} />
    </div>
  )
}
