// Server entry used only at build time to prerender the page to static HTML.
// Stores are not serialized: all shareable UI state comes from the URL and
// is applied on the client after hydration.

import { handleRequest } from '@geajs/ssr'
import App from './App'

// Lifecycle hooks run during server rendering too; this keeps browser-only
// work (observers, timers, listeners) out of the prerender pass.
globalThis.__PRERENDER__ = true

export default handleRequest(App, {
  onRenderError(error) {
    console.error('[prerender] component failed to render:', error)
    return ''
  },
})
