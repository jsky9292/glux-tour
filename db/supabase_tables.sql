-- GLUX Tour 테이블 생성 SQL
-- Supabase → SQL Editor에서 실행

CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  reservation_no TEXT,
  package_type TEXT,
  departure_date TEXT,
  return_date TEXT,
  nights INTEGER DEFAULT 0,
  passengers INTEGER DEFAULT 1,
  requests TEXT,
  channel TEXT DEFAULT '홈페이지',
  status TEXT DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS itineraries (
  id SERIAL PRIMARY KEY,
  application_id INTEGER REFERENCES applications(id),
  day_number INTEGER,
  date_label TEXT,
  pickup_time TEXT,
  pickup_loc TEXT,
  dropoff_time TEXT,
  dropoff_loc TEXT,
  schedule TEXT,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vouchers (
  id SERIAL PRIMARY KEY,
  application_id INTEGER REFERENCES applications(id),
  vehicle TEXT,
  balance TEXT,
  balance_note TEXT,
  includes TEXT,
  excludes TEXT,
  guide_notes TEXT,
  sent_at TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 견적 고객 (CRM) — 견적서 저장 시 기록, 문의→견적→계약 흐름 관리
CREATE TABLE IF NOT EXISTS quotes (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  name TEXT NOT NULL,
  phone TEXT,
  trip_name TEXT,
  passengers INTEGER DEFAULT 1,
  amount_jpy BIGINT,
  amount_krw BIGINT,
  exchange_rate NUMERIC,
  deposit BIGINT,
  balance BIGINT,
  status TEXT DEFAULT 'quote',   -- quote(견적) | contract(계약) | completed(완료) | canceled(취소)
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
