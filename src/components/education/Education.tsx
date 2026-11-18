import { degrees, programs } from '../../data/education'
import { domainAttr, getProject } from '../../data/selectors'
import { getSection } from '../../data/site'
import SectionHeader from '../layout/SectionHeader'
import CertWall from './CertWall'

const section = getSection('education')

export default function Education() {
  return (
    <section id="education" class="section" aria-labelledby="education-title">
      <div class="container">
        <SectionHeader id="education" title={section.title} kicker={section.kicker} />

        <div class="education">
          <ul class="grid degrees" role="list">
            {degrees.map(degree => (
              <li key={degree.id}>
                <article class="card degree" data-d={domainAttr(degree.domains)} data-domain={degree.domains[0]}>
                  <p class="card__meta">
                    {degree.degree} · {degree.years}
                  </p>
                  <h3 class="card__title">{degree.program}</h3>
                  <p class="degree__institution">{degree.institution}</p>
                  {degree.mode ? <p class="degree__mode">{degree.mode}</p> : ''}
                  <ul class="degree__highlights">
                    {degree.highlights.map(line => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  {degree.relatedProjects.length > 0 ? (
                    <ul class="tag-list" role="list" aria-label="Coursework projects">
                      {degree.relatedProjects.map(slug => (
                        <li key={slug}>
                          <a class="tag tag--outline related-link" href={`?project=${slug}`} data-project={slug}>
                            {getProject(slug)?.title ?? slug}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    ''
                  )}
                </article>
              </li>
            ))}
          </ul>

          <div class="programs">
            <h3 class="education__heading">Programs</h3>
            <ul class="programs__list" role="list">
              {programs.map(program => (
                <li key={program.id} class="program" data-d={domainAttr(program.domains)} data-domain={program.domains[0]}>
                  <span class="dot" aria-hidden="true"></span>
                  <span class="program__name">
                    {program.provider} · {program.name}
                  </span>
                  <span class="program__detail">
                    {program.detail} · {program.year}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <CertWall />
        </div>
      </div>
    </section>
  )
}
