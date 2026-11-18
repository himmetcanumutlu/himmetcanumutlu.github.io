// Small, dependency-free fuzzy matcher for the command palette.

const DOTLESS_I = String.fromCharCode(0x131)

const normalize = (value: string): string =>
  value
    .toLocaleLowerCase('en')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .split(DOTLESS_I)
    .join('i')

/**
 * Scores how well `query` matches `text`. Returns 0 for no match.
 * Prefix and word-boundary matches score highest, then substrings, then
 * in-order subsequences.
 */
export function fuzzyScore(query: string, text: string): number {
  const q = normalize(query.trim())
  if (!q) return 1
  const t = normalize(text)

  if (t.startsWith(q)) return 100 - Math.min(t.length - q.length, 50) / 10
  const wordIndex = t.indexOf(` ${q}`)
  if (wordIndex !== -1) return 80 - wordIndex / 100
  const index = t.indexOf(q)
  if (index !== -1) return 60 - index / 100

  let ti = 0
  let gaps = 0
  for (let qi = 0; qi < q.length; qi++) {
    const found = t.indexOf(q[qi], ti)
    if (found === -1) return 0
    gaps += found - ti
    ti = found + 1
  }
  return Math.max(1, 40 - gaps)
}

/** Best score of a query across several fields. */
export function bestScore(query: string, fields: readonly string[]): number {
  let best = 0
  for (const field of fields) {
    const score = fuzzyScore(query, field)
    if (score > best) best = score
  }
  return best
}
