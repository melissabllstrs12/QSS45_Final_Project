const DATA_SOURCES = [
  {
    name: 'Employment (QCEW)',
    scope: '2015–2019',
    detail:
      'BLS Quarterly Census of Employment and Wages, state–industry–year. Treatment: NAICS 331110 (Iron & Steel Mills). Control: NAICS 331523 (Nonferrous Die-Casting).',
  },
  {
    name: 'Producer Prices (PPI)',
    scope: 'Monthly',
    detail: 'BLS Producer Price Index for steel, used to test for tariff pass-through to buyers.',
  },
  {
    name: 'Steel Transactions',
    scope: '2015–2019',
    detail: 'Monthly-aggregated steel purchase quantities, used to trace demand around tariff implementation.',
  },
]

export default function TariffsDataMethods() {
  return (
    <section className="section section--alt" id="data-methods">
      <div className="section__inner">
        <p className="eyebrow">Data &amp; Methods</p>
        <h2 className="section-title">How the Analysis Was Built</h2>

        <p className="muted" style={{ maxWidth: '68ch', marginBottom: 32 }}>
          Employment is log-transformed and averaged from quarterly QCEW values. Prices come from
          the BLS Producer Price Index. All analysis was done in Python (pandas, numpy,
          statsmodels, matplotlib/plotnine).
        </p>

        <div className="dataset-grid">
          {DATA_SOURCES.map((d) => (
            <div className="card dataset-card" key={d.name}>
              <span className="dataset-card__scope">{d.scope}</span>
              <h3 className="dataset-card__name">{d.name}</h3>
              <p className="muted">{d.detail}</p>
            </div>
          ))}
        </div>

        <p className="muted" style={{ maxWidth: '68ch', marginTop: 32 }}>
          <strong>Methods:</strong> a Difference-in-Differences (DiD) regression compares treated
          (steel) vs. control industry employment before (2015&ndash;2017) and after (2019)
          tariff implementation, with industry and year fixed effects &mdash; the Treated
          &times; Post interaction captures the causal effect of tariff exposure. A separate
          interrupted time-series regression on the PPI tests for an immediate, sustained price
          shift after the tariff date.
        </p>
      </div>
    </section>
  )
}
