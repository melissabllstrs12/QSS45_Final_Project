import { QUERY1, QUERY2 } from '../data/maternalMorbidity.js'

const DATASETS = [
  {
    name: 'State-Level Aggregate',
    scope: '51 states',
    detail:
      'Both queries collapsed to one row per state: overall morbidity rate plus 11 composite socioeconomic predictors.',
  },
  {
    name: 'Query 1 — Race × Age × Education',
    scope: `${QUERY1.rows.toLocaleString()} rows`,
    detail:
      'Births by state, mother’s race, age band, and education, crossed with whether any morbidity was checked.',
  },
  {
    name: 'Query 2 — Urbanicity × Ethnicity × Insurance',
    scope: `${QUERY2.rows.toLocaleString()} rows`,
    detail:
      'Births by state, metro/nonmetro status, Hispanic origin, and source of payment for delivery.',
  },
]

export default function DataMethods() {
  return (
    <section className="section section--alt" id="data-methods">
      <div className="section__inner">
        <p className="eyebrow">Data &amp; Methods</p>
        <h2 className="section-title">How the Analysis Was Built</h2>

        <p className="muted" style={{ maxWidth: '68ch', marginBottom: 32 }}>
          All data comes from the <strong>CDC WONDER Natality database</strong>, pulled as two
          queries and analyzed at two different levels &mdash; aggregated to states, and at the
          level of individual demographic combinations.
        </p>

        <div className="dataset-grid">
          {DATASETS.map((d) => (
            <div className="card dataset-card" key={d.name}>
              <span className="dataset-card__scope">{d.scope}</span>
              <h3 className="dataset-card__name">{d.name}</h3>
              <p className="muted">{d.detail}</p>
            </div>
          ))}
        </div>

        <div className="method-split">
          <div>
            <h3 className="conclusion__subhead" style={{ marginTop: 32 }}>
              State level (n = 51)
            </h3>
            <p className="muted">
              OLS on standardized predictors, so each coefficient is the change in a state&rsquo;s
              morbidity rate per one-standard-deviation increase in that predictor, holding the
              rest constant. Compared against gradient boosting, with both scored by leave-one-out
              cross-validation and a random-forest permutation importance ranking.
            </p>
          </div>
          <div>
            <h3 className="conclusion__subhead" style={{ marginTop: 32 }}>
              Individual level
            </h3>
            <p className="muted">
              Logistic regression and CatBoost predicting whether a birth had any morbidity
              checked, both scored by 5-fold cross-validated AUC. CatBoost was then explained with
              SHAP values, which rank whole variables by how much they move predictions overall.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
