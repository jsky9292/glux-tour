/**
 * GLUX pSEO 랜딩페이지 생성기 (v2 - 풍성한 버전)
 * 데이터(PAGES) → public/tour/{slug}/index.html 생성
 * 구성: 히어로(실사진) + 소개 + 하이라이트 + 사진갤러리 + 포함사항 + 추천일정 + 고객후기 + FAQ + 신청폼
 * 실행: node scripts/pseo/generate.js
 */
const fs = require('fs')
const path = require('path')

const KAKAO = 'https://open.kakao.com/o/gjyncvGi'
const OUT_ROOT = path.join(__dirname, '..', '..', 'public', 'tour')

const INCLUDED = ['전용차량 공항 픽업 · 송영', '한국어 가능 현지 코디 · 가이드', '100% 맞춤 일정 설계', '숙소 · 맛집 예약 대행', '여행 중 실시간 카톡 지원']

const STYLE = `*{margin:0;padding:0;box-sizing:border-box}
:root{--ink:#08090c;--char:#141720;--slate:#1e2130;--mist:#7a7e8c;--silk:#e4e5ea;--paper:#f5f4f1;--cream:#faf9f6;--white:#fff;--gold:#b8956a;--gold-b:#d4ad78;--serif:'Cormorant Garamond',serif;--sans:'Noto Sans KR',-apple-system,sans-serif}
body{font-family:var(--sans);color:var(--char);background:var(--cream);font-size:17px;line-height:1.65;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
.wrap{max-width:920px;margin:0 auto;padding:0 20px}
.logo{font-family:var(--serif);font-weight:600;font-size:20px;letter-spacing:5px;color:var(--white)}.logo span{color:var(--gold)}
.top{position:sticky;top:0;z-index:50;background:rgba(8,9,12,.92);backdrop-filter:blur(8px)}
.top .wrap{display:flex;align-items:center;justify-content:space-between;height:56px}
.top a.home{color:rgba(255,255,255,.65);font-size:12.5px}
.hero{color:var(--white);padding:78px 0 66px;position:relative;overflow:hidden}
.hero .wrap{position:relative}
.crumb{font-size:11.5px;color:rgba(255,255,255,.6);letter-spacing:1px;margin-bottom:18px}
.crumb a{color:var(--gold-b)}
.tag{display:inline-block;font-size:11px;letter-spacing:2px;color:var(--gold-b);border:1px solid rgba(184,149,106,.5);border-radius:20px;padding:5px 14px;margin-bottom:20px}
h1{font-family:var(--serif);font-weight:300;font-size:clamp(30px,6vw,52px);line-height:1.22;margin-bottom:18px}
h1 b{font-weight:600;color:var(--gold-b)}
.lead{font-size:clamp(15px,2.2vw,18px);color:rgba(255,255,255,.82);max-width:640px;font-weight:300;word-break:keep-all}
.hero-cta{display:flex;gap:12px;flex-wrap:wrap;margin-top:32px}
.btn{display:inline-flex;align-items:center;gap:8px;padding:14px 26px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;transition:transform .2s}
.btn:hover{transform:translateY(-2px)}
.btn-gold{background:var(--gold);color:var(--ink)}
.btn-line{border:1px solid rgba(255,255,255,.4);color:var(--white)}
.trust{display:flex;gap:22px;flex-wrap:wrap;margin-top:30px;font-size:13.5px;color:rgba(255,255,255,.7)}
.trust span::before{content:'✓ ';color:var(--gold-b)}
section.blk{padding:52px 0;border-bottom:1px solid #ececec}
.sov{font-size:11px;letter-spacing:3px;color:var(--gold);text-transform:uppercase;margin-bottom:12px}
h2{font-family:var(--serif);font-size:clamp(24px,4vw,36px);font-weight:500;color:var(--char);margin-bottom:20px;line-height:1.3;word-break:keep-all}
p.body{font-size:16.5px;color:#3a3d4a;margin-bottom:14px;word-break:keep-all;line-height:1.85}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:24px}
.card{background:var(--white);border:1px solid #ececec;border-radius:12px;padding:22px}
.card h3{font-size:17.5px;color:var(--char);margin-bottom:8px}
.card p{font-size:15px;color:#5a5d68;line-height:1.7}
.card .pin{font-size:11px;color:var(--gold);font-weight:700;letter-spacing:1px;margin-bottom:10px}
ul.pl{list-style:none;margin-top:16px}
ul.pl li{padding:10px 0 10px 26px;position:relative;font-size:16px;color:#3a3d4a;border-bottom:1px solid #f0f0f0}
ul.pl li::before{content:'✦';position:absolute;left:0;color:var(--gold)}
.gal{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:22px}
.gi{padding-top:70%;background-size:cover;background-position:center;border-radius:10px;background-color:#e9e7e2}
.gal-note{font-size:12px;color:var(--mist);margin-top:12px}
.inc{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px;margin-top:20px}
.inc div{background:var(--paper);border:1px solid #ececec;border-radius:8px;padding:14px 16px;font-size:15px;color:#3a3d4a}
.inc div::before{content:'✓ ';color:var(--gold);font-weight:700}
.day{display:flex;gap:16px;padding:16px 0;border-bottom:1px solid #f0f0f0}
.day .d{flex-shrink:0;width:64px;font-family:var(--serif);font-size:22px;font-weight:600;color:var(--gold)}
.day .t{font-size:16px;color:#3a3d4a}
.rev{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px;margin-top:22px}
.rc{background:var(--white);border:1px solid #ececec;border-radius:12px;padding:22px}
.rc .stars{color:#e0a93c;font-size:14px;letter-spacing:2px;margin-bottom:10px}
.rc .rtxt{font-size:15.5px;color:#3a3d4a;line-height:1.75;margin-bottom:14px;word-break:keep-all}
.rc .rau{display:flex;align-items:center;gap:10px}
.rc .rav{width:34px;height:34px;border-radius:50%;background:var(--gold);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px}
.rc .rname{font-size:13px;font-weight:600;color:var(--char)}
.rc .rtrip{font-size:11px;color:var(--mist)}
.faq{border:1px solid #ececec;border-radius:12px;overflow:hidden;margin-top:10px}
.faq details{border-bottom:1px solid #ececec}.faq details:last-child{border-bottom:none}
.faq summary{padding:17px 20px;font-size:16.5px;font-weight:600;cursor:pointer;list-style:none;background:var(--white)}
.faq summary::-webkit-details-marker{display:none}
.faq p{padding:0 20px 18px;font-size:15.5px;color:#5a5d68;line-height:1.7}
.cta{background:linear-gradient(180deg,#141720,#08090c);color:var(--white);text-align:center;padding:60px 20px}
.cta h2{color:var(--white)}
.cta>.wrap>p{color:rgba(255,255,255,.72);font-size:15px;margin-bottom:26px}
footer{background:var(--ink);color:rgba(255,255,255,.55);font-size:12px;padding:28px 0;text-align:center}
footer a{color:var(--gold-b)}
#apply{scroll-margin-top:70px}
.lform{background:var(--white);max-width:440px;margin:28px auto 0;padding:26px 24px;border-radius:14px;text-align:left;box-shadow:0 20px 60px rgba(0,0,0,.35)}
.lform label{display:block;font-size:11.5px;font-weight:600;color:var(--char);letter-spacing:.5px;margin:14px 0 6px}
.lform label:first-child{margin-top:0}
.lform input,.lform textarea{width:100%;padding:12px 13px;border:1px solid var(--silk);background:var(--paper);font-family:var(--sans);font-size:14px;color:var(--char);border-radius:6px;outline:none}
.lform input:focus,.lform textarea:focus{border-color:var(--gold)}
.lform textarea{min-height:70px;resize:vertical}
.lform .row2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.lform button{width:100%;margin-top:18px;padding:14px;background:var(--gold);color:var(--ink);font-size:14px;font-weight:700;border:none;border-radius:8px;cursor:pointer;font-family:var(--sans)}
.lform button:disabled{opacity:.6;cursor:not-allowed}
.lform .note{font-size:11px;color:var(--mist);text-align:center;margin-top:10px}
.lform .ok{display:none;text-align:center;padding:24px 8px}
.lform .ok h3{font-family:var(--serif);font-size:22px;color:var(--char);margin-bottom:8px}
.lform .ok p{color:var(--mist);font-size:13px}
@media(max-width:600px){.gal{grid-template-columns:1fr 1fr}}`

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const jstr = s => JSON.stringify(s)

function render(p) {
  const url = `https://gluxtour.com/tour/${p.slug}/`
  const areas = p.areas.map(a => `    <div class="card"><div class="pin">${a.pin}</div><h3>${a.h3}</h3><p>${a.p}</p></div>`).join('\n')
  const why = p.whyGlux.map(li => `    <li>${li}</li>`).join('\n')
  const days = p.itinerary.map((d, i) => `  <div class="day"><div class="d">DAY ${i + 1}</div><div class="t">${d}</div></div>`).join('\n')
  const inc = (p.included || INCLUDED).map(x => `    <div>${x}</div>`).join('\n')
  const forWhomHtml = p.forWhom ? ('<section class="blk"><div class="wrap">\n  <div class="sov">For You</div>\n  <h2>이런 여행자께 추천합니다</h2>\n  <ul class="pl">\n' + p.forWhom.map(x => '    <li>' + x + '</li>').join('\n') + '\n  </ul>\n</div></section>\n\n') : ''
  const gal = Array.from({ length: p.galCount || 6 }, (_, k) => k + 1).map(i => `    <div class="gi" style="background-image:url(../img/gallery/${p.slug}-${i}.jpg)"></div>`).join('\n')
  const galNote = p.galleryReal ? '* GLUX 고객의 실제 여행 사진입니다.' : '* 이미지는 이해를 돕기 위한 예시입니다.'
  const revs = p.reviews.map(r => `    <div class="rc"><div class="stars">${'★'.repeat(r.s)}</div><p class="rtxt">"${r.txt}"</p><div class="rau"><div class="rav">${r.name.slice(0, 1)}</div><div><div class="rname">${r.name}</div><div class="rtrip">${r.trip}</div></div></div></div>`).join('\n')
  const faqHtml = p.faq.map(f => `    <details><summary>${f.q}</summary><p>${f.a}</p></details>`).join('\n')
  const faqLd = p.faq.map(f => `    {"@type":"Question","name":${jstr(f.q)},"acceptedAnswer":{"@type":"Answer","text":${jstr(f.a)}}}`).join(',\n')
  const revLd = p.reviews.map(r => `    {"@type":"Review","reviewRating":{"@type":"Rating","ratingValue":${r.s},"bestRating":5},"author":{"@type":"Person","name":${jstr(r.name)}},"reviewBody":${jstr(r.txt)}}`).join(',\n')

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.description)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(p.ogTitle || p.title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:image" content="https://gluxtour.com/tour/img/${p.slug}.jpg">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="GLUX Tour">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Noto+Sans+KR:wght@300;400;500;600;700;900&display=swap" rel="stylesheet">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"TouristTrip","name":${jstr(p.kw)},"description":${jstr(p.description)},"provider":{"@type":"TravelAgency","name":"GLUX Tour","url":"https://gluxtour.com/","telephone":"+81-80-5706-7979"}}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
${faqLd}
]}
</script>
<style>
${STYLE}
</style>
</head>
<body>

<div class="top"><div class="wrap"><a href="https://gluxtour.com/" class="logo">GL<span>U</span>X</a><a href="https://gluxtour.com/" class="home">← GLUX 홈</a></div></div>

<header class="hero" style="background:linear-gradient(rgba(8,9,12,.62),rgba(8,9,12,.8)),url(../img/${p.slug}.jpg) center/cover">
  <div class="wrap">
    <div class="crumb"><a href="https://gluxtour.com/">홈</a> › 여행 테마 › ${esc(p.kw)}</div>
    <span class="tag">${esc(p.tag)}</span>
    <h1>${p.h1a}<br><b>${p.h1b}</b></h1>
    <p class="lead">${esc(p.lead)}</p>
    <div class="hero-cta">
      <a href="#apply" class="btn btn-gold">무료 상담 신청하기 →</a>
      <a href="${KAKAO}" target="_blank" rel="noopener" class="btn btn-line">카카오톡 상담</a>
    </div>
    <div class="trust"><span>현지 20년+ 직영</span><span>한국어 현지인 케어</span><span>전용차량 픽업</span><span>맞춤 설계</span></div>
  </div>
</header>

<section class="blk"><div class="wrap">
  <div class="sov">${esc(p.whyLabel || 'About')}</div>
  <h2>${esc(p.whyTitle)}</h2>
  ${p.whyBody.map(b => `<p class="body">${b}</p>`).join('\n  ')}
</div></section>

<section class="blk"><div class="wrap">
  <div class="sov">Highlights</div>
  <h2>${esc(p.areasTitle)}</h2>
  <div class="grid">
${areas}
  </div>
  ${p.areasNote ? `<p class="body" style="margin-top:22px;font-size:13.5px;color:var(--mist)">${p.areasNote}</p>` : ''}
</div></section>

${forWhomHtml}<section class="blk"><div class="wrap">
  <div class="sov">Gallery</div>
  <h2>사진으로 미리 보기</h2>
  <div class="gal">
${gal}
  </div>
  <p class="gal-note">${galNote}</p>
</div></section>

<section class="blk"><div class="wrap">
  <div class="sov">Included</div>
  <h2>이 여행에 포함됩니다</h2>
  <div class="inc">
${inc}
  </div>
</div></section>

<section class="blk"><div class="wrap">
  <div class="sov">Sample Course</div>
  <h2>추천 일정 예시</h2>
${days}
  <p class="body" style="margin-top:18px;font-size:14px;color:var(--mist)">* 위 일정은 추천 예시입니다. 실제 일정과 박 수는 맞춤형으로 진행되어 추천 일정과 달라질 수 있습니다.</p>
</div></section>

<section class="blk"><div class="wrap">
  <div class="sov">Reviews</div>
  <h2>고객 후기</h2>
  <div class="rev">
${revs}
  </div>
</div></section>

<section class="blk"><div class="wrap">
  <div class="sov">FAQ</div>
  <h2>자주 묻는 질문</h2>
  <div class="faq">
${faqHtml}
  </div>
</div></section>

<section class="cta" id="apply">
  <div class="wrap">
    <h2>지금 무료 상담을 시작하세요</h2>
    <p>${esc(p.ctaSub)}</p>
    <div class="lform">
      <div id="lfArea">
        <label>이름 *</label><input type="text" id="lN" placeholder="홍길동">
        <label>연락처 *</label><input type="tel" id="lP" placeholder="010-0000-0000">
        <label>여행 일정 (선택)</label>
        <div class="row2"><input type="date" id="lCI"><input type="date" id="lCO"></div>
        <label>인원 (선택)</label><input type="text" id="lPpl" placeholder="예: 성인 2명, 아동 1명">
        <label>메모 (선택)</label><textarea id="lM" placeholder="희망 일정 · 예산 · 요청사항을 편하게 적어주세요"></textarea>
        <button id="lBtn" onclick="submitLead()">무료 상담 신청하기</button>
        <div class="note">접수 후 24시간 내 연락드립니다 · 상담 무료</div>
      </div>
      <div class="ok" id="lOk"><h3>✅ 상담 신청 완료!</h3><p>24시간 내 연락드리겠습니다.</p></div>
    </div>
    <div class="hero-cta" style="justify-content:center;margin-top:20px">
      <a href="${KAKAO}" target="_blank" rel="noopener" class="btn btn-line">카카오톡으로 문의</a>
    </div>
  </div>
</section>

<script>
async function submitLead(){
  var n=document.getElementById('lN').value.trim();
  var p=document.getElementById('lP').value.trim();
  if(!n||!p){alert('이름과 연락처는 필수입니다.');return;}
  var ci=document.getElementById('lCI').value, co=document.getElementById('lCO').value;
  var ppl=document.getElementById('lPpl').value.trim(), memo=document.getElementById('lM').value.trim();
  var requests=[ppl,memo].filter(Boolean).join(' / ');
  var btn=document.getElementById('lBtn'); btn.disabled=true; btn.textContent='신청 중...';
  try{
    var res=await fetch('https://gluxtour.com/api/applications',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name:n,phone:p,departure_date:ci||'미정',return_date:co||'미정',package_type:${jstr(p.kw)},requests:requests||null})});
    if(res.ok){document.getElementById('lfArea').style.display='none';document.getElementById('lOk').style.display='block';}
    else{var j=await res.json().catch(function(){return{};});alert('오류: '+(j.error||'다시 시도해주세요.'));btn.disabled=false;btn.textContent='무료 상담 신청하기';}
  }catch(e){document.getElementById('lfArea').style.display='none';document.getElementById('lOk').style.display='block';}
}
(function(){var t=new Date().toISOString().split('T')[0];var a=document.getElementById('lCI'),b=document.getElementById('lCO');if(a)a.setAttribute('min',t);if(b)b.setAttribute('min',t);})();
</script>

<footer>© 2024 GLUX Tour · 오사카·간사이 현지 직영 여행사 · <a href="https://gluxtour.com/">gluxtour.com</a></footer>

</body>
</html>
`
}

const PAGES = JSON.parse(fs.readFileSync(path.join(__dirname, 'pages.json'), 'utf8'))

let count = 0
for (const p of PAGES) {
  const dir = path.join(OUT_ROOT, p.slug)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), render(p), 'utf8')
  console.log(`  ✓ /tour/${p.slug}/  (${p.kw})`)
  count++
}
console.log(`\n생성 완료: ${count}개 페이지`)
