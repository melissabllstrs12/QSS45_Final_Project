import { ci95, niceTicks } from './chartUtils.js'
import { ChartTooltip } from './ChartUI.jsx'
import { useTooltip } from './useTooltip.js'
import './charts.css'

const W = 700
const ROW_H = 34
const PAD_TOP = 10
const AXIS_H = 40
const PAD_RIGHT = 24

/**
 * Coefficient plot: a dot per estimate with its 95% CI whisker and a zero
 * reference line. `data`: [{ label, coef, se, p? }]
 */
export default function ForestPlot({
  data,
  labelWidth = 210,
  axisTitle,
  valueFormat = (v) => v.toFixed(4),
  tickFormat,
  tooltipRows,
  ariaLabel,
}) {
  const { containerRef, tip, show, hide } = useTooltip()

  const plotW = W - labelWidth - PAD_RIGHT
  const H = PAD_TOP + data.length * ROW_H + AXIS_H

  const lows = data.map((d) => d.coef - ci95(d.se))
  const highs = data.map((d) => d.coef + ci95(d.se))
  const ticks = niceTicks(Math.min(...lows, 0), Math.max(...highs, 0), 6)
  const axisMin = ticks[0]
  const axisMax = ticks[ticks.length - 1]
  const x = (v) => labelWidth + ((v - axisMin) / (axisMax - axisMin)) * plotW
  const fmtTick = tickFormat ?? valueFormat

  // Significant when the interval clears zero (equivalently p < 0.05).
  const isSig = (d) => (d.p != null ? d.p < 0.05 : d.coef - ci95(d.se) > 0 || d.coef + ci95(d.se) < 0)

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
            y2={PAD_TOP + data.length * ROW_H}
          />
        ))}

        <line
          className="chart-zero-line"
          x1={x(0)}
          x2={x(0)}
          y1={PAD_TOP}
          y2={PAD_TOP + data.length * ROW_H}
        />

        {data.map((d, i) => {
          const y = PAD_TOP + i * ROW_H + ROW_H / 2
          const sig = isSig(d)
          const color = sig ? 'var(--chart-accent)' : 'var(--chart-neutral-dot)'
          const active = tip?.index === i
          const dimmed = tip && !active
          const lo = d.coef - ci95(d.se)
          const hi = d.coef + ci95(d.se)

          const rows = tooltipRows
            ? tooltipRows(d)
            : [
                ['Coefficient', valueFormat(d.coef)],
                ['95% CI', `${valueFormat(lo)} to ${valueFormat(hi)}`],
                ...(d.p != null ? [['p-value', d.p < 0.001 ? '< 0.001' : d.p.toFixed(3)]] : []),
              ]
          const payload = {
            index: i,
            title: d.label,
            rows,
            note: sig ? 'Significant at p < 0.05' : 'Not significant',
          }

          return (
            <g key={d.label} className={dimmed ? 'chart-dimmed' : undefined}>
              <text
                className="chart-label-text"
                x={labelWidth - 10}
                y={y}
                textAnchor="end"
                dominantBaseline="central"
              >
                {d.label}
              </text>

              <line x1={x(lo)} x2={x(hi)} y1={y} y2={y} stroke={color} strokeWidth="1.6" opacity="0.7" />
              <line x1={x(lo)} x2={x(lo)} y1={y - 5} y2={y + 5} stroke={color} strokeWidth="1.6" opacity="0.7" />
              <line x1={x(hi)} x2={x(hi)} y1={y - 5} y2={y + 5} stroke={color} strokeWidth="1.6" opacity="0.7" />
              <circle className="chart-dot" cx={x(d.coef)} cy={y} r={active ? 7 : 5.5} fill={color} />

              <rect
                className="chart-hit"
                x={0}
                y={PAD_TOP + i * ROW_H}
                width={W}
                height={ROW_H}
                onPointerMove={(e) => show(e, payload)}
                onPointerDown={(e) => show(e, payload)}
                onPointerLeave={hide}
              />
            </g>
          )
        })}

        <line
          className="chart-grid-line"
          x1={labelWidth}
          x2={W - PAD_RIGHT}
          y1={PAD_TOP + data.length * ROW_H}
          y2={PAD_TOP + data.length * ROW_H}
        />

        {ticks.map((t) => (
          <text
            key={t}
            className="chart-axis-text"
            x={x(t)}
            y={PAD_TOP + data.length * ROW_H + 16}
            textAnchor="middle"
          >
            {fmtTick(t)}
          </text>
        ))}

        {axisTitle && (
          <text className="chart-axis-title" x={labelWidth + plotW / 2} y={H - 6} textAnchor="middle">
            {axisTitle}
          </text>
        )}
      </svg>
      <ChartTooltip tip={tip} />
    </div>
  )
}
