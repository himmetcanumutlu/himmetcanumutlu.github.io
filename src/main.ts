import './styles/index.css'
import App from './App'
import { initStores } from './stores'

initStores()

const root = document.getElementById('app')
if (!root) throw new Error('Root element #app not found')

new App().render(root)
