import Hero from '../components/Hero.jsx'
import Motivation from '../components/Motivation.jsx'
import DataMethods from '../components/DataMethods.jsx'
import Results from '../components/Results.jsx'
import StateVariation from '../components/StateVariation.jsx'
import Conclusion from '../components/Conclusion.jsx'

export default function MaternalMorbidity() {
  return (
    <>
      <Hero
        eyebrow="QSS 45 · Final Project"
        title="Predictors of Severe Maternal Morbidity Across U.S. States"
        subtitle="Melissa Ballesteros, Dartmouth College — AI and Machine Learning for Social Science"
        links={[
          {
            label: 'View the code on GitHub',
            href: 'https://github.com/melissabllstrs12/QSS45_Final_Project',
            primary: true,
          },
          {
            label: 'Presentation slides',
            href: '/maternal-morbidity-slides.pdf',
          },
        ]}
      />
      <Motivation />
      <DataMethods />
      <Results />
      <StateVariation />
      <Conclusion />
    </>
  )
}
