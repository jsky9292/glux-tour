/**
 * GLUX 테마 이미지 AI 생성 (Gemini Imagen 4) → 웹 최적화 → public/tour/img 배치
 * 실행: node scripts/pseo/gen-images.js
 * 필요: .env GEMINI_API_KEY, ffmpeg
 */
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const KEY = process.env.GEMINI_API_KEY
const MODEL = 'gemini-3-pro-image'
const ROOT = path.join(__dirname, '..', '..', 'public')
const TMP = path.join(__dirname, '_imgtmp')
fs.mkdirSync(TMP, { recursive: true })

const STYLE = ', professional photography, elegant, high quality, cinematic lighting, no text, no watermark, no people faces'

// out(상대경로), w(가로px), ar(비율), prompt
const T = [
  // 고베 미식 (고베규/철판구이)
  ['tour/img/kobe-food.jpg', 1600, '16:9', 'Premium A5 Kobe wagyu beef steak searing on a teppanyaki iron griddle at an upscale Japanese restaurant, beautiful marbling, warm luxurious lighting, gourmet food photography'],
  ['tour/img/gallery/kobe-food-1.jpg', 900, '4:3', 'Sliced A5 Kobe wagyu beef beautifully plated on an elegant Japanese ceramic dish, fine dining, close-up gourmet food photography'],
  ['tour/img/gallery/kobe-food-2.jpg', 900, '4:3', 'Teppanyaki chef grilling premium wagyu beef on a hot iron plate at a luxury Kobe restaurant, flame, dramatic'],
  ['tour/img/gallery/kobe-food-3.jpg', 900, '4:3', 'Kobe harbor night view with illuminated port tower and ferris wheel reflected on water, romantic cityscape'],
  // 간사이 골프
  ['tour/img/kansai-golf.jpg', 1600, '16:9', 'Beautiful lush green golf course fairway with rolling hills and mountains in the background, sunny clear sky, Japan, premium country club'],
  ['tour/img/gallery/kansai-golf-1.jpg', 900, '4:3', 'Golf ball on the green next to the hole with a golf club, morning dew, close-up'],
  ['tour/img/gallery/kansai-golf-2.jpg', 900, '4:3', 'Scenic golf course fairway lined with pine trees, manicured green, blue sky, Japan'],
  ['tour/img/gallery/kansai-golf-3.jpg', 900, '4:3', 'Golfer teeing off at sunrise on a beautiful mountain golf course, silhouette, dramatic sky'],
  // 오사카 골프
  ['tour/img/osaka-golf.jpg', 1600, '16:9', 'Premium golf course near a city, lush green fairway with skyline in the distance, sunny, Japan'],
  ['tour/img/gallery/osaka-golf-1.jpg', 900, '4:3', 'Golf green with flag and city skyline background, sunny day'],
  ['tour/img/gallery/osaka-golf-2.jpg', 900, '4:3', 'Golf cart on a scenic fairway, green grass, trees'],
  ['tour/img/gallery/osaka-golf-3.jpg', 900, '4:3', 'Close-up of golf clubs and ball on tee, green fairway background'],
  // 홋카이도
  ['tour/img/hokkaido.jpg', 1600, '16:9', 'Vast purple lavender fields at Farm Tomita in Furano Hokkaido in summer, colorful flower rows, mountains and blue sky background, breathtaking scenery'],
  ['tour/img/gallery/hokkaido-1.jpg', 900, '4:3', 'The Blue Pond (Aoiike) of Biei Hokkaido, surreal turquoise blue water with bare tree trunks, ethereal'],
  ['tour/img/gallery/hokkaido-2.jpg', 900, '4:3', 'Otaru canal at dusk with old stone warehouses, vintage gas lamps reflecting on water, romantic Hokkaido'],
  ['tour/img/gallery/hokkaido-3.jpg', 900, '4:3', 'Colorful patchwork flower hills of Biei Hokkaido in summer, rows of vibrant flowers, panoramic'],
  ['tour/img/gallery/hokkaido-4.jpg', 900, '4:3', 'Noboribetsu Jigokudani Hell Valley, volcanic hot spring steam rising from red rocky terrain, Hokkaido onsen'],
  // 교토 료칸 (료칸/가이세키/온천 보강)
  ['tour/img/gallery/kyoto-ryokan-4.jpg', 900, '4:3', 'Traditional Japanese ryokan tatami room with a view of a serene Japanese garden, shoji screens, elegant, Kyoto'],
  ['tour/img/gallery/kyoto-ryokan-5.jpg', 900, '4:3', 'Beautiful kaiseki multi-course Japanese dinner elegantly arranged on lacquerware, fine dining, ryokan'],
  ['tour/img/gallery/kyoto-ryokan-6.jpg', 900, '4:3', 'Private open-air onsen bath (rotenburo) at a luxury Japanese ryokan surrounded by autumn maple trees, steam, tranquil'],
  // 아리마온천 (온천 보강)
  ['tour/img/gallery/arima-onsen-4.jpg', 900, '4:3', 'Traditional Japanese onsen hot spring bath with wooden interior and steam, tranquil, Arima style'],
  ['tour/img/gallery/arima-onsen-5.jpg', 900, '4:3', 'Cozy onsen town street at night with people in yukata strolling, lanterns, nostalgic Japanese atmosphere'],
]

async function gen(prompt, ar) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt + STYLE }] }], generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: ar } } }) })
  const d = await r.json()
  if (d.error) throw new Error(d.error.message)
  const parts = d.candidates?.[0]?.content?.parts || []
  const img = parts.find(p => p.inlineData && p.inlineData.data)
  if (!img) throw new Error('no image: ' + JSON.stringify(d).slice(0, 150))
  return Buffer.from(img.inlineData.data, 'base64')
}

;(async () => {
  let ok = 0
  for (const [out, w, ar, prompt] of T) {
    try {
      const buf = await gen(prompt, ar)
      const tmp = path.join(TMP, 'x.png')
      fs.writeFileSync(tmp, buf)
      const dst = path.join(ROOT, out)
      fs.mkdirSync(path.dirname(dst), { recursive: true })
      execSync(`ffmpeg -y -loglevel error -i "${tmp}" -vf "scale=${w}:-2" -q:v 5 "${dst}"`)
      const kb = Math.round(fs.statSync(dst).size / 1024)
      console.log(`  ✓ ${out} (${kb}KB)`)
      ok++
    } catch (e) { console.log(`  ✗ ${out} — ${e.message}`) }
  }
  console.log(`\n완료: ${ok}/${T.length}`)
})()
