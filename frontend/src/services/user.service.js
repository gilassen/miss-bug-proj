import Axios from 'axios'

const axios = Axios.create({
    withCredentials: true,
})

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

const BASE_URL =
    process.env.NODE_ENV !== 'development'
        ? '/api/'
        : '//localhost:3030/api/'

const BASE_USER_URL = BASE_URL + 'user/'
const BASE_AUTH_URL = BASE_URL + 'auth/'

export const userService = {
    login,
    logout,
    signup,
    getLoggedinUser,
    save,
    query,
    getById,
    remove,
    update,
    getEmptyUser
}

window.userService = userService

async function query() {
    const { data } = await axios.get(BASE_USER_URL)
    return data
}

async function getById(userId) {
    const { data } = await axios.get(BASE_USER_URL + userId)
    return data
}

async function remove(userId) {
    return await axios.delete(BASE_USER_URL + userId)
}

async function update(userToUpdate) {
    const { data: updatedUser } = await axios.put(BASE_USER_URL + userToUpdate._id, userToUpdate)
    if (getLoggedinUser()?._id === updatedUser._id) {
        _setLoggedinUser(updatedUser)
    }
    return updatedUser
}

async function login(credentials) {
    const { data: user } = await axios.post(BASE_AUTH_URL + 'login', credentials)
    if (user) return _setLoggedinUser(user)
}

async function signup(credentials) {
    const { data: user } = await axios.post(BASE_AUTH_URL + 'signup', credentials)
    return _setLoggedinUser(user)
}

async function logout() {
    await axios.post(BASE_AUTH_URL + 'logout')
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

function getEmptyUser() {
    return {
        username: '',
        fullname: '',
        password: '',
        imgUrl: ''
    }
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function _setLoggedinUser(user) {
    user = {
        _id: user._id,
        fullname: user.fullname,
        isAdmin: user.isAdmin
    }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

async function save(userToSave) {
    if (userToSave._id) {
        return await update(userToSave)
    } else {
        const { data } = await axios.post(BASE_USER_URL, userToSave)
        return data
    }
}