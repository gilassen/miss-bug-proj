import express from 'express'
import { getBugs, getBug, removeBug, updateBug, addBug, getCount, getBugsPDF } from './bug.controller.js'


const router = express.Router()

router.get('/', getBugs)
router.get('/count', getCount)
router.get('/pdf', getBugsPDF)
router.get('/:bugId', getBug)
router.delete('/:bugId', removeBug)
router.put('/:bugId', updateBug)
router.post('/', addBug)



export const bugRoutes = router
