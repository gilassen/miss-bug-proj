import { userService } from './user.service.js'
import { loggerService } from '../../services/logger.service.js'

export async function getUsers(req, res) {
  try {
    const users = await userService.query()
    res.json(users)
  } catch (err) {
    loggerService.error('Cannot get users', err)
    res.status(400).json({ err: 'Cannot get users' })
  }
}

export async function getUser(req, res) {
  const { userId } = req.params
  try {
    const user = await userService.getById(userId)
    res.json(user)
  } catch (err) {
    loggerService.error('Cannot get user', err)
    res.status(404).json({ err: 'Cannot get user' })
  }
}

export async function removeUser(req, res) {
  const { userId } = req.params
  try {
    await userService.remove(userId)
    res.json({ msg: 'User deleted successfully' })
  } catch (err) {
    loggerService.error('Cannot remove user', err)
    res.status(400).json({ err: 'Cannot remove user' })
  }
}

export async function updateUser(req, res) {
  const userToSave = req.body
  try {
    const savedUser = await userService.save(userToSave)
    res.json(savedUser)
  } catch (err) {
    loggerService.error('Cannot update user', err)
    res.status(400).json({ err: 'Cannot update user' })
  }
}

export async function addUser(req, res) {
  const userToSave = req.body
  try {
    const savedUser = await userService.save(userToSave)
    res.json(savedUser)
  } catch (err) {
    loggerService.error('Cannot add user', err)
    res.status(400).json({ err: 'Cannot add user' })
  }
}
