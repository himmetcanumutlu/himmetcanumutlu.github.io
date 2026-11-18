import { Component } from '@geajs/core'
import Hero from './components/hero/Hero'
import AppShell from './components/layout/AppShell'
import SectionHeader from './components/layout/SectionHeader'
import ProofStrip from './components/proof/ProofStrip'
import { sections } from './data/site'

// Content sections between the proof strip and the contact footer.
const bodySections = sections.filter(section => section.id !== 'top' && section.id !== 'contact')

export default class App extends Component {
  template() {
    return (
      <AppShell>
        <Hero />
        <ProofStrip />
        {bodySections.map(section => (
          <section key={section.id} id={section.id} class="section" aria-labelledby={`${section.id}-title`}>
            <div class="container">
              <SectionHeader id={section.id} title={section.title} kicker={section.kicker} />
            </div>
          </section>
        ))}
      </AppShell>
    )
  }
}
