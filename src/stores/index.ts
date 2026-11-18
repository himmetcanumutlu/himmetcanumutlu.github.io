import themeStore from './theme-store'
import urlStore from './url-store'

export { default as filterStore } from './filter-store'
export { default as paletteStore } from './palette-store'
export { default as themeStore } from './theme-store'
export { default as uiStore } from './ui-store'
export { default as urlStore } from './url-store'

/** Wires stores to browser APIs. Call once, client-side only. */
export function initStores(): void {
  themeStore.init()
  urlStore.init()
}
