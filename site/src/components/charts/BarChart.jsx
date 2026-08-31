import { niceTicks } from './chartUtils.js'
import { ChartTooltip } from './ChartUI.jsx'
import { useTooltip } from './useTooltip.js'
import './charts.css'

const W = 700
const ROW_H = 34
const PAD_TOP = 10
const AXIS_H = 38
const PAD_RIGHT = 52

/**
 * Horizontal bar chart for non-negative magnitudes (SHAP, permutation importance).
 * `data`: [{ label, value, std? }]
 */
export default function BarChart({
  data,
  labelWidth = 210,
  axisTitle,
  valueFormat = (v) => v.toFixed(3),
  tooltipRows,
  highlightTop = true,
  ariaLabel,
}) {
  const { containerRef, tip, show, hide } = useTooltip()

  const plotW = W - labelWidth - PAD_RIGHT
  const H = PAD_TOP + data.length * ROW_H + AXIS_H
  const maxValue = Math.max(...data.map((d) => d.value + (d.std ?? 0)))
  const ticks = niceTicks(0, maxValue, 5)
  const axisMax = ticks[ticks.length - 1]
  const x = (v) => labelWidth + (v / axisMax) * plotW
  const topValue = Math.max(...data.map((d) => d.value))

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
          const isTop = highlightTop && d.value === topValue
          const active = tip?.index === i
          const dimmed = tip && !active

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
                x={labelWidth}
                y={barY}
                width={Math.max(x(d.value) - labelWidth, 1)}
                height={barH}
                rx={3}
                fill={isTop ? 'var(--chart-accent)' : 'var(--chart-primary)'}
              />

              {d.std != null && (
                <g stroke="var(--color-green-900)" strokeWidth="1.1" opacity="0.55">
                  <line
                    x1={x(Math.max(d.value - d.std, 0))}
                    x2={x(d.value + d.std)}
                    y1={y + ROW_H / 2}
                    y2={y + ROW_H / 2}
                  />
                  <line
                    x1={x(Math.max(d.value - d.std, 0))}
                    x2={x(Math.max(d.value - d.std, 0))}
                    y1={y + ROW_H / 2 - 4}
                    y2={y + ROW_H / 2 + 4}
                  />
                  <line
                    x1={x(d.value + d.std)}
                    x2={x(d.value + d.std)}
                    y1={y + ROW_H / 2 - 4}
                    y2={y + ROW_H / 2 + 4}
                  />
                </g>
              )}

              <text
                className="chart-axis-text"
                x={x(d.value + (d.std ?? 0)) + 7}
                y={y + ROW_H / 2}
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
                onPointerMove={(e) =>
                  show(e, {
                    index: i,
                    title: d.label,
                    rows: tooltipRows ? tooltipRows(d) : [['Value', valueFormat(d.value)]],
                  })
                }
                onPointerDown={(e) =>
                  show(e, {
                    index: i,
                    title: d.label,
                    rows: tooltipRows ? tooltipRows(d) : [['Value', valueFormat(d.value)]],
                  })
                }
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
            {valueFormat(t)}
          </text>
        ))}

        {axisTitle && (
          <text
            className="chart-axis-title"
            x={labelWidth + plotW / 2}
            y={H - 6}
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
