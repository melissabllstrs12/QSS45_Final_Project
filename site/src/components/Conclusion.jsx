const LIMITATIONS = [
  'With 51 observations and 11 predictors, the state-level models could not generalize — both OLS and gradient boosting had negative cross-validated R².',
  '“Morbidity checked” is a documentation-dependent measure, not a direct clinical outcome. Patterns that look like demographic risk differences may partly reflect how thoroughly complications get recorded across hospitals and states.',
  'The state-level predictors are heavily collinear, so which one appears “most important” is unstable across model types.',
]

const NEXT_STEPS = [
  'Keep working at the row level rather than with state averages — thousands of rows instead of 51.',
  'Address collinearity directly via PCA or a single composite disadvantage index.',
  'Bring in added variables like income and measures of healthcare access such as OBGYN availability.',
]

export default function Conclusion() {
  return (
    <section className="section" id="conclusion">
      <div className="section__inner">
        <p className="eyebrow">Conclusion</p>
        <h2 className="section-title">Where This Leaves Us</h2>

        <div className="card takeaway-card">
          <h3 className="theory-card__title">The headline</h3>
          <p className="muted">
            The &ldquo;most important factor&rdquo; changes depending on the level of analysis. At
            the state-aggregate level, teen birth rate dominates. At the individual /
            demographic-combination level, race does. No single social determinant explains
            maternal morbidity uniformly &mdash; which means policy interventions likely need to
            be tailored rather than built around one universal &ldquo;top factor.&rdquo;
          </p>
        </div>

        <p className="muted" style={{ maxWidth: '68ch', margin: '28px 0 0' }}>
          Against the two guiding theories, the results split the difference. Race outranking
          income and insurance at the individual level partially supports the{' '}
          <strong>weathering hypothesis</strong>, while fundamental cause theory&rsquo;s emphasis
          on flexible resources did not come through &mdash; insurance was among the weakest
          predictors in both queries. Neither theory was cleanly confirmed, and the divergence
          between ecological and individual-level patterns is itself the finding.
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
