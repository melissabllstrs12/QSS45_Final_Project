import { niceTicks } from './chartUtils.js'
import { ChartTooltip } from './ChartUI.jsx'
import { useTooltip } from './useTooltip.js'
import './charts.css'

const W = 700
const H = 330
const PAD_L = 54
const PAD_R = 20
const PAD_T = 16
const PAD_B = 56

/**
 * Vertical grouped bars that handle negative values around a zero baseline.
 * `groups`: [{ label, values: number[] }]  `series`: [{ name, color }]
 */
export default function GroupedBars({
  groups,
  series,
  axisTitle,
  valueFormat = (v) => v.toFixed(3),
  tooltipNote,
  ariaLabel,
}) {
  const { containerRef, tip, show, hide } = useTooltip()

  const all = groups.flatMap((g) => g.values)
  const ticks = niceTicks(Math.min(...all, 0), Math.max(...all, 0), 6)
  const yMin = ticks[0]
  const yMax = ticks[ticks.length - 1]
  const plotH = H - PAD_T - PAD_B
  const plotW = W - PAD_L - PAD_R
  const y = (v) => PAD_T + plotH - ((v - yMin) / (yMax - yMin)) * plotH

  const groupW = plotW / groups.length
  const barW = Math.min(72, (groupW * 0.62) / series.length)
  const zeroY = y(0)

  return (
    <div className="chart-wrap" ref={containerRef}>
      <div className="chart-legend">
        {series.map((s) => (
          <span className="chart-legend__item" key={s.name}>
            <span className="chart-legend__swatch" style={{ background: s.color }} />
            {s.name}
          </span>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel}>
        {ticks.map((t) => (
          <g key={t}>
            <line className="chart-grid-line" x1={PAD_L} x2={W - PAD_R} y1={y(t)} y2={y(t)} />
            <text className="chart-axis-text" x={PAD_L - 9} y={y(t)} textAnchor="end" dominantBaseline="central">
              {valueFormat(t)}
            </text>
          </g>
        ))}

        <line className="chart-zero-line" x1={PAD_L} x2={W - PAD_R} y1={zeroY} y2={zeroY} />

        {groups.map((g, gi) => {
          const groupX = PAD_L + gi * groupW
          const clusterW = barW * series.length + 10 * (series.length - 1)
          const startX = groupX + (groupW - clusterW) / 2

          return (
            <g key={g.label}>
              {g.values.map((v, si) => {
                const bx = startX + si * (barW + 10)
                const top = v >= 0 ? y(v) : zeroY
                const h = Math.max(Math.abs(y(v) - zeroY), 1)
                const key = `${gi}-${si}`
                const active = tip?.key === key
                const dimmed = tip && !active
                const payload = {
                  key,
                  title: `${g.label} — ${series[si].name}`,
                  rows: [['Value', valueFormat(v)]],
                  note: v < 0 ? tooltipNote : undefined,
                }

                return (
                  <g key={key} className={dimmed ? 'chart-dimmed' : undefined}>
                    <rect
                      className="chart-bar"
                      x={bx}
                      y={top}
                      width={barW}
                      height={h}
                      rx={3}
                      fill={series[si].color}
                    />
                    <text
                      className="chart-axis-text"
                      x={bx + barW / 2}
                      y={v >= 0 ? top - 7 : top + h + 14}
                      textAnchor="middle"
                    >
                      {valueFormat(v)}
                    </text>
                    <rect
                      className="chart-hit"
                      x={bx}
                      y={Math.min(top, zeroY) - 10}
                      width={barW}
                      height={h + 20}
                      onPointerMove={(e) => show(e, payload)}
                      onPointerDown={(e) => show(e, payload)}
                      onPointerLeave={hide}
                    />
                  </g>
                )
              })}

              <text
                className="chart-label-text"
                x={groupX + groupW / 2}
                y={H - PAD_B + 24}
                textAnchor="middle"
              >
                {g.label}
              </text>
            </g>
          )
        })}

        {axisTitle && (
          <text
            className="chart-axis-title"
            transform={`rotate(-90) translate(${-(PAD_T + plotH / 2)} 14)`}
            textAnchor="middle"
          >
            {axisTitle}
          </text>
        )}
      </svg>
      <ChartTooltip tip={tip} />
    </div>
  )
}
