import { Component } from '@geajs/core'
import { includedProjects } from '../../data/selectors'
import { copyText } from '../../lib/clipboard'
import urlStore from '../../stores/url-store'
import Icon from '../ui/Icon'
import CaseStudyBody from './CaseStudyBody'
import { isBrowser } from '../../lib/env'

// Kept outside reactive state: a plain DOM reference for focus restoration.
let returnFocus: HTMLElement | null = null

/**
 * Case-study side sheet on a native modal <dialog>. Open state lives in the
 * URL (?project=slug): Back closes it, and links are shareable.
 */
export default class CaseStudyDrawer extends Component {
  dialogEl: HTMLDialogElement | null = null
  stopObserving: (() => void) | null = null
  copiedSlug = ''
  copyTimer = 0

  onAfterRender(): void {
    // Lifecycle hooks also run during prerendering; browser-only from here.
    if (!isBrowser()) return
    const dialog = this.dialogEl
    if (!dialog || this.stopObserving) return
    dialog.addEventListener('cancel', this.handleCancel)
    dialog.addEventListener('close', this.handleClose)
    dialog.addEventListener('click', this.handleBackdropClick)
    this.stopObserving = urlStore.observe('project', () => this.sync())
    this.sync()
  }

  dispose(): void {
    this.stopObserving?.()
    this.dialogEl?.removeEventListener('cancel', this.handleCancel)
    this.dialogEl?.removeEventListener('close', this.handleClose)
    this.dialogEl?.removeEventListener('click', this.handleBackdropClick)
    window.clearTimeout(this.copyTimer)
    super.dispose()
  }

  /** The store is the single source of truth; the dialog follows it. */
  sync(): void {
    const dialog = this.dialogEl
    if (!dialog) return
    // On first render (e.g. a ?project= deep link) the tree may not be attached yet.
    if (!dialog.isConnected) {
      window.setTimeout(() => this.sync(), 0)
      return
    }
    const shouldOpen = urlStore.project !== null

    if (shouldOpen && !dialog.open) {
      const active = document.activeElement
      returnFocus = active instanceof HTMLElement && active !== document.body ? active : null
      dialog.showModal()
    } else if (!shouldOpen && dialog.open) {
      dialog.close()
      this.restoreFocus()
    }

    if (shouldOpen) dialog.scrollTop = 0
  }

  restoreFocus(): void {
    const target = returnFocus
    returnFocus = null
    if (target?.isConnected) target.focus({ preventScroll: true })
  }

  /** Esc: route through the store instead of letting the dialog close itself. */
  handleCancel = (event: Event): void => {
    event.preventDefault()
    this.close()
  }

  /** Safety net for any other way the dialog gets closed. */
  handleClose = (): void => {
    if (urlStore.project !== null) urlStore.closeProject()
    this.restoreFocus()
  }

  handleBackdropClick = (event: MouseEvent): void => {
    // Clicks on the dialog element itself (not its content) land on the backdrop.
    if (event.target === this.dialogEl) this.close()
  }

  close(): void {
    urlStore.closeProject()
  }

  async copyLink(slug: string): Promise<void> {
    const ok = await copyText(urlStore.projectUrl(slug))
    if (!ok) return
    window.clearTimeout(this.copyTimer)
    this.copiedSlug = slug
    this.copyTimer = window.setTimeout(() => (this.copiedSlug = ''), 2000)
  }

  template() {
    const active = urlStore.activeProject

    return (
      <dialog ref={this.dialogEl} class="drawer" aria-label={active ? `Case study: ${active.title}` : 'Case study'}>
        <div class="drawer__bar">
          <p class="drawer__kicker">{active?.context ?? 'Case study'}</p>
          <div class="drawer__actions">
            <button
              type="button"
              class={`btn btn--sm btn--ghost copy-email${this.copiedSlug !== '' && this.copiedSlug === urlStore.project ? ' is-copied' : ''}`}
              click={() => urlStore.project && this.copyLink(urlStore.project)}
            >
              <span class="copy-email__icon copy-email__icon--copy">
                <Icon name="copy" />
              </span>
              <span class="copy-email__icon copy-email__icon--check">
                <Icon name="check" />
              </span>
              <span>{this.copiedSlug !== '' && this.copiedSlug === urlStore.project ? 'Link copied' : 'Copy link'}</span>
            </button>
            <button type="button" class="icon-btn" aria-label="Close case study" click={() => this.close()}>
              <Icon name="close" />
            </button>
          </div>
        </div>
        <div class="drawer__inner">
          {includedProjects.map(project => (
            <article key={project.slug} class="drawer__article" hidden={urlStore.project !== project.slug}>
              <CaseStudyBody project={project} />
            </article>
          ))}
        </div>
      </dialog>
    )
  }
}
