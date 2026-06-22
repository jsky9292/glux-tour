const { createClient } = require('@supabase/supabase-js')

let _client = null

function getClient() {
  if (_client) return _client
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY
  if (!url || !key) throw new Error('SUPABASE_URL / SUPABASE_SERVICE_KEY 환경변수가 없습니다.')
  _client = createClient(url, key)
  return _client
}

async function insert(col, data) {
  const sb = getClient()
  const now = new Date().toISOString()
  const { data: row, error } = await sb.from(col).insert({ ...data, created_at: now, updated_at: now }).select().single()
  if (error) throw new Error(`[insert:${col}] ${error.message}`)
  return row
}

async function find(col, where) {
  const sb = getClient()
  const { data, error } = await sb.from(col).select('*').order('id', { ascending: true })
  if (error) throw new Error(`[find:${col}] ${error.message}`)
  return where ? data.filter(where) : data
}

async function findOne(col, where) {
  const all = await find(col, null)
  return where ? (all.find(where) || null) : (all[0] || null)
}

async function update(col, where, patch) {
  const sb = getClient()
  const now = new Date().toISOString()
  const all = await find(col, null)
  const targets = all.filter(where)
  for (const row of targets) {
    const { error } = await sb.from(col).update({ ...patch, updated_at: now }).eq('id', row.id)
    if (error) throw new Error(`[update:${col}] ${error.message}`)
  }
  return targets.length
}

async function remove(col, where) {
  const sb = getClient()
  if (!where) {
    const { error } = await sb.from(col).delete().neq('id', 0)
    if (error) throw new Error(`[remove:${col}] ${error.message}`)
    return
  }
  const all = await find(col, null)
  const targets = all.filter(where)
  for (const row of targets) {
    const { error } = await sb.from(col).delete().eq('id', row.id)
    if (error) throw new Error(`[remove:${col}] ${error.message}`)
  }
}

module.exports = { insert, find, findOne, update, remove, getClient }
