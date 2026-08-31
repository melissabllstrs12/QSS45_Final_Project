// Values from the QSS 20 steel tariffs group project.
//
// EXACT (from the reported regression tables / quantity table):
//   DID_RESULTS, ITS_RESULTS, STEEL_QUANTITY
// APPROXIMATE (read off the project's employment_trends figure — swap in the
// exact values from steel_employment_annual.csv when convenient):
//   EMPLOYMENT_TRENDS

/** Difference-in-Differences: log(employment) ~ Treated × Post + state FE + year FE. */
export const DID_RESULTS = {
  coef: 0.1594,
  se: 0.0753,
  impliedPct: 17.28,
  p: 0.0343,
  n: 291,
  treatedNaics: '331110 — Iron & Steel Mills and Ferroalloy Manufacturing',
  controlNaics: '331523 — Nonferrous Metal Die-Casting',
}

/** Interrupted time-series on the rebased steel Producer Price Index. */
export const ITS_RESULTS = [
  { label: 'Intercept', coef: 102.3, p: 0.001, note: 'Pre-tariff baseline price level' },
  { label: 'Post-Tariff', coef: 19.0, p: 0.0005, note: 'Immediate level shift after tariffs' },
  { label: 'Time Trend', coef: -0.1, p: 0.08, note: 'Underlying monthly drift' },
]

/**
 * The fitted ITS step function, drawn directly from the coefficients above:
 *   price(t) = 102.3 + 19.0 × PostTariff(t) − 0.1 × t
 * t is months from the start of the series; the tariff lands at t = 38 (March 2018).
 */
export const ITS_FITTED = (() => {
  const START_YEAR = 2015
  const TARIFF_T = 38
  const points = []
  for (let t = 0; t <= 59; t += 1) {
    const post = t >= TARIFF_T ? 1 : 0
    points.push({
      t,
      year: START_YEAR + t / 12,
      value: 102.3 + 19.0 * post - 0.1 * t,
      post: Boolean(post),
    })
  }
  return { points, tariffT: TARIFF_T, tariffYear: START_YEAR + TARIFF_T / 12 }
})()

/** Monthly-aggregated steel purchase quantity (exact, from the reported table). */
export const STEEL_QUANTITY = [
  { date: '2015-01', year: 2015.0, quantity: 202.2 },
  { date: '2015-07', year: 2015.5, quantity: 186.4 },
  { date: '2016-01', year: 2016.0, quantity: 162.2 },
  { date: '2016-07', year: 2016.5, quantity: 169.2 },
  { date: '2017-01', year: 2017.0, quantity: 171.5 },
  { date: '2017-07', year: 2017.5, quantity: 180.2 },
  { date: '2018-01', year: 2018.0, quantity: 178.1 },
  { date: '2018-07', year: 2018.5, quantity: 212.0 },
  { date: '2019-01', year: 2019.0, quantity: 218.7 },
  { date: '2019-07', year: 2019.5, quantity: 202.5 },
]

export const STEEL_QUANTITY_TARIFF_YEAR = 2018.17

/** Log employment, treated (steel) vs. control industry. Approximate — see header note. */
export const EMPLOYMENT_TRENDS = {
  approximate: true,
  tariffYear: 2018,
  series: [
    {
      name: 'Treated (steel)',
      points: [
        { year: 2015, value: 6.540 },
        { year: 2016, value: 6.695 },
        { year: 2017, value: 6.757 },
        { year: 2018, value: 6.685 },
        { year: 2019, value: 6.794 },
      ],
    },
    {
      name: 'Control (die-casting)',
      points: [
        { year: 2015, value: 6.267 },
        { year: 2016, value: 6.365 },
        { year: 2017, value: 6.441 },
        { year: 2018, value: 6.445 },
        { year: 2019, value: 6.397 },
      ],
    },
  ],
}
