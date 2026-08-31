import { niceTicks } from './chartUtils.js'
import { ChartTooltip } from './ChartUI.jsx'
import { useTooltip } from './useTooltip.js'
import './charts.css'

const W = 700
const ROW_H = 34
const PAD_TOP = 10
const AXIS_H = 40
const PAD_RIGHT = 24

/**
 * Horizontal bars running left/right of a zero line, coloured by significance.
 * `data`: [{ label, value, significant, ... }]
 */
export default function SignedBars({
  data,
  labelWidth = 210,
  axisTitle,
  valueFormat = (v) => v.toFixed(3),
  tooltipRows,
  ariaLabel,
}) {
  const { containerRef, tip, show, hide } = useTooltip()

  const plotW = W - labelWidth - PAD_RIGHT
  const H = PAD_TOP + data.length * ROW_H + AXIS_H
  const values = data.map((d) => d.value)
  const ticks = niceTicks(Math.min(...values, 0), Math.max(...values, 0), 6)
  const axisMin = ticks[0]
  const axisMax = ticks[ticks.length - 1]
  const x = (v) => labelWidth + ((v - axisMin) / (axisMax - axisMin)) * plotW
  const zeroX = x(0)

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

        {data.map((d, i) => {
          const y = PAD_TOP + i * ROW_H
          const barH = 17
          const barY = y + (ROW_H - barH) / 2
          const bx = Math.min(zeroX, x(d.value))
          const bw = Math.max(Math.abs(x(d.value) - zeroX), 1.5)
          const active = tip?.index === i
          const dimmed = tip && !active
          // `significant` is optional: when a series has no p-values, stay silent
          // rather than labelling everything "not significant".
          const note =
            d.significant === undefined
              ? undefined
              : d.significant
                ? 'Significant at p < 0.05'
                : 'Not significant'
          const payload = {
            index: i,
            title: d.label,
            rows: tooltipRows ? tooltipRows(d) : [['Value', valueFormat(d.value)]],
            note,
          }

          return (
            <g key={d.label} className={dimmed ? 'chart-dimmed' : undefined}>
              <text
                className="chart-label-text"
                x={labelWidth - 10}
                y={y + ROW_H / 2}
                textAnchor="end"
                dominantBaseline="central"
              >
                {d.label}
              </text>

              <rect
                className="chart-bar"
                x={bx}
                y={barY}
                width={bw}
                height={barH}
                rx={3}
                fill={
                  d.significant === undefined
                    ? 'var(--chart-primary)'
                    : d.significant
                      ? 'var(--chart-accent)'
                      : 'var(--chart-neutral)'
                }
              />

              <text
                className="chart-axis-text"
                x={d.value >= 0 ? x(d.value) + 7 : x(d.value) - 7}
                y={y + ROW_H / 2}
                textAnchor={d.value >= 0 ? 'start' : 'end'}
                dominantBaseline="central"
              >
                {valueFormat(d.value)}
              </text>

              <rect
                className="chart-hit"
                x={0}
                y={y}
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
          className="chart-zero-line"
          x1={zeroX}
          x2={zeroX}
          y1={PAD_TOP}
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
            {valueFormat(t)}
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
