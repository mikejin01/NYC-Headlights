#!/usr/bin/env node
// Merge live WordPress content overrides into the local defaults file
// (playbook §4.3). Run via `make pull-content`; `--check` (make
// check-content-drift) reports drift and exits 1 instead of writing.
import fs from 'node:fs'

const DEFAULTS_FILE = 'src/data/liveData.json'
const CHECK = process.argv.includes('--check')

const read = (f, fallback) => {
  const raw = fs.readFileSync(f, 'utf8').trim()
  return raw ? JSON.parse(raw) : fallback
}
const options = read('.content-sync/options.json', [])
const routes = read('.content-sync/route-overrides.json', {})
const local = read(DEFAULTS_FILE, {})

// Keys are globally unique (page_* keys carry their page name), so live
// overrides flatten into one map: xo_global_x -> global_x, route keys as-is.
const live = {}
for (const row of options) live[row.option_name.replace(/^xo_/, '')] = row.option_value
for (const overrides of Object.values(Array.isArray(routes) ? {} : routes)) {
  for (const [key, value] of Object.entries(overrides)) live[key] = value
}

const drift = Object.entries(live).filter(([k, v]) => String(local[k] ?? '') !== String(v))

if (CHECK) {
  if (drift.length) {
    console.error(`DRIFT: the live site has ${drift.length} content key(s) newer than ${DEFAULTS_FILE}:`)
    for (const [k, v] of drift.slice(0, 20)) console.error(`  ${k}: local=${JSON.stringify(local[k] ?? null)} live=${JSON.stringify(v)}`)
    console.error('Run `make pull-content`, review and commit, before editing local content.')
    process.exit(1)
  }
  console.log('Local content defaults match the live site.')
  process.exit(0)
}

for (const [k, v] of drift) local[k] = v
const sorted = Object.fromEntries(Object.entries(local).sort(([a], [b]) => a.localeCompare(b)))
fs.writeFileSync(DEFAULTS_FILE, JSON.stringify(sorted, null, 2) + '\n')
console.log(`Merged ${drift.length} live edit(s) into ${DEFAULTS_FILE}.`)
