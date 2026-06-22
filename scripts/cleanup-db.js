require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

async function main() {
  const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

  console.log('Supabase 연결 중...')

  // 현재 데이터 확인
  const { data: customers } = await sb.from('customers').select('id, name, phone')
  const { data: applications } = await sb.from('applications').select('id')

  console.log(`\n현재 데이터:`)
  console.log(`  고객: ${customers?.length || 0}건`)
  console.log(`  신청: ${applications?.length || 0}건`)

  if ((customers?.length || 0) === 0) {
    console.log('\n삭제할 데이터 없음.')
    process.exit(0)
  }

  // 순서대로 삭제 (FK 제약 때문에 자식 테이블 먼저)
  const { error: e1 } = await sb.from('itineraries').delete().neq('id', 0)
  if (e1) console.warn('itineraries 삭제 경고:', e1.message)

  const { error: e2 } = await sb.from('vouchers').delete().neq('id', 0)
  if (e2) console.warn('vouchers 삭제 경고:', e2.message)

  const { error: e3 } = await sb.from('applications').delete().neq('id', 0)
  if (e3) { console.error('applications 삭제 실패:', e3.message); process.exit(1) }

  const { error: e4 } = await sb.from('customers').delete().neq('id', 0)
  if (e4) { console.error('customers 삭제 실패:', e4.message); process.exit(1) }

  // 확인
  const { data: check } = await sb.from('customers').select('id')
  console.log(`\n✅ 완료: 남은 고객 수 = ${check?.length || 0}`)
  console.log('이제 홈페이지에서 실제 신청 폼으로 테스트하세요.')
}

main().catch(err => { console.error(err); process.exit(1) })
