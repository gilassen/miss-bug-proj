import express from 'express'
import { getBugs, getBug, removeBug, updateBug, addBug, getCount, getBugsPDF } from './bug.controller.js'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'

const router = express.Router()

router.get('/', getBugs)
router.get('/count', getCount)
router.get('/pdf', requireAuth, getBugsPDF)
router.get('/:bugId', getBug)

router.post('/', requireAuth, addBug)
router.put('/:bugId', requireAuth, updateBug)
router.delete('/:bugId', requireAuth, removeBug)

export const bugRoutes = router
