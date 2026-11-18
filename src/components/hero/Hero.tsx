import { Component } from '@geajs/core'
import { profile } from '../../data/profile'
import Icon from '../ui/Icon'
import Tag from '../ui/Tag'
import NowLine from './NowLine'
import { isBrowser } from '../../lib/env'

/**
 * Above the fold: who, what, proof of now, and the three primary actions.
 * Falls back to a monogram if the portrait hasn't been added yet.
 */
export default class Hero extends Component {
  photoFailed = false
  photoEl: HTMLImageElement | null = null

  onAfterRender(): void {
    // Lifecycle hooks also run during prerendering; browser-only from here.
    if (!isBrowser()) return
    const img = this.photoEl
    if (!img) return
    if (img.complete && img.naturalWidth === 0) {
      this.photoFailed = true
      return
    }
    img.addEventListener('error', () => (this.photoFailed = true), { once: true })
  }

  template() {
    return (
      <section id="top" class="hero" aria-labelledby="hero-title">
        <div class="container hero__inner">
          <div class="hero__copy">
            <p class="hero__eyebrow">
              <span class="hero__status">
                <span class="hero__status-dot" aria-hidden="true"></span>
                {profile.availability}
              </span>
              <span class="hero__location">
                <Icon name="map-pin" />
                {profile.location}
              </span>
            </p>

            <h1 id="hero-title" class="hero__title">
              {profile.displayName}
            </h1>
            <p class="hero__role">{profile.roleLine}</p>
            <p class="hero__headline">{profile.headline}</p>

            <ul class="tag-list hero__chips" role="list" aria-label="Focus areas">
              {profile.identityChips.map(chip => (
                <li key={chip.label}>
                  <Tag label={chip.label} domain={chip.domain} />
                </li>
              ))}
            </ul>

            <div class="hero__ctas">
              <a class="btn btn--primary" href="#work">
                <span>View work</span>
                <Icon name="arrow-right" />
              </a>
              <a class="btn" href={profile.cv.href} download="Himmet-Can-Umutlu-CV.pdf">
                <Icon name="download" />
                <span>Download CV</span>
              </a>
              <a class="btn btn--ghost" href="#contact">
                Contact
              </a>
            </div>
          </div>

          <div class="hero__aside">
            <div class={`hero__photo${this.photoFailed ? ' is-fallback' : ''}`}>
              <span class="hero__monogram" aria-hidden="true">
                HC
              </span>
              <img
                ref={this.photoEl}
                src={profile.headshot.src}
                alt={profile.headshot.alt}
                width={profile.headshot.width}
                height={profile.headshot.height}
                decoding="async"
                fetchPriority="high"
              />
            </div>
            <NowLine items={profile.now} />
          </div>
        </div>
      </section>
    )
  }
}
