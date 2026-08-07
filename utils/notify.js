// 새 문의 알림 — 텔레그램 봇으로 전송(번호 무관·무료·즉시)
// 필요 env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
async function sendTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chat = process.env.TELEGRAM_CHAT_ID
  if (!token || !chat) return // 미설정 시 조용히 무시
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text, parse_mode: 'HTML', disable_web_page_preview: true }),
    })
  } catch (e) {
    console.error('[telegram] ' + e.message)
  }
}

// 새 신청(문의) 알림 포맷
function notifyNewApplication(a) {
  const line = (k, v) => v ? `${k}: ${escapeHtml(String(v))}\n` : ''
  const text =
    `<b>[새 여행 문의]</b>\n` +
    line('이름', a.name) +
    line('연락처', a.phone) +
    line('상품', a.package_type) +
    line('희망일', [a.departure_date, a.return_date].filter(Boolean).join(' ~ ')) +
    line('요청', a.requests) +
    line('예약번호', a.reservation_no) +
    `\n관리자: https://gluxtour.com/admin`
  return sendTelegram(text)
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

module.exports = { sendTelegram, notifyNewApplication }
