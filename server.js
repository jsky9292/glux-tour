require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 4567

// ── 관리자 인증 ──────────────────────────────────────────────
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin1234'

function parseCookies(req) {
  const out = {}
  ;(req.headers.cookie || '').split(';').forEach(c => {
    const idx = c.indexOf('=')
    if (idx > 0) out[c.slice(0, idx).trim()] = c.slice(idx + 1).trim()
  })
  return out
}

app.use(cors())
app.use(express.json({ type: ['application/json', 'text/plain'] }))

// 모든 응답에 UTF-8 명시
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  const orig = res.json.bind(res)
  res.json = function(body) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    return orig(body)
  }
  next()
})

// 로그인/로그아웃 (인증 미들웨어보다 먼저)
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body
  if (username === 'admin' && password === ADMIN_PASS) {
    res.setHeader('Set-Cookie', `glux_admin=${ADMIN_PASS}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`)
    return res.json({ success: true })
  }
  res.status(401).json({ error: '아이디 또는 비밀번호가 틀렸습니다.' })
})

app.get('/api/admin/logout', (req, res) => {
  res.setHeader('Set-Cookie', 'glux_admin=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0')
  res.redirect('/admin/login')
})

// /admin/* 접근 보호 (로그인 페이지 제외)
app.use('/admin', (req, res, next) => {
  if (req.path === '/login' || req.path === '/login.html') return next()
  const cookies = parseCookies(req)
  if (cookies.glux_admin === ADMIN_PASS) return next()
  return res.redirect('/admin/login')
})

// ── 정적 파일 ────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')))

// ── API 인증 가드(고객정보 보호) ─────────────────────────────
// 관리자 로그인 쿠키가 있어야만 접근 허용
function requireAdmin(req, res, next) {
  if (parseCookies(req).glux_admin === ADMIN_PASS) return next()
  return res.status(401).json({ error: '관리자 인증이 필요합니다.' })
}

// ── API 라우터 ───────────────────────────────────────────────
// applications: 신규 신청 제출(POST /)만 공개, 조회·수정·삭제·일정은 관리자 전용
app.use('/api/applications', (req, res, next) => {
  if (req.method === 'POST' && (req.path === '/' || req.path === '')) return next() // 폼 제출 공개
  return requireAdmin(req, res, next)
})
app.use('/api/applications', require('./routes/applications'))
// vouchers·quotes: 전면 관리자 전용
app.use('/api/vouchers', requireAdmin, require('./routes/vouchers'))
app.use('/api/quotes', requireAdmin, require('./routes/quotes'))

// ── 관리자 페이지 경로 ───────────────────────────────────────
app.get('/admin/login', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/admin/login.html')))
app.get('/admin', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/admin/index.html')))
app.get('/admin/voucher', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/admin/voucher.html')))
app.get('/admin/estimate', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/admin/estimate.html')))
app.get('/admin/quote', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/admin/quote.html')))
app.get('/admin/crm', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/admin/crm.html')))

app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }))

// 텔레그램 알림 진단(환경변수 확인 + 테스트 발송)
app.get('/api/notify-test', async (req, res) => {
  const { sendTelegram } = require('./utils/notify')
  const token_set = !!process.env.TELEGRAM_BOT_TOKEN
  const chat_set = !!process.env.TELEGRAM_CHAT_ID
  let sent = false
  try { await sendTelegram('<b>[GLUX 테스트]</b> 프로덕션 알림 연결이 정상입니다.'); sent = token_set && chat_set } catch (e) {}
  res.json({ token_set, chat_set, sent })
})

// Vercel serverless exports
module.exports = app

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`GLUX Tour 서버 실행 중 → http://localhost:${PORT}`)
    console.log(`관리자 대시보드 → http://localhost:${PORT}/admin`)
  })
}
