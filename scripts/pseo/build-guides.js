/**
 * GLUX 정보 아티클(가이드) 렌더러
 * scripts/pseo/guides/{slug}.json → public/guide/{slug}/index.html
 * 실행: node scripts/pseo/build-guides.js
 */
const fs = require('fs')
const path = require('path')

const KAKAO = 'https://open.kakao.com/o/gjyncvGi'
const SRC = path.join(__dirname, 'guides')
const OUT = path.join(__dirname, '..', '..', 'public', 'guide')

const STYLE = `*{margin:0;padding:0;box-sizing:border-box}
:root{--ink:#0f0f1a;--char:#141720;--mist:#7a7e8c;--silk:#e4e5ea;--paper:#f5f4f1;--cream:#fbfaf7;--white:#fff;--gold:#b8956a;--gold-b:#d4ad78;--serif:'Cormorant Garamond',serif;--sans:'Noto Sans KR',-apple-system,sans-serif}
body{font-family:var(--sans);color:var(--char);background:var(--cream);font-size:17px;line-height:1.85;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
.wrap{max-width:760px;margin:0 auto;padding:0 22px}
.logo{font-family:var(--serif);font-weight:600;font-size:20px;letter-spacing:5px;color:#fff}.logo span{color:var(--gold)}
.top{background:var(--ink)}
.top .wrap{display:flex;align-items:center;justify-content:space-between;height:56px}
.top a.home{color:rgba(255,255,255,.65);font-size:12.5px}
.hero{background:linear-gradient(180deg,#0f0f1a,#1b1e2a);color:#fff;padding:56px 0 48px}
.crumb{font-size:12px;color:rgba(255,255,255,.55);letter-spacing:.5px;margin-bottom:16px}
.crumb a{color:var(--gold-b)}
.tag{display:inline-block;font-size:11px;letter-spacing:2px;color:var(--gold-b);border:1px solid rgba(184,149,106,.5);border-radius:20px;padding:5px 13px;margin-bottom:18px}
h1{font-family:var(--serif);font-weight:600;font-size:clamp(28px,5vw,44px);line-height:1.25;color:#fff;letter-spacing:-.3px;word-break:keep-all}
.intro{font-size:clamp(15px,2vw,17px);color:rgba(255,255,255,.8);font-weight:300;margin-top:18px;line-height:1.9;word-break:keep-all}
article{padding:46px 0 20px}
article h2{font-family:var(--serif);font-size:clamp(22px,3.4vw,30px);font-weight:600;color:var(--ink);margin:40px 0 16px;line-height:1.35;word-break:keep-all}
article h2:first-child{margin-top:0}
article p{font-size:17px;color:#33363f;margin-bottom:16px;word-break:keep-all}
article p b{color:var(--ink);font-weight:600}
article ul.pl{list-style:none;margin:16px 0 20px;background:var(--white);border:1px solid #eee;border-radius:12px;padding:8px 18px}
article ul.pl li{padding:11px 0 11px 24px;position:relative;font-size:16px;color:#33363f;border-bottom:1px solid #f2f2f2}
article ul.pl li:last-child{border-bottom:none}
article ul.pl li::before{content:'✦';position:absolute;left:0;color:var(--gold)}
.tips{background:#fbf6ec;border:1px solid #ecdcc0;border-radius:14px;padding:22px 24px;margin:30px 0}
.tips h3{font-size:16px;color:var(--gold);font-weight:700;margin-bottom:12px;letter-spacing:.5px}
.tips li{list-style:none;position:relative;padding:8px 0 8px 26px;font-size:15.5px;color:#4a4d57;border-bottom:1px dashed #ecdcc0}
.tips li:last-child{border-bottom:none}
.tips li::before{content:'·';position:absolute;left:0;color:var(--gold);font-weight:900}
.faq{border:1px solid #ececec;border-radius:14px;overflow:hidden;margin:26px 0}
.faq details{border-bottom:1px solid #ececec;background:var(--white)}.faq details:last-child{border-bottom:none}
.faq summary{padding:17px 20px;font-size:16.5px;font-weight:600;cursor:pointer;list-style:none}
.faq summary::-webkit-details-marker{display:none}
.faq p{padding:0 20px 18px;font-size:15.5px;color:#5a5d68;line-height:1.75}
.sec-t{font-family:var(--serif);font-size:12px;letter-spacing:3px;text-transform:uppercase;color:var(--gold);margin:40px 0 4px}
.sec-h{font-size:20px;font-weight:600;color:var(--ink);margin-bottom:6px}
.cta{background:linear-gradient(135deg,#141720,#0f0f1a);border-radius:16px;padding:34px 30px;text-align:center;margin:40px 0 10px}
.cta h3{font-family:var(--serif);color:#fff;font-size:26px;font-weight:600;margin-bottom:8px}
.cta p{color:rgba(255,255,255,.7);font-size:15px;margin-bottom:22px}
.cta .btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;gap:8px;padding:14px 26px;border-radius:8px;font-size:14.5px;font-weight:700;cursor:pointer;transition:transform .2s}
.btn:hover{transform:translateY(-2px)}
.btn-gold{background:var(--gold);color:var(--ink)}
.btn-line{border:1px solid rgba(255,255,255,.3);color:#fff}
.related{margin:28px 0;font-size:14.5px;color:var(--mist)}
.related a{color:var(--gold);font-weight:600}
.summary{background:#fbf6ec;border-left:4px solid var(--gold);border-radius:0 10px 10px 0;padding:18px 22px;margin:0 0 24px;font-size:16.5px;color:#33363f;line-height:1.85;word-break:keep-all}
.summary .lbl{display:block;font-size:11px;letter-spacing:2px;color:var(--gold-b);font-weight:700;margin-bottom:6px}
.keyfacts{background:var(--white);border:1px solid #eee;border-radius:12px;padding:18px 22px;margin:0 0 30px}
.keyfacts h3{font-size:15px;color:var(--ink);font-weight:700;margin-bottom:8px}
.keyfacts ul{list-style:none}
.keyfacts li{position:relative;padding:9px 0 9px 24px;font-size:15.5px;color:#3f424c;border-bottom:1px dashed #efefef}
.keyfacts li:last-child{border-bottom:none}
.keyfacts li::before{content:'✓';position:absolute;left:0;color:var(--gold);font-weight:700}
.mapbox{margin:34px 0}
.map-t{font-size:14px;font-weight:700;color:var(--ink);margin-bottom:10px}.map-t span{color:var(--gold-b);font-weight:400}
.gmap{width:100%;height:340px;border:0;border-radius:12px;display:block}
.gal{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:34px 0}
.gi{padding-top:68%;background-size:cover;background-position:center;border-radius:10px;background:#e9e7e2}
@media(max-width:600px){.gal{grid-template-columns:1fr 1fr}}
.fig{margin:22px 0}.fig img{width:100%;border-radius:12px;display:block}.fig figcaption{font-size:13px;color:var(--mist);margin-top:8px;text-align:center}
.tblwrap{overflow-x:auto;margin:22px 0;-webkit-overflow-scrolling:touch}
table.tbl{width:100%;border-collapse:collapse;font-size:15px;min-width:420px}
table.tbl th{background:var(--paper);color:var(--ink);font-weight:700;text-align:left;padding:11px 12px;border-bottom:2px solid var(--gold);white-space:nowrap}
table.tbl td{padding:10px 12px;border-bottom:1px solid #eee;color:#33363f;vertical-align:top;line-height:1.6}
table.tbl tr:last-child td{border-bottom:none}
.route{list-style:none;margin:22px 0;padding:0}
.route li{position:relative;padding:0 0 20px 28px;border-left:2px solid #e7ddcf;margin-left:6px}
.route li:last-child{border-left-color:transparent;padding-bottom:0}
.route li::before{content:'';position:absolute;left:-8px;top:1px;width:13px;height:13px;border-radius:50%;background:var(--gold);border:2px solid #fff;box-shadow:0 0 0 1px #e7ddcf}
.route .rt{display:inline-block;font-weight:800;color:var(--gold);font-size:13px;min-width:52px}
.route .rp{font-weight:700;color:var(--ink)}
.route .rn{display:block;font-size:14.5px;color:#5a5d68;margin-top:4px;line-height:1.65}
.flow{display:flex;flex-wrap:wrap;gap:12px;align-items:stretch;margin:26px 0}
.flow .fstep{flex:1 1 140px;background:linear-gradient(135deg,#fbf6ec,#fff);border:1px solid #ecdcc0;border-radius:14px;padding:15px 14px;position:relative}
.flow .fd{font-size:11.5px;font-weight:800;color:var(--gold);letter-spacing:1.5px}
.flow .ft{font-weight:800;color:var(--ink);margin:5px 0 8px;font-size:15px;line-height:1.3}
.flow .fs{font-size:13px;color:#5a5d68;line-height:1.65}
.flow .fstep:not(:last-child)::after{content:'→';position:absolute;right:-14px;top:50%;transform:translateY(-50%);color:var(--gold);font-weight:900;font-size:16px;z-index:2}
@media(max-width:600px){.flow{flex-direction:column}.flow .fstep:not(:last-child)::after{content:'↓';right:auto;left:50%;top:auto;bottom:-16px;transform:translateX(-50%)}}
.usp{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:22px 0 26px;text-align:left}
.usp .u{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:12px;padding:14px 15px}
.usp .u b{display:block;color:#fff;font-size:14.5px;margin-bottom:4px}
.usp .u span{color:rgba(255,255,255,.72);font-size:13px;line-height:1.6}
@media(max-width:600px){.usp{grid-template-columns:1fr}}
footer{background:var(--ink);color:rgba(255,255,255,.55);font-size:12px;padding:30px 0;text-align:center;margin-top:40px}
footer a{color:var(--gold-b)}`

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const jstr = s => JSON.stringify(s)

function render(a) {
  const url = `https://gluxtour.com/guide/${a.slug}/`
  const tour = (a.related || '').replace('/tour/', '').replace(/\//g, '')
  const heroImg = tour ? `/tour/img/${tour}.jpg` : '/glux_thumbnail.png'
  const gal = tour ? `\n    <div class="gal">${[1, 2, 3].map(i => `<div class="gi" style="background-image:url(/tour/img/gallery/${tour}-${i}.jpg)"></div>`).join('')}</div>` : ''
  const summaryHtml = a.summary ? `    <div class="summary"><span class="lbl">핵심 요약</span>${a.summary}</div>\n` : ''
  const keyFactsHtml = (a.keyFacts && a.keyFacts.length) ? `    <div class="keyfacts"><h3>한눈에 보기</h3><ul>\n${a.keyFacts.map(f => `      <li>${f}</li>`).join('\n')}\n    </ul></div>\n` : ''
  const mapHtml = a.place ? `\n    <div class="mapbox">
      <div class="map-t">${esc(a.kw)} <span>· ${esc(a.place)}</span></div>
      <iframe class="gmap" src="https://maps.google.com/maps?q=${encodeURIComponent(a.place)}&z=15&hl=ko&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
    </div>\n` : ''
  const body = (a.sections || []).map(s => {
    const ps = (s.body || []).map(p => `    <p>${p}</p>`).join('\n')
    const rawhtml = s.html ? `\n    ${s.html}` : ''
    const flow = (s.flow && s.flow.length) ? `\n    <div class="flow">${s.flow.map(f => `<div class="fstep"><div class="fd">${esc(f.day)}</div><div class="ft">${esc(f.title)}</div><div class="fs">${(f.spots || []).map(esc).join(' · ')}</div></div>`).join('')}</div>` : ''
    const img = s.img ? `\n    <figure class="fig"><img src="${esc(s.img)}" alt="${esc(s.cap || s.h2 || '')}" loading="lazy">${s.cap ? `<figcaption>${esc(s.cap)}</figcaption>` : ''}</figure>` : ''
    const route = (s.route && s.route.length) ? `\n    <ul class="route">\n${s.route.map(r => `      <li>${r.t ? `<span class="rt">${esc(r.t)}</span> ` : ''}<span class="rp">${esc(r.p)}</span>${r.n ? `<span class="rn">${r.n}</span>` : ''}</li>`).join('\n')}\n    </ul>` : ''
    const table = (s.table && s.table.rows) ? `\n    <div class="tblwrap"><table class="tbl">${s.table.headers ? `<thead><tr>${s.table.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>` : ''}<tbody>${s.table.rows.map(row => `<tr>${row.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : ''
    const list = (s.list && s.list.length) ? `\n    <ul class="pl">\n${s.list.map(x => `      <li>${x}</li>`).join('\n')}\n    </ul>` : ''
    return `    <h2>${esc(s.h2)}</h2>\n${ps}${rawhtml}${flow}${img}${route}${table}${list}`
  }).join('\n')
  const tips = (a.tips && a.tips.length) ? `\n    <div class="tips"><h3>알아두면 좋은 팁</h3><ul>\n${a.tips.map(t => `      <li>${t}</li>`).join('\n')}\n    </ul></div>` : ''
  const faqHtml = (a.faq || []).map(f => `      <details><summary>${esc(f.q)}</summary><p>${f.a}</p></details>`).join('\n')
  const faqLd = (a.faq || []).map(f => `    {"@type":"Question","name":${jstr(f.q)},"acceptedAnswer":{"@type":"Answer","text":${jstr(String(f.a).replace(/<[^>]+>/g, ''))}}}`).join(',\n')

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(a.title)}</title>
<meta name="description" content="${esc(a.description)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(a.title)}">
<meta property="og:description" content="${esc(a.description)}">
<meta property="og:image" content="https://gluxtour.com/glux_thumbnail.png">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="GLUX Tour">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":${jstr(a.title)},"description":${jstr(a.description)},"image":"https://gluxtour.com/glux_thumbnail.png","author":{"@type":"Organization","name":"GLUX Tour"},"publisher":{"@type":"Organization","name":"GLUX Tour","url":"https://gluxtour.com/"},"mainEntityOfPage":${jstr(url)}}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
${faqLd}
]}
</script>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6969943039321705" crossorigin="anonymous"></script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-480GXTHM5Q"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-480GXTHM5Q')</script>
<style>
${STYLE}
</style>
</head>
<body>

<div class="top"><div class="wrap"><a href="https://gluxtour.com/" class="logo">GL<span>U</span>X</a><a href="https://gluxtour.com/" class="home">← GLUX 홈</a></div></div>

<header class="hero" style="background:linear-gradient(rgba(15,15,26,.7),rgba(15,15,26,.86)),url(${heroImg}) center/cover"><div class="wrap">
  <div class="crumb"><a href="https://gluxtour.com/">홈</a> › 여행 가이드 › ${esc(a.kw)}</div>
  <span class="tag">TRAVEL GUIDE</span>
  <h1>${esc(a.title)}</h1>
  <p class="intro">${a.intro}</p>
</div></header>

<div class="wrap">
  <article>
${summaryHtml}${keyFactsHtml}${body}
${tips}
${gal}
${mapHtml}
    <div class="sec-t">FAQ</div>
    <div class="sec-h">자주 묻는 질문</div>
    <div class="faq">
${faqHtml}
    </div>

    <div class="cta">
      <h3>공항 픽업부터 송영까지, 통째로 맡기세요</h3>
      <p>관광객 패키지가 아닙니다. 여러분 일행만을 위한 <b style="color:#fff">A to Z 프라이빗 케어</b>를 현지에서 직접 짜드립니다.</p>
      <div class="usp">
        <div class="u"><b>공항 픽업 · 송영</b><span>도착부터 출국까지 전용차량으로 모십니다</span></div>
        <div class="u"><b>한국어·일본어 가이드</b><span>말이 안 통할 걱정 전혀 없이, 편하게</span></div>
        <div class="u"><b>맛집·명소·소도시 예약 대행</b><span>줄서기·일본어 전화예약 스트레스 0</span></div>
        <div class="u"><b>현지 직영 · 대행 마진 없음</b><span>거품 없는 현지 가격 그대로</span></div>
      </div>
      <div class="btns">
        <a href="/private/" class="btn btn-gold" onclick="if(window.gtag)gtag('event','cta_click',{from:'guide'})">무료 견적 신청 →</a>
        <a href="${KAKAO}" target="_blank" rel="noopener" class="btn btn-line" onclick="if(window.gtag)gtag('event','click_kakao',{from:'guide'})">카카오톡 상담</a>
      </div>
    </div>

    <div class="related">관련: <a href="${a.related || '/'}">${esc(a.kw)} 상담·견적 받기 →</a></div>
  </article>
</div>

<footer>© 2024 GLUX Tour · 오사카·간사이 현지 직영 여행사 · <a href="https://gluxtour.com/">gluxtour.com</a></footer>

</body>
</html>
`
}

let n = 0
const slugs = []
for (const f of fs.readdirSync(SRC)) {
  if (!f.endsWith('.json')) continue
  const a = JSON.parse(fs.readFileSync(path.join(SRC, f), 'utf8'))
  const dir = path.join(OUT, a.slug)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), render(a), 'utf8')
  slugs.push(a.slug)
  console.log(`  ✓ /guide/${a.slug}/  (${a.kw})`)
  n++
}
console.log(`\n생성 완료: ${n}개 아티클`)
console.log('sitemap용 URL:')
slugs.forEach(s => console.log(`  https://gluxtour.com/guide/${s}/`))
