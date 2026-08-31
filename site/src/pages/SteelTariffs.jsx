import Hero from '../components/Hero.jsx'
import TariffsMotivation from '../components/TariffsMotivation.jsx'
import TariffsDataMethods from '../components/TariffsDataMethods.jsx'
import TariffsResults from '../components/TariffsResults.jsx'
import TariffsConclusion from '../components/TariffsConclusion.jsx'

export default function SteelTariffs() {
  return (
    <>
      <Hero
        eyebrow="QSS 20 · Group Project"
        title="Do Tariffs Work? Evidence from the 2018–2019 U.S.–China Steel Tariffs"
        subtitle="Melissa Ballesteros & team, Dartmouth College — effects of U.S.–China tariffs on steel employment and prices"
        links={[
          {
            label: 'View the code on GitHub',
            href: 'https://github.com/melissabllstrs12/QSS20_Group_Project',
            primary: true,
          },
        ]}
      />
      <TariffsMotivation />
      <TariffsDataMethods />
      <TariffsResults />
      <TariffsConclusion />
    </>
  )
}
