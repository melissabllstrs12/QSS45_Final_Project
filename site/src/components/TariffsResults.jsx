import ForestPlot from './charts/ForestPlot.jsx'
import LineChart from './charts/LineChart.jsx'
import { ChartCard } from './charts/ChartUI.jsx'
import { fmtP } from './charts/chartUtils.js'
import {
  DID_RESULTS,
  EMPLOYMENT_TRENDS,
  ITS_FITTED,
  ITS_RESULTS,
  STEEL_QUANTITY,
  STEEL_QUANTITY_TARIFF_YEAR,
} from '../data/tariffs.js'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const itsPoints = ITS_FITTED.points.map((p) => ({
  x: p.t,
  y: p.value,
  label: `${MONTHS[p.t % 12]} ${2015 + Math.floor(p.t / 12)}`,
  // Start a new path segment exactly where the tariff steps the level up.
  break: p.t === ITS_FITTED.tariffT,
}))

export default function TariffsResults() {
  return (
    <section className="section" id="results">
      <div className="section__inner">
        <p className="eyebrow">Results</p>
        <h2 className="section-title">What the Models Show</h2>

        <div className="findings">
          <article className="finding">
            <span className="finding__number">01</span>
            <div className="finding__body">
              <h3 className="finding__title">
                Steel Employment Rose ~17% After Tariffs &mdash; and It&rsquo;s Statistically
                Significant
              </h3>
              <p className="muted">
                The Difference-in-Differences model estimates a Treated &times; Post coefficient of{' '}
                {DID_RESULTS.coef} (SE {DID_RESULTS.se}), implying a{' '}
                <strong>{DID_RESULTS.impliedPct}% increase</strong> in steel employment relative to
                the control industry &mdash; significant at p&nbsp;&asymp;&nbsp;{DID_RESULTS.p}{' '}
                with state and year fixed effects (n&nbsp;=&nbsp;{DID_RESULTS.n}).
              </p>

              <ChartCard
                title="Log employment: treated vs. control industry"
                subtitle="Iron & steel mills against nonferrous die-casting, 2015–2019."
                caption="Approximate values read from the project's employment_trends figure — swap in steel_employment_annual.csv for exact numbers. The parallel pre-trend through 2017 is what licenses the DiD comparison."
              >
                <LineChart
                  series={[
                    {
                      name: 'Treated (steel)',
                      color: 'var(--chart-accent)',
                      points: EMPLOYMENT_TRENDS.series[0].points.map((p) => ({
                        x: p.year,
                        y: p.value,
                      })),
                    },
                    {
                      name: 'Control (die-casting)',
                      color: 'var(--chart-series-2)',
                      points: EMPLOYMENT_TRENDS.series[1].points.map((p) => ({
                        x: p.year,
                        y: p.value,
                      })),
                    },
                  ]}
                  xTicks={[2015, 2016, 2017, 2018, 2019]}
                  formatX={(v) => String(v)}
                  formatY={(v) => v.toFixed(2)}
                  formatTooltipY={(v) => v.toFixed(3)}
                  xAxisTitle="Year"
                  yAxisTitle="Log employment"
                  markerX={EMPLOYMENT_TRENDS.tariffYear}
                  markerLabel="Tariffs"
                  ariaLabel="Log employment in treated and control industries from 2015 to 2019"
                />
              </ChartCard>

              <ChartCard
                title="Difference-in-Differences estimate"
                subtitle="log(employment) ~ Treated × Post + state FE + year FE."
                caption={`Treated: NAICS ${DID_RESULTS.treatedNaics}. Control: NAICS ${DID_RESULTS.controlNaics}.`}
              >
                <ForestPlot
                  data={[
                    { label: 'Treated × Post', coef: DID_RESULTS.coef, se: DID_RESULTS.se, p: DID_RESULTS.p },
                  ]}
                  labelWidth={190}
                  axisTitle="Effect on log employment"
                  valueFormat={(v) => v.toFixed(3)}
                  tooltipRows={(d) => [
                    ['Coefficient', d.coef.toFixed(4)],
                    ['Implied effect', `+${DID_RESULTS.impliedPct}%`],
                    ['Std. error', d.se.toFixed(4)],
                    ['p-value', fmtP(d.p)],
                    ['Observations', String(DID_RESULTS.n)],
                  ]}
                  ariaLabel="Difference-in-differences coefficient with confidence interval"
                />
              </ChartCard>
            </div>
          </article>

          <article className="finding">
            <span className="finding__number">02</span>
            <div className="finding__body">
              <h3 className="finding__title">
                Tariff Costs Were Passed Straight Through to Steel Prices
              </h3>
              <p className="muted">
                An interrupted time-series regression on the Producer Price Index shows steel
                prices jumping <strong>19 points</strong> immediately after the tariffs took effect
                (p&nbsp;&lt;&nbsp;0.001), against an underlying trend that was flat to slightly
                negative. Foreign exporters did not absorb the cost &mdash; U.S. buyers did, which
                matches existing Federal Reserve findings on the same tariffs.
              </p>

              <ChartCard
                title="Fitted price model"
                subtitle="price(t) = 102.3 + 19.0 × PostTariff − 0.1 × t, drawn straight from the estimated coefficients."
                caption="The step at March 2018 is the Post-Tariff coefficient; the gentle downward slope is the time trend. Hover any month for the fitted level."
              >
                <LineChart
                  series={[{ name: 'Fitted price index', color: 'var(--chart-primary)', points: itsPoints }]}
                  xTicks={[0, 12, 24, 36, 48]}
                  formatX={(t) => String(2015 + Math.round(t / 12))}
                  formatY={(v) => v.toFixed(0)}
                  formatTooltipY={(v) => v.toFixed(2)}
                  xAxisTitle="Year"
                  yAxisTitle="Steel price index (rebased)"
                  markerX={ITS_FITTED.tariffT}
                  markerLabel="Tariffs"
                  showDots={false}
                  ariaLabel="Fitted interrupted time series model of steel prices"
                />
              </ChartCard>

              <ChartCard
                title="Interrupted time-series coefficients"
                subtitle="Estimated on the rebased steel Producer Price Index."
                caption="Whiskers are omitted here because the source table reported coefficients and p-values only."
              >
                <ForestPlot
                  data={ITS_RESULTS.filter((r) => r.label !== 'Intercept').map((r) => ({
                    label: r.label,
                    coef: r.coef,
                    se: 0,
                    p: r.p,
                  }))}
                  labelWidth={170}
                  axisTitle="Coefficient (index points)"
                  valueFormat={(v) => v.toFixed(1)}
                  tooltipRows={(d) => {
                    const src = ITS_RESULTS.find((r) => r.label === d.label)
                    return [
                      ['Coefficient', d.coef.toFixed(2)],
                      ['p-value', fmtP(d.p)],
                      ['Meaning', src.note],
                    ]
                  }}
                  ariaLabel="Interrupted time series regression coefficients for steel prices"
                />
              </ChartCard>
            </div>
          </article>

          <article className="finding">
            <span className="finding__number">03</span>
            <div className="finding__body">
              <h3 className="finding__title">
                Buyers Stockpiled Steel Before Tariffs Hit, Then Pulled Back
              </h3>
              <p className="muted">
                Steel transaction volumes fell through 2016, recovered across 2017, then climbed
                sharply into tariff implementation &mdash; peaking at 218.7 in January 2019 before
                falling back to 202.5 by that July. That run-up and retreat is consistent with
                firms stockpiling ahead of the price shock, then scaling back demand once the
                higher prices landed.
              </p>

              <ChartCard
                title="Monthly steel purchase quantity"
                subtitle="Aggregated transaction quantities, 2015–2019."
                caption="Exact values as reported in the project's steel purchase quantity table."
              >
                <LineChart
                  series={[
                    {
                      name: 'Quantity',
                      color: 'var(--chart-primary)',
                      points: STEEL_QUANTITY.map((d) => ({
                        x: d.year,
                        y: d.quantity,
                        label: d.date,
                      })),
                    },
                  ]}
                  xTicks={[2015, 2016, 2017, 2018, 2019]}
                  formatX={(v) => String(v)}
                  formatY={(v) => v.toFixed(0)}
                  formatTooltipY={(v) => v.toFixed(1)}
                  xAxisTitle="Year"
                  yAxisTitle="Transaction quantity"
                  markerX={STEEL_QUANTITY_TARIFF_YEAR}
                  markerLabel="Tariffs"
                  ariaLabel="Monthly steel purchase quantity from 2015 to 2019"
                />
              </ChartCard>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
