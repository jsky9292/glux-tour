/**
 * 인스타 카드뉴스 생성기 (큐레이션 형식) — 실사진 + 순위 + 평점
 * curation.json → public/cards/{slug}/index.html (1:1 카드 캐러셀)
 * 실행: node scripts/pseo/build-cards.js [slug ...]
 */
const fs = require('fs')
const path = require('path')
const OUT = path.join(__dirname, '..', '..', 'public', 'cards')
const cur = JSON.parse(fs.readFileSync(path.join(__dirname, 'curation.json'), 'utf8'))
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const firstSentence = s => { const t = String(s || '').split(/(?<=[.!?요다])\s/)[0]; return t.length > 52 ? t.slice(0, 50) + '…' : t }

const STYLE = `*{margin:0;padding:0;box-sizing:border-box;font-variant-numeric:lining-nums}
:root{--ink:#12131a;--gold:#d9b45a;--goldd:#b98a3e;--sans:'Pretendard','Pretendard Variable',-apple-system,sans-serif}
body{background:#0a0a0f;font-family:var(--sans);-webkit-font-smoothing:antialiased}
.deck{display:flex;flex-direction:column;align-items:center;gap:14px;padding:14px 0 40px}
.card{position:relative;width:100vmin;height:100vmin;max-width:1080px;max-height:1080px;overflow:hidden;background:#12131a;color:#fff;scroll-snap-align:center;flex:none}
.hint{color:#8a8a92;font-size:13px;text-align:center;padding:10px}
/* 커버 */
.cover{display:flex;flex-direction:column;justify-content:center;padding:0 9%;background:radial-gradient(120% 90% at 50% 0%,#20222e,#0d0e15)}
.cover .brand{position:absolute;top:6.5%;left:9%;font-weight:800;letter-spacing:4px;font-size:2.4vmin;color:#fff}.cover .brand b{color:var(--gold)}
.cover .kick{color:var(--gold);font-weight:800;font-size:3.1vmin;letter-spacing:.5px;margin-bottom:2.2vmin}
.cover h1{font-size:8.6vmin;font-weight:900;line-height:1.18;letter-spacing:-.5px}
.cover h1 em{font-style:normal;color:var(--gold)}
.cover .sub{color:rgba(255,255,255,.8);font-size:3.1vmin;margin-top:3vmin;line-height:1.6}
.cover .swipe{position:absolute;bottom:7%;left:9%;color:rgba(255,255,255,.85);font-size:3vmin;font-weight:700}
.cover .swipe::after{content:' →'}
/* 아이템 */
.ph{position:absolute;inset:0;background-size:cover;background-position:center}
.shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.05) 40%,rgba(0,0,0,.55) 66%,rgba(10,10,15,.96) 100%)}
.rk{position:absolute;top:6%;left:8%;width:11vmin;height:11vmin;border-radius:50%;background:linear-gradient(135deg,#e7c877,#b98a3e);color:#231a08;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:6vmin;box-shadow:0 6px 20px rgba(0,0,0,.4)}
.tag{position:absolute;top:8.4%;left:22%;background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.25);color:#fff;font-size:2.6vmin;font-weight:700;padding:1vmin 2.4vmin;border-radius:20px;backdrop-filter:blur(4px)}
.info{position:absolute;left:8%;right:8%;bottom:8%}
.info .nm{font-size:6.4vmin;font-weight:900;line-height:1.2;letter-spacing:-.3px;text-shadow:0 2px 12px rgba(0,0,0,.5)}
.info .rt{display:inline-block;margin-top:2.4vmin;background:rgba(217,180,90,.16);border:1px solid rgba(217,180,90,.6);color:#f0d79c;font-weight:800;font-size:3vmin;padding:1vmin 2.6vmin;border-radius:10px}
.info .ds{color:rgba(255,255,255,.9);font-size:3.1vmin;line-height:1.55;margin-top:2.4vmin;word-break:keep-all}
/* CTA */
.cta{display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:0 10%;background:radial-gradient(120% 90% at 50% 100%,#20222e,#0d0e15)}
.cta .brand{font-weight:800;letter-spacing:4px;font-size:3vmin;color:#fff;margin-bottom:4vmin}.cta .brand b{color:var(--gold)}
.cta h2{font-size:6.6vmin;font-weight:900;line-height:1.3}
.cta h2 em{font-style:normal;color:var(--gold)}
.cta p{color:rgba(255,255,255,.82);font-size:3.2vmin;line-height:1.7;margin-top:3.4vmin}
.cta .pill{margin-top:5vmin;background:linear-gradient(135deg,#e7c877,#b98a3e);color:#231a08;font-weight:900;font-size:3.4vmin;padding:2.4vmin 5vmin;border-radius:14px}
@media print{.hint{display:none}}`

function coverCard(p, n) {
  const kw = esc(p.kw)
  return `  <div class="card cover">
    <div class="brand">GL<b>U</b>X · 오사카 현지 큐레이션</div>
    <div class="kick">구글 평점·리뷰로 검증</div>
    <h1>${kw}<br><em>현지 TOP ${n}</em></h1>
    <div class="sub">관광객 말고, 현지 기준으로 고른 진짜.<br>넘겨서 확인하세요.</div>
    <div class="swipe">SWIPE</div>
  </div>`
}
function itemCard(it, i) {
  const ph = it.photo ? `<div class="ph" style="background-image:url('${esc(it.photo)}')"></div>` : `<div class="ph" style="background:#20222e"></div>`
  const rt = it.rating ? `<span class="rt">구글 평점 ${it.rating} ★ (${Number(it.count || 0).toLocaleString()})</span>` : ''
  const area = it.area ? `<div class="tag">${esc(it.area)}</div>` : ''
  return `  <div class="card">
    ${ph}<div class="shade"></div>
    <div class="rk">${i + 1}</div>${area}
    <div class="info">
      <div class="nm">${esc(it.name)}</div>
      ${rt}
      <div class="ds">${esc(firstSentence(it.desc))}</div>
    </div>
  </div>`
}
function ctaCard(p) {
  return `  <div class="card cta">
    <div class="brand">GL<b>U</b>X</div>
    <h2>전체 순위·예약은<br><em>GLUX가 도와드려요</em></h2>
    <p>오사카 현지 30년. 맛집 예약·통역·전용차량까지<br>A to Z로 케어합니다. 프로필 링크에서 문의하세요.</p>
    <div class="pill">프로필 링크 → 무료 견적</div>
  </div>`
}

function build(p) {
  const items = (p.items || []).slice(0, 5)
  if (!items.length) return false
  const cards = [coverCard(p, items.length), ...items.map(itemCard), ctaCard(p)].join('\n')
  const html = `<!DOCTYPE html>
<html lang="ko"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(p.kw)} 카드뉴스 — GLUX</title>
<meta name="robots" content="noindex">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@latest/dist/web/static/pretendard.min.css">
<style>${STYLE}</style></head>
<body>
<div class="hint">인스타용 1:1 카드 — 각 카드를 캡처하거나 저장해 캐러셀로 올리세요 (표지→TOP5→문의)</div>
<div class="deck">
${cards}
</div>
</body></html>`
  const dir = path.join(OUT, p.slug)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8')
  return true
}

const only = process.argv.slice(2)
let n = 0
for (const p of cur) {
  if (only.length && !only.includes(p.slug)) continue
  if (build(p)) { console.log('  ✓ /cards/' + p.slug + '/  (' + p.kw + ')'); n++ }
}
console.log('\n카드뉴스 생성: ' + n + '개')
