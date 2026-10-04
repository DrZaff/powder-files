import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { setTimeout as sleep } from 'node:timers/promises'

export async function readFreshCache(path, maxAgeDays) {
  try {
    const info = await stat(path)
    if ((Date.now() - info.mtimeMs) / 86400000 > maxAgeDays) return null
    return JSON.parse(await readFile(path, 'utf8'))
  } catch { return null }
}

export async function writeJson(path, value) {
  await mkdir(dirname(path instanceof URL ? fileURLToPath(path) : path), { recursive: true })
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`)
}

export async function fetchJsonWithRetry({ url, body, headers, attempts = 4, timeoutMs = 180000 }) {
  let lastError
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), timeoutMs)
      const response = await fetch(url, { method: body ? 'POST' : 'GET', body, headers, signal: controller.signal })
      clearTimeout(timer)
      if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`)
      return await response.json()
    } catch (error) {
      lastError = error
      if (attempt < attempts) await sleep(Math.min(30000, 1500 * (2 ** (attempt - 1))))
    }
  }
  throw lastError
}
