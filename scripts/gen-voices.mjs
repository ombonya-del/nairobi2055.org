// Weekly Voices generator — pulls the "Nairobi 2055" X List, classifies each new
// post into the site's Voices shape (reusing index.html's own keyword classifier),
// and appends to voices-auto.json, which the page loads and merges automatically.
// Deterministic: no AI needed. Requires env X_BEARER_TOKEN (X API v2 app bearer).
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const BEARER  = process.env.X_BEARER_TOKEN
const LIST_ID = process.env.NAIROBI_LIST_ID || '2076339026177785915'
const OUT     = 'voices-auto.json'
if (!BEARER) { console.error('X_BEARER_TOKEN not set'); process.exit(1) }

// ── classification (ported verbatim from index.html so it matches the lanes) ──
function classify(text) {
  const low = text.toLowerCase()
  const themeScores = {
    transport:   (low.match(/matatu|boda|road|traffic|bus|train|tram|ev|electric vehicle|expressway|kenha|transport|commut|highway|fare|brt/g) || []).length,
    flooding:    (low.match(/flood|rain|drainage|sewer|mifereji|river|drain|storm|inundat|overflow|downpour/g) || []).length,
    livelihoods: (low.match(/gikomba|market|trader|biashara|vendor|hustle|shop|business|stall|jua kali|demolit|informal economy/g) || []).length,
    housing:     (low.match(/house|housing|slum|settlement|demolit|tenant|landlord|rent|informal settlement|upgrade|shelter/g) || []).length,
    environment: (low.match(/green|tree|park|garbage|waste|river|pollution|sewer|open sewer|litter|dump|clean|environment|air quality/g) || []).length,
    governance:  (low.match(/governor|county|sakaja|government|planning|enforce|policy|corrupt|tax|levy|officer|ward|politician|leader|council/g) || []).length,
    youth:       (low.match(/youth|young|graduate|student|job|unemploy|gen z|generation|university|opportunity/g) || []).length,
    culture:     (low.match(/music|art|culture|heritage|nairobian|pride|creative|festival|identity/g) || []).length,
  }
  const anyTheme = Object.values(themeScores).some((n) => n > 0)
  const theme = anyTheme ? Object.keys(themeScores).sort((a, b) => themeScores[b] - themeScores[a])[0] : 'governance'
  const frust = (text.match(/disgrace|shame|chaos|broken|fail|terrible|horrible|mess|disaster|pathetic|useless|corrupt|neglect|ruined|slum|eyesore|filthy|cursed|deplorable|outrag|angry|furious|unacceptable|stench|revolting|lament/i) || []).length
  const hope  = (text.match(/electric vehicle|free transport|inaugurate|restore|alliance|progress|better|improve|invest|new|clean|world.class|inspir|potential|possible|solution|change|transform|develop|upgrade|build|vision|future|delivers|benchmark|leading|success/i) || []).length
  let mood = 'frustration'
  if (hope > frust * 1.5) mood = 'hope'
  else if (hope > 0 && frust > 0) mood = 'mixed'
  else if (hope > frust) mood = 'hope'
  const areaMap = [['Mathare','mathare'],['Kibera','kibera'],['Mukuru','mukuru'],['Gikomba','gikomba'],['CBD Nairobi','cbd|central business district'],["Lang'ata","lang.?ata"],['Westlands','westlands'],['Kilimani','kilimani'],['Lavington','lavington'],['Ruaraka','ruaraka'],['Embakasi','embakasi'],['Eastlands','eastlands'],['Ngong Road','ngong road'],['Thika Road','thika road'],['Kangundo Road','kangundo'],['Nairobi Expressway','expressway'],['Nairobi rivers','open sewer'],['Nairobi roads','kenha|unmarked road'],['Nairobi streets','street light|giza']]
  let area = 'Nairobi'
  for (const [name, rx] of areaMap) { if (new RegExp(rx, 'i').test(text)) { area = name; break } }
  return { theme, mood, area }
}

// keep it Nairobi/city-relevant so off-topic list posts don't leak into Voices
const REL = /nairobi|matatu|sakaja|\bcbd\b|gikomba|kibera|mathare|mukuru|county|estate|\bcity\b|kenha|expressway|flood|drainage|garbage|sewer|housing|slum|traffic|boda|street|ward|governor|nms/i

const fmtDate = (iso) => { try { return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) } catch { return '' } }

async function fetchList() {
  const url = `https://api.twitter.com/2/lists/${LIST_ID}/tweets?max_results=50&tweet.fields=created_at,public_metrics,text,author_id&expansions=author_id&user.fields=username,name`
  const r = await fetch(url, { headers: { Authorization: `Bearer ${BEARER}` } })
  if (!r.ok) { console.error(`X API ${r.status}: ${(await r.text()).slice(0, 200)}`); process.exit(1) }
  const j = await r.json()
  const users = {}
  ;(j.includes?.users || []).forEach((u) => { users[u.id] = { username: u.username, name: u.name } })
  return (j.data || []).map((t) => ({ t, u: users[t.author_id] || {} }))
}

const existing = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : []
const seen = new Set(existing.map((v) => v.source))
let maxId = existing.reduce((m, v) => Math.max(m, parseInt(String(v.id).replace(/\D/g, '')) || 0), 0)
let added = 0

for (const { t, u } of await fetchList()) {
  const text = (t.text || '').replace(/https?:\/\/t\.co\/\S+/g, '').trim()
  const uname = u.username || ''
  const source = `https://x.com/${uname || 'i/web'}/status/${t.id}`
  if (seen.has(source) || text.length < 20 || !REL.test(text)) continue
  const { theme, mood, area } = classify(text)
  const pm = t.public_metrics || {}
  existing.push({
    id: 'va' + (++maxId), platform: 'twitter', handle: uname ? '@' + uname : '@nairobi',
    area, role: u.name || (uname ? '@' + uname : 'Nairobi resident'), theme, mood,
    likes: pm.like_count || 0, retweets: pm.retweet_count || 0, views: pm.impression_count || 0,
    timestamp: fmtDate(t.created_at), text, hope: null, source, auto: true,
  })
  seen.add(source); added++
}

writeFileSync(OUT, JSON.stringify(existing, null, 2))
console.log(`Voices generator: +${added} new (total ${existing.length})`)
