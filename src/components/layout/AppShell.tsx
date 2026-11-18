import { Component } from '@geajs/core'
import type { JSX } from '@geajs/core/jsx-runtime'
import filterStore from '../../stores/filter-store'
import Toast from '../ui/Toast'
import Footer from './Footer'
import NavBar from './NavBar'

/**
 * Page frame. `data-focus` on the root drives CSS cross-highlighting:
 * items whose `data-d` list lacks the focused domain recede.
 */
export default class AppShell extends Component {
  template({ children }: { children?: JSX.Element }) {
    return (
      <div class="app" data-focus={filterStore.focusDomain ?? ''}>
        <a class="skip-link" href="#main">
          Skip to content
        </a>
        <NavBar />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <Toast />
      </div>
    )
  }
}
