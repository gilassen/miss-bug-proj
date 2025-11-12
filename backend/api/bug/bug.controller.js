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
      fs.unlink(filePath, () => {}) 
    })
  } catch (err) {
    loggerService.error('Cannot generate PDF', err)
    res.status(500).send('Failed to generate PDF')
  }
}