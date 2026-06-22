require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 4567

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/applications', require('./routes/applications'))
app.use('/api/vouchers', require('./routes/vouchers'))

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin/index.html'))
})
app.get('/admin/voucher', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin/voucher.html'))
})

app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }))

// Vercel serverless exports
module.exports = app

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`GLUX Tour 서버 실행 중 → http://localhost:${PORT}`)
    console.log(`관리자 대시보드 → http://localhost:${PORT}/admin`)
  })
}
