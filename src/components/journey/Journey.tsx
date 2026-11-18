import { profile } from '../../data/profile'
import { getSection } from '../../data/site'
import { talks } from '../../data/talks'
import SectionHeader from '../layout/SectionHeader'
import EventStrip from './EventStrip'
import ExperienceList from './ExperienceList'
import SwimlaneTimeline from './SwimlaneTimeline'
import TalkCard from './TalkCard'

const section = getSection('journey')

export default function Journey() {
  return (
    <section id="journey" class="section" aria-labelledby="journey-title">
      <div class="container">
        <SectionHeader
          id="journey"
          title={section.title}
          kicker={section.kicker}
          lede="Professional roles, and the communities I founded, led and handed on — shown as role progressions rather than dates."
        />

        <div class="journey">
          <div class="journey__block">
            <h3 class="journey__heading">Experience</h3>
            <ExperienceList />
          </div>

          <div class="journey__block">
            <h3 class="journey__heading">Communities</h3>
            <SwimlaneTimeline />
          </div>

          <div class="journey__block">
            <h3 class="journey__heading">Talks & workshops</h3>
            <div class="grid">
              {talks.map(talk => (
                <TalkCard key={talk.id} talk={talk} />
              ))}
            </div>
          </div>

          <div class="journey__block">
            <h3 class="journey__heading">Events & volunteering</h3>
            <EventStrip />
            <ul class="beyond" role="list" aria-label="Beyond tech">
              {profile.beyondTech.map(line => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
