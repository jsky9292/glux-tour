require('dotenv').config()
const fs = require('fs'), path = require('path'), { execSync } = require('child_process')
const KEY = process.env.GEMINI_API_KEY, MODEL = 'gemini-3-pro-image'
const ROOT = path.join(__dirname, '..', '..', 'public', 'tour', 'img', 'hok')
fs.mkdirSync(ROOT, { recursive: true })
const TMP = path.join(__dirname, '_hoktmp'); fs.mkdirSync(TMP, { recursive: true })
const S = ', professional travel photography, vibrant, high quality, cinematic, no text, no watermark, no people faces'
const T = [
  ['lavender', 'Vast purple lavender fields of Farm Tomita in Furano Hokkaido in bright summer, rainbow rows of colorful flowers, green mountains and blue sky'],
  ['bluepond', 'The mystical Blue Pond (Aoiike) of Biei Hokkaido, surreal vivid turquoise blue water with bare pale tree trunks, ethereal calm'],
  ['sikisai', 'Shikisai-no-Oka colorful flower hills of Biei Hokkaido in summer, rolling rainbow rows of flowers under blue sky, panoramic'],
  ['jigokudani', 'Noboribetsu Jigokudani Hell Valley, dramatic volcanic steam rising from red and grey sulfur rocky terrain, wooden boardwalk, summer green trees'],
  ['toya', 'Lake Toya (Toyako) in Hokkaido with a sightseeing cruise boat on calm deep blue water, forested mountains and Mount Yotei in the distance, summer'],
  ['otaru', 'Otaru canal at golden dusk with historic red-brick stone warehouses and glowing vintage gas lamps reflecting on the water, romantic Hokkaido'],
  ['orgel', 'Interior of Otaru Music Box Museum (Orgel Do) with a large antique steam clock and warm wooden shelves full of glass music boxes, nostalgic cozy lighting'],
  ['golf', 'Beautiful highland golf course in Hokkaido in summer, lush green fairway lined with white birch trees, distant blue mountains, cool clear sunny day'],
]
async function gen(p) {
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: p + S }] }], generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: '4:3' } } })
  })
  const d = await r.json(); if (d.error) throw new Error(d.error.message)
  const img = (d.candidates?.[0]?.content?.parts || []).find(x => x.inlineData && x.inlineData.data)
  if (!img) throw new Error('no image'); return Buffer.from(img.inlineData.data, 'base64')
}
;(async () => {
  let ok = 0
  for (const [name, prompt] of T) {
    try {
      const buf = await gen(prompt); const tmp = path.join(TMP, 'x.png'); fs.writeFileSync(tmp, buf)
      const dst = path.join(ROOT, name + '.jpg')
      execSync(`ffmpeg -y -loglevel error -i "${tmp}" -vf "scale=1000:-2" -q:v 5 "${dst}"`)
      console.log('  ✓ hok/' + name + '.jpg (' + Math.round(fs.statSync(dst).size / 1024) + 'KB)'); ok++
    } catch (e) { console.log('  ✗ ' + name + ' — ' + e.message) }
  }
  console.log('완료: ' + ok + '/' + T.length)
})()
