import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { bugService } from './services/bugService.js'

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => res.send('Hello there'))

app.get('/api/bug', async (req, res) => {
  const bugs = await bugService.query()
  res.send(bugs)
})

app.get('/api/bug/cookie-count', (req, res) => {
  const visitedBugs = JSON.parse(req.cookies.visitedBugs || '[]')
  res.json({ count: visitedBugs.length })
})

app.get('/api/bug/:bugId', async (req, res) => {
  try {
    const bugId = req.params.bugId

    let visitedBugs = req.cookies.visitedBugs || '[]'
    try {
      visitedBugs = JSON.parse(visitedBugs)
    } catch {
      visitedBugs = []
    }

    console.log('User visited at the following bugs:', visitedBugs)

    if (!visitedBugs.includes(bugId)) {
      if (visitedBugs.length >= 3) {
        return res.status(401).send('Wait for a bit')
      }
      visitedBugs.push(bugId)
    }

    res.cookie('visitedBugs', JSON.stringify(visitedBugs), {
      maxAge: 1000 * 7, 
      httpOnly: false,
      sameSite: 'lax',
      secure: false
    })

    const bug = await bugService.getById(bugId)
    res.send(bug)
  } catch (err) {
    console.error('Error in GET /api/bug/:bugId', err)
    res.status(500).send('Failed to get bug')
  }
})

app.post('/api/bug', async (req, res) => {
  try {
    const bug = req.body
    const savedBug = await bugService.save(bug)
    res.send(savedBug)
  } catch (err) {
    console.error('Error saving bug:', err)
    res.status(500).send('Failed to save bug')
  }
})

app.delete('/api/bug/:bugId', async (req, res) => {
  try {
    const msg = await bugService.remove(req.params.bugId)
    res.send(msg)
  } catch (err) {
    console.error('Error deleting bug:', err)
    res.status(500).send('Failed to delete bug')
  }
})

app.put('/api/bug/:bugId', async (req, res) => {
  const bug = req.body
  bug._id = req.params.bugId
  const savedBug = await bugService.save(bug)
  res.send(savedBug)
})

app.listen(3030, () => console.log('Server ready at port 3030'))
