import { Component } from '@geajs/core'
import { systemsLab } from '../../data/systems'
import type { TerminalLine } from '../../data/types'
import { prefersReducedMotion } from '../../lib/env'
import { onFirstVisible } from '../../lib/visible'
import uiStore from '../../stores/ui-store'

interface Line {
  id: number
  kind: TerminalLine['kind']
  text: string
}

const { user, host, bootScript, commands } = systemsLab.terminal
const PROMPT = `${user}@${host}:~$`
const MAX_LINES = 120
const HISTORY_LIMIT = 30

/**
 * Scripted shell. Plays the boot script the first time it scrolls into view
 * (or when the command palette asks), then accepts a few real commands.
 */
export default class TerminalWhoami extends Component {
  lines: Line[] = []
  draft = ''
  running = false
  seq = 0
  timers: number[] = []
  history: string[] = []
  historyIndex = -1
  screenEl: HTMLDivElement | null = null
  inputEl: HTMLInputElement | null = null
  stopVisible: (() => void) | null = null
  stopRuns: (() => void) | null = null

  onAfterRender(): void {
    if (this.stopRuns || !this.el) return
    this.stopVisible = onFirstVisible(this.el, () => {
      if (this.seq === 0) this.boot(false)
    })
    this.stopRuns = uiStore.observe('terminalRunId', () => this.boot(true))
  }

  dispose(): void {
    this.clearTimers()
    this.stopVisible?.()
    this.stopRuns?.()
    super.dispose()
  }

  clearTimers(): void {
    for (const timer of this.timers) window.clearTimeout(timer)
    this.timers = []
  }

  line(source: TerminalLine): Line {
    this.seq += 1
    return { id: this.seq, kind: source.kind, text: source.text }
  }

  append(sources: TerminalLine[]): void {
    for (const source of sources) this.lines.push(this.line(source))
    if (this.lines.length > MAX_LINES) this.lines = this.lines.slice(-MAX_LINES)
    this.scrollToEnd()
  }

  boot(focusAfter: boolean): void {
    this.clearTimers()
    this.lines = []

    if (prefersReducedMotion()) {
      this.append(bootScript)
      this.finishBoot(focusAfter)
      return
    }

    this.running = true
    let delay = 0
    bootScript.forEach((source, index) => {
      delay += source.kind === 'cmd' ? 520 : 140
      const timer = window.setTimeout(() => {
        this.append([source])
        if (index === bootScript.length - 1) this.finishBoot(focusAfter)
      }, delay)
      this.timers.push(timer)
    })
  }

  finishBoot(focusAfter: boolean): void {
    this.running = false
    if (focusAfter) window.setTimeout(() => this.inputEl?.focus({ preventScroll: true }), 0)
  }

  run(raw: string): void {
    const input = raw.trim()
    this.append([{ kind: 'cmd', text: input }])
    if (!input) return

    this.history = [...this.history.filter(entry => entry !== input), input].slice(-HISTORY_LIMIT)
    this.historyIndex = -1

    const name = input.toLowerCase()
    if (name === 'clear') {
      this.lines = []
      return
    }

    const command = commands.find(entry => entry.name === name)
    this.append(
      command ? command.output : [{ kind: 'muted', text: `command not found: ${input} — type \`help\`` }],
    )
  }

  submit(event: Event): void {
    event.preventDefault()
    if (this.running) return
    const value = this.draft
    this.draft = ''
    if (this.inputEl) this.inputEl.value = ''
    this.run(value)
  }

  recall(direction: 1 | -1): void {
    if (this.history.length === 0) return
    const last = this.history.length - 1
    let index = this.historyIndex === -1 ? (direction === -1 ? last : -1) : this.historyIndex + direction
    if (index > last) index = -1
    if (index < -1) index = 0
    this.historyIndex = index
    this.draft = index === -1 ? '' : this.history[index]
    if (this.inputEl) this.inputEl.value = this.draft
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      this.recall(-1)
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      this.recall(1)
    } else if (event.key === 'l' && event.ctrlKey) {
      event.preventDefault()
      this.lines = []
    }
  }

  scrollToEnd(): void {
    // DOM patches are batched; scroll after they land.
    window.setTimeout(() => {
      const screen = this.screenEl
      if (screen) screen.scrollTop = screen.scrollHeight
    }, 0)
  }

  focusInput(): void {
    const selection = window.getSelection()
    if (selection && selection.toString().length > 0) return
    this.inputEl?.focus({ preventScroll: true })
  }

  template() {
    return (
      <div class="terminal" data-domain="systems">
        <div class="terminal__bar">
          <span class="terminal__dots" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>
          <span class="terminal__title">{`${user}@${host} — bash`}</span>
          <button type="button" class="terminal__replay" click={() => this.boot(true)} aria-label="Replay the whoami script">
            replay
          </button>
        </div>
        <div ref={this.screenEl} class="terminal__screen" click={() => this.focusInput()}>
          <div class="terminal__log" role="log" aria-live="polite" aria-label="Terminal output">
            {this.lines.map(line => (
              <p key={line.id} class={`terminal__line terminal__line--${line.kind}`}>
                <span class="terminal__prompt" aria-hidden="true">
                  {PROMPT}
                </span>
                <span class="terminal__text">{line.text}</span>
              </p>
            ))}
          </div>
          <form class={`terminal__form${this.running ? ' is-busy' : ''}`} submit={(event: Event) => this.submit(event)}>
            <label class="sr-only" for="terminal-input">
              Type a command, for example help
            </label>
            <span class="terminal__prompt" aria-hidden="true">
              {PROMPT}
            </span>
            <input
              ref={this.inputEl}
              id="terminal-input"
              class="terminal__input"
              type="text"
              value={this.draft}
              input={(event: Event) => (this.draft = (event.target as HTMLInputElement).value)}
              keydown={(event: KeyboardEvent) => this.onKeydown(event)}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
              enterKeyHint="send"
            />
          </form>
        </div>
      </div>
    )
  }
}
