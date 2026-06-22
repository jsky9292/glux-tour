const express = require('express')
const router = express.Router()
const db = require('../db/store')
const { sendConfirmationEmail } = require('../utils/mailer')

// 전체 목록
router.get('/', async (req, res) => {
  try {
    const { status } = req.query
    let apps = await db.find('applications', status ? r => r.status === status : null)
    apps = apps.sort((a, b) => b.id - a.id)

    const result = await Promise.all(apps.map(async a => {
      const cust = (await db.findOne('customers', c => c.id === a.customer_id)) || {}
      const hasVoucher = !!(await db.findOne('vouchers', v => v.application_id === a.id))
      return { ...a, name: cust.name, phone: cust.phone, email: cust.email, has_voucher: hasVoucher }
    }))
    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// 통계
router.get('/stats', async (req, res) => {
  try {
    const apps = await db.find('applications')
    const count = s => apps.filter(a => a.status === s).length
    res.json({
      total: apps.length,
      pending: count('pending'),
      confirmed: count('confirmed'),
      sent: count('voucher_sent'),
      completed: count('completed')
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 단건 상세
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const app = await db.findOne('applications', a => a.id === id)
    if (!app) return res.status(404).json({ error: '신청 정보를 찾을 수 없습니다.' })

    const cust = (await db.findOne('customers', c => c.id === app.customer_id)) || {}
    const itinerary = (await db.find('itineraries', i => i.application_id === id))
      .sort((a, b) => a.day_number - b.day_number)
    const voucher = await db.findOne('vouchers', v => v.application_id === id)
    if (voucher) {
      try { voucher.guide_notes = JSON.parse(voucher.guide_notes || '[]') } catch { voucher.guide_notes = [] }
    }

    res.json({ ...app, name: cust.name, phone: cust.phone, email: cust.email, itinerary, voucher })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 신규 신청
router.post('/', async (req, res) => {
  const { name, phone, email, package_type, departure_date, return_date, nights, passengers, requests } = req.body

  if (!name || !phone || !package_type || !departure_date || !return_date) {
    return res.status(400).json({ error: '필수 항목(이름, 연락처, 패키지, 날짜)을 입력해주세요.' })
  }

  try {
    let cust = await db.findOne('customers', c => c.phone === phone)
    if (!cust) {
      cust = await db.insert('customers', { name, phone, email: email || null })
    } else if (email) {
      await db.update('customers', c => c.id === cust.id, { email, name })
    }

    const rno = 'GLX' + Date.now().toString().slice(-8)
    const app = await db.insert('applications', {
      customer_id: cust.id,
      reservation_no: rno,
      package_type,
      departure_date,
      return_date,
      nights: parseInt(nights) || 0,
      passengers: parseInt(passengers) || 1,
      requests: requests || null,
      channel: '홈페이지',
      status: 'pending',
      admin_notes: null
    })

    if (email && process.env.EMAIL_USER && process.env.EMAIL_PASS !== 'your_gmail_app_password_here') {
      sendConfirmationEmail({ name, email, phone, package_type, departure_date, return_date, passengers, reservation_no: rno })
        .catch(err => console.error('[이메일 오류]', err.message))
    }

    res.json({ id: app.id, reservation_no: rno })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '서버 오류가 발생했습니다.' })
  }
})

// 상태/메모 업데이트
router.patch('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const { status, admin_notes } = req.body
    const patch = {}
    if (status !== undefined) patch.status = status
    if (admin_notes !== undefined) patch.admin_notes = admin_notes
    await db.update('applications', a => a.id === id, patch)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 삭제
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    await db.remove('itineraries', i => i.application_id === id)
    await db.remove('vouchers', v => v.application_id === id)
    await db.remove('applications', a => a.id === id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 일정 저장
router.post('/:id/itinerary', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const { days } = req.body
    if (!Array.isArray(days)) return res.status(400).json({ error: 'days 배열이 필요합니다.' })

    await db.remove('itineraries', i => i.application_id === id)
    for (let i = 0; i < days.length; i++) {
      const d = days[i]
      await db.insert('itineraries', {
        application_id: id,
        day_number: i + 1,
        date_label: d.date || '',
        pickup_time: d.pu?.time || '',
        pickup_loc: d.pu?.loc || '',
        dropoff_time: d.dr?.time || '',
        dropoff_loc: d.dr?.loc || '',
        schedule: d.schedule || '',
        note: d.note || ''
      })
    }

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
