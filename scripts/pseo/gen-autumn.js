require('dotenv').config()
const fs = require('fs'), path = require('path'), { execSync } = require('child_process')
const KEY = process.env.GEMINI_API_KEY, MODEL = 'gemini-3-pro-image'
const ROOT = path.join(__dirname, '..', '..', 'public', 'tour', 'img', 'autumn')
fs.mkdirSync(ROOT, { recursive: true })
const TMP = path.join(__dirname, '_autmp'); fs.mkdirSync(TMP, { recursive: true })
const S = ', professional travel photography, vivid autumn colors, cinematic, high quality, no text, no watermark, no visible faces'
const T = [
  ['hero', 'Breathtaking autumn foliage in Kyoto Arashiyama, brilliant red and orange maple trees along a river with a traditional temple, golden late afternoon light, serene', '16:9'],
  ['golf', 'A beautiful highland golf course in Japan in autumn, emerald fairway framed by vivid red and gold maple trees, clear cool blue sky, distant mountains', '4:3'],
  ['private', 'An elegant private tour scene in Kyoto in autumn, a luxury car parked by a temple gate surrounded by red maple leaves, refined and calm atmosphere', '4:3'],
  ['family', 'A warm family travel scene at Nara park in autumn, deer among golden ginkgo and red maple trees, gentle sunlight, cozy and inviting', '4:3'],
  ['onsen', 'A traditional Japanese onsen ryokan with an outdoor bath surrounded by brilliant autumn maple foliage, steam rising, tranquil evening', '4:3'],
]
async function gen(p, ar) {
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: p + S }] }], generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: ar } } })
  })
  const d = await r.json(); if (d.error) throw new Error(d.error.message)
  const img = (d.candidates?.[0]?.content?.parts || []).find(x => x.inlineData && x.inlineData.data)
  if (!img) throw new Error('no image'); return Buffer.from(img.inlineData.data, 'base64')
}
;(async () => {
  let ok = 0
  for (const [name, prompt, ar] of T) {
    try {
      const buf = await gen(prompt, ar); const tmp = path.join(TMP, 'x.png'); fs.writeFileSync(tmp, buf)
      const w = ar === '16:9' ? 1280 : 1000
      const dst = path.join(ROOT, name + '.jpg')
      execSync(`ffmpeg -y -loglevel error -i "${tmp}" -vf "scale=${w}:-2" -q:v 5 "${dst}"`)
      console.log('  ok ' + name + '.jpg (' + Math.round(fs.statSync(dst).size / 1024) + 'KB)'); ok++
    } catch (e) { console.log('  x ' + name + ' - ' + e.message) }
  }
  console.log('done: ' + ok + '/' + T.length)
})()
