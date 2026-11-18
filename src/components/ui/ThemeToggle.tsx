import { Component } from '@geajs/core'
import themeStore from '../../stores/theme-store'
import Icon from './Icon'

/**
 * Both icons are always rendered; CSS shows the right one from [data-theme],
 * so the button is correct even before the store hydrates.
 */
export default class ThemeToggle extends Component {
  template() {
    return (
      <button
        type="button"
        class="icon-btn theme-toggle"
        aria-label={themeStore.toggleLabel}
        title={themeStore.toggleLabel}
        click={() => themeStore.toggle()}
      >
        <span class="theme-toggle__icon theme-toggle__icon--sun">
          <Icon name="sun" />
        </span>
        <span class="theme-toggle__icon theme-toggle__icon--moon">
          <Icon name="moon" />
        </span>
      </button>
    )
  }
}
