import express from 'express'
import { getBugs, getBug, removeBug, updateBug, addBug, getCount, getBugsPDF, getAllBugs } from './bug.controller.js'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'

const router = express.Router()

router.get('/', getBugs)
router.get('/count', getCount)
router.get('/pdf', requireAuth, getBugsPDF)
router.get('/all', getAllBugs)
router.get('/:bugId', getBug)

router.post('/', requireAuth, addBug)
router.put('/:bugId', requireAuth, updateBug)
router.delete('/:bugId', requireAuth, removeBug)



export const bugRoutes = router
