import fs from 'fs'
import { makeId, readJsonFile } from '../../services/util.service.js'

let bugs = readJsonFile('./data/bugs.json') // נטען פעם אחת

export const bugService = {
  query,
  getById,
  remove,
  save
}

async function query(filterBy) {
  let bugsToDisplay = [...bugs]
  return bugsToDisplay
}

async function getById(bugId) {
  const bug = bugs.find(bug => bug._id === bugId)
  if (!bug) throw `Couldn't find bug with _id ${bugId}`
  return bug
}

async function remove(bugId) {
  const idx = bugs.findIndex(bug => bug._id === bugId)
  if (idx === -1) throw `Couldn't remove bug with _id ${bugId}`
  bugs.splice(idx, 1)
  await _saveBugsToFile()
}

async function save(bugToSave) {
  if (bugToSave._id) {
    const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
    if (idx === -1) throw `Couldn't update bug with _id ${bugToSave._id}`
    bugs[idx] = { ...bugs[idx], ...bugToSave }
  } else {
    bugToSave._id = makeId()
    bugToSave.createdAt = Date.now()
    bugToSave.labels ||= []
    bugs.push(bugToSave)
  }

  await _saveBugsToFile() 
  return bugToSave
}

function _saveBugsToFile() {
  return new Promise((resolve, reject) => {
    fs.writeFile('./data/bugs.json', JSON.stringify(bugs, null, 4), err => {
      if (err) return reject(err)
      resolve()
    })
  })
}
