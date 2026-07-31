/**
 * GLUX 정보 아티클 AI 생성기 (Gemini) — AEO 최적화 + 지역/스팟
 * 주제 → Gemini가 SEO/AEO 정보글 작성 → scripts/pseo/guides/{slug}.json
 * 실행: node scripts/pseo/ai-generate.js            (전체)
 *       node scripts/pseo/ai-generate.js <slug>     (특정)
 *       node scripts/pseo/ai-generate.js --spots    (스팟만)
 *       node scripts/pseo/ai-generate.js --new      (아직 없는 것만)
 */
require('dotenv').config()
const fs = require('fs')
const path = require('path')

const KEY = process.env.GEMINI_API_KEY
const MODEL = 'gemini-2.5-flash'
const OUT = path.join(__dirname, 'guides')
fs.mkdirSync(OUT, { recursive: true })

const BRAND = `GLUX Tour는 일본 현지생활 30년 + 가이드 경력 10년의 베테랑이 직접 운영하는 오사카·간사이 현지 직영 여행사다. 관광객·대행사는 모르는 "알려지지 않은 진짜 일본"(현지인만 아는 골목·명소·맛집·코스)을 보여준다. 대행사 마진 0, 한국어 완벽, 전용차량 공항 픽업~출국까지 올인원.`

// 지역 가이드 6 + 스팟 14 (place = 구글 지도 연동용 장소명)
const OSAKA = '/tour/osaka-family/', KYOTO = '/tour/kyoto-ryokan/', NARA = '/tour/nara-family/', KOBE = '/tour/kobe-food/'
const TOPICS = [
  { slug: 'osaka-family-3d4n-course', kw: '오사카 가족여행 코스', related: OSAKA, place: 'Osaka', hint: '오사카 3박4일 가족여행 추천 코스(도톤보리·유니버설·구로몬·교토/나라 연계) 일차별 상세', spot: false },
  { slug: 'kansai-golf-course-guide', kw: '간사이 골프장 추천', related: '/tour/kansai-golf/', place: 'Kansai, Japan', hint: '간사이(오사카·고베·시가·와카야마) 명문 골프장 유형별 추천과 고르는 법, 시즌·예약 팁', spot: false },
  { slug: 'arima-onsen-guide', kw: '아리마온천 여행 가이드', related: '/tour/arima-onsen/', place: 'Arima Onsen, Kobe', hint: '아리마온천 완벽 가이드(금탕·은탕, 료칸, 가는 법, 고베 연계, 계절)', spot: false },
  { slug: 'kyoto-ryokan-guide', kw: '교토 료칸 추천', related: KYOTO, place: 'Kyoto', hint: '교토 온천 료칸 고르는 법·예약 팁·지역(아라시야마 등)·가이세키·기모노 체험', spot: false },
  { slug: 'kobe-beef-guide', kw: '고베 와규 맛집', related: KOBE, place: 'Kobe', hint: '고베규(A5) 제대로 즐기는 법·철판구이·예약 팁·하버랜드 야경 연계', spot: false },
  { slug: 'nara-day-trip', kw: '나라 당일치기 코스', related: NARA, place: 'Nara', hint: '오사카/교토에서 나라 당일치기 코스(사슴공원·도다이지·나라마치), 사슴 먹이 팁', spot: false },
  // 오사카 스팟
  { slug: 'dotonbori', kw: '도톤보리', related: OSAKA, place: 'Dotonbori, Osaka', hint: '오사카 도톤보리 완벽 가이드 — 글리코 사인, 먹거리(타코야키·오코노미야키), 현지인 맛집, 즐기는 법', spot: true },
  { slug: 'kuromon-market', kw: '쿠로몬시장', related: OSAKA, place: 'Kuromon Ichiba Market, Osaka', hint: '오사카 구로몬시장 — 해산물·과일·먹거리, 방문 팁, 영업시간', spot: true },
  { slug: 'universal-studios-japan', kw: '유니버설 스튜디오 재팬', related: OSAKA, place: 'Universal Studios Japan', hint: 'USJ 오사카 — 슈퍼 닌텐도 월드, 익스프레스 패스, 동선·대기 줄이는 팁, 가족 코스', spot: true },
  { slug: 'shinsekai', kw: '신세카이', related: OSAKA, place: 'Shinsekai, Osaka', hint: '오사카 신세카이 — 츠텐카쿠, 쿠시카츠 골목, 레트로 분위기, 즐기는 법', spot: true },
  // 교토 스팟
  { slug: 'fushimi-inari', kw: '후시미이나리 신사', related: KYOTO, place: 'Fushimi Inari Taisha, Kyoto', hint: '교토 후시미이나리 천 개의 붉은 도리이, 등산 코스, 붐비지 않게 가는 시간, 팁', spot: true },
  { slug: 'arashiyama', kw: '아라시야마', related: KYOTO, place: 'Arashiyama, Kyoto', hint: '교토 아라시야마 — 대나무숲, 도게츠교, 사가노 트롯코, 계절 절경, 코스', spot: true },
  { slug: 'gion', kw: '기온 거리', related: KYOTO, place: 'Gion, Kyoto', hint: '교토 기온 — 게이샤 거리, 하나미코지, 기모노 산책, 저녁 분위기, 매너', spot: true },
  { slug: 'kinkakuji', kw: '금각사', related: KYOTO, place: 'Kinkaku-ji, Kyoto', hint: '교토 금각사(킨카쿠지) — 황금 누각, 관람 코스, 계절별 풍경, 팁', spot: true },
  // 나라 스팟
  { slug: 'nara-park', kw: '나라 사슴공원', related: NARA, place: 'Nara Park', hint: '나라공원 사슴 먹이주기 완전정복 — 사슴센베이, 안전 팁, 인사하는 사슴, 포토스팟', spot: true },
  { slug: 'todaiji', kw: '도다이지', related: NARA, place: 'Todai-ji, Nara', hint: '나라 도다이지 대불(다이부츠), 세계 최대 목조건축, 관람 코스, 팁', spot: true },
  { slug: 'naramachi', kw: '나라마치', related: NARA, place: 'Naramachi, Nara', hint: '나라마치 옛 거리 — 전통가옥, 카페·공예, 산책 코스, 현지 분위기', spot: true },
  { slug: 'isuien', kw: '이스이엔 정원', related: NARA, place: 'Isuien Garden, Nara', hint: '나라 이스이엔 일본 정원 — 차경 정원, 계절 풍경, 조용한 명소, 관람 팁', spot: true },
  // 고베 스팟
  { slug: 'harborland', kw: '고베 하버랜드', related: KOBE, place: 'Kobe Harborland', hint: '고베 하버랜드·모자이크 항구 야경, 관람차, 데이트·가족 코스, 포토스팟', spot: true },
  { slug: 'rokko', kw: '롯코산', related: KOBE, place: 'Mount Rokko, Kobe', hint: '고베 롯코산 1000만불 야경, 가는 법(케이블카), 마야산 연계, 계절 팁', spot: true }
]

function prompt(t) {
  const kind = t.spot ? '특정 명소(스팟) 소개' : '여행 주제 가이드'
  return `너는 간사이 여행 전문 매거진 에디터다. 한국인 여행자를 위한 SEO·AEO 최적화 ${kind} 아티클을 쓴다.

[브랜드] ${BRAND}
[주제] ${t.kw} — ${t.hint}

[작성 원칙]
- **AEO(답변엔진 최적화)**: 결론을 먼저 제시. summary와 도입부는 "이 장소/주제가 무엇이고 왜 가는지"를 첫 문장에서 바로 답한다. keyFacts는 검색/AI가 뽑아가기 쉬운 짧고 명확한 사실.
- 정보성·신뢰가 핵심. 구체적 지명·명소·음식·교통 이름을 정확히. 과장/허위/가격확정 금지.
- 제목·소제목(H2)에 핵심 키워드와 롱테일을 자연스럽게. 소제목은 질문형/정보형으로.
- 브랜드 앵글(현지 30년 베테랑, 관광객 모르는 진짜 일본)을 은근히 녹이고, 마지막은 GLUX 상담으로 부드럽게 유도.
- 분량: 섹션 5~7개, 각 2~3문단. 실질 정보가 가득해야 함.

[출력] 아래 JSON 스키마로만 응답(코드펜스·설명 없이 순수 JSON):
{
  "title": "55자 내외, 키워드 포함, 클릭 유도",
  "description": "150자 내외 메타설명",
  "summary": "1~2문장. 핵심 결론(직접 답변). AI 스니펫·음성검색용",
  "keyFacts": ["핵심 사실 4~5개(각 한 줄, 위치/특징/소요시간/팁 등 명확하게)"],
  "intro": "2~3문장 도입(결론 먼저)",
  "sections": [ { "h2": "소제목", "body": ["문단1","문단2"], "list": ["선택: 항목들"] } ],
  "tips": ["실전 팁 3~5개"],
  "faq": [ { "q": "질문(검색되는 형태)", "a": "간결·정확한 답변" } ]
}
body/tips/faq/keyFacts 안에서 <b>강조</b> 태그 사용 가능. list는 해당 섹션에만.`
}

async function gen(t) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`
  const res = await fetch(url, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt(t) }] }], generationConfig: { temperature: 0.8, maxOutputTokens: 8192, responseMimeType: 'application/json' } })
  })
  const d = await res.json()
  if (d.error) throw new Error(d.error.message)
  const txt = d.candidates?.[0]?.content?.parts?.[0]?.text
  if (!txt) throw new Error('빈 응답')
  let obj
  try { obj = JSON.parse(txt) } catch { obj = JSON.parse(txt.replace(/^```json\s*|\s*```$/g, '')) }
  obj.slug = t.slug; obj.kw = t.kw; obj.related = t.related; obj.place = t.place; obj.spot = !!t.spot
  return obj
}

;(async () => {
  const arg = process.argv[2]
  let list = TOPICS
  if (arg === '--spots') list = TOPICS.filter(t => t.spot)
  else if (arg === '--new') list = TOPICS.filter(t => !fs.existsSync(path.join(OUT, t.slug + '.json')))
  else if (arg && !arg.startsWith('--')) list = TOPICS.filter(t => t.slug === arg)
  console.log(`생성 대상: ${list.length}개`)
  for (const t of list) {
    try {
      const a = await gen(t)
      fs.writeFileSync(path.join(OUT, t.slug + '.json'), JSON.stringify(a, null, 2))
      console.log(`  ✓ ${t.slug}`)
    } catch (e) { console.log(`  ✗ ${t.slug} — ${e.message}`) }
  }
  console.log('완료')
})()
