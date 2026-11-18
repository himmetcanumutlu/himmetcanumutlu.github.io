import './styles/index.css'
import { hydrate } from '@geajs/ssr/client'
import App from './App'
import { initStores } from './stores'

const root = document.getElementById('app')
if (!root) throw new Error('Root element #app not found')

// Production pages are prerendered: adopt the existing DOM. In dev the root
// is empty and hydrate() falls back to a normal client render.
hydrate(App, root)

// Apply URL state (?domain, ?project) and the saved theme after hydration,
// so the adopted DOM matches the prerendered HTML before anything changes.
initStores()
