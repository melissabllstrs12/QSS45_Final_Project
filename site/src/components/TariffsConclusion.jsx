const LIMITATIONS = [
  'DiD validity rests on the parallel trends assumption — untestable directly, and other macro or industry-specific trends may have influenced employment over this period.',
  'Tariffs rolled out gradually and sporadically across 2018–2019, making it hard to isolate the precise effect of any single policy change.',
  'The analysis stops before 2020 so that COVID-19’s disruption to global trade and labor markets doesn’t get conflated with the tariff effect.',
]

const NEXT_STEPS = [
  'Extend the same DiD and price-pass-through approach to other tariff-protected sectors from the same period, like solar panels and washing machines, to see if the steel pattern generalizes.',
  'Compare employment and price trends across sectors between 2015–2019 to test consistency of the protectionist tradeoff.',
]

export default function TariffsConclusion() {
  return (
    <section className="section section--alt" id="conclusion">
      <div className="section__inner">
        <p className="eyebrow">Conclusion</p>
        <h2 className="section-title">Where This Leaves Us</h2>

        <p className="muted" style={{ maxWidth: '68ch', marginBottom: 16 }}>
          The 2018&ndash;2019 tariffs are associated with a real, statistically significant
          employment gain in steel (~17%) &mdash; but that gain came with a clear, immediate
          pass-through of tariff costs to steel prices. Taken together, the results support the
          hypothesis: protection helped the targeted industry, but likely at a broader cost to
          consumers and downstream firms that offsets much of the labor market benefit &mdash; a
          tradeoff directly relevant to today&rsquo;s renewed tariff debate.
        </p>

        <h3 className="conclusion__subhead">Limitations</h3>
        <ul className="next-steps" style={{ marginBottom: 32 }}>
          {LIMITATIONS.map((item) => (
            <li className="next-steps__item" key={item}>
              <span className="next-steps__bullet" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>

        <h3 className="conclusion__subhead">Next Steps</h3>
        <ul className="next-steps">
          {NEXT_STEPS.map((item) => (
            <li className="next-steps__item" key={item}>
              <span className="next-steps__bullet" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
