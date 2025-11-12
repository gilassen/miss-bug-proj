import { bugService } from './bug.service.js'
import { loggerService } from '../../services/logger.service.js'

export async function getBugs(req, res) {
  const { txt, minSeverity, labels, sortBy, sortDir, pageIdx } = req.query

  const filterBy = {
    txt: txt || '',
    minSeverity: +minSeverity || 0,
    labels: labels ? labels.split(',') : [],
    sortBy: sortBy || 'createdAt',
    sortDir: +sortDir || 1,
    pageIdx: +pageIdx || 0
  }

  try {
    const bugs = await bugService.query(filterBy)
    res.send(bugs)
  } catch (err) {
    loggerService.error('Cannot get bugs', err)
    res.status(400).send('Cannot get bugs')
  }
}

export async function getBug(req, res) {
  try {
    const bugId = req.params.bugId
    const bug = await bugService.getById(bugId)

    let visitedBugs = req.cookies.visitedBugs || []
    if (typeof visitedBugs === 'string') visitedBugs = JSON.parse(visitedBugs)

    if (!visitedBugs.includes(bugId)) {
      if (visitedBugs.length >= 3) {
        res.status(401).send('Cannot view more than 3 bugs')
        return
      }
      visitedBugs.push(bugId)
    }

    console.log('User visited at the following bugs:', visitedBugs)
    
    res.cookie('visitedBugs', JSON.stringify(visitedBugs), { maxAge: 7000 })

    res.json({ bug, viewedCount: visitedBugs.length })
  } catch (err) {
    console.log('Error in getBug:', err)
    res.status(500).send('Failed to get bug')
  }
}


export async function removeBug(req, res) {
  const { bugId } = req.params
  try {
    await bugService.remove(bugId)
    res.send('Bug deleted')
  } catch (err) {
    loggerService.error('Cannot remove bug', err)
    res.status(400).send('Cannot remove bug')
  }
}

export async function updateBug(req, res) {
  const bugToSave = req.body
  try {
    const savedBug = await bugService.save(bugToSave)
    res.send(savedBug)
  } catch (err) {
    loggerService.error('Cannot update bug', err)
    res.status(400).send('Cannot update bug')
  }
}

export async function addBug(req, res) {
  const bugToSave = req.body
  try {
    const savedBug = await bugService.save(bugToSave)
    res.send(savedBug)
  } catch (err) {
    loggerService.error('Cannot add bug', err)
    res.status(400).send('Cannot add bug')
  }
}

export function getCount(req, res) {
  try {
    let visitedBugs = req.cookies.visitedBugs || []
    if (typeof visitedBugs === 'string') visitedBugs = JSON.parse(visitedBugs)
    res.json({ count: visitedBugs.length })
  } catch (err) {
    console.log('Error getting count:', err)
    res.status(500).send('Failed to get count')
  }
}
