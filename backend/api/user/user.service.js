import fs from 'fs'
import { makeId, readJsonFile } from '../../services/util.service.js'
import { loggerService } from '../../services/logger.service.js'

let users = readJsonFile('./data/users.json') 

export const userService = {
  query,
  getById,
  remove,
  save,
  getByUsername  
}

async function query() {
  try {
    return [...users] 
  } catch (err) {
    loggerService.error('Cannot get users', err)
    throw err
  }
}

async function getById(userId) {
  try {
    const user = users.find(user => user._id === userId)
    if (!user) throw new Error(`Couldn't find user with _id ${userId}`)
    return user
  } catch (err) {
    loggerService.error('Cannot get user', err)
    throw err
  }
}

async function getByUsername(username) {
  try {
    const user = users.find(user => user.username === username)
    return user
  } catch (err) {
    loggerService.error('Cannot find user by username', err)
    throw err
  }
}

async function remove(userId) {
  try {
    const { bugService } = await import('../bug/bug.service.js')
    const bugs = await bugService.getAll()
    const userHasBugs = bugs.some(bug => bug.creator && bug.creator._id === userId)
    
    if (userHasBugs) {
      throw new Error('Cannot delete user with existing bugs')
    }

    const idx = users.findIndex(user => user._id === userId)
    if (idx === -1) throw new Error(`Couldn't remove user with _id ${userId}`)
    users.splice(idx, 1)
    await _saveUsersToFile()
  } catch (err) {
    loggerService.error('Cannot remove user', err)
    throw err
  }
}

async function save(userToSave) {
  try {
    if (userToSave._id) {
      const idx = users.findIndex(user => user._id === userToSave._id)
      if (idx === -1) throw new Error(`Couldn't update user with _id ${userToSave._id}`)
      users[idx] = { ...users[idx], ...userToSave }
    } else {
      userToSave._id = makeId()
      userToSave.score ||= 0
      users.push(userToSave)
    }

    await _saveUsersToFile()
    return userToSave
  } catch (err) {
    loggerService.error('Cannot save user', err)
    throw err
  }
}

function _saveUsersToFile() {
  return new Promise((resolve, reject) => {
    fs.writeFile('./data/users.json', JSON.stringify(users, null, 4), err => {
      if (err) return reject(err)
      resolve()
    })
  })
}
