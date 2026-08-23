/**
 * 미식·여행 가이드 허브 생성 → public/guide/index.html
 * curation.json의 22개 큐레이션을 그룹별 카드로, 하단에 여행 정보 가이드 링크 + 문의 CTA.
 * 실행: node scripts/pseo/build-guide-hub.js
 */
const fs = require('fs'), path = require('path')
const KAKAO = 'https://open.kakao.com/o/gjyncvGi'
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const cur = JSON.parse(fs.readFileSync(path.join(__dirname, 'curation.json'), 'utf8'))
const bySlug = Object.fromEntries(cur.map(p => [p.slug, p]))

const GROUPS = [
  ['관광명소', ['osaka-spots', 'kyoto-spots', 'kyoto-temple', 'kobe-spots', 'nara-spots']],
  ['음식별 맛집', ['osaka-yakiniku', 'osaka-wagyu', 'osaka-sushi', 'osaka-ramen', 'osaka-udon', 'osaka-okonomiyaki', 'osaka-takoyaki', 'osaka-izakaya', 'osaka-cafe']],
  ['오사카 지역별', ['dotonbori-food', 'namba-food', 'shinsaibashi-food', 'umeda-food', 'osaka-station-food', 'shinsekai-food', 'tennoji-food', 'kuromon-food', 'kyobashi-food', 'horie-food', 'tenma-food']],
  ['교토 미식', ['kyoto-food', 'gion-food', 'arashiyama-food', 'kyoto-nishiki', 'kyoto-cafe']],
  ['고베 미식', ['kobe-food', 'sannomiya-food', 'nankinmachi-food', 'kobe-sweets']],
  ['나라 미식', ['nara-food']],
  ['온천·힐링', ['osaka-onsen']],
]
const GUIDES = [
  ['osaka-local-food', '오사카 숨은 맛집'], ['japan-must-buy', '일본 여행 필수템'], ['japan-travel-tips', '간사이 여행 준비물·꿀팁'],
  ['osaka-3d4n-course', '오사카 3박4일 코스'], ['kansai-airport-access', '간사이공항 시내이동'], ['namba-area', '난바역 주변'], ['umeda-area', '우메다역 주변'], ['osaka-like-local', '오사카 현지인처럼'], ['osaka-rainy-day', '비 오는 날 오사카'], ['osaka-neighborhoods', '오사카 골목 동네'], ['osaka-hotel', '오사카 호텔'],
  ['dotonbori', '도톤보리'], ['kuromon-market', '쿠로몬시장'], ['shinsekai', '신세카이'], ['universal-studios-japan', '유니버설 스튜디오'],
  ['kinkakuji', '금각사'], ['fushimi-inari', '후시미이나리'], ['gion', '기온'], ['arashiyama', '아라시야마'], ['kyoto-ryokan-guide', '교토 료칸'],
  ['nara-park', '나라공원'], ['todaiji', '도다이지'], ['naramachi', '나라마치'], ['nara-day-trip', '나라 당일치기'], ['isuien', '이스이엔'],
  ['kobe-beef-guide', '고베규'], ['harborland', '하버랜드'], ['rokko', '롯코산'], ['arima-onsen-guide', '아리마온천'],
  ['kansai-golf-course-guide', '간사이 골프장'], ['osaka-family-3d4n-course', '오사카 3박4일 코스'],
]

const STYLE = `*{margin:0;padding:0;box-sizing:border-box;font-variant-numeric:lining-nums}
:root{--ink:#141720;--sub:#3a3d4a;--mist:#6b7079;--line:#eceae4;--paper:#f7f5f1;--white:#fff;--gold:#b98a3e;--goldd:#8a6427;--gold-b:#e0bd6e;--sans:'Pretendard','Pretendard Variable',-apple-system,sans-serif}
body{font-family:var(--sans);color:var(--ink);background:var(--white);font-size:16px;line-height:1.7;-webkit-font-smoothing:antialiased;word-break:keep-all;padding-bottom:72px}
a{color:inherit;text-decoration:none}
.wrap{max-width:1080px;margin:0 auto;padding:0 20px}
.topbar{position:sticky;top:0;z-index:30;background:rgba(12,13,18,.95);backdrop-filter:blur(8px)}
.topbar .wrap{display:flex;align-items:center;justify-content:space-between;height:54px}
.brand{font-weight:800;letter-spacing:3px;font-size:18px;color:#fff}.brand span{color:var(--gold-b)}
.topbar .home{font-size:12.5px;color:rgba(255,255,255,.72)}
.hero{color:#fff;padding:60px 0 44px;background:linear-gradient(rgba(8,7,14,.72),rgba(8,7,14,.9)),linear-gradient(135deg,#2a2620,#12131a) center/cover}
.hero .eyebrow{display:inline-block;background:rgba(224,189,110,.14);color:var(--gold-b);border:1px solid rgba(224,189,110,.4);border-radius:20px;padding:6px 14px;font-size:12.5px;font-weight:700;margin-bottom:16px}
.hero h1{font-size:clamp(26px,6vw,38px);font-weight:900;line-height:1.28;letter-spacing:-.5px}
.hero p{font-size:15px;color:rgba(255,255,255,.9);margin-top:14px;max-width:460px;line-height:1.75}
.hero .cta{display:flex;gap:10px;flex-wrap:wrap;margin-top:22px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:14px 22px;border-radius:12px;font-size:14.5px;font-weight:800;cursor:pointer;border:none;font-family:inherit;transition:transform .15s}
.btn:active{transform:scale(.98)}
.btn-g{background:linear-gradient(135deg,#e0bd6e,#b98a3e);color:#231a08;box-shadow:0 5px 14px rgba(0,0,0,.28)}
.btn-l{border:1px solid rgba(255,255,255,.45);color:#fff;background:transparent}
.sec{padding:36px 0 6px}
.sec h2{font-size:clamp(20px,4.5vw,26px);font-weight:900;letter-spacing:-.4px;margin-bottom:4px}
.sec h2 b{color:var(--goldd)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px;margin-top:16px}
.card{border:1px solid var(--line);border-radius:14px;overflow:hidden;transition:transform .15s,border-color .15s;background:var(--white)}
.card:hover{transform:translateY(-3px);border-color:var(--gold)}
.card .im{aspect-ratio:16/10;background:linear-gradient(135deg,#24252e,#15161e) center/cover no-repeat;background-size:cover}
.card .tx{padding:12px 14px 14px}
.card .nm{font-size:15px;font-weight:800;line-height:1.35}
.card .rk{font-size:12px;color:var(--goldd);font-weight:700;margin-top:5px}
.banner{background:linear-gradient(135deg,#171922,#12131a);color:#fff;border-radius:16px;padding:28px 24px;margin:34px 0;text-align:center}
.banner h3{font-size:20px;font-weight:800;margin-bottom:6px}
.banner p{font-size:14px;color:rgba(255,255,255,.8);margin:0 auto 16px;max-width:440px}
.guides{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.guides a{border:1px solid var(--line);border-radius:20px;padding:8px 15px;font-size:13.5px;font-weight:600;color:var(--sub)}
.guides a:hover{border-color:var(--gold);color:var(--goldd)}
footer{background:#0c0c14;color:rgba(255,255,255,.6);font-size:12px;padding:26px 20px 34px;text-align:center;line-height:1.7;margin-top:30px}
footer a{color:var(--gold-b)}
.sticky{position:fixed;bottom:0;left:0;right:0;z-index:100;background:rgba(15,14,26,.97);backdrop-filter:blur(6px);display:flex;gap:8px;padding:9px 14px calc(9px + env(safe-area-inset-bottom));max-width:1080px;margin:0 auto;box-shadow:0 -4px 20px rgba(0,0,0,.3)}
.sticky a{flex:1;padding:13px;border-radius:11px;font-size:14px;font-weight:800;text-align:center}
.sticky .k{flex:0 0 42%;background:rgba(255,255,255,.13);color:#fff}
.sticky .g{background:linear-gradient(135deg,#e0bd6e,#b98a3e);color:#231a08}
@media(max-width:600px){.grid{grid-template-columns:1fr 1fr}}`

function card(slug) {
  const p = bySlug[slug]; if (!p) return ''
  const photo = (p.items && p.items[0] && p.items[0].photo) ? p.items[0].photo : ''
  const im = photo ? ` style="background-image:url('${esc(photo)}')"` : ''
  const n = (p.items || []).length
  return `    <a class="card" href="/guide/${slug}/"><div class="im"${im}></div><div class="tx"><div class="nm">${esc(p.kw)}</div><div class="rk">구글 평점순 TOP ${n} · 문의 →</div></div></a>`
}
const sections = GROUPS.map(([title, slugs]) => `  <section class="sec"><div class="wrap">
    <h2>${esc(title)}</h2>
    <div class="grid">
${slugs.map(card).filter(Boolean).join('\n')}
    </div>
  </div></section>`).join('\n')
const guideLinks = GUIDES.map(([s, l]) => `    <a href="/guide/${s}/">${esc(l)}</a>`).join('\n')

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>오사카·간사이 미식·여행 가이드 | 구글 평점순 맛집 큐레이션 — GLUX</title>
<meta name="description" content="오사카·교토·고베·나라 맛집을 구글 평점순으로 큐레이션. 야끼니꾸·라멘·스시·와규부터 지역별 미식, 온천까지. 원하는 곳으로 여행·예약 문의하면 GLUX가 동선·예약·통역을 도와드립니다.">
<link rel="canonical" href="https://gluxtour.com/guide/">
<meta property="og:type" content="website">
<meta property="og:title" content="오사카·간사이 미식 가이드 · 구글 평점순 — GLUX">
<meta property="og:description" content="구글 평점순 맛집 큐레이션 + 여행 문의. 오사카·교토·고베·나라 미식여행.">
<meta property="og:url" content="https://gluxtour.com/guide/">
<meta property="og:image" content="https://gluxtour.com/guide/img/osaka-yakiniku-1.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://gluxtour.com/guide/img/osaka-yakiniku-1.jpg">
<meta property="og:site_name" content="GLUX Tour">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@latest/dist/web/static/pretendard.min.css">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6969943039321705" crossorigin="anonymous"></script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-480GXTHM5Q"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-480GXTHM5Q')</script>
<style>${STYLE}</style>
</head>
<body>
<div class="topbar"><div class="wrap"><a href="https://gluxtour.com/" class="brand">GL<span>U</span>X</a><a href="https://gluxtour.com/" class="home">← GLUX 홈</a></div></div>
<header class="hero"><div class="wrap">
  <span class="eyebrow">GLUX 미식 큐레이션</span>
  <h1>오사카·간사이 미식 가이드</h1>
  <p>구글 평점순으로 고른 진짜 맛집. 마음에 드는 곳을 골라 문의하면, 예약·통역·전용차량 동선까지 GLUX가 도와드립니다.</p>
  <div class="cta"><a href="https://gluxtour.com/#contact" class="btn btn-g">무료 여행 문의하기 →</a><a href="${KAKAO}" target="_blank" rel="noopener" class="btn btn-l">카카오톡 상담</a></div>
</div></header>
${sections}
  <div class="wrap"><div class="banner">
    <h3>맛집만 고르셨나요? 여행은 GLUX가 완성합니다</h3>
    <p>원하는 맛집·온천만 알려주세요. 예약·통역·전용차량 동선까지 올인원으로 짜드립니다.</p>
    <a href="https://gluxtour.com/#contact" class="btn btn-g" style="display:inline-flex">무료 여행 문의하기 →</a>
  </div></div>
  <section class="sec"><div class="wrap">
    <h2>여행 <b>정보 가이드</b></h2>
    <div class="guides">
${guideLinks}
    </div>
  </div></section>
<footer>© GLUX Tour · 오사카·간사이 현지 직영 여행사 · <a href="https://gluxtour.com/">gluxtour.com</a></footer>
<div class="sticky">
  <a href="${KAKAO}" target="_blank" rel="noopener" class="k">카톡 상담</a>
  <a href="https://gluxtour.com/#contact" class="g">무료 여행 문의 →</a>
</div>
</body>
</html>
`
fs.writeFileSync(path.join(__dirname, '..', '..', 'public', 'guide', 'index.html'), html, 'utf8')
console.log('허브 생성: public/guide/index.html (큐레이션 ' + cur.length + ' + 가이드 ' + GUIDES.length + ')')
