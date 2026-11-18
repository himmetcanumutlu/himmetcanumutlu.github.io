// Refreshes src/data/generated/github.json with live stats for every
// repository referenced in the content. Network failures keep the existing
// snapshot so builds never break on a flaky API.

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { projects } from '../src/data/projects'
import { GITHUB_OWNER } from '../src/data/site'
import type { GithubSnapshot, RepoStats } from '../src/data/types'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outFile = resolve(root, 'src/data/generated/github.json')

interface GithubRepoResponse {
  name: string
  stargazers_count: number
  forks_count: number
  pushed_at: string
  html_url: string
}

const headers: Record<string, string> = {
  Accept: 'application/vnd.github+json',
  'User-Agent': `${GITHUB_OWNER}.github.io build`,
  'X-GitHub-Api-Version': '2022-11-28',
}
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

async function readExisting(): Promise<GithubSnapshot | null> {
  try {
    return JSON.parse(await readFile(outFile, 'utf8')) as GithubSnapshot
  } catch {
    return null
  }
}

async function fetchRepo(name: string): Promise<RepoStats> {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${encodeURIComponent(name)}`, { headers })
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`)
  const data = (await res.json()) as GithubRepoResponse
  return {
    stars: data.stargazers_count,
    forks: data.forks_count,
    pushedAt: data.pushed_at,
    url: data.html_url,
  }
}

async function main(): Promise<void> {
  const repos = [...new Set(projects.filter(p => p.include && p.repo).map(p => p.repo as string))].sort()
  const existing = await readExisting()
  const next: GithubSnapshot = {
    generatedAt: new Date().toISOString(),
    owner: GITHUB_OWNER,
    repos: {},
  }

  let failures = 0
  for (const repo of repos) {
    try {
      next.repos[repo] = await fetchRepo(repo)
    } catch (error) {
      failures++
      const previous = existing?.repos[repo]
      if (previous) next.repos[repo] = previous
      console.warn(`[fetch-github] ${(error as Error).message}${previous ? ' — kept previous value' : ''}`)
    }
  }

  if (failures === repos.length && existing) {
    console.warn('[fetch-github] every request failed — leaving the existing snapshot untouched')
    return
  }

  await mkdir(dirname(outFile), { recursive: true })
  await writeFile(outFile, `${JSON.stringify(next, null, 2)}\n`, 'utf8')
  console.log(`[fetch-github] wrote ${Object.keys(next.repos).length}/${repos.length} repositories`)
}

main().catch(error => {
  console.warn(`[fetch-github] skipped: ${(error as Error).message}`)
})
