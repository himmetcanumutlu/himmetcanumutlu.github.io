import { Component } from '@geajs/core'
import { profile } from '../../data/profile'
import { isBrowser } from '../../lib/env'
import { withBase } from '../../lib/paths'
import Icon from '../ui/Icon'
import NowLine from './NowLine'

const socialLinks = [profile.links.github, profile.links.linkedin, profile.links.youtube]
const focusLine = profile.identityChips.map(chip => chip.label).join(' · ')
const headshotSrc = withBase(profile.headshot.src)
const cvHref = withBase(profile.cv.href)

/**
 * The opening page: name, a plain-spoken introduction, the portrait and a
 * short "now" note in the margin. Falls back to a monogram if the portrait
 * hasn't been added yet.
 */
export default class Hero extends Component {
  photoFailed = false
  photoEl: HTMLImageElement | null = null

  onAfterRender(): void {
    // Lifecycle hooks also run during prerendering; browser-only from here.
    if (!isBrowser()) return
    const img = this.photoEl
    if (!img) return
    img.addEventListener('error', () => (this.photoFailed = true), { once: true })
    // The element may still be detached (and inert) here, which reports
    // complete with no pixels; only judge it once it's in the document.
    window.setTimeout(() => {
      if (img.isConnected && img.complete && img.naturalWidth === 0) this.photoFailed = true
    }, 0)
  }

  template() {
    return (
      <section id="top" class="hero" aria-labelledby="hero-title">
        <p class="hero__eyebrow">
          <span class="hero__status">{profile.availability}</span>
          <span class="hero__location">{profile.location}</span>
        </p>

        <div class="hero__body">
          <div class="hero__copy">
            <h1 id="hero-title" class="hero__title">
              {profile.displayName}
            </h1>
            <p class="hero__role">{profile.roleLine}</p>
            <p class="hero__headline">{profile.headline}</p>
            <p class="hero__focus">{focusLine}</p>

            <div class="hero__ctas">
              <a class="btn btn--primary" href="#work">
                <span>Read the case studies</span>
                <Icon name="arrow-right" />
              </a>
              <a class="link-quiet" href={cvHref} download="Himmet-Can-Umutlu-CV.pdf">
                Download CV
              </a>
              <a class="link-quiet" href="#contact">
                Contact
              </a>
            </div>

            <ul class="hero__social" role="list" aria-label="Profiles">
              {socialLinks.map(link => (
                <li key={link.kind}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer me">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <aside class="hero__aside" aria-label="Portrait and current roles">
            <figure class={`hero__photo${this.photoFailed ? ' is-fallback' : ''}`}>
              <span class="hero__monogram" aria-hidden="true">
                HC
              </span>
              <img
                ref={this.photoEl}
                src={headshotSrc}
                alt={profile.headshot.alt}
                width={profile.headshot.width}
                height={profile.headshot.height}
                decoding="async"
                fetchPriority="high"
              />
            </figure>
            <NowLine items={profile.now} />
          </aside>
        </div>
      </section>
    )
  }
}
