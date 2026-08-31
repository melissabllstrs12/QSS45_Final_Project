// All values below are taken directly from the project notebooks:
//   ini_data_analysis/initial_data_analy.ipynb  (state-level OLS / gradient boosting)
//   final_project/final_data_analy.ipynb        (individual-level logit / CatBoost + SHAP)

/** State-level OLS on standardized predictors. n = 51, R² = 0.373, adj. R² = 0.197. */
export const OLS_COEFFICIENTS = [
  { label: '% Teen Births (<20)', coef: -0.0052714, se: 0.0023482, p: 0.030519 },
  { label: '% Advanced Maternal Age (35+)', coef: -0.0020614, se: 0.0025008, p: 0.414793 },
  { label: '% Black', coef: 0.0017502, se: 0.0016643, p: 0.299464 },
  { label: '% Self-Pay (Uninsured)', coef: -0.0010705, se: 0.0012207, p: 0.385883 },
  { label: '% White', coef: 0.0008739, se: 0.0017131, p: 0.612838 },
  { label: '% Hispanic/Latino', coef: -0.0008171, se: 0.0011291, p: 0.473552 },
  { label: '% Nonmetro (Rural)', coef: 0.0005627, se: 0.0010783, p: 0.604761 },
  { label: "% Bachelor's Degree+", coef: -0.0004362, se: 0.0021346, p: 0.839144 },
  { label: '% Private Insurance', coef: -0.0003207, se: 0.0023144, p: 0.890502 },
  { label: '% Less Than HS Education', coef: 0.0001462, se: 0.0011567, p: 0.900100 },
  { label: '% Medicaid', coef: 0.0001276, se: 0.0025233, p: 0.959938 },
]

export const OLS_FIT = { r2: 0.373, adjR2: 0.197, n: 51, predictors: 11 }

/** In-sample vs. leave-one-out cross-validated R², state-level models. */
export const R2_COMPARISON = [
  { model: 'OLS', inSample: 0.373, loocv: -0.418 },
  { model: 'Gradient Boosting', inSample: 0.752, loocv: -0.054 },
]

/** Simple pairwise Pearson correlation of each predictor with state morbidity rate. */
export const CORRELATIONS = [
  { label: '% Teen Births (<20)', r: -0.4842, p: 0.0003 },
  { label: "% Bachelor's Degree+", r: 0.4296, p: 0.0017 },
  { label: '% Private Insurance', r: 0.3954, p: 0.0041 },
  { label: '% Less Than HS Education', r: -0.3808, p: 0.0058 },
  { label: '% Medicaid', r: -0.2911, p: 0.0382 },
  { label: '% Advanced Maternal Age (35+)', r: 0.2719, p: 0.0536 },
  { label: '% Self-Pay (Uninsured)', r: -0.2623, p: 0.0629 },
  { label: '% Hispanic/Latino', r: -0.2570, p: 0.0687 },
  { label: '% White', r: 0.1070, p: 0.4550 },
  { label: '% Black', r: -0.0727, p: 0.6123 },
  { label: '% Nonmetro (Rural)', r: 0.0186, p: 0.8969 },
]

/** Random-forest permutation importance (drop in R² when a predictor is shuffled). */
export const PERMUTATION_IMPORTANCE = [
  { label: '% Teen Births (<20)', mean: 0.190182, std: 0.050020 },
  { label: '% Less Than HS Education', mean: 0.126400, std: 0.023563 },
  { label: '% Self-Pay (Uninsured)', mean: 0.118935, std: 0.033322 },
  { label: "% Bachelor's Degree+", mean: 0.114128, std: 0.037654 },
  { label: '% White', mean: 0.066425, std: 0.015440 },
  { label: '% Private Insurance', mean: 0.061383, std: 0.015273 },
  { label: '% Hispanic/Latino', mean: 0.057157, std: 0.011343 },
  { label: '% Black', mean: 0.056520, std: 0.016120 },
  { label: '% Nonmetro (Rural)', mean: 0.050784, std: 0.010654 },
  { label: '% Medicaid', mean: 0.041482, std: 0.004645 },
  { label: '% Advanced Maternal Age (35+)', mean: 0.029888, std: 0.005314 },
]

/** Query 1 — Race × Age × Education. 14,561 rows. */
export const QUERY1 = {
  rows: 14561,
  logitAuc: 0.8167,
  logitAucSd: 0.0108,
  catboostAuc: 0.9904,
  catboostAucSd: 0.0022,
  shap: [
    { label: "Mother's Race", value: 0.809597 },
    { label: 'State of Residence', value: 0.676569 },
    { label: "Mother's Education", value: 0.609375 },
    { label: 'Age of Mother', value: 0.580158 },
  ],
}

/** Query 2 — Urbanicity × Hispanic Origin × Insurance. 1,939 rows. */
export const QUERY2 = {
  rows: 1939,
  logitAuc: 0.6593,
  logitAucSd: 0.0191,
  catboostAuc: 0.9768,
  catboostAucSd: 0.0075,
  shap: [
    { label: "Mother's Hispanic Origin", value: 0.679571 },
    { label: 'Source of Payment', value: 0.633818 },
    { label: 'State of Residence', value: 0.558180 },
    { label: 'Metro / Nonmetro', value: 0.542898 },
  ],
}

/** Query 1 logistic-regression log-odds coefficients, grouped by variable. */
export const LOGIT_Q1_RACE = {
  reference: 'American Indian or Alaska Native',
  items: [
    { label: 'White', coef: 3.084544, se: 0.143955 },
    { label: 'Black or African American', coef: 2.117922, se: 0.146371 },
    { label: 'Asian', coef: 1.695844, se: 0.149544 },
    { label: 'More than one race', coef: 0.583990, se: 0.164693 },
    { label: 'Not Reported', coef: -0.205847, se: 1.561210 },
    { label: 'Native Hawaiian / Pacific Islander', coef: -1.273949, se: 0.328974 },
  ],
}

export const LOGIT_Q1_AGE = {
  reference: '15–17 years',
  items: [
    { label: '30–34 years', coef: 1.519781, se: 0.160628 },
    { label: '25–29 years', coef: 1.440014, se: 0.160615 },
    { label: '35–39 years', coef: 1.222240, se: 0.161685 },
    { label: '20–24 years', coef: 1.059992, se: 0.162892 },
    { label: '18–19 years', coef: 0.396266, se: 0.179136 },
    { label: '40–44 years', coef: 0.282260, se: 0.169895 },
    { label: 'Under 15 years', coef: -1.970384, se: 0.691780 },
    { label: '45–49 years', coef: -2.428705, se: 0.347595 },
    { label: '50 years and over', coef: -2.518856, se: 0.635726 },
  ],
}

export const LOGIT_Q1_EDUCATION = {
  reference: '8th grade or less',
  items: [
    { label: 'High school graduate / GED', coef: 1.376242, se: 0.105711 },
    { label: "Bachelor's degree", coef: 1.357545, se: 0.108854 },
    { label: 'Some college, no degree', coef: 1.106163, se: 0.108387 },
    { label: "Master's degree", coef: 1.017312, se: 0.113767 },
    { label: '9th–12th grade, no diploma', coef: 0.783541, se: 0.111431 },
    { label: 'Associate degree', coef: 0.667574, se: 0.114518 },
    { label: 'Doctorate / Professional', coef: 0.468554, se: 0.125896 },
    { label: 'Unknown or Not Stated', coef: -0.719182, se: 0.156865 },
  ],
}

/** Query 2 logistic-regression log-odds coefficients (non-state terms). */
export const LOGIT_Q2 = [
  { label: 'Not Hispanic or Latino', coef: 0.479582, se: 0.109023, group: 'Hispanic origin (ref: Hispanic)' },
  { label: 'Private Insurance', coef: 0.044547, se: 0.138680, group: 'Payment (ref: Medicaid)' },
  { label: 'Nonmetro (rural)', coef: -0.463474, se: 0.106526, group: 'Urbanicity (ref: Metro)' },
  { label: 'Other payment source', coef: -0.533068, se: 0.153779, group: 'Payment (ref: Medicaid)' },
  { label: 'Self Pay', coef: -0.545482, se: 0.152451, group: 'Payment (ref: Medicaid)' },
  { label: 'Hispanic origin unknown', coef: -1.581624, se: 0.188341, group: 'Hispanic origin (ref: Hispanic)' },
  { label: 'Payment unknown', coef: -1.706769, se: 0.216280, group: 'Payment (ref: Medicaid)' },
]

/** Five focus states — observed morbidity rates (share of births with ≥1 morbidity checked). */
export const FIVE_STATES = [
  { state: 'New Hampshire', q1: 0.02575, q2: 0.03014, combined: 0.02795 },
  { state: 'Nebraska', q1: 0.01529, q2: 0.01852, combined: 0.01691 },
  { state: 'California', q1: 0.01299, q2: 0.01332, combined: 0.01315 },
  { state: 'Alabama', q1: 0.01198, q2: 0.01345, combined: 0.01271 },
  { state: 'Texas', q1: 0.00852, q2: 0.00876, combined: 0.00864 },
]

/** Per-state OLS coefficients (Query 2 predictors), showing effects vary by state. */
export const PER_STATE_Q2 = {
  states: ['Texas', 'California', 'New Hampshire', 'Alabama', 'Nebraska'],
  rows: [
    { label: 'Nonmetro (rural)', values: [-0.1929, -0.2203, -0.0753, -0.0835, -0.1197] },
    { label: 'Not Hispanic or Latino', values: [0.0, 0.0402, 0.1885, 0.0034, 0.0389] },
    { label: 'Hispanic origin unknown', values: [-0.3060, -0.0850, -0.3462, -0.5400, -0.5404] },
    { label: 'Other payment source', values: [-0.2411, -0.1275, -0.1146, 0.0, -0.1866] },
    { label: 'Private Insurance', values: [0.0, -0.0618, 0.0715, 0.0, 0.0] },
    { label: 'Self Pay', values: [-0.0680, -0.2034, 0.0, -0.1806, -0.0828] },
    { label: 'Payment unknown', values: [-0.2411, -0.2815, -0.5108, -0.5145, -0.5000] },
  ],
}
