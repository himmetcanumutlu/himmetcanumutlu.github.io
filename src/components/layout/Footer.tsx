import { profile } from '../../data/profile'
import { formatMonth, githubGeneratedAt } from '../../data/selectors'
import { sectionById } from '../../data/site'
import CopyEmail from '../ui/CopyEmail'
import { withBase } from '../../lib/paths'
import Icon from '../ui/Icon'

const contact = sectionById('contact')
const socialLinks = [profile.links.github, profile.links.linkedin, profile.links.youtube]
const updated = formatMonth(githubGeneratedAt.slice(0, 7))

/** Contact section + site footer. */
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer id="contact" class="footer section" aria-labelledby="contact-title">
      <div class="container footer__inner">
        <div class="footer__cta">
          <p class="section-header__kicker">Contact</p>
          <h2 id="contact-title" class="footer__title">
            {contact?.title ?? 'Get in touch'}
          </h2>
          <p class="footer__bio">{profile.bio[1]}</p>

          <div class="footer__email">
            <a class="footer__address" href={profile.links.email.href}>
              <Icon name="mail" />
              <span>{profile.email}</span>
            </a>
            <CopyEmail />
          </div>

          <ul class="footer__links" role="list">
            {socialLinks.map(link => (
              <li key={link.kind}>
                <a class="btn btn--ghost btn--sm" href={link.href} target="_blank" rel="noopener noreferrer me">
                  <Icon name={link.kind as 'github' | 'linkedin' | 'youtube'} />
                  <span>{link.label}</span>
                </a>
              </li>
            ))}
            <li>
              <a class="btn btn--ghost btn--sm" href={withBase(profile.cv.href)} download="Himmet-Can-Umutlu-CV.pdf">
                <Icon name="download" />
                <span>CV (PDF)</span>
              </a>
            </li>
          </ul>
        </div>

        <div class="footer__meta">
          <p class="footer__location">
            <Icon name="map-pin" />
            <span>{profile.location}</span>
          </p>
          <p>
            © {year} {profile.name}
          </p>
          <p class="subtle">Last updated {updated}</p>
          <a class="footer__top" href="#top">
            <Icon name="arrow-up" />
            <span>Back to top</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
