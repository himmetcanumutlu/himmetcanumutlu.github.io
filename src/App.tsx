import { Component } from '@geajs/core'
import { profile } from './data/profile'
import { sections } from './data/site'
import filterStore from './stores/filter-store'

const contentSections = sections.filter(section => section.id !== 'top')

/**
 * Root component. `data-focus` drives CSS cross-highlighting: any element
 * with a `data-d` domain list that doesn't include the focused domain dims.
 */
export default class App extends Component {
  template() {
    return (
      <div class="app" data-focus={filterStore.focusDomain ?? ''}>
        <main id="main">
          <header id="top" class="section">
            <h1>{profile.displayName}</h1>
            <p>{profile.headline}</p>
          </header>
          {contentSections.map(section => (
            <section key={section.id} id={section.id} class="section" aria-labelledby={`${section.id}-title`}>
              <h2 id={`${section.id}-title`}>{section.title}</h2>
            </section>
          ))}
        </main>
      </div>
    )
  }
}
