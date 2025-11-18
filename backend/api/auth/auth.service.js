import Cryptr from 'cryptr'
import bcrypt from 'bcrypt'

import { userService } from '../user/user.service.js'
import { loggerService } from '../../services/logger.service.js'

const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Puk-1234')

export const authService = {
    getLoginToken,
    validateToken,
    login,
    signup
}

function getLoginToken(user) {
    const str = JSON.stringify(user)
    const encryptedStr = cryptr.encrypt(str)
    return encryptedStr
}

function validateToken(token) {
    try {
        const json = cryptr.decrypt(token)
        const loggedinUser = JSON.parse(json)
        return loggedinUser
    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}

async function login(username, password) {
    const user = await userService.getByUsername(username)
    if (!user) throw new Error('Unknown username')

    const match = await bcrypt.compare(password, user.password)
    if (!match) throw new Error('Invalid username or password')

    const miniUser = {
        _id: user._id,
        fullname: user.fullname,
        score: user.score || 0,
        isAdmin: user.isAdmin,
    }

    return miniUser
}

async function signup({ username, password, fullname }) {
    const saltRounds = 10

    if (!username || !password || !fullname)
        throw new Error('Missing required signup information')

    // Validate username
    if (username.length < 3 || username.length > 20)
        throw new Error('Username must be between 3 and 20 characters')
    
    if (!/^[a-zA-Z0-9_]+$/.test(username))
        throw new Error('Username can only contain letters, numbers, and underscores')

    // Validate password
    if (password.length < 6)
        throw new Error('Password must be at least 6 characters')

    // Validate fullname
    if (fullname.length < 2 || fullname.length > 50)
        throw new Error('Full name must be between 2 and 50 characters')

    const userExist = await userService.getByUsername(username)
    if (userExist) throw new Error('Username already taken')

    const hash = await bcrypt.hash(password, saltRounds)

    return userService.save({
        username,
        password: hash,
        fullname,
        score: 0,
        isAdmin: false
    })
}