const nodemailer = require('nodemailer')

function getTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('이메일 환경변수(EMAIL_USER, EMAIL_PASS)가 설정되지 않았습니다.')
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })
}

const STYLE = {
  wrap: 'font-family:"Malgun Gothic",sans-serif;max-width:600px;margin:0 auto;padding:20px',
  header: 'background:#0f0f1a;color:white;padding:24px 28px;text-align:center;border-radius:10px 10px 0 0',
  logo: 'font-family:Arial,sans-serif;font-size:26px;font-weight:900;letter-spacing:3px',
  body: 'background:#f9fafb;padding:28px 32px;border-radius:0 0 10px 10px;border:1px solid #e5e7eb;border-top:none',
  table: 'width:100%;border-collapse:collapse;margin:16px 0;font-size:14px',
  thRow: 'background:#0f0f1a;color:white',
  th: 'padding:10px 14px;text-align:left',
  tdLabel: 'padding:10px 14px;background:#f3f4f6;font-weight:600;width:38%;border-bottom:1px solid #e5e7eb',
  tdValue: 'padding:10px 14px;border-bottom:1px solid #e5e7eb',
  notice: 'background:#D9251C;color:white;padding:14px 18px;border-radius:8px;margin:18px 0;font-size:14px',
  footer: 'font-size:12px;color:#9ca3af;margin-top:20px;text-align:center'
}

async function sendConfirmationEmail({ name, email, phone, package_type, departure_date, return_date, passengers, reservation_no }) {
  const transporter = getTransporter()

  await transporter.sendMail({
    from: `"GLUX Tour" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `[GLUX Tour] 여행 신청 접수 확인 — ${reservation_no}`,
    html: `
<div style="${STYLE.wrap}">
  <div style="${STYLE.header}">
    <div style="${STYLE.logo}">GL<span style="color:#D9251C">U</span>X <span style="font-size:16px;font-weight:400;letter-spacing:2px">TOUR</span></div>
    <p style="margin:6px 0 0;font-size:12px;color:#9ca3af">여행 신청 접수 확인</p>
  </div>
  <div style="${STYLE.body}">
    <h2 style="color:#0f0f1a;margin:0 0 10px">신청이 정상 접수되었습니다 ✓</h2>
    <p style="color:#374151;font-size:14px">안녕하세요, <strong>${name}</strong>님!<br>GLUX Tour에 신청해 주셔서 감사드립니다. 아래 내용을 확인해 주세요.</p>

    <table style="${STYLE.table}">
      <tr><td style="${STYLE.tdLabel}">예약번호</td><td style="${STYLE.tdValue}"><strong style="color:#D9251C">${reservation_no}</strong></td></tr>
      <tr><td style="${STYLE.tdLabel}">패키지</td><td style="${STYLE.tdValue}">${package_type}</td></tr>
      <tr><td style="${STYLE.tdLabel}">출발일</td><td style="${STYLE.tdValue}">${departure_date}</td></tr>
      <tr><td style="${STYLE.tdLabel}">귀국일</td><td style="${STYLE.tdValue}">${return_date}</td></tr>
      <tr><td style="${STYLE.tdLabel}">인원</td><td style="${STYLE.tdValue}">${passengers}명</td></tr>
      <tr><td style="${STYLE.tdLabel}">연락처</td><td style="${STYLE.tdValue}">${phone}</td></tr>
    </table>

    <div style="${STYLE.notice}">
      <strong>📞 담당자가 빠른 시일 내 연락드리겠습니다</strong><br>
      <span style="font-size:13px">문의: ${process.env.BUSINESS_KAKAO || 'KakaoTalk GLUX Tour'} | ${process.env.BUSINESS_PHONE || ''}</span>
    </div>

    <p style="${STYLE.footer}">본 메일은 자동 발송된 확인 메일입니다. 문의는 카카오톡으로 연락 주세요.</p>
  </div>
</div>`
  })
}

async function sendVoucherEmail(app, voucher, itinerary) {
  const transporter = getTransporter()

  const notes = (() => {
    try { return JSON.parse(voucher.guide_notes || '[]') } catch { return [] }
  })()

  const itinRows = itinerary.map(day => `
    <tr>
      <td style="padding:9px 12px;background:#f9fafb;border-bottom:1px solid #e5e7eb;font-weight:700;white-space:nowrap">${day.day_number}일차</td>
      <td style="padding:9px 12px;border-bottom:1px solid #e5e7eb">${day.date_label}</td>
      <td style="padding:9px 12px;border-bottom:1px solid #e5e7eb;white-space:nowrap">${day.pickup_time}</td>
      <td style="padding:9px 12px;border-bottom:1px solid #e5e7eb">${day.pickup_loc}</td>
    </tr>`).join('')

  const noteHtml = notes.length
    ? `<div style="background:#fafafa;border:1px solid #e5e7eb;border-radius:8px;padding:14px 18px;margin:16px 0">
        ${notes.map(n => `<p style="font-size:13px;margin:4px 0;padding-left:14px;position:relative"><span style="position:absolute;left:0;color:#D9251C;font-weight:700">**</span>${n}</p>`).join('')}
      </div>` : ''

  await transporter.sendMail({
    from: `"GLUX Tour" <${process.env.EMAIL_USER}>`,
    to: app.email,
    subject: `[GLUX Tour] 여행 바우처 발송 — ${app.reservation_no}`,
    html: `
<div style="${STYLE.wrap}">
  <div style="${STYLE.header}">
    <div style="${STYLE.logo}">GL<span style="color:#D9251C">U</span>X <span style="font-size:16px;font-weight:400;letter-spacing:2px">TOUR</span></div>
    <p style="margin:6px 0 0;font-size:12px;color:#9ca3af">TOUR VOUCHER</p>
  </div>
  <div style="${STYLE.body}">
    <h2 style="color:#0f0f1a;margin:0 0 10px">여행 바우처를 발송드립니다 🎌</h2>
    <p style="color:#374151;font-size:14px">안녕하세요, <strong>${app.name}</strong>님! 즐거운 여행 되세요 :)</p>

    <table style="${STYLE.table}">
      <tr><td style="${STYLE.tdLabel}">예약번호</td><td style="${STYLE.tdValue}"><strong>${app.reservation_no}</strong></td></tr>
      <tr><td style="${STYLE.tdLabel}">여행 날짜</td><td style="${STYLE.tdValue}">${app.departure_date} ~ ${app.return_date}</td></tr>
      <tr><td style="${STYLE.tdLabel}">차량</td><td style="${STYLE.tdValue}">${voucher.vehicle || '토요타 알파드 (8인승)'}</td></tr>
      <tr><td style="${STYLE.tdLabel}">잔금(현장결제)</td><td style="${STYLE.tdValue}"><strong>${voucher.balance || ''}</strong> ${voucher.balance_note || ''}</td></tr>
    </table>

    <h3 style="font-size:13px;font-weight:700;letter-spacing:1px;border-left:3px solid #D9251C;padding-left:8px;margin:18px 0 8px">여행 일정</h3>
    <table style="${STYLE.table}">
      <tr style="${STYLE.thRow}">
        <th style="${STYLE.th}">일차</th>
        <th style="${STYLE.th}">날짜</th>
        <th style="${STYLE.th}">픽업</th>
        <th style="${STYLE.th}">픽업 장소</th>
      </tr>
      ${itinRows}
    </table>

    ${noteHtml}

    <div style="${STYLE.notice}">
      <strong>📱 담당 가이드님이 카카오톡으로 연락드릴 예정입니다</strong><br>
      <span style="font-size:13px">문의: ${process.env.BUSINESS_KAKAO || 'KakaoTalk GLUX Tour'}</span>
    </div>

    <p style="${STYLE.footer}">본 메일은 자동 발송된 바우처 안내 메일입니다.</p>
  </div>
</div>`
  })
}

module.exports = { sendConfirmationEmail, sendVoucherEmail }
