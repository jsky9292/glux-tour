require('dotenv').config()
const KEY = process.env.GEMINI_API_KEY
;(async () => {
  const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + KEY + '&pageSize=1000')
  const d = await r.json()
  if (d.error) { console.log('ERR', JSON.stringify(d.error).slice(0, 200)); return }
  const models = d.models || []
  const isImg = m => /image|imagen/i.test(m.name)
  console.log('총 모델:', models.length)
  console.log('\n=== [이미지 생성 모델] (이게 지도용) ===')
  models.filter(isImg).forEach(m => console.log('  ' + m.name.replace('models/', '').padEnd(34), '|', m.displayName || ''))
  console.log('\n=== [텍스트/기타 모델 — 이미지 생성 불가] 이름에 버전만 발췌 ===')
  models.filter(m => !isImg(m)).forEach(m => console.log('  ' + m.name.replace('models/', '').padEnd(34), '|', m.displayName || ''))
})()
