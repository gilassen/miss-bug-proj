import express from 'express'
import { getBugs, getBug, removeBug, updateBug, addBug, getCount } from './bug.controller.js'


const router = express.Router()

router.get('/', getBugs)
router.get('/:bugId', getBug)
router.delete('/:bugId', removeBug)
router.put('/:bugId', updateBug)
router.post('/', addBug)
router.get('/count', getCount)


export const bugRoutes = router
