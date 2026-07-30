/**
 * GLUX pSEO 랜딩페이지 생성기
 * 데이터(PAGES) → public/tour/{slug}/index.html 생성
 * 각 페이지: 브랜드 디자인 + 신청폼(관리자로 취합) + SEO 메타 + JSON-LD
 * 실행: node scripts/pseo/generate.js
 */
const fs = require('fs')
const path = require('path')

const KAKAO = 'https://open.kakao.com/o/gjyncvGi'
const OUT_ROOT = path.join(__dirname, '..', '..', 'public', 'tour')

// ── 공통 CSS (kansai-golf와 동일 톤) ──────────────────────────
const STYLE = `*{margin:0;padding:0;box-sizing:border-box}
:root{--ink:#08090c;--char:#141720;--slate:#1e2130;--mist:#7a7e8c;--silk:#e4e5ea;--paper:#f5f4f1;--cream:#faf9f6;--white:#fff;--gold:#b8956a;--gold-b:#d4ad78;--serif:'Cormorant Garamond',serif;--sans:'Noto Sans KR',-apple-system,sans-serif}
body{font-family:var(--sans);color:var(--char);background:var(--cream);line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
.wrap{max-width:920px;margin:0 auto;padding:0 20px}
.logo{font-family:var(--serif);font-weight:600;font-size:20px;letter-spacing:5px;color:var(--white)}.logo span{color:var(--gold)}
.top{position:sticky;top:0;z-index:50;background:rgba(8,9,12,.92);backdrop-filter:blur(8px)}
.top .wrap{display:flex;align-items:center;justify-content:space-between;height:56px}
.top a.home{color:rgba(255,255,255,.6);font-size:12.5px}
.hero{background:linear-gradient(180deg,#08090c,#141720);color:var(--white);padding:64px 0 56px;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 0%,rgba(184,149,106,.16),transparent)}
.hero .wrap{position:relative}
.crumb{font-size:11.5px;color:rgba(255,255,255,.4);letter-spacing:1px;margin-bottom:18px}
.crumb a{color:rgba(184,149,106,.85)}
.tag{display:inline-block;font-size:11px;letter-spacing:2px;color:var(--gold-b);border:1px solid rgba(184,149,106,.4);border-radius:20px;padding:5px 14px;margin-bottom:20px}
h1{font-family:var(--serif);font-weight:300;font-size:clamp(30px,6vw,52px);line-height:1.22;margin-bottom:18px}
h1 b{font-weight:600;color:var(--gold-b)}
.lead{font-size:clamp(14px,2vw,16px);color:rgba(255,255,255,.62);max-width:620px;font-weight:300;word-break:keep-all}
.hero-cta{display:flex;gap:12px;flex-wrap:wrap;margin-top:32px}
.btn{display:inline-flex;align-items:center;gap:8px;padding:14px 26px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;transition:transform .2s}
.btn:hover{transform:translateY(-2px)}
.btn-gold{background:var(--gold);color:var(--ink)}
.btn-line{border:1px solid rgba(255,255,255,.25);color:var(--white)}
.trust{display:flex;gap:22px;flex-wrap:wrap;margin-top:30px;font-size:12.5px;color:rgba(255,255,255,.5)}
.trust span::before{content:'✓ ';color:var(--gold)}
section.blk{padding:52px 0;border-bottom:1px solid #ececec}
.sov{font-size:11px;letter-spacing:3px;color:var(--gold);text-transform:uppercase;margin-bottom:12px}
h2{font-family:var(--serif);font-size:clamp(24px,4vw,36px);font-weight:500;color:var(--char);margin-bottom:20px;line-height:1.3;word-break:keep-all}
p.body{font-size:15px;color:#40434f;margin-bottom:14px;word-break:keep-all}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:24px}
.card{background:var(--white);border:1px solid #ececec;border-radius:12px;padding:22px}
.card h3{font-size:16px;color:var(--char);margin-bottom:8px}
.card p{font-size:13.5px;color:var(--mist);line-height:1.7}
.card .pin{font-size:11px;color:var(--gold);font-weight:700;letter-spacing:1px;margin-bottom:10px}
ul.pl{list-style:none;margin-top:16px}
ul.pl li{padding:9px 0 9px 26px;position:relative;font-size:14.5px;color:#40434f;border-bottom:1px solid #f0f0f0}
ul.pl li::before{content:'✦';position:absolute;left:0;color:var(--gold)}
.day{display:flex;gap:16px;padding:16px 0;border-bottom:1px solid #f0f0f0}
.day .d{flex-shrink:0;width:64px;font-family:var(--serif);font-size:22px;font-weight:600;color:var(--gold)}
.day .t{font-size:14.5px;color:#40434f}
.faq{border:1px solid #ececec;border-radius:12px;overflow:hidden;margin-top:10px}
.faq details{border-bottom:1px solid #ececec}.faq details:last-child{border-bottom:none}
.faq summary{padding:16px 20px;font-size:15px;font-weight:600;cursor:pointer;list-style:none;background:var(--white)}
.faq summary::-webkit-details-marker{display:none}
.faq p{padding:0 20px 18px;font-size:14px;color:var(--mist);line-height:1.7}
.cta{background:linear-gradient(180deg,#141720,#08090c);color:var(--white);text-align:center;padding:60px 20px}
.cta h2{color:var(--white)}
.cta>.wrap>p{color:rgba(255,255,255,.55);font-size:15px;margin-bottom:26px}
footer{background:var(--ink);color:rgba(255,255,255,.4);font-size:12px;padding:28px 0;text-align:center}
footer a{color:rgba(184,149,106,.7)}
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
.lform .ok p{color:var(--mist);font-size:13px}`

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const jstr = s => JSON.stringify(s)

function render(p) {
  const url = `https://gluxtour.com/tour/${p.slug}/`
  const areas = p.areas.map(a => `    <div class="card"><div class="pin">${a.pin}</div><h3>${a.h3}</h3><p>${a.p}</p></div>`).join('\n')
  const why = p.whyGlux.map(li => `    <li>${li}</li>`).join('\n')
  const days = p.itinerary.map((d, i) => `  <div class="day"><div class="d">DAY ${i + 1}</div><div class="t">${d}</div></div>`).join('\n')
  const faqHtml = p.faq.map(f => `    <details><summary>${f.q}</summary><p>${f.a}</p></details>`).join('\n')
  const faqLd = p.faq.map(f => `    {"@type":"Question","name":${jstr(f.q)},"acceptedAnswer":{"@type":"Answer","text":${jstr(f.a)}}}`).join(',\n')

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
<meta property="og:image" content="https://gluxtour.com/glux_thumbnail.png">
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

<header class="hero" style="background:linear-gradient(rgba(8,9,12,.66),rgba(8,9,12,.82)),url(../img/${p.slug}.jpg) center/cover">
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
  <div class="sov">${esc(p.whyLabel || 'Why')}</div>
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

<section class="blk"><div class="wrap">
  <div class="sov">Why GLUX</div>
  <h2>GLUX가 다른 점</h2>
  <ul class="pl">
${why}
  </ul>
</div></section>

<section class="blk"><div class="wrap">
  <div class="sov">Sample Course</div>
  <h2>추천 일정 예시</h2>
${days}
  <p class="body" style="margin-top:18px;font-size:13.5px;color:var(--mist)">* 일정·박수·인원은 100% 맞춤 설계됩니다.</p>
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
        <label>메모 (선택)</label><textarea id="lM" placeholder="희망 일정·예산·요청사항을 편하게 적어주세요"></textarea>
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

// ── 페이지 데이터 ────────────────────────────────────────────
const PAGES = [
  {
    slug: 'osaka-family', kw: '오사카 가족여행',
    title: '오사카 가족여행 | 아이·부모님 맞춤 프라이빗 여행 — GLUX Tour',
    ogTitle: '오사카 가족여행 | 프라이빗 맞춤 — GLUX Tour',
    description: '오사카 가족여행 전문 GLUX. 아이·부모님까지 편안한 프라이빗 맞춤 일정, 전용차량 공항 픽업, 현지 30년 직영. 교토·나라·고베 연계, 한국어 현지인 케어.',
    tag: 'OSAKA FAMILY · 현지 직영',
    h1a: '오사카 가족여행', h1b: '아이도 부모님도 편안하게',
    lead: '유니버설·도톤보리부터 교토·나라 관광까지, 가족 구성원 모두에게 맞춘 프라이빗 일정을 설계합니다. 전용차량 공항 픽업으로 짐·이동 걱정 없이 편안하게.',
    whyTitle: '왜 오사카 가족여행인가', whyLabel: 'Why Osaka',
    whyBody: [
      '오사카는 <b>간사이국제공항에서 가깝고 볼거리·먹거리가 집약</b>돼 있어 아이·어르신과 함께하기에 이동 부담이 적습니다.',
      '유니버설 스튜디오, 도톤보리, 교토·나라 관광까지 <b>하루 단위로 완급 조절</b>이 가능해 가족 여행의 베이스캠프로 최적입니다.'
    ],
    areasTitle: '가족여행 하이라이트',
    areas: [
      { pin: 'OSAKA', h3: '유니버설·도톤보리', p: '아이들이 좋아하는 USJ, 저녁엔 도톤보리 먹거리. 전용차량으로 편하게 이동합니다.' },
      { pin: 'KYOTO', h3: '교토 감성 체험', p: '기모노 체험·사찰 산책 등 온 가족이 즐기는 문화 코스.' },
      { pin: 'NARA', h3: '나라 사슴공원', p: '아이들에게 인기 만점. 오사카에서 당일치기로 다녀오기 좋습니다.' },
      { pin: 'KOBE', h3: '고베 미식·야경', p: 'A5 와규와 항구 야경으로 어른들의 만족까지 챙깁니다.' }
    ],
    whyGlux: [
      '일본 생활 30년·가이드 10년의 <b>한국어 잘하는 현지인</b>이 직접 운영',
      '유아·어르신 동반을 고려한 <b>완급 있는 맞춤 일정</b>',
      '<b>전용차량 공항 픽업</b>으로 짐·이동 스트레스 최소화',
      '맛집·료칸을 현지 관계로 <b>우선 예약</b>',
      '대행사 마진 0 — <b>현지 가격 그대로</b>'
    ],
    itinerary: [
      '간사이공항 도착 → 전용차량 픽업 → 숙소 → 도톤보리 저녁',
      '유니버설 스튜디오 또는 교토·나라 관광 (선택)',
      '오전 쇼핑·자유시간 → 공항 송영 → 출국'
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
    slug: 'kyoto-ryokan', kw: '교토 온천 료칸 여행',
    title: '교토 온천·료칸 여행 | 프라이빗 료칸 우선 예약 — GLUX Tour',
    ogTitle: '교토 온천·료칸 여행 | 프라이빗 — GLUX Tour',
    description: '교토 온천·료칸 여행 전문 GLUX. 예약 어려운 프라이빗 료칸 우선 배정, 가이세키·기모노 체험 연계, 현지 20년 직거래. 전용차량·한국어 현지인 케어.',
    tag: 'KYOTO RYOKAN · 현지 직영',
    h1a: '교토 온천·료칸 여행', h1b: '예약 어려운 료칸, 우선 배정',
    lead: '개인 예약이 어려운 프라이빗 온천 료칸을 20년 직거래 관계로 우선 배정해 드립니다. 가이세키 만찬·기모노 체험·사찰 산책까지 교토의 정취를 한 번에.',
    whyTitle: '교토 료칸 여행의 매력', whyLabel: 'Why Kyoto',
    whyBody: [
      '교토는 <b>일본 전통의 정수</b>가 살아있는 도시입니다. 프라이빗 온천이 딸린 료칸에서의 하룻밤은 여행의 격을 완전히 바꿔 줍니다.',
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
      '가이세키·기모노 등 <b>정통 체험 코디</b>',
      '일본 30년·가이드 10년 <b>한국어 현지인</b> 케어',
      '<b>전용차량</b>으로 료칸·명소 이동 편안하게',
      '대행사 마진 0 — <b>현지 가격 그대로</b>'
    ],
    itinerary: [
      '간사이공항 → 교토 이동 → 아라시야마 → 프라이빗 료칸 체크인·가이세키',
      '기모노 체험 → 기요미즈데라·후시미이나리 → 온천 휴식',
      '우지 말차·쇼핑 → 공항 송영 → 출국'
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
    slug: 'arima-onsen', kw: '아리마온천 여행',
    title: '아리마온천 여행 | 일본 3대 온천 힐링 패키지 — GLUX Tour',
    ogTitle: '아리마온천 여행 | 힐링 패키지 — GLUX Tour',
    description: '아리마온천 여행 전문 GLUX. 일본 3대 온천 아리마의 프라이빗 료칸, 고베 미식·야경 연계, 전용차량 공항 픽업. 현지 30년 직영, 한국어 현지인 케어.',
    tag: 'ARIMA ONSEN · 현지 직영',
    h1a: '아리마온천 여행', h1b: '일본 3대 온천에서의 힐링',
    lead: '고베 근교 아리마온천은 일본 3대 온천으로 꼽히는 대표 온천지입니다. 금탕·은탕과 프라이빗 료칸, 고베 미식·야경을 함께 즐기는 힐링 여행을 설계합니다.',
    whyTitle: '왜 아리마온천인가', whyLabel: 'Why Arima',
    whyBody: [
      '아리마온천은 <b>오사카·고베에서 가까워 접근성이 뛰어난 온천지</b>입니다. 짧은 일정에도 진짜 온천 힐링이 가능합니다.',
      '<b>금탕(철분)·은탕(탄산)</b>의 독특한 온천과 전통 료칸, 그리고 고베 미식·야경 연계로 어른들의 힐링 여행에 특히 인기입니다.'
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
      '고베 미식·야경 <b>연계 코스</b> 설계',
      '일본 30년·가이드 10년 <b>한국어 현지인</b> 케어',
      '<b>전용차량 공항 픽업</b>으로 이동 편안하게',
      '대행사 마진 0 — <b>현지 가격 그대로</b>'
    ],
    itinerary: [
      '간사이공항 → 고베 → 아리마온천 료칸 체크인·가이세키·온천',
      '온천 마을 산책 → 고베 와규 점심 → 롯코/마야산 야경',
      '오전 휴식·쇼핑 → 공항 송영 → 출국'
    ],
    faq: [
      { q: '아리마온천은 어디에 있나요?', a: '고베 근교에 위치해 오사카·간사이공항에서 전용차량으로 편하게 이동할 수 있는 대표 온천지입니다.' },
      { q: '금탕·은탕이 뭔가요?', a: '아리마 특유의 철분 함유 온천(금탕)과 탄산·라듐 온천(은탕)을 말합니다. 두 온천 모두 경험하실 수 있게 안내합니다.' },
      { q: '온천만 하나요, 관광도 되나요?', a: '고베 미식·야경, 오사카·교토 관광과 자유롭게 연계됩니다. 힐링 위주 또는 관광 병행 모두 가능합니다.' },
      { q: '부모님 효도여행으로 좋을까요?', a: '완만한 일정과 온천 중심 구성으로 효도여행에 특히 인기입니다. 어르신 페이스에 맞춰 설계해 드립니다.' }
    ],
    ctaSub: '아리마온천 힐링 여행, 원하시는 일정에 맞춰 24시간 내 맞춤 견적을 보내드립니다.'
  }
]

// ── 실행 ─────────────────────────────────────────────────────
let count = 0
for (const p of PAGES) {
  const dir = path.join(OUT_ROOT, p.slug)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), render(p), 'utf8')
  console.log(`  ✓ /tour/${p.slug}/  (${p.kw})`)
  count++
}
console.log(`\n생성 완료: ${count}개 페이지`)
console.log('sitemap에 추가할 URL:')
PAGES.forEach(p => console.log(`  https://gluxtour.com/tour/${p.slug}/`))
