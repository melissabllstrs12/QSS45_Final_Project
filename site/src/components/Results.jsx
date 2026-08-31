import { useState } from 'react'
import Figure from './Figure.jsx'
import BarChart from './charts/BarChart.jsx'
import Beeswarm from './charts/Beeswarm.jsx'
import ForestPlot from './charts/ForestPlot.jsx'
import GroupedBars from './charts/GroupedBars.jsx'
import SignedBars from './charts/SignedBars.jsx'
import { ChartCard } from './charts/ChartUI.jsx'
import { fmtP } from './charts/chartUtils.js'
import { SHAP_SUMMARY as SHAP } from '../data/shapSummary.js'
import {
  CORRELATIONS,
  LOGIT_Q1_AGE,
  LOGIT_Q1_EDUCATION,
  LOGIT_Q1_RACE,
  LOGIT_Q2,
  OLS_COEFFICIENTS,
  OLS_FIT,
  PERMUTATION_IMPORTANCE,
  QUERY1,
  QUERY2,
  R2_COMPARISON,
} from '../data/maternalMorbidity.js'

function Toggle({ options, value, onChange }) {
  return (
    <div className="chart-toggle" role="tablist">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="tab"
          aria-selected={value === opt.value}
          className={`chart-toggle__btn${value === opt.value ? ' chart-toggle__btn--active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

/** Finding 1 — the same predictors, alone vs. all together. */
function CollinearityChart() {
  const [view, setView] = useState('alone')

  // Keep both views in one fixed row order so labels stay put when you switch.
  const order = CORRELATIONS.map((c) => c.label)
  const olsByLabel = new Map(OLS_COEFFICIENTS.map((d) => [d.label, d]))
  const olsOrdered = order.map((label) => olsByLabel.get(label)).filter(Boolean)

  const sigCount = CORRELATIONS.filter((c) => c.p < 0.05).length

  return (
    <>
      <Toggle
        value={view}
        onChange={setView}
        options={[
          { value: 'alone', label: 'One at a time' },
          { value: 'together', label: 'All 11 together (OLS)' },
        ]}
      />

      {view === 'alone' ? (
        <ChartCard
          title="Each predictor on its own"
          subtitle={`Simple pairwise correlation with state morbidity rate — ${sigCount} of 11 look significant.`}
          caption="Pearson correlation between each predictor and the state morbidity rate, one predictor at a time. Coloured bars are significant at p < 0.05."
        >
          <SignedBars
            data={CORRELATIONS.map((c) => ({
              label: c.label,
              value: c.r,
              significant: c.p < 0.05,
              p: c.p,
            }))}
            axisTitle="Pearson correlation (r) with state morbidity rate"
            valueFormat={(v) => v.toFixed(3)}
            tooltipRows={(d) => [
              ['Correlation (r)', d.value.toFixed(4)],
              ['p-value', fmtP(d.p)],
            ]}
            ariaLabel="Pairwise correlation of each predictor with state morbidity rate"
          />
        </ChartCard>
      ) : (
        <ChartCard
          title="All 11 predictors in one model"
          subtitle={`OLS on standardized predictors — only 1 of 11 survives. R² = ${OLS_FIT.r2}, n = ${OLS_FIT.n}.`}
          caption="Each coefficient is the change in a state's morbidity rate associated with a one-standard-deviation increase in that predictor, holding the other ten constant. Whiskers are 95% confidence intervals; coloured dots are significant at p < 0.05."
        >
          <ForestPlot
            data={olsOrdered}
            axisTitle="Change in state morbidity rate per 1 SD increase"
            valueFormat={(v) => v.toFixed(4)}
            tickFormat={(v) => v.toFixed(3)}
            tooltipRows={(d) => [
              ['Coefficient', d.coef.toFixed(4)],
              ['In percentage points', `${(d.coef * 100).toFixed(2)} pp`],
              ['Std. error', d.se.toFixed(4)],
              ['p-value', fmtP(d.p)],
            ]}
            ariaLabel="OLS coefficient plot for all eleven state-level predictors"
          />
        </ChartCard>
      )}
    </>
  )
}

/** Finding 3 — which individual-level variable moves predictions most. */
function LogitCoefficientChart() {
  const [group, setGroup] = useState('race')
  const groups = {
    race: { data: LOGIT_Q1_RACE, name: "Mother's race" },
    age: { data: LOGIT_Q1_AGE, name: 'Age of mother' },
    education: { data: LOGIT_Q1_EDUCATION, name: "Mother's education" },
  }
  const active = groups[group]

  return (
    <>
      <Toggle
        value={group}
        onChange={setGroup}
        options={[
          { value: 'race', label: 'Race' },
          { value: 'age', label: 'Age' },
          { value: 'education', label: 'Education' },
        ]}
      />
      <ChartCard
        title={`${active.name} — logistic regression coefficients`}
        subtitle={`Log-odds of any morbidity being checked, relative to ${active.data.reference}.`}
        caption="Positive values mean higher odds of a documented morbidity than the reference group. Whiskers are 95% confidence intervals. Hover any estimate for its odds ratio."
      >
        <ForestPlot
          data={active.data.items}
          labelWidth={230}
          axisTitle={`Log-odds vs. ${active.data.reference}`}
          valueFormat={(v) => v.toFixed(2)}
          tooltipRows={(d) => [
            ['Log-odds', d.coef.toFixed(3)],
            ['Odds ratio', Math.exp(d.coef).toFixed(2)],
            ['Std. error', d.se.toFixed(3)],
            ['95% CI', `${(d.coef - 1.96 * d.se).toFixed(2)} to ${(d.coef + 1.96 * d.se).toFixed(2)}`],
          ]}
          ariaLabel={`Logistic regression coefficients for ${active.name}`}
        />
      </ChartCard>
    </>
  )
}

export default function Results() {
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
                Teen Birth Rate Is the Only State-Level Predictor That Survives
              </h3>
              <p className="muted">
                Looked at one at a time, five of the eleven predictors correlate significantly
                with a state&rsquo;s morbidity rate. Put all eleven into one regression and only
                <strong> % teen births</strong> stays significant (coefficient &minus;0.0053,
                p&nbsp;=&nbsp;0.031) &mdash; states with more teen births tended to have{' '}
                <em>lower</em> overall morbidity rates, holding everything else constant. The gap
                between the two views is the signature of heavy collinearity among these
                &ldquo;socioeconomic disadvantage&rdquo; measures. Flip between them below.
              </p>
              <CollinearityChart />
            </div>
          </article>

          <article className="finding">
            <span className="finding__number">02</span>
            <div className="finding__body">
              <h3 className="finding__title">
                Model Fit Looks Strong Until Cross-Validated &mdash; Then It Collapses
              </h3>
              <p className="muted">
                Gradient boosting looks far better than OLS in-sample (R&sup2; 0.752 vs. 0.373).
                But under leave-one-out cross-validation both go <strong>negative</strong> &mdash;
                worse than simply guessing the average rate for every state. With 51 states and 11
                predictors, neither model had enough data relative to its complexity, and the
                boosting model was memorizing individual states rather than learning a pattern.
              </p>

              <ChartCard
                title="In-sample vs. cross-validated R²"
                subtitle="Leave-one-out CV: train on 50 states, predict the one left out, repeated 51 times."
                caption="A negative cross-validated R² means the model predicts held-out states worse than the sample mean would."
              >
                <GroupedBars
                  groups={R2_COMPARISON.map((r) => ({
                    label: r.model,
                    values: [r.inSample, r.loocv],
                  }))}
                  series={[
                    { name: 'In-sample R²', color: 'var(--chart-primary)' },
                    { name: 'Cross-validated R² (LOOCV)', color: 'var(--chart-accent)' },
                  ]}
                  axisTitle="R²"
                  valueFormat={(v) => v.toFixed(3)}
                  tooltipNote="Negative — worse than predicting the mean"
                  ariaLabel="Comparison of in-sample and cross-validated R squared for OLS and gradient boosting"
                />
              </ChartCard>

              <ChartCard
                title="Which factors the tree model leaned on"
                subtitle="Random-forest permutation importance — how much R² drops when a predictor is shuffled."
                caption="Error bars show the standard deviation across 100 shuffles. Note that this ranking disagrees with the OLS result, another symptom of collinear predictors."
              >
                <BarChart
                  data={PERMUTATION_IMPORTANCE.map((d) => ({
                    label: d.label,
                    value: d.mean,
                    std: d.std,
                  }))}
                  axisTitle="Drop in R² when shuffled"
                  valueFormat={(v) => v.toFixed(3)}
                  tooltipRows={(d) => [
                    ['Importance', d.value.toFixed(4)],
                    ['Std. dev.', d.std.toFixed(4)],
                  ]}
                  ariaLabel="Permutation importance of each state-level predictor"
                />
              </ChartCard>
            </div>
          </article>

          <article className="finding">
            <span className="finding__number">03</span>
            <div className="finding__body">
              <h3 className="finding__title">
                At the Individual Level, Race &mdash; Not Income or Insurance &mdash; Drives
                Predictions
              </h3>
              <p className="muted">
                On the {QUERY1.rows.toLocaleString()}-row Query 1 data, race was the strongest SHAP
                feature, ahead of state, education, and age. Births in the White category had the
                highest predicted probability of a <em>documented</em> morbidity relative to the
                reference group. That ordering runs against fundamental cause theory&rsquo;s
                emphasis on income and insurance, and partially supports the weathering
                hypothesis.
              </p>

              <ChartCard
                title="Query 1 — CatBoost SHAP feature importance"
                subtitle={`Race × Age × Education, ${QUERY1.rows.toLocaleString()} rows. Cross-validated AUC: logistic ${QUERY1.logitAuc.toFixed(3)}, CatBoost ${QUERY1.catboostAuc.toFixed(3)}.`}
                caption="Mean absolute SHAP value — how much each variable moves the model's prediction on average, across all its categories."
              >
                <BarChart
                  data={QUERY1.shap.map((d) => ({ label: d.label, value: d.value }))}
                  labelWidth={175}
                  axisTitle="Mean |SHAP value|"
                  valueFormat={(v) => v.toFixed(3)}
                  tooltipRows={(d) => [['Mean |SHAP|', d.value.toFixed(4)]]}
                  ariaLabel="SHAP feature importance for Query 1"
                />
              </ChartCard>

              <ChartCard
                title="Query 1 — SHAP summary plot"
                subtitle={`Every dot is one held-out record (${SHAP.query1.nPlotted.toLocaleString()} of ${SHAP.query1.nTest.toLocaleString()} sampled). Hover any dot for its category; click to hold that category highlighted across the plot.`}
                caption="Race spreads widest, meaning it moved individual predictions further than any other variable. Colour encodes which category a record falls in — it is a label, not a magnitude, so read spread and direction rather than the colour ramp itself."
              >
                <Beeswarm data={SHAP.query1} ariaLabel="SHAP summary plot for Query 1" />
              </ChartCard>

              <p className="muted" style={{ marginTop: 24 }}>
                Breaking the logistic regression open by category shows where that signal sits.
                Switch between the three variables:
              </p>
              <LogitCoefficientChart />

              <p className="muted" style={{ marginTop: 28 }}>
                The partial dependence surfaces show the same story as an interaction: predicted
                morbidity is highest for White births in the 25&ndash;34 age range, and race
                separates the surface far more sharply than education does.
              </p>

              <Figure
                src="/figures/pdp_age_race.png"
                alt="Partial dependence heatmap of predicted maternal morbidity across mother's age bands and race categories, peaking for White births aged 25 to 34."
                caption="Partial dependence: age of mother × race."
              />
              <Figure
                src="/figures/pdp_age_education.png"
                alt="Partial dependence heatmap of predicted maternal morbidity across mother's age bands and education levels."
                caption="Partial dependence: age of mother × education."
              />
            </div>
          </article>

          <article className="finding">
            <span className="finding__number">04</span>
            <div className="finding__body">
              <h3 className="finding__title">
                Query 2&rsquo;s Variables Carry Much Less Individual-Level Signal
              </h3>
              <p className="muted">
                Urbanicity, Hispanic origin, and insurance produced a far weaker logistic
                regression than Query 1 ({QUERY2.logitAuc.toFixed(3)} vs.{' '}
                {QUERY1.logitAuc.toFixed(3)} AUC). Query 2 has only{' '}
                {QUERY2.rows.toLocaleString()} distinct combinations for a model to learn from
                versus {QUERY1.rows.toLocaleString()} in Query 1, despite covering a similar
                number of births. Within it, Hispanic origin mattered most &mdash; not insurance.
              </p>

              <ChartCard
                title="Cross-validated AUC by query and model"
                subtitle="5-fold cross-validation. 0.5 is chance; 1.0 is perfect separation."
                caption="CatBoost's very high AUC reflects its ability to exploit high-cardinality categories like state of residence; the logistic AUC is the more conservative read on how much signal these variables carry."
              >
                <GroupedBars
                  groups={[
                    {
                      label: 'Query 1 (Race/Age/Edu)',
                      values: [QUERY1.logitAuc, QUERY1.catboostAuc],
                    },
                    {
                      label: 'Query 2 (Urban/Ethnicity/Ins)',
                      values: [QUERY2.logitAuc, QUERY2.catboostAuc],
                    },
                  ]}
                  series={[
                    { name: 'Logistic regression', color: 'var(--chart-primary)' },
                    { name: 'CatBoost', color: 'var(--chart-series-2)' },
                  ]}
                  axisTitle="Cross-validated AUC"
                  valueFormat={(v) => v.toFixed(3)}
                  ariaLabel="Cross-validated AUC for both queries and both models"
                />
              </ChartCard>

              <ChartCard
                title="Query 2 — CatBoost SHAP feature importance"
                subtitle="Urbanicity × Hispanic Origin × Insurance."
                caption="The four variables sit much closer together than in Query 1 — no single dominant predictor."
              >
                <BarChart
                  data={QUERY2.shap.map((d) => ({ label: d.label, value: d.value }))}
                  labelWidth={195}
                  axisTitle="Mean |SHAP value|"
                  valueFormat={(v) => v.toFixed(3)}
                  tooltipRows={(d) => [['Mean |SHAP|', d.value.toFixed(4)]]}
                  ariaLabel="SHAP feature importance for Query 2"
                />
              </ChartCard>

              <ChartCard
                title="Query 2 — SHAP summary plot"
                subtitle={`All ${SHAP.query2.nPlotted.toLocaleString()} held-out records. Hover for the category behind each dot; click to hold one highlighted.`}
                caption="Hispanic origin spreads widest here, but every row is narrower than Query 1's — the visual signature of a weaker predictive signal (AUC 0.659 vs 0.817)."
              >
                <Beeswarm data={SHAP.query2} labelWidth={186} ariaLabel="SHAP summary plot for Query 2" />
              </ChartCard>

              <ChartCard
                title="Query 2 — logistic regression coefficients"
                subtitle="Log-odds of any morbidity being checked, relative to each variable's reference category."
                caption="Nonmetro births show lower odds of a documented morbidity than metro births; private insurance is indistinguishable from Medicaid."
              >
                <ForestPlot
                  data={LOGIT_Q2}
                  labelWidth={205}
                  axisTitle="Log-odds vs. reference category"
                  valueFormat={(v) => v.toFixed(2)}
                  tooltipRows={(d) => [
                    ['Log-odds', d.coef.toFixed(3)],
                    ['Odds ratio', Math.exp(d.coef).toFixed(2)],
                    ['Std. error', d.se.toFixed(3)],
                    ['Comparison', d.group],
                  ]}
                  ariaLabel="Logistic regression coefficients for Query 2"
                />
              </ChartCard>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
