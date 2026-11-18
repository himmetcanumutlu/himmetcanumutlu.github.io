import { Store } from '@geajs/core'
import { commands } from '../data/commands'
import type { Command, CommandAction } from '../data/types'
import { isBrowser } from '../lib/env'
import { bestScore } from '../lib/fuzzy'
import { scrollToSection } from '../lib/scroll'
import filterStore from './filter-store'
import themeStore from './theme-store'
import uiStore from './ui-store'
import urlStore from './url-store'

const MAX_RESULTS = 8

/** Shown before the user types anything. */
const defaultCommands: Command[] = commands.filter(
  c => (c.group === 'Navigate' && c.action.type === 'section' && c.action.id !== 'top') || c.group === 'Actions',
)

/** ⌘K command palette state. The dialog element itself lives in the component. */
class PaletteStore extends Store {
  open = false
  query = ''
  activeIndex = 0
  /** False when the last command moved focus elsewhere (e.g. scrolled to a section). */
  restoreFocus = true

  get results(): Command[] {
    const query = this.query.trim()
    if (!query) return defaultCommands.slice(0, MAX_RESULTS)
    return commands
      .map(command => ({ command, score: bestScore(query, [command.label, ...command.keywords]) }))
      .filter(entry => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_RESULTS)
      .map(entry => entry.command)
  }

  get activeCommand(): Command | undefined {
    return this.results[this.activeIndex]
  }

  get hasResults(): boolean {
    return this.results.length > 0
  }

  openPalette(): void {
    this.query = ''
    this.activeIndex = 0
    this.restoreFocus = true
    this.open = true
  }

  close(): void {
    if (this.open) this.open = false
  }

  toggle(): void {
    if (this.open) this.close()
    else this.openPalette()
  }

  setQuery(query: string): void {
    this.query = query
    this.activeIndex = 0
  }

  setActive(index: number): void {
    const count = this.results.length
    if (count === 0) return
    this.activeIndex = Math.max(0, Math.min(index, count - 1))
  }

  move(delta: number): void {
    const count = this.results.length
    if (count === 0) return
    this.activeIndex = (this.activeIndex + delta + count) % count
  }

  runActive(): void {
    const command = this.activeCommand
    if (command) this.run(command)
  }

  run(command: Command): void {
    this.restoreFocus = !movesFocus(command.action)
    this.close()
    execute(command.action)
  }
}

const movesFocus = (action: CommandAction): boolean =>
  action.type === 'section' || action.type === 'project' || action.type === 'domain' || action.type === 'terminal'

export function execute(action: CommandAction): void {
  switch (action.type) {
    case 'section':
      scrollToSection(action.id)
      break
    case 'project':
      urlStore.openProject(action.slug)
      break
    case 'domain':
      filterStore.setDomain(action.id)
      scrollToSection('lab')
      break
    case 'theme':
      themeStore.toggle()
      break
    case 'copy-email':
      void uiStore.copyEmail()
      break
    case 'open':
      if (isBrowser()) window.open(action.href, '_blank', 'noopener,noreferrer')
      break
    case 'terminal':
      scrollToSection('systems')
      uiStore.requestTerminalRun()
      break
  }
}

export default new PaletteStore()
