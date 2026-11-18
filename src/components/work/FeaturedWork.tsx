import { featuredProjects } from '../../data/selectors'
import { getSection } from '../../data/site'
import SectionHeader from '../layout/SectionHeader'
import CaseStudyCard from './CaseStudyCard'

const section = getSection('work')

export default function FeaturedWork() {
  return (
    <section id="work" class="section" aria-labelledby="work-title">
      <div class="container">
        <SectionHeader
          id="work"
          title={section.title}
          kicker={section.kicker}
          lede="Four projects, each told as problem → approach → result."
        />
        <ul class="grid grid--featured" role="list">
          {featuredProjects.map(project => (
            <li key={project.slug}>
              <CaseStudyCard project={project} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
