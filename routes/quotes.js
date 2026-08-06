const express = require('express')
const router = express.Router()
const db = require('../db/store')

// 숫자 파싱(콤마·원·엔 등 제거)
const num = v => {
  if (v == null || v === '') return null
  const n = parseInt(String(v).replace(/[^0-9.-]/g, ''), 10)
  return isNaN(n) ? null : n
}

// 목록 (검색: ?q=이름/전화, 상태: ?status=)
router.get('/', async (req, res) => {
  try {
    const { q, status } = req.query
    let rows = await db.find('quotes')
    if (status) rows = rows.filter(r => r.status === status)
    if (q) {
      const t = q.toLowerCase()
      rows = rows.filter(r => `${r.name || ''}${r.phone || ''}${r.trip_name || ''}`.toLowerCase().includes(t))
    }
    rows = rows.sort((a, b) => b.id - a.id)
    res.json(rows)
  } catch (err) { console.error(err); res.status(500).json({ error: err.message }) }
})

// 통계
router.get('/stats', async (req, res) => {
  try {
    const rows = await db.find('quotes')
    const cnt = s => rows.filter(r => r.status === s).length
    res.json({ total: rows.length, quote: cnt('quote'), contract: cnt('contract'), completed: cnt('completed'), canceled: cnt('canceled') })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// 특정 고객의 견적 이력 (전화번호 기준)
router.get('/customer/:phone', async (req, res) => {
  try {
    const phone = req.params.phone
    let rows = await db.find('quotes', r => r.phone === phone)
    rows = rows.sort((a, b) => b.id - a.id)
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// 단건
router.get('/:id', async (req, res) => {
  try {
    const q = await db.findOne('quotes', r => r.id === parseInt(req.params.id))
    if (!q) return res.status(404).json({ error: '견적을 찾을 수 없습니다.' })
    res.json(q)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// 저장(생성) — 전화번호로 기존 고객과 연결(없으면 고객 신규 생성)
router.post('/', async (req, res) => {
  const { name, phone, trip_name, passengers, amount_jpy, amount_krw, exchange_rate, deposit, balance, memo } = req.body
  if (!name) return res.status(400).json({ error: '고객명은 필수입니다.' })
  try {
    let cust = null
    if (phone) {
      cust = await db.findOne('customers', c => c.phone === phone)
      if (!cust) cust = await db.insert('customers', { name, phone, email: null })
      else await db.update('customers', c => c.id === cust.id, { name })
    }
    const q = await db.insert('quotes', {
      customer_id: cust ? cust.id : null,
      name, phone: phone || null, trip_name: trip_name || null,
      passengers: parseInt(passengers) || 1,
      amount_jpy: num(amount_jpy), amount_krw: num(amount_krw),
      exchange_rate: exchange_rate ? parseFloat(exchange_rate) : null,
      deposit: num(deposit), balance: num(balance),
      status: 'quote', memo: memo || null
    })
    res.json({ id: q.id, customer_id: q.customer_id })
  } catch (err) { console.error(err); res.status(500).json({ error: err.message }) }
})

// 수정(예전 견적 편집: 내용·금액·상태·메모)
router.patch('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const b = req.body
  const patch = {}
  for (const k of ['name', 'phone', 'trip_name', 'memo', 'status']) if (k in b) patch[k] = b[k]
  if ('passengers' in b) patch.passengers = parseInt(b.passengers) || 1
  if ('exchange_rate' in b) patch.exchange_rate = b.exchange_rate ? parseFloat(b.exchange_rate) : null
  for (const k of ['amount_jpy', 'amount_krw', 'deposit', 'balance']) if (k in b) patch[k] = num(b[k])
  try {
    const q = await db.findOne('quotes', r => r.id === id)
    if (!q) return res.status(404).json({ error: '견적을 찾을 수 없습니다.' })
    await db.update('quotes', r => r.id === id, patch)
    res.json({ ok: true })
  } catch (err) { console.error(err); res.status(500).json({ error: err.message }) }
})

// 삭제
router.delete('/:id', async (req, res) => {
  try {
    await db.remove('quotes', r => r.id === parseInt(req.params.id))
    res.json({ ok: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

module.exports = router
