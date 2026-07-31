/**
 * GLUX 정보 아티클 AI 생성기 (Gemini)
 * 주제 목록 → Gemini가 SEO 정보글 작성 → scripts/pseo/guides/{slug}.json 저장
 * 실행: node scripts/pseo/ai-generate.js            (전체 TOPICS)
 *       node scripts/pseo/ai-generate.js <slug>     (특정 주제만 - 테스트)
 * 필요: .env 의 GEMINI_API_KEY
 */
require('dotenv').config()
const fs = require('fs')
const path = require('path')

const KEY = process.env.GEMINI_API_KEY
const MODEL = 'gemini-2.5-flash'
const OUT = path.join(__dirname, 'guides')
fs.mkdirSync(OUT, { recursive: true })

// 브랜드 앵글 (모든 글에 주입)
const BRAND = `GLUX Tour는 일본 현지생활 30년 + 가이드 경력 10년의 베테랑이 직접 운영하는 오사카·간사이 현지 직영 여행사다. 관광객·대행사는 모르는 "알려지지 않은 진짜 일본"(현지인만 아는 골목·명소·맛집·코스)을 보여준다. 대행사 마진 0(현지 가격 그대로), 한국어 완벽, 전용차량 공항 픽업~출국까지 올인원.`

// 생성할 정보 아티클 주제 (SEO 유입용) + 연결 랜딩
const TOPICS = [
  { slug: 'osaka-family-3d4n-course', kw: '오사카 가족여행 코스', related: '/tour/osaka-family/', hint: '오사카 3박4일 가족여행 추천 코스(도톤보리·유니버설·구로몬·교토/나라 연계) 일차별 상세' },
  { slug: 'kansai-golf-course-guide', kw: '간사이 골프장 추천', related: '/tour/kansai-golf/', hint: '간사이(오사카·고베·시가·와카야마) 명문 골프장 유형별 추천과 고르는 법, 시즌·예약 팁' },
  { slug: 'arima-onsen-guide', kw: '아리마온천 여행 가이드', related: '/tour/arima-onsen/', hint: '아리마온천 완벽 가이드(금탕·은탕, 료칸, 가는 법, 고베 연계, 계절)' },
  { slug: 'kyoto-ryokan-guide', kw: '교토 료칸 추천', related: '/tour/kyoto-ryokan/', hint: '교토 온천 료칸 고르는 법·예약 팁·지역(아라시야마 등)·가이세키·기모노 체험' },
  { slug: 'kobe-beef-guide', kw: '고베 와규 맛집', related: '/tour/kobe-food/', hint: '고베규(A5) 제대로 즐기는 법·철판구이·예약 팁·하버랜드 야경 연계' },
  { slug: 'nara-day-trip', kw: '나라 당일치기 코스', related: '/tour/nara-family/', hint: '오사카/교토에서 나라 당일치기 코스(사슴공원·도다이지·나라마치), 사슴 먹이 팁' }
]

function buildPrompt(t) {
  return `너는 간사이 여행 전문 매거진 에디터다. 아래 주제로 한국인 여행자를 위한 SEO 최적화 정보 아티클을 쓴다.

[브랜드] ${BRAND}
[주제] ${t.kw} — ${t.hint}

[작성 원칙]
- 정보성·신뢰가 핵심. 구체적 지명·명소·음식 이름을 정확히. 과장/허위/가격확정 금지.
- 검색 유입용: 제목과 소제목(H2)에 핵심 키워드와 롱테일을 자연스럽게.
- 글 곳곳에 브랜드 앵글(현지 30년 베테랑, 관광객 모르는 진짜 일본)을 은근히 녹여라(광고 티는 최소).
- 마지막은 GLUX 상담으로 부드럽게 유도.
- 분량: 본문 섹션 5~7개, 각 2~4문단. 실질 정보가 가득해야 함.

[출력] 아래 JSON 스키마로만 응답(코드펜스·설명 없이 순수 JSON):
{
  "title": "55자 내외, 키워드 포함, 클릭 유도",
  "description": "150자 내외 메타설명",
  "intro": "2~3문장 도입 훅",
  "sections": [ { "h2": "소제목", "body": ["문단1","문단2"], "list": ["선택: 항목들"] } ],
  "tips": ["실전 팁 3~5개"],
  "faq": [ { "q": "질문", "a": "답변" } ]
}
body/tips/faq 안에서 <b>강조</b> 태그 사용 가능. list는 해당되는 섹션에만.`
}

async function gen(t) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`
  const res = await fetch(url, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(t) }] }],
      generationConfig: { temperature: 0.8, maxOutputTokens: 8192, responseMimeType: 'application/json' }
    })
  })
  const d = await res.json()
  if (d.error) throw new Error(d.error.message)
  const txt = d.candidates?.[0]?.content?.parts?.[0]?.text
  if (!txt) throw new Error('빈 응답')
  let obj
  try { obj = JSON.parse(txt) } catch { obj = JSON.parse(txt.replace(/^```json\s*|\s*```$/g, '')) }
  obj.slug = t.slug; obj.kw = t.kw; obj.related = t.related
  return obj
}

;(async () => {
  const only = process.argv[2]
  const list = only ? TOPICS.filter(t => t.slug === only) : TOPICS
  for (const t of list) {
    try {
      const a = await gen(t)
      fs.writeFileSync(path.join(OUT, t.slug + '.json'), JSON.stringify(a, null, 2))
      console.log(`  ✓ ${t.slug} (${a.sections?.length}섹션, faq ${a.faq?.length}, ${a.title})`)
    } catch (e) {
      console.log(`  ✗ ${t.slug} — ${e.message}`)
    }
  }
  console.log('완료')
})()
