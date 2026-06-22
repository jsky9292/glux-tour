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
app.use(express.json())

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

// ── API 라우터 ───────────────────────────────────────────────
app.use('/api/applications', require('./routes/applications'))
app.use('/api/vouchers', require('./routes/vouchers'))

// ── 관리자 페이지 경로 ───────────────────────────────────────
app.get('/admin/login', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/admin/login.html')))
app.get('/admin', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/admin/index.html')))
app.get('/admin/voucher', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/admin/voucher.html')))

app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }))

// Vercel serverless exports
module.exports = app

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`GLUX Tour 서버 실행 중 → http://localhost:${PORT}`)
    console.log(`관리자 대시보드 → http://localhost:${PORT}/admin`)
  })
}
