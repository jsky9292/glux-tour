/**
 * 골프 개별 페이지(공개된 /golf/{id}/)의 코스명을 읽어 Google Places 사진을 받아온다.
 * 저장: public/golf/img/{id}.jpg (Google Places Photo, 표시 시 출처 명기)
 * 실행: node scripts/pseo/fetch-golf-photos.js
 */
require('dotenv').config()
const fs = require('fs'), path = require('path')
const KEY = process.env.GOOGLE_PLACES_KEY
const GROOT = path.join(__dirname, '..', '..', 'public', 'golf')
const IMG = path.join(GROOT, 'img')
fs.mkdirSync(IMG, { recursive: true })
const sleep = ms => new Promise(r => setTimeout(r, ms))

function courseDirs() {
  return fs.readdirSync(GROOT, { withFileTypes: true })
    .filter(d => d.isDirectory() && /^\d+$/.test(d.name))
    .map(d => d.name)
}
function nameOf(id) {
  const html = fs.readFileSync(path.join(GROOT, id, 'index.html'), 'utf8')
  const m = html.match(/<h1 class="cname">([^<]+)<\/h1>/)
  const a = html.match(/<div class="caddr">([^<]+)<\/div>/)
  const pref = a ? a[1].split('·')[0].trim() : ''
  return { name: m ? m[1].trim() : '', pref }
}
async function photoName(query) {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': KEY, 'X-Goog-FieldMask': 'places.photos,places.displayName' },
    body: JSON.stringify({ textQuery: query, languageCode: 'ja', regionCode: 'JP', maxResultCount: 1 }),
  })
  const d = await res.json()
  if (d.error) throw new Error(d.error.message)
  const p = (d.places || [])[0]
  return p && p.photos && p.photos[0] ? p.photos[0].name : ''
}
async function download(pname, dst) {
  const url = `https://places.googleapis.com/v1/${pname}/media?maxWidthPx=900&key=${KEY}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('photo ' + res.status)
  const buf = Buffer.from(await res.arrayBuffer())
  fs.writeFileSync(dst, buf)
  return buf.length
}
;(async () => {
  if (!KEY) { console.error('GOOGLE_PLACES_KEY 없음'); process.exit(1) }
  const ids = courseDirs()
  console.log(`대상 골프 페이지: ${ids.length}곳`)
  let ok = 0, miss = 0
  for (const id of ids) {
    const dst = path.join(IMG, id + '.jpg')
    if (fs.existsSync(dst)) { ok++; continue }
    const { name, pref } = nameOf(id)
    if (!name) { miss++; continue }
    try {
      const pn = await photoName(`${name} ${pref} ゴルフ`)
      if (!pn) { console.log(`  - ${name}: 사진 없음`); miss++; await sleep(150); continue }
      const kb = Math.round(await download(pn, dst) / 1024)
      console.log(`  ✓ ${id} ${name} (${kb}KB)`); ok++
    } catch (e) { console.log(`  ✗ ${id} ${name}: ${e.message}`); miss++ }
    await sleep(200)
  }
  console.log(`\n완료: 사진 ${ok}곳 / 실패·없음 ${miss}곳 → public/golf/img/`)
})()
