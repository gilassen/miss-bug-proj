import { useEffect, useState } from 'react'
import { userService } from '../services/user.service.js'
import { UserList } from '../cmps/UserList.jsx'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'

export function UserIndex() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    try {
      const data = await userService.query()
      setUsers(data)
    } catch (err) {
      showErrorMsg('Cannot load users')
    }
  }

  async function onRemoveUser(userId) {
    try {
      await userService.remove(userId)
      setUsers(prev => prev.filter(u => u._id !== userId))
      showSuccessMsg('User removed')
    } catch (err) {
      showErrorMsg('Cannot remove user')
    }
  }

  async function onAddUser() {
    const fullname = prompt('Full name?')
    const username = prompt('Username?')
    const password = prompt('Password?')
    const score = +prompt('Score?')

    if (!fullname || !username || !password) return showErrorMsg('All fields required')

    try {
      const newUser = { fullname, username, password, score }
      const savedUser = await userService.save(newUser)
      setUsers(prev => [...prev, savedUser])
      showSuccessMsg('User added')
    } catch (err) {
      showErrorMsg('Cannot add user')
    }
  }

  async function onEditUser(user) {
    const newScore = +prompt('Enter new score:', user.score)
    if (isNaN(newScore)) return showErrorMsg('Invalid score')

    try {
      const userToSave = { ...user, score: newScore }
      const savedUser = await userService.save(userToSave)
      setUsers(prev => prev.map(u => (u._id === savedUser._id ? savedUser : u)))
      showSuccessMsg('User updated')
    } catch (err) {
      showErrorMsg('Cannot update user')
    }
  }

  return (
    <section className="user-index main-layout">
      <h1>Users App</h1>

      <div className="actions-container">
        <button onClick={onAddUser}>Add User ✚</button>
      </div>

      <UserList
        users={users}
        onRemoveUser={onRemoveUser}
        onEditUser={onEditUser}
      />
    </section>
  )
}
