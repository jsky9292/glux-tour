/**
 * 큐레이션 페이지 상호 연결(related) 자동 설정 — 체류시간·SEO 강화
 * 맛집 → 카페 → 명소 → 호텔/현지가이드로 이어지는 체인 구성
 * 실행: node scripts/pseo/interlink.js
 */
const fs = require('fs')
const path = require('path')
const CUR = path.join(__dirname, 'curation.json')
const cur = JSON.parse(fs.readFileSync(CUR, 'utf8'))
const bySlug = Object.fromEntries(cur.map(p => [p.slug, p]))

// 정보가이드(에디토리얼) 슬러그 → [표시명, 설명]
const guideMeta = {
  'osaka-like-local': ['오사카 현지인처럼', '로컬 하루 루틴'],
  'osaka-local-food': ['오사카 숨은 맛집', '현지인 단골집'],
  'osaka-neighborhoods': ['오사카 골목 동네', '나카자키초·호리에'],
  'osaka-rainy-day': ['비 오는 날 오사카', '실내 코스'],
  'osaka-hotel': ['오사카 호텔', '지역 선택법'],
  'japan-travel-tips': ['간사이 여행 준비물', '교통·유심·앱'],
  'japan-must-buy': ['일본 여행 필수템', '쇼핑 리스트'],
  'kyoto-ryokan-guide': ['교토 료칸', '료칸 가이드'],
  'arima-onsen-guide': ['아리마 온천', '온천 여행'],
  'kobe-beef-guide': ['고베규', '고베규 가이드'],
  'nara-day-trip': ['나라 당일치기', '반나절 코스'],
}
function link(slug) {
  const p = bySlug[slug]
  if (p) return { t: p.kw, d: p.kind === 'spot' ? '가볼만한 곳' : '구글 평점 순위', href: `/guide/${slug}/` }
  if (guideMeta[slug]) return { t: guideMeta[slug][0], d: guideMeta[slug][1], href: `/guide/${slug}/` }
  return null
}
const rel = (...slugs) => slugs.map(link).filter(Boolean)

const osakaFood = ['osaka-yakiniku', 'osaka-ramen', 'osaka-sushi', 'osaka-wagyu', 'osaka-udon', 'osaka-takoyaki', 'osaka-okonomiyaki', 'osaka-izakaya', 'dotonbori-food', 'namba-food', 'shinsaibashi-food', 'umeda-food', 'shinsekai-food', 'tennoji-food', 'kuromon-food', 'kyobashi-food', 'osaka-station-food', 'horie-food', 'tenma-food']
const kyotoFood = ['kyoto-food', 'gion-food', 'arashiyama-food', 'kyoto-nishiki']
const kobeFood = ['kobe-food', 'sannomiya-food', 'nankinmachi-food']
// 같은 리스트에서 자기 다음 n개(순환)
function others(list, self, n) {
  const i = list.indexOf(self); const out = []
  for (let k = 1; out.length < n && k < list.length; k++) out.push(list[(i + k) % list.length])
  return out
}

let n = 0
for (const p of cur) {
  const s = p.slug; let r = []
  if (osakaFood.includes(s)) r = rel(...others(osakaFood, s, 2), 'osaka-cafe', 'osaka-spots', 'osaka-like-local', 'osaka-hotel')
  else if (s === 'osaka-cafe') r = rel(osakaFood[0], osakaFood[1], 'osaka-spots', 'osaka-neighborhoods', 'osaka-like-local', 'osaka-hotel')
  else if (s === 'osaka-onsen') r = rel('arima-onsen-guide', 'osaka-spots', osakaFood[0], 'osaka-like-local', 'osaka-hotel')
  else if (s === 'osaka-spots') r = rel('osaka-like-local', osakaFood[0], osakaFood[1], 'osaka-cafe', 'osaka-hotel', 'osaka-rainy-day')
  else if (kyotoFood.includes(s)) r = rel(...others(kyotoFood, s, 2), 'kyoto-cafe', 'kyoto-spots', 'kyoto-ryokan-guide', 'kyoto-temple')
  else if (s === 'kyoto-cafe') r = rel(kyotoFood[0], kyotoFood[1], 'kyoto-spots', 'kyoto-temple', 'kyoto-ryokan-guide')
  else if (s === 'kyoto-spots' || s === 'kyoto-temple') r = rel(s === 'kyoto-spots' ? 'kyoto-temple' : 'kyoto-spots', kyotoFood[0], kyotoFood[1], 'kyoto-cafe', 'kyoto-ryokan-guide')
  else if (kobeFood.includes(s)) r = rel(...others(kobeFood, s, 2), 'kobe-sweets', 'kobe-spots', 'kobe-beef-guide')
  else if (s === 'kobe-sweets') r = rel(kobeFood[0], kobeFood[1], 'kobe-spots', 'kobe-beef-guide')
  else if (s === 'kobe-spots') r = rel(kobeFood[0], kobeFood[1], 'kobe-sweets', 'kobe-beef-guide', 'nara-spots')
  else if (s === 'nara-food') r = rel('nara-spots', 'nara-day-trip', osakaFood[0], 'kyoto-spots')
  else if (s === 'nara-spots') r = rel('nara-food', 'nara-day-trip', 'osaka-spots', 'kyoto-spots')
  if (r.length) { p.related = r; n++ }
}
fs.writeFileSync(CUR, JSON.stringify(cur, null, 2) + '\n', 'utf8')
console.log(`상호연결(related) 설정: ${n}개 페이지`)
