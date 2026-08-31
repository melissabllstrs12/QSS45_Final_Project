export default function TariffsMotivation() {
  return (
    <section className="section" id="motivation">
      <div className="section__inner">
        <p className="eyebrow">Motivation</p>
        <h2 className="section-title">Why This Question Matters</h2>

        <p className="lede" style={{ marginBottom: 20 }}>
          <strong>Research question:</strong> How did exposure to the 2018&ndash;2019 U.S.&ndash;China
          tariffs affect employment dynamics in import-competing industries, and to what extent
          were labor market gains offset by price increases?
        </p>

        <p className="muted" style={{ maxWidth: '68ch', marginBottom: 40 }}>
          In 2018&ndash;2019, the U.S. imposed Section 301 tariffs on Chinese imports to protect
          domestic manufacturing, restore jobs, and reduce reliance on foreign goods &mdash; but
          tariffs also raise costs for firms and consumers and can invite retaliation. Tariffs
          remain a central tool in U.S. trade policy, and with tariff use rising again in current
          politics, understanding their real cost&ndash;benefit tradeoff is directly policy-relevant:
          did protection actually grow jobs, and who paid for it?
        </p>

        <div className="hypothesis-card card">
          <h3 className="theory-card__title">Hypothesis</h3>
          <p className="muted">
            We hypothesize that the 2018&ndash;2019 tariffs generated an increase in employment
            within protected industries &mdash; particularly steel &mdash; by reducing import
            competition and encouraging domestic production. However, we expect these gains to be
            limited and accompanied by higher consumer prices, such that the broader economic
            costs to consumers likely outweigh the labor market benefits within the protected
            industry.
          </p>
        </div>
      </div>
    </section>
  )
}
