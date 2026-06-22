const express = require('express')
const router = express.Router()
const db = require('../db/store')
const { sendVoucherEmail } = require('../utils/mailer')

router.get('/:appId', async (req, res) => {
  try {
    const appId = parseInt(req.params.appId)
    const v = await db.findOne('vouchers', v => v.application_id === appId)
    if (!v) return res.status(404).json({ error: '바우처가 없습니다.' })
    try { v.guide_notes = JSON.parse(v.guide_notes || '[]') } catch { v.guide_notes = [] }
    res.json(v)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { application_id, vehicle, balance, balance_note, includes, excludes, guide_notes } = req.body
    if (!application_id) return res.status(400).json({ error: 'application_id가 필요합니다.' })

    const appId = parseInt(application_id)
    const notes = JSON.stringify(Array.isArray(guide_notes) ? guide_notes : [])
    const data = {
      vehicle: vehicle || '',
      balance: balance || '',
      balance_note: balance_note || '',
      includes: includes || '',
      excludes: excludes || '',
      guide_notes: notes,
      sent_at: null
    }

    const existing = await db.findOne('vouchers', v => v.application_id === appId)
    if (existing) {
      await db.update('vouchers', v => v.application_id === appId, data)
    } else {
      await db.insert('vouchers', { ...data, application_id: appId })
    }

    const app = await db.findOne('applications', a => a.id === appId)
    if (app && app.status === 'pending') {
      await db.update('applications', a => a.id === appId, { status: 'confirmed' })
    }

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/:appId/send', async (req, res) => {
  try {
    const appId = parseInt(req.params.appId)

    const app = await db.findOne('applications', a => a.id === appId)
    if (!app) return res.status(404).json({ error: '신청 정보를 찾을 수 없습니다.' })

    const cust = (await db.findOne('customers', c => c.id === app.customer_id)) || {}
    if (!cust.email) return res.status(400).json({ error: '고객 이메일 주소가 없습니다.' })

    const voucher = await db.findOne('vouchers', v => v.application_id === appId)
    if (!voucher) return res.status(400).json({ error: '먼저 바우처를 저장하세요.' })

    const itinerary = (await db.find('itineraries', i => i.application_id === appId))
      .sort((a, b) => a.day_number - b.day_number)
    const appData = { ...app, ...cust }

    await sendVoucherEmail(appData, voucher, itinerary)
    const sentAt = new Date().toLocaleString('ko-KR', { hour12: false })
    await db.update('vouchers', v => v.application_id === appId, { sent_at: sentAt })
    await db.update('applications', a => a.id === appId, { status: 'voucher_sent' })
    res.json({ success: true })
  } catch (err) {
    console.error('[바우처 이메일 오류]', err.message)
    res.status(500).json({ error: `이메일 발송 실패: ${err.message}` })
  }
})

module.exports = router
