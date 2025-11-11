const BASE_URL = 'http://localhost:3030/api/user/'

export const userService = {
  query,
  getById,
  remove,
  save
}

async function query() {
  const res = await fetch(BASE_URL)
  if (!res.ok) throw new Error('Cannot load users')
  return res.json()
}

async function getById(userId) {
  const res = await fetch(BASE_URL + userId)
  if (!res.ok) throw new Error('Cannot get user')
  return res.json()
}

async function remove(userId) {
  const res = await fetch(BASE_URL + userId, { method: 'DELETE' })
  if (!res.ok) throw new Error('Cannot remove user')
  return res.text()
}

async function save(user) {
  const method = user._id ? 'PUT' : 'POST'
  const url = user._id ? BASE_URL + user._id : BASE_URL
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  })
  if (!res.ok) throw new Error('Cannot save user')
  return res.json()
}
