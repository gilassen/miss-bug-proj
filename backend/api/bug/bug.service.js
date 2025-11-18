import fs from 'fs'
import { makeId, readJsonFile } from '../../services/util.service.js'

let bugs = readJsonFile('./data/bugs.json') 

export const bugService = {
  query,
  getById,
  remove,
  save,
  getAll
}

async function query(filterBy) {
  let bugsToDisplay = [...bugs]
  
  if (filterBy.txt) {
    const regex = new RegExp(filterBy.txt, 'i')
    bugsToDisplay = bugsToDisplay.filter(bug => 
      regex.test(bug.title) || regex.test(bug.description)
    )
  }
  
  if (filterBy.minSeverity) {
    bugsToDisplay = bugsToDisplay.filter(bug => 
      bug.severity >= filterBy.minSeverity
    )
  }
  
  if (filterBy.labels && filterBy.labels.length > 0) {
    bugsToDisplay = bugsToDisplay.filter(bug =>
      bug.labels && bug.labels.some(label => 
        filterBy.labels.includes(label)
      )
    )
  }
  
  if (filterBy.sortBy) {
    bugsToDisplay.sort((a, b) => {
      if (a[filterBy.sortBy] < b[filterBy.sortBy]) return -1 * filterBy.sortDir
      if (a[filterBy.sortBy] > b[filterBy.sortBy]) return 1 * filterBy.sortDir
      return 0
    })
  }
  
  const PAGE_SIZE = 5
  const startIdx = filterBy.pageIdx * PAGE_SIZE
  bugsToDisplay = bugsToDisplay.slice(startIdx, startIdx + PAGE_SIZE)
  
  return bugsToDisplay
}

async function getById(bugId) {
  const bug = bugs.find(bug => bug._id === bugId)
  if (!bug) throw new Error(`Couldn't find bug with _id ${bugId}`)
  return bug
}

async function remove(bugId) {
  const idx = bugs.findIndex(bug => bug._id === bugId)
  if (idx === -1) throw new Error(`Couldn't remove bug with _id ${bugId}`)
  bugs.splice(idx, 1)
  await _saveBugsToFile()
}

async function save(bugToSave) {
  if (bugToSave._id) {
    const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
    if (idx === -1) throw new Error(`Couldn't update bug with _id ${bugToSave._id}`)
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

function getAll() {
   return bugs
}