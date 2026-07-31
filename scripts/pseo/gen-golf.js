require('dotenv').config()
const fs = require('fs'), path = require('path'), { execSync } = require('child_process')
const KEY = process.env.GEMINI_API_KEY, MODEL = 'gemini-3-pro-image'
const ROOT = path.join(__dirname, '..', '..', 'public', 'tour', 'img', 'hok')
fs.mkdirSync(ROOT, { recursive: true })
const TMP = path.join(__dirname, '_golftmp'); fs.mkdirSync(TMP, { recursive: true })
const S = ', professional golf course photography, lush green, crisp clear summer day, high quality, cinematic, no text, no watermark, no visible faces'
// [name, prompt, aspect]
const T = [
  ['golf-hero', 'Breathtaking wide panorama of a highland golf course in summer Hokkaido, emerald fairway lined with white birch trees winding toward distant blue mountains and Mount Yotei, deep blue sky with soft clouds, pristine and cool', '16:9'],
  ['golf-green', 'A beautifully manicured putting green on a Hokkaido golf course with a flag pin, smooth rolling fairway behind, bunkers with white sand, green forest and mountains, bright summer morning', '4:3'],
  ['golf-fairway', 'View from the tee box looking down a long fairway of a Hokkaido mountain golf course, lined with tall white birch and pine trees, sunny cool summer, vivid green grass', '4:3'],
  ['golf-play', 'Two golfers seen from behind (no faces) walking with golf bags along a lush green fairway of a Hokkaido highland course, golf cart nearby, mountains in the distance, sunny summer', '4:3'],
  ['golf-club', 'Elegant modern golf resort clubhouse in Hokkaido overlooking a green course in summer, tasteful architecture, blue sky, welcoming premium atmosphere', '4:3'],
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
