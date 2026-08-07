/**
 * Google Places(New)로 카테고리별 맛집·온천을 구글 평점순으로 수집 → curation.json 갱신
 * 실행: node scripts/pseo/collect-places.js
 * 필요: .env GOOGLE_PLACES_KEY (Places API New, 애플리케이션 제한 '없음')
 * 정직성: 실제 구글 평점만 사용, 표시 시 출처(Google) 명기. 원본 리뷰문 재게시 안 함.
 */
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const KEY = process.env.GOOGLE_PLACES_KEY
const GKEY = process.env.GEMINI_API_KEY
const CURATION = path.join(__dirname, 'curation.json')
const PRICE = { PRICE_LEVEL_INEXPENSIVE: '₩ 저렴', PRICE_LEVEL_MODERATE: '₩₩ 보통', PRICE_LEVEL_EXPENSIVE: '₩₩₩ 고급', PRICE_LEVEL_VERY_EXPENSIVE: '₩₩₩₩ 최고급' }

// 한 카테고리(약 10곳)의 리뷰·요약을 근거로 Gemini가 가게별 소개를 한 번에 작성 → 배열 반환
async function geminiDescs(items, noun) {
  const fallback = items.map(it => descOf(it, noun))
  if (!GKEY) return fallback
  const list = items.map((it, i) => {
    const rev = (it.reviews || []).slice(0, 3).map(r => (r || '').replace(/\s+/g, ' ').slice(0, 140)).join(' || ')
    return `${i + 1}) ${it.name} | 지역:${it.area} | 요약:${it.editorial || '없음'} | 리뷰: ${rev || '없음'}`
  }).join('\n')
  const prompt = `너는 한국인 여행객을 위한 일본 ${noun} 큐레이터다. 아래 각 가게를 '구글 리뷰·요약'에 근거해 2~3문장 한국어 소개로 써라.
규칙:
- 리뷰에서 실제 언급된 대표 메뉴·강점·분위기를 구체적으로 반영(뚜렷한 단점이 반복되면 균형있게 한마디). 리뷰에 없는 사실은 지어내지 말 것.
- 평점 숫자는 반복하지 말 것. 자연스러운 구어체.
- 순수 정보만 쓸 것. 예약 대행·통역·GLUX 언급·홍보 문구는 절대 넣지 말 것.
- 출력은 JSON 배열만: [{"i":1,"desc":"..."}]
가게:
${list}`
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GKEY}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7 } })
    })
    const d = await r.json()
    let t = d?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    t = t.replace(/```json|```/g, '').trim()
    const arr = JSON.parse(t)
    const out = fallback.slice()
    for (const o of arr) if (o && o.i >= 1 && o.i <= items.length && o.desc) out[o.i - 1] = String(o.desc).trim()
    return out
  } catch (e) { console.log('   (gemini 실패 → 기본 문구): ' + e.message); return fallback }
}
const IMGDIR = path.join(__dirname, '..', '..', 'public', 'guide', 'img')
fs.mkdirSync(IMGDIR, { recursive: true })
const sleep = ms => new Promise(r => setTimeout(r, ms))

// 관광·할랄 특화/체험형 제외(로컬 위주 재정렬) — 이름에 포함되면 제외
const EXCLUDE = ['halal', 'muslim', 'vegan', 'vegetarian', 'gluten', 'kosher', 'experience', 'making', 'cooking class', 'テマキ', 'ハラル', 'observation', '전망대', 'harukas 300', '300 observatory', 'maid', '메이드', '메이드리밍', 'maidreamin', 'cosplay', 'concept cafe', '메이드카페',
  'micropig', 'micro pig', 'pig cafe', '돼지카페', '미피그', 'animal cafe', 'cat cafe', '고양이카페', 'hedgehog', 'owl cafe', 'うさぎ', 'ふくろう', '동물카페']

async function dlPhoto(pname, dst) {
  const res = await fetch(`https://places.googleapis.com/v1/${pname}/media?maxWidthPx=800&key=${KEY}`)
  if (!res.ok) throw new Error('photo ' + res.status)
  fs.writeFileSync(dst, Buffer.from(await res.arrayBuffer()))
}

// slug → 수집 조건. noun=설명용 명사, min=최소 리뷰수, take=노출 개수
const Q = {
  'osaka-yakiniku': { query: 'yakiniku restaurant Osaka', noun: '야끼니꾸(불고기) 맛집', min: 500, take: 10 },
  'osaka-ramen': { query: 'ramen Osaka', noun: '라멘 맛집', min: 500, take: 10 },
  'osaka-sushi': { query: 'sushi restaurant Osaka', noun: '스시(초밥) 맛집', min: 200, take: 10 },
  'osaka-wagyu': { query: 'wagyu steak Osaka', noun: '와규 스테이크 맛집', min: 200, take: 10 },
  'dotonbori-food': { query: 'best restaurant Dotonbori Osaka', noun: '도톤보리 맛집', min: 500, take: 10 },
  'osaka-onsen': { query: 'onsen spa Osaka', noun: '온천·스파', min: 1000, take: 10 },
  'namba-food': { query: 'best restaurant Namba Osaka', noun: '난바 맛집', min: 500, take: 10 },
  'shinsaibashi-food': { query: 'best restaurant Shinsaibashi Osaka', noun: '신사이바시 맛집', min: 300, take: 10 },
  'umeda-food': { query: 'best restaurant Umeda Osaka', noun: '우메다 맛집', min: 500, take: 10 },
  'shinsekai-food': { query: 'kushikatsu restaurant Shinsekai Osaka', noun: '신세카이 맛집', min: 300, take: 10 },
  'tennoji-food': { query: 'restaurant Tennoji Osaka', noun: '텐노지 맛집', min: 100, take: 10 },
  'kuromon-food': { query: 'restaurant Kuromon Market Osaka', noun: '맛집', min: 200, take: 10 },
  'kyobashi-food': { query: 'restaurant Kyobashi Osaka', noun: '맛집', min: 100, take: 10 },
  'osaka-station-food': { query: 'best restaurant Osaka Station', noun: '맛집', min: 300, take: 10 },
  'kyoto-food': { query: 'best restaurant Kyoto', noun: '맛집', min: 500, take: 10 },
  'kobe-food': { query: 'best restaurant Kobe', noun: '맛집', min: 500, take: 10 },
  'nara-food': { query: 'best restaurant Nara', noun: '맛집', min: 200, take: 10 },
  'osaka-izakaya': { query: 'izakaya Osaka', noun: '이자카야', min: 300, take: 10 },
  'osaka-cafe': { query: 'cafe Osaka', noun: '카페', min: 500, take: 10 },
  'osaka-udon': { query: 'udon Osaka', noun: '우동', min: 200, take: 10 },
  'osaka-takoyaki': { query: 'takoyaki Osaka', noun: '타코야키', min: 300, take: 10 },
  'osaka-okonomiyaki': { query: 'okonomiyaki Osaka', noun: '오코노미야키', min: 300, take: 10 },
  'horie-food': { query: 'restaurant cafe Horie Osaka', noun: '맛집', min: 200, take: 10 },
  'tenma-food': { query: 'izakaya restaurant Tenma Osaka', noun: '맛집', min: 200, take: 10 },
  'gion-food': { query: 'restaurant Gion Kyoto', noun: '맛집', min: 300, take: 10 },
  'arashiyama-food': { query: 'restaurant soba tofu Arashiyama Kyoto', noun: '맛집', min: 80, take: 10 },
  'kyoto-nishiki': { query: 'Nishiki Market Kyoto food', noun: '맛집', min: 200, take: 10 },
  'kyoto-cafe': { query: 'cafe Kyoto', noun: '카페', min: 500, take: 10 },
  'sannomiya-food': { query: 'restaurant Sannomiya Kobe', noun: '맛집', min: 300, take: 10 },
  'nankinmachi-food': { query: 'Nankinmachi Chinatown Kobe restaurant', noun: '맛집', min: 150, take: 10 },
  'kobe-sweets': { query: 'sweets patisserie cake Kobe', noun: '디저트', min: 100, take: 10 },
}

const AREAS = [
  ['난바', ['난바', '難波', 'Namba']], ['도톤보리', ['도톤보리', '道頓堀', 'Dotonbori']],
  ['신사이바시', ['신사이바시', '心斎橋', 'Shinsaibashi']], ['우메다', ['우메다', '梅田', 'Umeda']],
  ['닛폰바시', ['닛폰바시', '日本橋', 'Nipponbashi']], ['텐노지', ['텐노지', '天王寺', 'Tennoji']],
  ['신세카이', ['신세카이', '新世界', 'Shinsekai']], ['츠루하시', ['츠루하시', '鶴橋', 'Tsuruhashi']],
  ['교바시', ['교바시', '京橋', 'Kyobashi']], ['키타신치', ['키타신치', '北新地', 'Kitashinchi']],
  ['우메다', ['우메다', '梅田', 'Umeda']], ['교토', ['교토', '京都', 'Kyoto']], ['고베', ['고베', '神戸', 'Kobe']],
  ['나라', ['나라', '奈良', 'Nara']], ['산노미야', ['산노미야', '三宮', 'Sannomiya']], ['기온', ['기온', '祇園', 'Gion']],
  ['호리에', ['호리에', '堀江', 'Horie']], ['텐마', ['텐마', '天満', 'Tenma']], ['니시키', ['니시키', '錦', 'Nishiki']],
  ['아라시야마', ['아라시야마', '嵐山', 'Arashiyama']], ['난킨마치', ['난킨마치', '南京町', 'Nankinmachi', 'Chinatown']], ['기타노', ['기타노', '北野', 'Kitano']],
]
function areaOf(addr) {
  const a = addr || ''
  for (const [ko, keys] of AREAS) if (keys.some(k => a.includes(k))) return ko
  return '오사카'
}

// 브랜드 식별키: 지역·업종·수식어를 걷어내고 남는 첫 고유 단어(분점 중복 제거용)
const STOP = new Set(['osaka', 'halal', 'wagyu', 'beef', 'kobe', 'ramen', 'yakiniku', 'sushi', 'steak', 'restaurant', 'main', 'store', 'branch', 'honten', 'the', 'and', 'vegan', 'gluten', 'free', 'dotonbori', 'namba', 'shinsaibashi', 'umeda', 'osakananba', 'premium', '본점', '분점', '점', '오사카', '난바', '도톤보리', '신사이바시', '우메다', '맛집', '야끼니꾸', '야키니쿠', '라멘', '스시', '와규', '온천', '스테이크'])
function brandKey(name) {
  const toks = String(name).toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(t => t.length >= 3 && !STOP.has(t))
  return toks[0] || String(name).toLowerCase().slice(0, 6)
}

async function search(query) {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': KEY,
      'X-Goog-FieldMask': 'places.displayName,places.rating,places.userRatingCount,places.formattedAddress,places.googleMapsUri,places.photos,places.editorialSummary,places.reviews,places.priceLevel',
    },
    body: JSON.stringify({ textQuery: query, languageCode: 'ko', regionCode: 'JP', maxResultCount: 20 }),
  })
  const d = await res.json()
  if (d.error) throw new Error(d.error.message)
  return d.places || []
}

function descOf(p, noun) {
  const area = p.area && p.area !== '오사카' ? `${p.area}의 ` : ''
  const love = p.count >= 3000 ? '현지에서 오래도록 사랑받는' : '꾸준히 높은 평가를 받는'
  return `${area}인기 ${noun}입니다. 구글 평점 ${p.rating}점(리뷰 ${Number(p.count).toLocaleString()}개)으로 ${love} 곳입니다.`
}

;(async () => {
  if (!KEY) { console.error('GOOGLE_PLACES_KEY 없음'); process.exit(1) }
  const pages = JSON.parse(fs.readFileSync(CURATION, 'utf8'))
  const bySlug = Object.fromEntries(pages.map(p => [p.slug, p]))
  for (const [slug, cfg] of Object.entries(Q)) {
    const page = bySlug[slug]
    if (!page) { console.log(`  ! ${slug} 페이지 없음 — 건너뜀`); continue }
    let places
    try { places = await search(cfg.query) } catch (e) { console.log(`  ✗ ${slug}: ${e.message}`); continue }
    const C = 4.2, M = 1000 // 종합점수: (v*R + M*C)/(v+M) — 리뷰 많은 고평점을 상위로
    const brandSeen = new Set()
    const items = places
      .filter(p => p.rating && (p.userRatingCount || 0) >= cfg.min)
      .map(p => {
        const name = (p.displayName && p.displayName.text) || ''
        const v = p.userRatingCount || 0
        return { name, rating: p.rating, count: v, area: areaOf(p.formattedAddress), maps: p.googleMapsUri || '', photoRef: (p.photos && p.photos[0]) ? p.photos[0].name : '', editorial: (p.editorialSummary && p.editorialSummary.text) || '', price: PRICE[p.priceLevel] || '', reviews: (p.reviews || []).map(rv => rv.text && rv.text.text).filter(Boolean), score: (v * p.rating + M * C) / (v + M), brand: brandKey(name) }
      })
      .filter(p => p.name && !EXCLUDE.some(k => p.name.toLowerCase().includes(k))) // 관광·할랄 특화 제외
      .sort((a, b) => b.score - a.score)
      .filter(p => !brandSeen.has(p.brand) && brandSeen.add(p.brand)) // 같은 브랜드 분점 1곳만
      .slice(0, cfg.take)
    if (!items.length) { console.log(`  ! ${slug}: 조건(리뷰 ${cfg.min}+) 충족 결과 없음`); continue }
    const descs = await geminiDescs(items, cfg.noun)   // 리뷰 분석 기반 소개
    for (let i = 0; i < items.length; i++) {
      const it = items[i]
      it.desc = descs[i] || descOf(it, cfg.noun)
      if (it.photoRef) {
        const dst = path.join(IMGDIR, `${slug}-${i + 1}.jpg`)
        if (fs.existsSync(dst)) { it.photo = `/guide/img/${slug}-${i + 1}.jpg` }
        else { try { await dlPhoto(it.photoRef, dst); it.photo = `/guide/img/${slug}-${i + 1}.jpg`; await sleep(120) } catch (e) {} }
      }
      delete it.photoRef; delete it.score; delete it.brand; delete it.reviews
    }
    page.items = items
    const n = items.length
    page.h1 = `${page.kw} 구글 평점 순위 TOP ${n}`
    page.listTitle = `구글 평점 순위 TOP ${n}`
    page.listLead = `구글 지도 평점과 리뷰 수를 함께 반영한 순위예요. (출처: Google)`
    page.title = `${page.kw} 순위 TOP ${n} | 구글 평점 기준 추천 — GLUX`
    console.log(`  ✓ ${slug}: ${n}곳 (1위 ${items[0].name} ${items[0].rating}★/${items[0].count})`)
  }
  fs.writeFileSync(CURATION, JSON.stringify(pages, null, 2) + '\n', 'utf8')
  console.log('\ncuration.json 갱신 완료')
})()
