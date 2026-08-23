/**
 * 제미나이 나노바나나(이미지) API로 일러스트 지도 생성
 * 사용: node scripts/pseo/gen-map.js <프롬프트파일> <출력png>
 * 필요: .env GEMINI_API_KEY
 */
require('dotenv').config()
const fs = require('fs')
const KEY = process.env.GEMINI_API_KEY
const promptFile = process.argv[2]
const outFile = process.argv[3]
const forceModel = process.argv[4] // 선택: 특정 모델 강제
const MODELS = forceModel ? [forceModel] : [
  'gemini-3.1-flash-image',    // Nano Banana 2 (기본 — 아기자기·디테일, 한글 정확)
  'gemini-3-pro-image',        // Nano Banana Pro (폴백)
  'gemini-2.5-flash-image',    // 폴백2
]
;(async () => {
  if (!KEY) { console.error('GEMINI_API_KEY 없음'); process.exit(1) }
  const prompt = fs.readFileSync(promptFile, 'utf8')
  for (const model of MODELS) {
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${KEY}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseModalities: ['Text', 'Image'] } })
      })
      const d = await r.json()
      if (d.error) { console.log(`  [${model}] ${d.error.status || ''} ${String(d.error.message).slice(0, 80)}`); continue }
      const parts = d?.candidates?.[0]?.content?.parts || []
      const img = parts.find(p => p.inlineData || p.inline_data)
      if (!img) { console.log(`  [${model}] 이미지 없음`); continue }
      const b64 = (img.inlineData || img.inline_data).data
      fs.writeFileSync(outFile, Buffer.from(b64, 'base64'))
      console.log(`OK [${model}] → ${outFile} (${fs.statSync(outFile).size} bytes)`)
      return
    } catch (e) { console.log(`  [${model}] 예외 ${e.message}`) }
  }
  console.error('모든 모델 실패')
  process.exit(1)
})()
