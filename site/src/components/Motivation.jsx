const INDICATORS = [
  'ICU admission',
  'Severe postpartum hemorrhage',
  'Hypertensive disorders',
  'Sepsis',
  'Blood transfusion',
  'Perineal laceration',
  'Unplanned hysterectomy',
  'Uterine rupture',
]

const THEORIES = [
  {
    name: 'Weathering Hypothesis',
    text: 'Chronic stress from cumulative exposure to social and economic adversity explains racial disparities in health independent of socioeconomic status.',
  },
  {
    name: 'Fundamental Cause Theory',
    text: 'Socioeconomic status should predict health outcomes through flexible resources — income, knowledge, and insurance — that can be redeployed as new risks emerge.',
  },
]

export default function Motivation() {
  return (
    <section className="section" id="motivation">
      <div className="section__inner">
        <p className="eyebrow">Motivation</p>
        <h2 className="section-title">Why This Question Matters</h2>

        <p className="lede" style={{ marginBottom: 20 }}>
          <strong>Research question:</strong> Which social and economic factors &mdash; race,
          ethnicity, education, age, insurance, and rurality &mdash; most strongly and
          independently predict severe maternal morbidity across U.S. states?
        </p>

        <p className="muted" style={{ maxWidth: '68ch', marginBottom: 28 }}>
          Severe maternal morbidity covers short- or long-term physical or mental health problems
          that result from or are aggravated by pregnancy, childbirth, or the postpartum period.
          In the CDC WONDER data it is recorded as whether at least one of these was checked on
          the birth record:
        </p>

        <ul className="chip-list" style={{ marginBottom: 32 }}>
          {INDICATORS.map((item) => (
            <li className="chip" key={item}>
              {item}
            </li>
          ))}
        </ul>

        <p className="muted" style={{ maxWidth: '68ch', marginBottom: 40 }}>
          Much of this is preventable, but public health resources are limited. Determining which
          factor carries the greatest <em>independent</em> weight &mdash; rather than which are
          merely correlated &mdash; can directly inform where policymakers should prioritize
          those resources.
        </p>

        <div className="theory-grid">
          {THEORIES.map((theory) => (
            <div className="card theory-card" key={theory.name}>
              <h3 className="theory-card__title">{theory.name}</h3>
              <p className="muted">{theory.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
