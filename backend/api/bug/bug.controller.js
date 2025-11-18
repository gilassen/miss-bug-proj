import { bugService } from './bug.service.js'
import { loggerService } from '../../services/logger.service.js'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import fs from 'fs'

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
    res.json(bugs)
  } catch (err) {
    loggerService.error('Cannot get bugs', err)
    res.status(400).json({ err: 'Cannot get bugs' })
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
        res.status(401).json({ err: 'Cannot view more than 3 bugs' })
        return
      }
      visitedBugs.push(bugId)
    }

    console.log('User visited at the following bugs:', visitedBugs)

    res.cookie('visitedBugs', JSON.stringify(visitedBugs), { maxAge: 7000 })

    res.json({ bug, viewedCount: visitedBugs.length })
  } catch (err) {
    console.log('Error in getBug:', err)
    res.status(500).json({ err: 'Failed to get bug' })
  }
}

export async function removeBug(req, res) {
  const { bugId } = req.params
  const loggedinUser = req.loggedinUser 

  try {
    const bug = await bugService.getById(bugId)

    if (!loggedinUser.isAdmin && bug.creator._id !== loggedinUser._id) {
      return res.status(403).json({ err: 'Not authorized to delete this bug' })
    }

    await bugService.remove(bugId)
    res.json({ msg: 'Bug deleted successfully' })
  } catch (err) {
    loggerService.error('Cannot remove bug', err)
    res.status(400).json({ err: 'Cannot remove bug' })
  }
}

export async function updateBug(req, res) {
  const bugToSave = req.body
  const loggedinUser = req.loggedinUser

  try {
    // ✅ ADDED: Input validation
    if (bugToSave.title && (bugToSave.title.length < 3 || bugToSave.title.length > 100)) {
      return res.status(400).json({ err: 'Title must be between 3 and 100 characters' })
    }

    if (bugToSave.description && bugToSave.description.length > 500) {
      return res.status(400).json({ err: 'Description must be less than 500 characters' })
    }

    if (bugToSave.severity !== undefined && (bugToSave.severity < 1 || bugToSave.severity > 3)) {
      return res.status(400).json({ err: 'Severity must be between 1 and 3' })
    }

    if (bugToSave.labels && !Array.isArray(bugToSave.labels)) {
      return res.status(400).json({ err: 'Labels must be an array' })
    }

    const existingBug = await bugService.getById(bugToSave._id)

    if (!loggedinUser.isAdmin && existingBug.creator._id !== loggedinUser._id) {
      return res.status(403).json({ err: 'Not authorized to update this bug' })
    }

    const updatableFields = ['title', 'description', 'severity', 'labels']
    const cleanBugToSave = {}

    updatableFields.forEach(field => {
      if (bugToSave[field] !== undefined) cleanBugToSave[field] = bugToSave[field]
    })

    cleanBugToSave._id = bugToSave._id
    cleanBugToSave.creator = existingBug.creator 
    cleanBugToSave.createdAt = existingBug.createdAt

    const savedBug = await bugService.save(cleanBugToSave)
    res.json(savedBug)

  } catch (err) {
    loggerService.error('Cannot update bug', err)
    res.status(400).json({ err: 'Cannot update bug' })
  }
}

export async function addBug(req, res) {
  try {
    const bugToSave = req.body
    const loggedinUser = req.loggedinUser 

    // ✅ ADDED: Input validation
    if (!bugToSave.title || bugToSave.title.length < 3 || bugToSave.title.length > 100) {
      return res.status(400).json({ err: 'Title is required and must be between 3 and 100 characters' })
    }

    if (bugToSave.description && bugToSave.description.length > 500) {
      return res.status(400).json({ err: 'Description must be less than 500 characters' })
    }

    if (!bugToSave.severity || bugToSave.severity < 1 || bugToSave.severity > 3) {
      return res.status(400).json({ err: 'Severity is required and must be between 1 and 3' })
    }

    if (bugToSave.labels && !Array.isArray(bugToSave.labels)) {
      return res.status(400).json({ err: 'Labels must be an array' })
    }

    bugToSave.creator = {
      _id: loggedinUser._id,
      fullname: loggedinUser.fullname
    }

    const savedBug = await bugService.save(bugToSave)
    res.json(savedBug)
  } catch (err) {
    loggerService.error('Cannot add bug', err)
    res.status(400).json({ err: 'Cannot add bug' })
  }
}

export function getCount(req, res) {
  try {
    let visitedBugs = req.cookies.visitedBugs || []
    if (typeof visitedBugs === 'string') visitedBugs = JSON.parse(visitedBugs)
    res.json({ count: visitedBugs.length })
  } catch (err) {
    console.log('Error getting count:', err)
    res.status(500).json({ err: 'Failed to get count' })
  }
}

export async function getBugsPDF(req, res) {
  try {
    const { txt, minSeverity, labels, sortBy, sortDir, pageIdx } = req.query

    const filterBy = {
      txt: txt || '',
      minSeverity: +minSeverity || 0,
      labels: labels ? labels.split(',') : [],
      sortBy: sortBy || 'createdAt',
      sortDir: +sortDir || 1,
      pageIdx: +pageIdx || 0
    }

    const bugs = await bugService.query(filterBy)

    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text('Bugs Report', 14, 20)
    doc.setFontSize(10)
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30)

    const tableData = bugs.map(bug => [
      bug.title,
      bug.description || 'No description',
      bug.severity,
      new Date(bug.createdAt).toLocaleDateString()
    ])

    autoTable(doc, {
      head: [['Title', 'Description', 'Severity', 'Created']],
      body: tableData,
      startY: 40,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [90, 90, 90] }
    })

    const filePath = `./logs/bugs-report-${Date.now()}.pdf`
    const pdfData = doc.output('arraybuffer')
    fs.writeFileSync(filePath, Buffer.from(pdfData))

    res.download(filePath, 'bugs-report.pdf', (err) => {
      if (err) loggerService.error('Failed to send PDF:', err)
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) loggerService.error('Failed to delete temp PDF:', unlinkErr)
      })
    })
  } catch (err) {
    loggerService.error('Cannot generate PDF', err)
    res.status(500).json({ err: 'Failed to generate PDF' })
  }
}

export async function getAllBugs(req, res) {
   const bugs = await bugService.getAll()
   res.json(bugs)
}