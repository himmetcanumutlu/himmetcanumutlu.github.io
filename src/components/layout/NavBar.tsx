import { Component } from '@geajs/core'
import { profile } from '../../data/profile'
import { sections } from '../../data/site'
import { watchActiveSection } from '../../lib/visible'
import ThemeToggle from '../ui/ThemeToggle'

const navSections = sections.filter(section => section.inNav)
const spiedIds = sections.map(section => section.id)

/** Sticky top bar with scroll-spy. Links are plain anchors, so it works without JS. */
export default class NavBar extends Component {
  active = ''
  scrolled = false
  stopSpy: (() => void) | null = null

  handleScroll = (): void => {
    const scrolled = window.scrollY > 8
    if (scrolled !== this.scrolled) this.scrolled = scrolled
  }

  onAfterRender(): void {
    if (this.stopSpy) return

    // Sections are looked up lazily on each pass, so ones mounted after the
    // nav are picked up without waiting for a frame.
    this.stopSpy = watchActiveSection(spiedIds, id => {
      this.active = id === 'top' ? '' : id
    })

    this.handleScroll()
    window.addEventListener('scroll', this.handleScroll, { passive: true })
  }

  dispose(): void {
    this.stopSpy?.()
    window.removeEventListener('scroll', this.handleScroll)
    super.dispose()
  }

  template() {
    return (
      <header class={`nav${this.scrolled ? ' is-scrolled' : ''}`}>
        <div class="container nav__inner">
          <a class="nav__brand" href="#top">
            <span class="nav__mark" aria-hidden="true">
              HC
            </span>
            <span class="nav__name">{profile.displayName}</span>
          </a>
          <nav class="nav__links" aria-label="Sections">
            <ul class="nav__list" role="list">
              {navSections.map(section => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    class={`nav__link${this.active === section.id ? ' is-active' : ''}`}
                    aria-current={this.active === section.id ? 'location' : 'false'}
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div class="nav__actions">
            <ThemeToggle />
          </div>
        </div>
        <div class="nav__progress" aria-hidden="true"></div>
      </header>
    )
  }
}
