import './charts.css'

export function ChartTooltip({ tip }) {
  if (!tip) return null
  return (
    <div className="chart-tooltip" style={{ left: tip.x, top: tip.y }}>
      <div className="chart-tooltip__title">{tip.title}</div>
      {tip.rows.map(([key, value]) => (
        <div className="chart-tooltip__row" key={key}>
          <span>{key}</span>
          <span>{value}</span>
        </div>
      ))}
      {tip.note && <div className="chart-tooltip__note">{tip.note}</div>}
    </div>
  )
}

/** Wrapper giving every chart the same title / hint / caption furniture. */
export function ChartCard({ title, subtitle, caption, children }) {
  return (
    <div className="chart-card">
      {(title || subtitle) && (
        <>
          <div className="chart-card__head">
            {title && <span className="chart-card__title">{title}</span>}
            <span className="chart-card__hint">Hover for values</span>
          </div>
          {subtitle && <p className="chart-card__subtitle">{subtitle}</p>}
        </>
      )}
      {children}
      {caption && <p className="chart-card__caption">{caption}</p>}
    </div>
  )
}
