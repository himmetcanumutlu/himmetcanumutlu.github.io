import '@fontsource-variable/newsreader/opsz.css'
import '@fontsource-variable/newsreader/opsz-italic.css'
import '@fontsource-variable/source-sans-3/wght.css'
import './styles/index.css'
import { hydrate } from '@geajs/ssr/client'
import App from './App'
import { initStores } from './stores'

const root = document.getElementById('app')
if (!root) throw new Error('Root element #app not found')

// hydrate() swaps the prerendered markup for live components in one task.
// Pin the root's height across the swap so the page can never collapse
// and reset the visitor's scroll position on a slow connection.
const scrollY = window.scrollY
const prerendered = root.firstElementChild !== null
if (prerendered) root.style.minHeight = `${root.offsetHeight}px`

hydrate(App, root)

if (prerendered) {
  root.style.minHeight = ''
  if (window.scrollY !== scrollY) window.scrollTo(0, scrollY)
}

// Apply URL state (?domain, ?project) and the saved theme after hydration,
// so the first client render matches the prerendered HTML.
initStores()
