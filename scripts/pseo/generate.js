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
body{font-family:var(--sans);color:var(--char);background:var(--cream);line-height:1.6;-webkit-font-smoothing:antialiased}
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
.lead{font-size:clamp(14px,2vw,16px);color:rgba(255,255,255,.82);max-width:640px;font-weight:300;word-break:keep-all}
.hero-cta{display:flex;gap:12px;flex-wrap:wrap;margin-top:32px}
.btn{display:inline-flex;align-items:center;gap:8px;padding:14px 26px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;transition:transform .2s}
.btn:hover{transform:translateY(-2px)}
.btn-gold{background:var(--gold);color:var(--ink)}
.btn-line{border:1px solid rgba(255,255,255,.4);color:var(--white)}
.trust{display:flex;gap:22px;flex-wrap:wrap;margin-top:30px;font-size:12.5px;color:rgba(255,255,255,.7)}
.trust span::before{content:'✓ ';color:var(--gold-b)}
section.blk{padding:52px 0;border-bottom:1px solid #ececec}
.sov{font-size:11px;letter-spacing:3px;color:var(--gold);text-transform:uppercase;margin-bottom:12px}
h2{font-family:var(--serif);font-size:clamp(24px,4vw,36px);font-weight:500;color:var(--char);margin-bottom:20px;line-height:1.3;word-break:keep-all}
p.body{font-size:15px;color:#3a3d4a;margin-bottom:14px;word-break:keep-all;line-height:1.85}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:24px}
.card{background:var(--white);border:1px solid #ececec;border-radius:12px;padding:22px}
.card h3{font-size:16px;color:var(--char);margin-bottom:8px}
.card p{font-size:13.5px;color:#5a5d68;line-height:1.7}
.card .pin{font-size:11px;color:var(--gold);font-weight:700;letter-spacing:1px;margin-bottom:10px}
ul.pl{list-style:none;margin-top:16px}
ul.pl li{padding:10px 0 10px 26px;position:relative;font-size:14.5px;color:#3a3d4a;border-bottom:1px solid #f0f0f0}
ul.pl li::before{content:'✦';position:absolute;left:0;color:var(--gold)}
.gal{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:22px}
.gi{padding-top:70%;background-size:cover;background-position:center;border-radius:10px;background-color:#e9e7e2}
.gal-note{font-size:12px;color:var(--mist);margin-top:12px}
.inc{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px;margin-top:20px}
.inc div{background:var(--paper);border:1px solid #ececec;border-radius:8px;padding:13px 15px;font-size:13.5px;color:#3a3d4a}
.inc div::before{content:'✓ ';color:var(--gold);font-weight:700}
.day{display:flex;gap:16px;padding:16px 0;border-bottom:1px solid #f0f0f0}
.day .d{flex-shrink:0;width:64px;font-family:var(--serif);font-size:22px;font-weight:600;color:var(--gold)}
.day .t{font-size:14.5px;color:#3a3d4a}
.rev{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px;margin-top:22px}
.rc{background:var(--white);border:1px solid #ececec;border-radius:12px;padding:22px}
.rc .stars{color:#e0a93c;font-size:14px;letter-spacing:2px;margin-bottom:10px}
.rc .rtxt{font-size:14px;color:#3a3d4a;line-height:1.75;margin-bottom:14px;word-break:keep-all}
.rc .rau{display:flex;align-items:center;gap:10px}
.rc .rav{width:34px;height:34px;border-radius:50%;background:var(--gold);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px}
.rc .rname{font-size:13px;font-weight:600;color:var(--char)}
.rc .rtrip{font-size:11px;color:var(--mist)}
.faq{border:1px solid #ececec;border-radius:12px;overflow:hidden;margin-top:10px}
.faq details{border-bottom:1px solid #ececec}.faq details:last-child{border-bottom:none}
.faq summary{padding:16px 20px;font-size:15px;font-weight:600;cursor:pointer;list-style:none;background:var(--white)}
.faq summary::-webkit-details-marker{display:none}
.faq p{padding:0 20px 18px;font-size:14px;color:#5a5d68;line-height:1.7}
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
  <p class="body" style="margin-top:18px;font-size:13.5px;color:var(--mist)">* 일정 · 박수 · 인원은 100% 맞춤 설계됩니다.</p>
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

const PAGES = [
  {
    slug: 'kansai-golf', kw: '간사이 골프여행', galleryReal: false, galCount: 3,
    title: '간사이 골프여행 | 오사카·고베·시가 명문 CC 프라이빗 부킹 — GLUX Tour',
    ogTitle: '간사이 골프여행 | 명문 CC 프라이빗 부킹 — GLUX Tour',
    description: '간사이 골프여행 전문 GLUX. 오사카·고베·시가·와카야마 100여 개 명문 CC를 컨디션별로 직접 부킹. 현지 30년 직영, 대행사 마진 0. 골프+온천 연계, 전용차량·한국어 현지인 케어.',
    tag: 'KANSAI GOLF · 현지 직영', h1a: '간사이 골프여행', h1b: '명문 CC 프라이빗 부킹',
    lead: '오사카·고베·시가·와카야마의 100여 개 골프장을 컨디션별로 직접 부킹합니다. 현지 30년 직영, 대행사 마진 0. 라운드부터 온천·미식까지 전용차량으로 올인원 케어해 드립니다.',
    whyTitle: '왜 간사이에서 골프인가', whyLabel: 'Why Kansai Golf',
    whyBody: [
      '간사이는 <b>간사이국제공항(KIX)에서 1~2시간 거리에 명문 코스가 밀집</b>해 있어, 짧은 일정에도 라운드 효율이 가장 좋은 골프 여행지입니다. 도착 당일 라운드도 무리가 없습니다.',
      '평탄한 챔피언십 코스부터 산악·해안 코스, 비와코(호수) 뷰 코스까지 <b>다양한 코스를 실력과 취향에 맞춰</b> 고를 수 있습니다.',
      '무엇보다 <b>라운드 후 온천·미식과의 연계</b>가 뛰어납니다. 고베 A5 와규, 아리마·시라하마 온천이 골프장과 가까워 "낮엔 골프, 저녁엔 힐링"이 한 번에 됩니다.'
    ],
    areasTitle: '간사이 골프 추천 권역',
    areas: [
      { pin: 'OSAKA · KOBE', h3: '오사카·고베 근교', p: '공항·시내 접근성 최상. 짧은 일정, 도심 숙소 연계에 적합. 라운드 후 고베 미식·야경으로 연결하기 좋습니다.' },
      { pin: 'SHIGA · BIWAKO', h3: '시가·비와코', p: '골프장 밀집 지역. 호수 뷰의 명문 코스가 많아 라운드 만족도가 높습니다. 2라운드 이상 일정에 추천.' },
      { pin: 'WAKAYAMA', h3: '와카야마', p: '해안·산악 코스와 시라하마 온천 연계. 골프+온천 힐링 조합을 원하는 분께 인기입니다.' },
      { pin: 'NARA · MIE', h3: '나라·미에 근교', p: '한적하고 자연 경관이 좋은 코스. 관광을 곁들인 여유로운 골프 여행에 어울립니다.' }
    ],
    whyGlux: [
      '일본 생활 30년 · 가이드 10년 내공의 <b>한국어 잘하는 현지인</b>이 직접 운영',
      '대행사를 거치지 않는 <b>현지 직영 — 현지 가격 그대로</b>',
      '100여 개 CC 중 <b>잔디 컨디션까지 확인해 직접 부킹</b>',
      '공항 픽업부터 라운드·온천·미식까지 <b>전용차량 올인원</b>',
      '골프 안 하는 동반 가족을 위한 <b>관광 코스 병행</b> 가능'
    ],
    itinerary: [
      '간사이공항 도착 → 전용차량 픽업 → 숙소 체크인 → 고베 와규 만찬',
      '오전 명문 CC 라운드 → 점심 → 오후 온천/휴식 또는 2라운드 (선택)',
      '오전 라운드 또는 관광·쇼핑 → 공항 송영 → 출국'
    ],
    reviews: [
      { s: 5, txt: '잔디 컨디션까지 체크해서 골프장 추천해주니 믿음이 갔어요. 2라운드 후 아리마온천 코스가 최고였습니다. 전용차량이라 이동도 편했어요.', name: '이OO님', trip: '프리미엄 골프 3박4일' },
      { s: 5, txt: '부킹부터 픽업, 식당까지 다 알아서 해주셔서 저희는 라운드만 즐기면 됐습니다. 현지 가격 그대로라 만족도 최고.', name: '정OO님', trip: '골프+온천 2박3일' },
      { s: 5, txt: '골프 초보 아내와 함께 갔는데 코스 난이도까지 배려해주셔서 둘 다 즐겁게 쳤어요. 다음에 또 부탁드립니다.', name: '김OO님', trip: '부부 골프 2박3일' }
    ],
    faq: [
      { q: '간사이 골프여행은 어디 공항으로 가나요?', a: '간사이국제공항(KIX)이 관문입니다. 공항에서 골프장·숙소까지 전용차량으로 픽업해 드려 이동이 편리합니다.' },
      { q: '골프장은 어떻게 골라주나요?', a: '실력, 코스 유형(평탄/산악/해안), 잔디 컨디션, 숙소 거리, 예산을 종합 고려해 간사이 100여 개 CC 중 최적의 골프장을 직접 부킹합니다.' },
      { q: '골프만 하나요, 관광·온천도 되나요?', a: '골프+온천, 골프+가족관광 등 자유롭게 조합됩니다. 라운드 후 아리마·시라하마 온천이나 고베 미식 코스를 연계해 드립니다.' },
      { q: '몇 명부터 가능한가요?', a: '소규모 프라이빗부터 단체까지 인원에 맞춰 전용차량과 일정을 설계합니다. 편하게 상담 남겨 주세요.' }
    ],
    ctaSub: '간사이 골프여행, 어떤 일정이든 24시간 내 맞춤 견적을 보내드립니다.'
  },
  {
    slug: 'osaka-family', kw: '오사카 가족여행', galleryReal: true,
    title: '오사카 가족여행 | 아이·부모님 맞춤 프라이빗 여행 — GLUX Tour',
    ogTitle: '오사카 가족여행 | 프라이빗 맞춤 — GLUX Tour',
    description: '오사카 가족여행 전문 GLUX. 아이·부모님까지 편안한 프라이빗 맞춤 일정, 전용차량 공항 픽업, 현지 30년 직영. 교토·나라·고베 연계, 한국어 현지인 케어.',
    tag: 'OSAKA FAMILY · 현지 직영', h1a: '오사카 가족여행', h1b: '아이도 부모님도 편안하게',
    lead: '아이는 신나고, 부모님은 편안하고, 준비는 우리가 — 유니버설의 함성부터 나라 사슴의 웃음, 교토의 정취까지, 온 가족의 ‘인생 여행’을 현지 30년 직영이 처음부터 끝까지 설계합니다.',
    whyTitle: '왜 오사카 가족여행인가', whyLabel: 'Why Osaka',
    whyBody: [
      '간사이국제공항을 나서는 순간, 낯선 대중교통도 무거운 캐리어도 없습니다. 이름이 적힌 팻말을 든 한국어 가이드가 <b>전용차량</b>으로 맞이하고, 아이는 창밖 오사카 풍경에 벌써 신이 납니다. 다음 날 유니버설 스튜디오에서 터지는 아이의 함성, 저녁 도톤보리에서 온 가족이 나눠 먹는 타코야키와 오코노미야키 — 이 모든 장면이 ‘누가 알아서 다 해주는’ 여행 안에서 펼쳐집니다.',
      '가족여행은 설레지만 걱정도 많습니다. <b>아이가 지치면 어쩌지, 부모님 걸음은 괜찮을까, 식당은 입맛에 맞을까, 동선이 꼬여 하루를 길에서 버리면 어쩌지.</b> 인원이 많을수록 계획은 더 복잡해집니다.',
      'GLUX는 <b>가족 구성원 한 명 한 명</b>에 맞춰 일정을 설계합니다. 유아·어르신의 컨디션을 고려해 무리한 일정 대신 완급을 조절하고, 유모차와 짐은 전용차량이 실어 나르며, 식당은 아이 메뉴와 어르신 입맛까지 감안해 미리 예약합니다.',
      '오사카는 공항에서 가깝고 유니버설·도톤보리·구로몬시장은 물론 <b>교토(기모노·사찰)·나라(사슴공원)·고베(A5 와규)</b>까지 하루 단위로 이어집니다. 일본 생활 30년, 가이드 10년의 한국어 잘하는 현지인이 <b>대행사 없이 현지 가격 그대로</b> 온 가족을 모십니다.'
    ],
    areasTitle: '오사카 가족여행, 이런 경험이 기다립니다',
    areas: [
      { pin: 'USJ', h3: '유니버설 스튜디오 재팬', p: '아이들의 로망 USJ. 익스프레스·동선을 미리 챙겨 대기 시간을 줄이고, 슈퍼 닌텐도 월드와 미니언즈까지 알차게 즐깁니다. 지친 오후엔 전용차량이 바로 대기합니다.' },
      { pin: 'NAMBA', h3: '도톤보리 · 구로몬시장', p: '글리코 사인 앞 온 가족 인증샷, 타코야키·오코노미야키·게 요리. 구로몬시장에서 신선한 해산물과 제철 과일까지, 오사카는 눈도 입도 즐거운 미식의 천국입니다.' },
      { pin: 'NARA', h3: '나라 사슴공원 · 도다이지', p: '자유롭게 노니는 사슴에게 센베이를 건네는 순간 아이들의 웃음이 터집니다. 세계 최대 목조건축 도다이지의 거대한 대불은 어른에게도 깊은 울림을 남깁니다.' },
      { pin: 'KYOTO', h3: '교토 기모노 · 사찰', p: '기모노를 입고 기요미즈데라, 후시미이나리의 천 개 붉은 도리이를 걷는 특별한 하루. 온 가족의 ‘인생 사진’이 남는 시간입니다.' }
    ],
    forWhom: [
      '아이와 함께 <b>처음 일본 가족여행</b>을 계획하는 분',
      '<b>부모님을 모시고</b> 편안한 효도여행을 원하는 분',
      '대중교통 · 짐 · 동선 <b>스트레스 없이</b> 쉬고 싶은 분',
      '유니버설과 관광, 미식을 <b>알차게 다 담고</b> 싶은 분',
      '인원이 많아 계획이 복잡한 <b>3대 · 대가족</b>'
    ],
    whyGlux: [
      '일본 생활 30년 · 가이드 10년의 <b>한국어 잘하는 현지인</b>이 직접 운영',
      '유아 · 어르신 동반을 고려한 <b>완급 있는 맞춤 일정</b>',
      '<b>전용차량 공항 픽업</b>으로 짐 · 이동 스트레스 최소화',
      '맛집 · 료칸을 현지 관계로 <b>우선 예약</b>',
      '대행사 마진 0 — <b>현지 가격 그대로</b>'
    ],
    itinerary: [
      '(오전) 간사이공항 도착 → 한국어 가이드·전용차량 픽업 (오후) 숙소 체크인·휴식 (저녁) 도톤보리 길거리 미식 & 글리코 사인 인증샷',
      '(종일) 유니버설 스튜디오 재팬 — 익스프레스 동선으로 알차게 / 또는 나라 사슴공원 + 도다이지 (가족 취향대로 선택)',
      '(오전) 구로몬시장·신사이바시 쇼핑 또는 교토 기모노 체험 (오후) 공항 송영 → 따뜻한 추억 안고 출국'
    ],
    reviews: [
      { s: 5, txt: '아이 둘 데리고 갔는데 유모차 이동까지 배려해주셔서 편했어요. 도톤보리·유니버설 동선을 알아서 짜주셔서 하나도 안 힘들었습니다.', name: '박OO님', trip: '가족여행 3박4일' },
      { s: 5, txt: '부모님 모시고 간 여행. 어르신 페이스에 맞춰 완만하게 일정 짜주시고 맛집도 입맛에 맞게 예약해주셔서 감동이었어요.', name: '최OO님', trip: '효도 가족여행 2박3일' },
      { s: 5, txt: '현지인만 아는 맛집 리스트가 진짜였습니다. 아이들도 어른들도 다 만족한 여행이었어요.', name: '한OO님', trip: '가족여행 2박3일' }
    ],
    faq: [
      { q: '아이가 어린데 일정이 힘들지 않을까요?', a: '유아·어린이 동반에 맞춰 이동과 휴식을 조절한 일정을 설계합니다. 전용차량이라 유모차·짐도 문제없습니다.' },
      { q: '부모님을 모시고 가는데 괜찮을까요?', a: '어르신 페이스에 맞춘 완만한 코스와 좌식/온천 등을 반영합니다. 효도여행 상담을 편하게 남겨 주세요.' },
      { q: '오사카만 보나요, 교토·나라도 가나요?', a: '오사카를 베이스로 교토·나라·고베까지 자유롭게 연계됩니다. 원하시는 곳 위주로 설계합니다.' },
      { q: '공항 픽업이 포함인가요?', a: '전용차량 공항 픽업·송영을 기본으로 제공합니다. 도착 즉시 편하게 이동하실 수 있습니다.' }
    ],
    ctaSub: '오사카 가족여행, 아이·부모님 상황에 맞춰 24시간 내 맞춤 견적을 보내드립니다.'
  },
  {
    slug: 'kyoto-ryokan', kw: '교토 온천 료칸 여행', galleryReal: true,
    title: '교토 온천·료칸 여행 | 프라이빗 료칸 우선 예약 — GLUX Tour',
    ogTitle: '교토 온천·료칸 여행 | 프라이빗 — GLUX Tour',
    description: '교토 온천·료칸 여행 전문 GLUX. 예약 어려운 프라이빗 료칸 우선 배정, 가이세키·기모노 체험 연계, 현지 20년 직거래. 전용차량·한국어 현지인 케어.',
    tag: 'KYOTO RYOKAN · 현지 직영', h1a: '교토 온천·료칸 여행', h1b: '예약 어려운 료칸, 우선 배정',
    lead: '개인 예약이 어려운 프라이빗 온천 료칸을 20년 직거래 관계로 우선 배정해 드립니다. 가이세키 만찬·기모노 체험·사찰 산책까지 교토의 정취를 한 번에.',
    whyTitle: '교토 료칸 여행의 매력', whyLabel: 'Why Kyoto',
    whyBody: [
      '교토는 <b>일본 전통의 정수</b>가 살아있는 도시입니다. 프라이빗 온천이 딸린 료칸에서의 하룻밤은 여행의 격을 완전히 바꿔 줍니다.',
      '벚꽃의 봄, 단풍의 가을은 물론 <b>사계절 언제 와도 다른 얼굴</b>을 보여주는 곳이 교토입니다. 아라시야마 대나무숲, 기요미즈데라, 기온 거리까지 걸음마다 그림이 됩니다.',
      '다만 인기 료칸은 <b>개인 예약이 매우 어렵습니다.</b> GLUX는 현지 직거래로 우선 배정이 가능합니다.'
    ],
    areasTitle: '교토 료칸 여행 하이라이트',
    areas: [
      { pin: 'RYOKAN', h3: '프라이빗 온천 료칸', p: '객실 노천탕·가이세키 만찬이 있는 인기 료칸을 우선 배정.' },
      { pin: 'ARASHIYAMA', h3: '아라시야마', p: '대나무숲·도게츠교의 사계절 절경 산책 코스.' },
      { pin: 'CULTURE', h3: '기모노·사찰', p: '기모노 입고 기요미즈데라·후시미이나리 산책.' },
      { pin: 'UJI', h3: '우지 말차', p: '우지 말차 디저트·다도 체험으로 여유로운 하루.' }
    ],
    whyGlux: [
      '<b>예약 어려운 프라이빗 료칸 우선 배정</b> (20년 직거래)',
      '가이세키 · 기모노 등 <b>정통 체험 코디</b>',
      '일본 30년 · 가이드 10년 <b>한국어 현지인</b> 케어',
      '<b>전용차량</b>으로 료칸 · 명소 이동 편안하게',
      '대행사 마진 0 — <b>현지 가격 그대로</b>'
    ],
    itinerary: [
      '간사이공항 → 교토 이동 → 아라시야마 → 프라이빗 료칸 체크인·가이세키',
      '기모노 체험 → 기요미즈데라·후시미이나리 → 온천 휴식',
      '우지 말차·쇼핑 → 공항 송영 → 출국'
    ],
    reviews: [
      { s: 5, txt: '개인적으로 예약이 안 되던 료칸을 잡아주셔서 놀랐어요. 객실 노천탕과 가이세키가 인생 경험이었습니다.', name: '윤OO님', trip: '교토 료칸 2박3일' },
      { s: 5, txt: '기모노 입고 기요미즈데라 산책, 저녁엔 료칸 온천. 교토의 정취를 제대로 느꼈어요. 코디가 완벽했습니다.', name: '서OO님', trip: '커플 여행 2박3일' },
      { s: 5, txt: '조용하고 프라이빗한 료칸을 원했는데 딱 맞게 추천해주셨어요. 다시 가고 싶은 여행.', name: '임OO님', trip: '가족 여행 3박4일' }
    ],
    faq: [
      { q: '료칸 예약이 정말 어렵다던데 가능한가요?', a: '인기 프라이빗 료칸은 개인 예약이 매우 어렵습니다. GLUX는 현지 20년 직거래 관계로 우선 배정이 가능합니다.' },
      { q: '가이세키·기모노 체험도 되나요?', a: '료칸 가이세키 만찬, 기모노 체험, 다도 등 정통 체험을 일정에 함께 코디해 드립니다.' },
      { q: '커플/가족 모두 괜찮나요?', a: '커플·가족·효도여행 모두 맞춤 설계됩니다. 인원과 분위기에 맞춰 료칸을 추천드립니다.' },
      { q: '온천은 개인탕인가요?', a: '객실 노천탕 또는 프라이빗 온천이 있는 료칸을 우선 안내해 프라이버시를 지켜 드립니다.' }
    ],
    ctaSub: '교토 온천·료칸 여행, 원하시는 분위기에 맞춰 24시간 내 맞춤 견적을 보내드립니다.'
  },
  {
    slug: 'arima-onsen', kw: '아리마온천 여행', galleryReal: true,
    title: '아리마온천 여행 | 일본 3대 온천 힐링 패키지 — GLUX Tour',
    ogTitle: '아리마온천 여행 | 힐링 패키지 — GLUX Tour',
    description: '아리마온천 여행 전문 GLUX. 일본 3대 온천 아리마의 프라이빗 료칸, 고베 미식·야경 연계, 전용차량 공항 픽업. 현지 30년 직영, 한국어 현지인 케어.',
    tag: 'ARIMA ONSEN · 현지 직영', h1a: '아리마온천 여행', h1b: '일본 3대 온천에서의 힐링',
    lead: '고베 근교 아리마온천은 일본 3대 온천으로 꼽히는 대표 온천지입니다. 금탕·은탕과 프라이빗 료칸, 고베 미식·야경을 함께 즐기는 힐링 여행을 설계합니다.',
    whyTitle: '왜 아리마온천인가', whyLabel: 'Why Arima',
    whyBody: [
      '아리마온천은 <b>오사카·고베에서 가까워 접근성이 뛰어난 온천지</b>입니다. 짧은 일정에도 진짜 온천 힐링이 가능합니다.',
      '<b>금탕(철분)·은탕(탄산)</b>의 독특한 온천과 전통 료칸, 유카타 차림의 온천 마을 산책은 일상에서 완전히 벗어난 휴식을 선사합니다.',
      '고베 A5 와규와 롯코·마야산 야경까지 연계되어, <b>어른들의 힐링 여행과 효도여행</b>에 특히 인기입니다.'
    ],
    areasTitle: '아리마온천 여행 하이라이트',
    areas: [
      { pin: 'ONSEN', h3: '금탕·은탕', p: '아리마 특유의 금탕(철분)·은탕(탄산) 온천으로 피로를 풀어보세요.' },
      { pin: 'RYOKAN', h3: '프라이빗 료칸', p: '객실 온천·가이세키가 있는 전통 료칸 우선 배정.' },
      { pin: 'KOBE', h3: '고베 미식·야경', p: 'A5 와규와 롯코·마야산 야경으로 완성하는 하루.' },
      { pin: 'TOWN', h3: '온천 마을 산책', p: '유카타 입고 즐기는 아리마 온천 거리 산책.' }
    ],
    whyGlux: [
      '<b>아리마 프라이빗 료칸 우선 배정</b>',
      '고베 미식 · 야경 <b>연계 코스</b> 설계',
      '일본 30년 · 가이드 10년 <b>한국어 현지인</b> 케어',
      '<b>전용차량 공항 픽업</b>으로 이동 편안하게',
      '대행사 마진 0 — <b>현지 가격 그대로</b>'
    ],
    itinerary: [
      '간사이공항 → 고베 → 아리마온천 료칸 체크인·가이세키·온천',
      '온천 마을 산책 → 고베 와규 점심 → 롯코/마야산 야경',
      '오전 휴식·쇼핑 → 공항 송영 → 출국'
    ],
    reviews: [
      { s: 5, txt: '금탕·은탕 둘 다 경험하고 왔어요. 아리마 료칸이 정말 좋았고 고베 와규 저녁까지 완벽했습니다.', name: '조OO님', trip: '아리마온천 2박3일' },
      { s: 5, txt: '부모님 효도여행으로 갔는데 온천 중심 완만한 일정이라 너무 만족하셨어요. 감사합니다.', name: '강OO님', trip: '효도 온천여행 2박3일' },
      { s: 5, txt: '공항 픽업부터 끝까지 케어받는 느낌. 힐링이 필요했는데 제대로 쉬고 왔습니다.', name: '오OO님', trip: '커플 힐링여행 2박3일' }
    ],
    faq: [
      { q: '아리마온천은 어디에 있나요?', a: '고베 근교에 위치해 오사카·간사이공항에서 전용차량으로 편하게 이동할 수 있는 대표 온천지입니다.' },
      { q: '금탕·은탕이 뭔가요?', a: '아리마 특유의 철분 함유 온천(금탕)과 탄산·라듐 온천(은탕)을 말합니다. 두 온천 모두 경험하실 수 있게 안내합니다.' },
      { q: '온천만 하나요, 관광도 되나요?', a: '고베 미식·야경, 오사카·교토 관광과 자유롭게 연계됩니다. 힐링 위주 또는 관광 병행 모두 가능합니다.' },
      { q: '부모님 효도여행으로 좋을까요?', a: '완만한 일정과 온천 중심 구성으로 효도여행에 특히 인기입니다. 어르신 페이스에 맞춰 설계해 드립니다.' }
    ],
    ctaSub: '아리마온천 힐링 여행, 원하시는 일정에 맞춰 24시간 내 맞춤 견적을 보내드립니다.'
  },
  {
    slug: 'nara-family', kw: '나라 여행', galleryReal: true,
    title: '나라 여행 | 사슴공원·도다이지 가족여행 — GLUX Tour',
    ogTitle: '나라 여행 | 사슴공원·도다이지 — GLUX Tour',
    description: '나라 여행 전문 GLUX. 사슴공원·도다이지 대불·나라마치까지, 오사카·교토에서 편하게 연계하는 가족여행. 전용차량·한국어 현지인 케어, 현지 30년 직영.',
    tag: 'NARA · 현지 직영', h1a: '나라 여행', h1b: '사슴공원과 천년 고찰',
    lead: '오사카·교토에서 가까운 나라는 사슴공원과 도다이지 대불로 유명한 가족여행 명소입니다. 아이도 어른도 좋아하는 여유로운 하루를 전용차량으로 편하게 설계해 드립니다.',
    whyTitle: '왜 나라 여행인가', whyLabel: 'Why Nara',
    whyBody: [
      '나라는 <b>오사카·교토에서 당일치기로 다녀오기 좋은</b> 천년 고도입니다. 이동이 짧아 가족여행 일정에 부담 없이 넣을 수 있습니다.',
      '<b>나라공원의 사슴</b>은 아이들에게 잊지 못할 경험을 선사하고, <b>도다이지의 거대한 대불</b>은 어른들에게도 깊은 인상을 남깁니다.',
      '전통 거리 나라마치 산책과 현지 맛집까지, GLUX가 <b>동선과 시간을 알아서 챙겨</b> 여유로운 하루를 만들어 드립니다.'
    ],
    areasTitle: '나라 여행 하이라이트',
    areas: [
      { pin: 'NARA PARK', h3: '나라 사슴공원', p: '자유롭게 노니는 사슴에게 먹이 주기. 아이들이 가장 좋아하는 코스.' },
      { pin: 'TODAIJI', h3: '도다이지 대불', p: '세계 최대 목조 건축과 거대한 청동 대불. 나라의 상징.' },
      { pin: 'NARAMACHI', h3: '나라마치', p: '전통 가옥이 늘어선 옛 거리. 카페·공예 산책이 즐겁습니다.' },
      { pin: 'CONNECT', h3: '오사카·교토 연계', p: '오사카·교토 일정에 반나절~하루로 자연스럽게 연결됩니다.' }
    ],
    whyGlux: [
      '오사카·교토와 <b>매끄럽게 연계</b>하는 맞춤 동선',
      '아이 · 어르신 모두 편안한 <b>여유로운 페이스</b>',
      '<b>전용차량</b>으로 사슴공원·도다이지 이동 편리',
      '현지 맛집 · 카페 <b>코디</b>',
      '일본 30년 · 가이드 10년 <b>한국어 현지인</b> 케어'
    ],
    itinerary: [
      '오사카/교토 출발 → 전용차량 → 나라공원 사슴 먹이주기',
      '도다이지 대불 관람 → 점심 → 나라마치 산책',
      '오후 카페·쇼핑 → 오사카/교토 복귀 (또는 다음 일정 연계)'
    ],
    reviews: [
      { s: 5, txt: '사슴공원에서 아이들이 너무 좋아했어요. 오사카에서 당일치기로 편하게 다녀왔습니다.', name: '백OO님', trip: '가족여행 (나라 당일)' },
      { s: 5, txt: '도다이지 대불 규모에 놀랐고, 가이드님 설명 덕에 더 뜻깊었어요. 사진도 예쁘게 찍어주셨습니다.', name: '신OO님', trip: '가족여행 2박3일' },
      { s: 5, txt: '어른 아이 모두 만족한 여유로운 하루. 나라마치 산책도 좋았어요.', name: '황OO님', trip: '가족여행 3박4일' }
    ],
    faq: [
      { q: '나라만 따로 가나요, 오사카·교토와 함께 가나요?', a: '보통 오사카·교토 일정에 반나절~하루로 연계합니다. 물론 나라 중심 일정도 설계 가능합니다.' },
      { q: '사슴에게 먹이를 줘도 안전한가요?', a: '지정된 사슴센베이로 안전하게 먹이 주기가 가능합니다. 아이들과 함께 즐기기 좋은 체험입니다.' },
      { q: '아이·부모님과 가기 좋은가요?', a: '이동이 짧고 코스가 완만해 유아·어르신 동반에 특히 좋습니다. 페이스에 맞춰 설계해 드립니다.' },
      { q: '전용차량으로 이동하나요?', a: '네, 전용차량으로 공항·숙소·나라를 편하게 이동합니다. 대중교통 환승 걱정이 없습니다.' }
    ],
    ctaSub: '나라 여행, 오사카·교토 연계까지 24시간 내 맞춤 견적을 보내드립니다.'
  },
  {
    slug: 'kobe-food', kw: '고베 미식여행', galleryReal: true,
    title: '고베 미식여행 | A5 고베규·항구 야경 프라이빗 투어 — GLUX Tour',
    ogTitle: '고베 미식여행 | A5 고베규·야경 — GLUX Tour',
    description: '고베 미식여행 전문 GLUX. 최고급 A5 고베규, 하버랜드 항구 야경, 롯코·마야산 전망까지. 전용차량·한국어 현지인 케어, 현지 30년 직영. 아리마온천 연계.',
    tag: 'KOBE GOURMET · 현지 직영', h1a: '고베 미식여행', h1b: 'A5 고베규와 항구 야경',
    lead: '세계가 인정한 A5 고베규, 이국적인 항구도시의 야경, 그리고 롯코·마야산 전망까지. 고베의 미식과 낭만을 전용차량으로 편안하게 즐기는 프라이빗 여행입니다.',
    whyTitle: '왜 고베 미식여행인가', whyLabel: 'Why Kobe',
    whyBody: [
      '고베는 <b>일본 최고의 소고기 A5 고베규</b>의 본고장입니다. 현지 직영이기에 예약 어려운 철판구이 명점도 안내가 가능합니다.',
      '개항 도시 특유의 <b>이국적인 거리와 하버랜드 항구 야경</b>, 롯코·마야산에서 내려다보는 "1,000만 불 야경"은 커플·가족 모두에게 잊지 못할 밤을 선사합니다.',
      '오사카에서 가깝고 <b>아리마온천과도 바로 연결</b>되어, 미식·야경·온천을 하루에 묶기에 최적입니다.'
    ],
    areasTitle: '고베 미식여행 하이라이트',
    areas: [
      { pin: 'KOBE BEEF', h3: 'A5 고베규', p: '엄선한 철판구이 명점에서 즐기는 최고급 고베규 코스.' },
      { pin: 'HARBORLAND', h3: '하버랜드 야경', p: '모자이크·포트타워의 로맨틱한 항구 야경 산책.' },
      { pin: 'ROKKO', h3: '롯코·마야산', p: '1,000만 불 야경으로 불리는 파노라마 전망.' },
      { pin: 'ARIMA', h3: '아리마온천 연계', p: '미식 후 아리마온천으로 이어지는 힐링 코스.' }
    ],
    whyGlux: [
      '예약 어려운 <b>고베규 명점 안내</b>',
      '항구 야경·롯코 전망 <b>최적 동선 설계</b>',
      '일본 30년 · 가이드 10년 <b>한국어 현지인</b> 케어',
      '<b>전용차량</b>으로 야경 명소까지 편안하게',
      '대행사 마진 0 — <b>현지 가격 그대로</b>'
    ],
    itinerary: [
      '간사이공항 → 고베 → 하버랜드 산책 → A5 고베규 만찬',
      '오전 이진칸·거리 산책 → 점심 → 롯코/마야산 야경',
      '아리마온천 연계 또는 쇼핑 → 공항 송영 → 출국'
    ],
    reviews: [
      { s: 5, txt: '고베규 철판구이가 인생 소고기였어요. 예약 어려운 곳을 잡아주셔서 감사했습니다. 야경도 최고.', name: '문OO님', trip: '고베 미식 2박3일' },
      { s: 5, txt: '항구 야경 산책하고 A5 소고기 먹고, 다음날 아리마온천까지. 완벽한 코스였습니다.', name: '류OO님', trip: '커플 미식여행 2박3일' },
      { s: 5, txt: '부모님 모시고 갔는데 소고기도 야경도 다 좋아하셨어요. 전용차량이라 편했습니다.', name: '장OO님', trip: '효도 미식여행 2박3일' }
    ],
    faq: [
      { q: '고베규 맛집 예약도 해주나요?', a: '예약이 어려운 철판구이 명점을 인원·예산에 맞춰 추천·예약해 드립니다.' },
      { q: '야경은 어디가 좋나요?', a: '하버랜드 항구 야경과 롯코·마야산 전망을 추천합니다. 일정·날씨에 맞춰 최적 동선을 안내합니다.' },
      { q: '오사카·아리마온천과 함께 가나요?', a: '오사카에서 가깝고 아리마온천과 바로 연결되어 미식·야경·온천을 하루에 묶을 수 있습니다.' },
      { q: '커플·가족 모두 좋나요?', a: '미식과 야경 중심이라 커플·가족·효도여행 모두 인기입니다. 분위기에 맞춰 설계합니다.' }
    ],
    ctaSub: '고베 미식여행, 원하시는 코스로 24시간 내 맞춤 견적을 보내드립니다.'
  },
  {
    slug: 'shirahama-onsen', kw: '시라하마 온천여행', galleryReal: true,
    title: '시라하마 온천여행 | 와카야마 바다·엔게츠토 힐링 — GLUX Tour',
    ogTitle: '시라하마 온천여행 | 바다 온천 힐링 — GLUX Tour',
    description: '시라하마 온천여행 전문 GLUX. 와카야마 바다 절경 엔게츠토, 백사장, 노천 온천 힐링. 전용차량 공항 픽업, 현지 30년 직영, 한국어 현지인 케어.',
    tag: 'SHIRAHAMA ONSEN · 현지 직영', h1a: '시라하마 온천여행', h1b: '바다를 품은 온천 힐링',
    lead: '와카야마 시라하마는 하얀 백사장과 바다 절경, 노천 온천으로 유명한 힐링 온천지입니다. 상징적인 엔게츠토(둥근 바위섬)와 해안 온천을 전용차량으로 편안하게 즐겨보세요.',
    whyTitle: '왜 시라하마 온천인가', whyLabel: 'Why Shirahama',
    whyBody: [
      '시라하마는 <b>바다를 바라보며 온천을 즐길 수 있는</b> 드문 온천지입니다. 오사카에서 조금 벗어나 진짜 휴식을 원하는 분께 딱입니다.',
      '가운데가 뻥 뚫린 <b>엔게츠토(円月島) 바위섬의 석양</b>, 하얀 백사장, 해안 절벽은 사진마다 그림이 됩니다.',
      '한적하고 여유로운 분위기라 <b>커플·가족·효도여행</b>의 힐링 코스로 인기입니다.'
    ],
    areasTitle: '시라하마 온천여행 하이라이트',
    areas: [
      { pin: 'ENGETSUTO', h3: '엔게츠토(円月島)', p: '가운데가 뚫린 상징적 바위섬. 석양 명소로 유명합니다.' },
      { pin: 'ONSEN', h3: '해안 노천 온천', p: '바다를 바라보며 즐기는 노천 온천의 특별한 경험.' },
      { pin: 'BEACH', h3: '시라라하마 백사장', p: '눈부신 하얀 백사장과 에메랄드빛 바다.' },
      { pin: 'COAST', h3: '해안 절경', p: '산단베키 절벽 등 와카야마 해안의 웅장한 절경.' }
    ],
    whyGlux: [
      '<b>바다 전망 온천 료칸</b> 우선 안내',
      '엔게츠토 석양 등 <b>절경 명소 동선</b> 설계',
      '일본 30년 · 가이드 10년 <b>한국어 현지인</b> 케어',
      '<b>전용차량 공항 픽업</b>으로 먼 거리도 편안하게',
      '대행사 마진 0 — <b>현지 가격 그대로</b>'
    ],
    itinerary: [
      '간사이공항 → 시라하마 이동 → 온천 료칸 체크인 → 엔게츠토 석양',
      '해안 절경 산책 → 백사장 → 노천 온천 힐링',
      '오전 휴식 → 공항 송영 → 출국'
    ],
    reviews: [
      { s: 5, txt: '바다 보면서 하는 온천은 처음이었어요. 엔게츠토 석양이 정말 예뻤습니다. 힐링 제대로 하고 왔어요.', name: '남OO님', trip: '시라하마 온천 2박3일' },
      { s: 5, txt: '조용하고 여유로운 곳을 원했는데 딱이었어요. 부모님이 온천 너무 좋아하셨습니다.', name: '고OO님', trip: '효도 온천여행 2박3일' },
      { s: 5, txt: '오사카에서 조금 멀지만 전용차량이라 편했고, 그만한 가치가 있는 절경이었어요.', name: '유OO님', trip: '커플 힐링여행 2박3일' }
    ],
    faq: [
      { q: '시라하마는 어디에 있나요?', a: '와카야마현 해안에 위치한 온천지입니다. 간사이공항에서 전용차량으로 편하게 이동합니다.' },
      { q: '바다 전망 온천이 있나요?', a: '바다를 바라보며 즐기는 해안 노천 온천과 오션뷰 료칸을 우선 안내해 드립니다.' },
      { q: '오사카와 함께 일정을 짤 수 있나요?', a: '오사카·간사이 일정과 연계해 시라하마 1박을 넣는 구성이 인기입니다. 맞춤 설계해 드립니다.' },
      { q: '가족·효도여행에 좋을까요?', a: '한적하고 완만한 분위기라 가족·효도·커플 힐링 모두 좋습니다.' }
    ],
    ctaSub: '시라하마 온천여행, 바다 힐링 일정으로 24시간 내 맞춤 견적을 보내드립니다.'
  },
  {
    slug: 'osaka-golf', kw: '오사카 골프여행', galleryReal: false, galCount: 3,
    title: '오사카 골프여행 | 공항 근교 명문 CC 프라이빗 부킹 — GLUX Tour',
    ogTitle: '오사카 골프여행 | 근교 명문 CC — GLUX Tour',
    description: '오사카 골프여행 전문 GLUX. 간사이공항·시내 근교 명문 CC를 컨디션별로 직접 부킹. 도심 숙소·미식 연계, 전용차량·한국어 현지인 케어, 현지 30년 직영.',
    tag: 'OSAKA GOLF · 현지 직영', h1a: '오사카 골프여행', h1b: '공항 근교 명문 CC',
    lead: '간사이공항과 오사카 시내에서 가까운 명문 골프장을 컨디션별로 직접 부킹합니다. 짧은 일정에도 라운드와 도심 미식·관광을 함께 즐기는 프라이빗 골프여행.',
    whyTitle: '왜 오사카 골프여행인가', whyLabel: 'Why Osaka Golf',
    whyBody: [
      '오사카는 <b>공항·시내에서 골프장 접근성이 좋아</b> 도착 당일 라운드도 가능한 효율적인 골프 여행지입니다.',
      '라운드 후 <b>도톤보리 미식, 도심 쇼핑</b>으로 바로 이어져 골프+관광을 함께 즐기기에 최적입니다.',
      '동반 가족을 위한 <b>관광 코스 병행</b>도 자유롭게 설계됩니다.'
    ],
    areasTitle: '오사카 골프여행 하이라이트',
    areas: [
      { pin: 'ACCESS', h3: '공항 근접 코스', p: '간사이공항·시내에서 가까워 도착 당일 라운드도 가능.' },
      { pin: 'CITY', h3: '도심 숙소·미식', p: '라운드 후 도톤보리 미식·쇼핑으로 바로 연결.' },
      { pin: 'COURSE', h3: '컨디션 부킹', p: '실력·예산에 맞춘 명문 CC를 컨디션까지 확인 후 부킹.' },
      { pin: 'FAMILY', h3: '가족 관광 병행', p: '골프 안 하는 가족을 위한 관광 코스 동시 설계.' }
    ],
    whyGlux: [
      '<b>공항·시내 근교 명문 CC 직접 부킹</b>',
      '라운드+도심 미식·관광 <b>동선 최적화</b>',
      '일본 30년 · 가이드 10년 <b>한국어 현지인</b> 케어',
      '공항 픽업부터 라운드까지 <b>전용차량 올인원</b>',
      '대행사 마진 0 — <b>현지 가격 그대로</b>'
    ],
    itinerary: [
      '간사이공항 도착 → 픽업 → 근교 CC 오후 라운드 → 도톤보리 만찬',
      '오전 명문 CC 라운드 → 점심 → 오후 관광/쇼핑',
      '라운드 또는 자유시간 → 공항 송영 → 출국'
    ],
    reviews: [
      { s: 5, txt: '공항 근처라 도착하자마자 라운드했어요. 저녁엔 도톤보리 회식까지, 시간 알차게 썼습니다.', name: '권OO님', trip: '오사카 골프 2박3일' },
      { s: 5, txt: '골프치는 친구들이랑 갔는데 부킹·차량·식당 다 알아서 해주셔서 편했어요.', name: '손OO님', trip: '친구 골프여행 2박3일' },
      { s: 5, txt: '아내는 쇼핑, 저는 골프. 각자 원하는 걸 동시에 즐기게 짜주셔서 만족했습니다.', name: '배OO님', trip: '부부 여행 3박4일' }
    ],
    faq: [
      { q: '도착 당일 라운드가 되나요?', a: '공항 근교 코스라 도착 시간에 따라 당일 오후 라운드도 가능합니다. 항공편에 맞춰 설계합니다.' },
      { q: '골프와 관광을 같이 할 수 있나요?', a: '라운드 후 도톤보리 미식·쇼핑 등 도심 관광과 자유롭게 연계됩니다.' },
      { q: '골프 안 하는 가족도 함께 갈 수 있나요?', a: '동반 가족을 위한 관광 코스를 동시에 설계해 각자 즐기실 수 있습니다.' },
      { q: '골프장은 어떻게 정하나요?', a: '실력·예산·코스 취향에 맞춰 컨디션까지 확인해 직접 추천·부킹합니다.' }
    ],
    ctaSub: '오사카 골프여행, 라운드+관광 일정으로 24시간 내 맞춤 견적을 보내드립니다.'
  }
]

let count = 0
for (const p of PAGES) {
  const dir = path.join(OUT_ROOT, p.slug)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), render(p), 'utf8')
  console.log(`  ✓ /tour/${p.slug}/  (${p.kw})`)
  count++
}
console.log(`\n생성 완료: ${count}개 페이지`)
