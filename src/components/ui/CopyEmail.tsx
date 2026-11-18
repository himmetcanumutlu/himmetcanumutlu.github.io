import { Component } from '@geajs/core'
import { profile } from '../../data/profile'
import uiStore from '../../stores/ui-store'
import Icon from './Icon'

const RESET_MS = 2000

export default class CopyEmail extends Component {
  copied = false
  timer = 0

  async copy(): Promise<void> {
    const ok = await uiStore.copyEmail()
    window.clearTimeout(this.timer)
    this.copied = ok
    if (ok) this.timer = window.setTimeout(() => (this.copied = false), RESET_MS)
  }

  dispose(): void {
    window.clearTimeout(this.timer)
    super.dispose()
  }

  template() {
    return (
      <button
        type="button"
        class={`btn btn--sm copy-email${this.copied ? ' is-copied' : ''}`}
        aria-label={`Copy email address ${profile.email}`}
        click={() => this.copy()}
      >
        <span class="copy-email__icon copy-email__icon--copy">
          <Icon name="copy" />
        </span>
        <span class="copy-email__icon copy-email__icon--check">
          <Icon name="check" />
        </span>
        <span>{this.copied ? 'Copied' : 'Copy'}</span>
      </button>
    )
  }
}
