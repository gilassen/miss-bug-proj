import express from 'express'
import { getUsers, getUser, removeUser, updateUser, addUser } from './user.controller.js'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { requireAdmin } from '../../middlewares/requireAdmin.middleware.js'

const router = express.Router()

router.get('/', requireAuth, requireAdmin, getUsers)
router.get('/:userId', requireAuth, requireAdmin, getUser)
router.post('/', requireAuth, requireAdmin, addUser)
router.put('/:userId', requireAuth, requireAdmin, updateUser)
router.delete('/:userId', requireAuth, requireAdmin, removeUser)

export const userRoutes = router
