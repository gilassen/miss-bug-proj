const BASE_URL = 'http://localhost:3030/api/bug/'

export const bugService = {
  query,
  getById,
  remove,
  save,
  getCookieCount,
}

async function query() {
  const res = await fetch(BASE_URL, {
    credentials: 'include', 
  })
  return res.json()
}

async function getById(bugId) {
  const res = await fetch(BASE_URL + bugId, {
    credentials: 'include', 
  })
  return res.json()
}

async function remove(bugId) {
  const res = await fetch(BASE_URL + bugId, {
    method: 'DELETE',
    credentials: 'include', 
  })
  if (!res.ok) throw new Error('Cannot remove bug')
  return res.json()
}

async function save(bug) {
  const method = bug._id ? 'PUT' : 'POST'
  const url = bug._id ? BASE_URL + bug._id : BASE_URL
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bug),
    credentials: 'include', 
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(errText || 'Failed to save bug')
  }

  return res.json()
}

async function getCookieCount() {
  const res = await fetch(BASE_URL + 'cookie-count', {
    credentials: 'include',
  })
  console.log('📡 Fetch cookie-count status:', res.status)
  const data = await res.json()
  console.log('📡 cookie-count data:', data)
  return data
}
