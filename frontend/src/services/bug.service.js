const BASE_URL = 'http://localhost:3030/api/bug/'

export const bugService = {
  query,
  getById,
  remove,
  save,
  getCookieCount,
  getAll 
}

async function query(filterBy = {}) {
  const queryParams = new URLSearchParams()
  
  if (filterBy.txt) queryParams.set('txt', filterBy.txt)
  if (filterBy.minSeverity) queryParams.set('minSeverity', filterBy.minSeverity)
  if (filterBy.labels && filterBy.labels.length) queryParams.set('labels', filterBy.labels.join(','))
  if (filterBy.sortBy) queryParams.set('sortBy', filterBy.sortBy)
  if (filterBy.sortDir) queryParams.set('sortDir', filterBy.sortDir)
  if (filterBy.pageIdx !== undefined) queryParams.set('pageIdx', filterBy.pageIdx)
  
  const queryString = queryParams.toString()
  const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL
  
  const res = await fetch(url, {
    credentials: 'include', 
  })
  return res.json()
}

async function getById(bugId) {
  const res = await fetch(BASE_URL + bugId, {
    credentials: 'include', 
  })
  if (!res.ok) {
    const errText = await res.text()
    throw new Error(errText)
  }
  return res.json()
}

async function remove(bugId) {
  const res = await fetch(BASE_URL + bugId, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Cannot remove bug')
  return res.text()
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
  try {
    const res = await fetch('/api/bug/count', { credentials: 'include' })
    if (!res.ok) throw new Error('Failed to get cookie count')
    const data = await res.json()
    return data
  } catch (err) {
    console.error('Cannot get cookie count:', err)
    throw err
  }
}

async function getAll() {
  const res = await fetch(BASE_URL + 'all', {
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to load all bugs')
  return res.json()
}

