import { Component } from '@geajs/core'
import uiStore from '../../stores/ui-store'
import Icon from './Icon'

/** Global toast. Always in the DOM so the live region is announced reliably. */
export default class Toast extends Component {
  template() {
    return (
      <div class="toast-region">
        <div
          class={`toast${uiStore.toastVisible ? ' is-visible' : ''}`}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <Icon name="check" />
          <span class="toast__message">{uiStore.toastMessage}</span>
        </div>
      </div>
    )
  }
}
