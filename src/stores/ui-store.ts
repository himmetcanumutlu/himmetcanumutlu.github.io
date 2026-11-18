import { Store } from '@geajs/core'
import { profile } from '../data/profile'
import { copyText } from '../lib/clipboard'
import { isBrowser } from '../lib/env'

const TOAST_MS = 2400

/** Small cross-cutting UI state: toast notifications and terminal replays. */
class UiStore extends Store {
  toastMessage = ''
  toastVisible = false
  toastSeq = 0
  /** Incremented to ask the terminal to (re)run its boot script. */
  terminalRunId = 0

  showToast(message: string, duration = TOAST_MS): void {
    this.toastMessage = message
    this.toastVisible = true
    const seq = ++this.toastSeq
    if (!isBrowser()) return
    window.setTimeout(() => {
      if (this.toastSeq === seq) this.toastVisible = false
    }, duration)
  }

  hideToast(): void {
    this.toastVisible = false
  }

  requestTerminalRun(): void {
    this.terminalRunId++
  }

  async copyEmail(): Promise<boolean> {
    const ok = await copyText(profile.email)
    this.showToast(ok ? 'Email copied to clipboard' : `Couldn’t copy. Email: ${profile.email}`)
    return ok
  }
}

export default new UiStore()
