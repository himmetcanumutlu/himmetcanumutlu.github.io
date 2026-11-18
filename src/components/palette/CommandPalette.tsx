import { Component } from '@geajs/core'
import paletteStore from '../../stores/palette-store'
import Icon from '../ui/Icon'

// Plain DOM reference kept outside reactive state.
let returnFocus: HTMLElement | null = null

const optionId = (commandId: string): string => `cmd-${commandId.replace(/[^a-z0-9-]/gi, '-')}`

/**
 * ⌘K / Ctrl+K command palette on a native modal <dialog> (focus trap, Esc
 * and backdrop handled by the platform). State lives in the palette store.
 */
export default class CommandPalette extends Component {
  dialogEl: HTMLDialogElement | null = null
  inputEl: HTMLInputElement | null = null
  listEl: HTMLUListElement | null = null
  stopObserving: (() => void) | null = null

  onAfterRender(): void {
    const dialog = this.dialogEl
    if (!dialog || this.stopObserving) return
    dialog.addEventListener('cancel', this.handleCancel)
    dialog.addEventListener('close', this.handleClose)
    dialog.addEventListener('click', this.handleBackdropClick)
    this.stopObserving = paletteStore.observe('open', () => this.sync())
    this.sync()
  }

  dispose(): void {
    this.stopObserving?.()
    this.dialogEl?.removeEventListener('cancel', this.handleCancel)
    this.dialogEl?.removeEventListener('close', this.handleClose)
    this.dialogEl?.removeEventListener('click', this.handleBackdropClick)
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

    if (paletteStore.open && !dialog.open) {
      const active = document.activeElement
      returnFocus = active instanceof HTMLElement && active !== document.body ? active : null
      if (this.inputEl) this.inputEl.value = ''
      dialog.showModal()
      this.inputEl?.focus()
    } else if (!paletteStore.open && dialog.open) {
      dialog.close()
      this.restoreFocus()
    }
  }

  restoreFocus(): void {
    const target = returnFocus
    returnFocus = null
    if (paletteStore.restoreFocus && target?.isConnected) target.focus({ preventScroll: true })
  }

  /** Esc: route through the store instead of letting the dialog close itself. */
  handleCancel = (event: Event): void => {
    event.preventDefault()
    paletteStore.close()
  }

  /** Safety net for any other way the dialog gets closed. */
  handleClose = (): void => {
    paletteStore.close()
    this.restoreFocus()
  }

  handleBackdropClick = (event: MouseEvent): void => {
    if (event.target === this.dialogEl) paletteStore.close()
  }

  revealActive(): void {
    window.setTimeout(() => {
      const id = paletteStore.activeCommand ? optionId(paletteStore.activeCommand.id) : ''
      if (id) this.listEl?.querySelector(`#${id}`)?.scrollIntoView({ block: 'nearest' })
    }, 0)
  }

  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        paletteStore.move(1)
        this.revealActive()
        break
      case 'ArrowUp':
        event.preventDefault()
        paletteStore.move(-1)
        this.revealActive()
        break
      case 'Home':
        event.preventDefault()
        paletteStore.setActive(0)
        this.revealActive()
        break
      case 'End':
        event.preventDefault()
        paletteStore.setActive(paletteStore.results.length - 1)
        this.revealActive()
        break
      case 'Enter':
        event.preventDefault()
        paletteStore.runActive()
        break
    }
  }

  template() {
    const results = paletteStore.results
    const active = paletteStore.activeCommand

    return (
      <dialog ref={this.dialogEl} class="modal palette" aria-label="Command palette">
        <div class="palette__search">
          <Icon name="search" />
          <input
            ref={this.inputEl}
            class="palette__input"
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-results"
            aria-autocomplete="list"
            aria-activedescendant={active ? optionId(active.id) : ''}
            placeholder="Search sections, projects and actions…"
            autoComplete="off"
            spellCheck="false"
            value={paletteStore.query}
            input={(event: Event) => paletteStore.setQuery((event.target as HTMLInputElement).value)}
            keydown={(event: KeyboardEvent) => this.onKeydown(event)}
          />
          <kbd>esc</kbd>
        </div>

        <ul ref={this.listEl} id="palette-results" class="palette__results" role="listbox" aria-label="Results">
          {results.map(command => (
            <li
              key={command.id}
              id={optionId(command.id)}
              role="option"
              aria-selected={active?.id === command.id ? 'true' : 'false'}
              class={`palette__option${active?.id === command.id ? ' is-active' : ''}`}
              click={() => paletteStore.run(command)}
              pointermove={() => paletteStore.setActive(paletteStore.results.indexOf(command))}
            >
              <span class="palette__group">{command.group}</span>
              <span class="palette__label">{command.label}</span>
              <span class="palette__hint">{command.hint ?? ''}</span>
            </li>
          ))}
        </ul>

        <p class="palette__empty" hidden={paletteStore.hasResults}>
          No matches for “{paletteStore.query}”. Try a section, project or “theme”.
        </p>

        <footer class="palette__footer" aria-hidden="true">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> navigate
          </span>
          <span>
            <kbd>↵</kbd> select
          </span>
          <span>
            <kbd>esc</kbd> close
          </span>
        </footer>
      </dialog>
    )
  }
}
