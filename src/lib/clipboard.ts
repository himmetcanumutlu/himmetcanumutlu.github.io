import { isBrowser } from './env'

/** Copies text, falling back to a hidden textarea where the Clipboard API is unavailable. */
export async function copyText(text: string): Promise<boolean> {
  if (!isBrowser()) return false

  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Fall through to the legacy path.
    }
  }

  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.opacity = '0'
  area.style.pointerEvents = 'none'
  document.body.appendChild(area)
  area.select()
  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {
    ok = false
  }
  area.remove()
  return ok
}
