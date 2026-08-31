import { useState } from 'react'
import BarChart from './charts/BarChart.jsx'
import SignedBars from './charts/SignedBars.jsx'
import { ChartCard } from './charts/ChartUI.jsx'
import { FIVE_STATES, PER_STATE_Q2 } from '../data/maternalMorbidity.js'

export default function StateVariation() {
  const [rowIndex, setRowIndex] = useState(0)
  const row = PER_STATE_Q2.rows[rowIndex]

  return (
    <section className="section section--alt" id="state-variation">
      <div className="section__inner">
        <p className="eyebrow">Going Deeper</p>
        <h2 className="section-title">Do These Factors Work the Same Way in Every State?</h2>

        <p className="muted" style={{ maxWidth: '68ch', marginBottom: 8 }}>
          To test whether the national picture holds locally, the same models were refit within
          five focus states chosen to span regions and population sizes: Texas, California, New
          Hampshire, Alabama, and Nebraska. Their baseline morbidity rates differ by more than
          threefold before any modeling.
        </p>

        <ChartCard
          title="Observed morbidity rate by focus state"
          subtitle="Share of births with at least one morbidity checked, both queries combined."
          caption="New Hampshire's rate is over three times Texas's — a reminder that documentation practice, not only underlying risk, varies across states."
        >
          <BarChart
            data={FIVE_STATES.map((s) => ({ label: s.state, value: s.combined }))}
            labelWidth={150}
            axisTitle="Morbidity rate"
            valueFormat={(v) => `${(v * 100).toFixed(2)}%`}
            tooltipRows={(d) => {
              const s = FIVE_STATES.find((f) => f.state === d.label)
              return [
                ['Combined', `${(s.combined * 100).toFixed(3)}%`],
                ['Query 1', `${(s.q1 * 100).toFixed(3)}%`],
                ['Query 2', `${(s.q2 * 100).toFixed(3)}%`],
              ]
            }}
            ariaLabel="Observed maternal morbidity rate in five focus states"
          />
        </ChartCard>

        <p className="muted" style={{ maxWidth: '68ch', margin: '36px 0 4px' }}>
          Refitting the Query 2 predictors state by state shows the pattern the class presentation
          landed on: some effects hold their direction everywhere, while others swing widely.
          Pick a predictor to compare across states.
        </p>

        <div className="chart-toggle" style={{ marginTop: 14 }} role="tablist">
          {PER_STATE_Q2.rows.map((r, i) => (
            <button
              key={r.label}
              type="button"
              role="tab"
              aria-selected={rowIndex === i}
              className={`chart-toggle__btn${rowIndex === i ? ' chart-toggle__btn--active' : ''}`}
              onClick={() => setRowIndex(i)}
            >
              {r.label}
            </button>
          ))}
        </div>

        <ChartCard
          title={`${row.label} — coefficient by state`}
          subtitle="Per-state OLS coefficients on the Query 2 predictors."
          caption="A value of exactly zero means the predictor was collinear or unavailable within that state's data and dropped out of the fit."
        >
          <SignedBars
            data={PER_STATE_Q2.states.map((state, i) => ({
              label: state,
              value: row.values[i],
            }))}
            labelWidth={150}
            axisTitle={`Coefficient on “${row.label}”`}
            valueFormat={(v) => v.toFixed(3)}
            tooltipRows={(d) => [['Coefficient', d.value.toFixed(4)]]}
            ariaLabel={`Per-state coefficients for ${row.label}`}
          />
        </ChartCard>
      </div>
    </section>
  )
}
