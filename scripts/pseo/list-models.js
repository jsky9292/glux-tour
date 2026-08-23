require('dotenv').config()
const KEY = process.env.GEMINI_API_KEY
;(async () => {
  const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + KEY + '&pageSize=1000')
  const d = await r.json()
  if (d.error) { console.log('ERR', JSON.stringify(d.error).slice(0, 200)); return }
  const models = d.models || []
  console.log('총 모델:', models.length)
  console.log('=== 이미지 관련 모델 ===')
  models.filter(m => /image|imagen|nano|3-pro/i.test(m.name)).forEach(m => {
    console.log(m.name.replace('models/', ''), '|', m.displayName || '', '|', (m.supportedGenerationMethods || []).join(','))
  })
})()
