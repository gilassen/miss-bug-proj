import fs from 'fs'
const bugsFilePath = './data/bugs.json'

import { existsSync, mkdirSync } from 'fs'
if (!existsSync('./data')) mkdirSync('./data')
if (!existsSync(bugsFilePath)) fs.writeFileSync(bugsFilePath, '[]')

export const bugService = {
  query,
  getById,
  remove,
  save,
}

function _readBugsFromFile() {
  const data = fs.readFileSync(bugsFilePath)
  return JSON.parse(data)
}

function _writeBugsToFile(bugs) {
  fs.writeFileSync(bugsFilePath, JSON.stringify(bugs, null, 2))
}

async function query() {
  return _readBugsFromFile()
}

async function getById(bugId) {
  const bugs = _readBugsFromFile()
  return bugs.find(bug => bug._id === bugId)
}

async function remove(bugId) {
  const bugs = _readBugsFromFile()
  const idx = bugs.findIndex(bug => bug._id === bugId)
  if (idx === -1) throw new Error('Bug not found')
  bugs.splice(idx, 1)
  _writeBugsToFile(bugs)
  return { msg: 'Bug removed successfully' }
}

async function save(bug) {
  const bugs = _readBugsFromFile()

  if (bug._id) {
    const idx = bugs.findIndex(currBug => currBug._id === bug._id)
    if (idx === -1) throw new Error('Bug not found') 
    bugs[idx] = { ...bugs[idx], ...bug } 
  } else {
    bug._id = makeId()
    bug.createdAt = Date.now()
    bugs.push(bug)
  }

  _writeBugsToFile(bugs)
  return bug
}


function makeId(length = 5) {
  var txt = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return txt
}
