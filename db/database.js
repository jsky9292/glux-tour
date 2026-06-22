// MongoDB 사용으로 변경됨 - store.js의 getDB()가 자동 연결 처리
function initDB() {
  if (!process.env.MONGODB_URI) {
    console.warn('⚠️  MONGODB_URI가 없습니다. .env에 MongoDB Atlas 연결 문자열을 추가하세요.')
  }
}

module.exports = { initDB }
