import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { userService } from '../services/user.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'

export function UserDetails() {
  const [user, setUser] = useState(null)
  const { userId } = useParams()

  useEffect(() => {
    loadUser()
  }, [])

  async function loadUser() {
    try {
      const data = await userService.getById(userId)
      setUser(data)
    } catch (err) {
      showErrorMsg('Cannot load user')
    }
  }

  if (!user) return <h1>Loading...</h1>

  return (
    <div className="user-details main-layout">
      <h3>User Details 👤</h3>
      <h4>{user.fullname}</h4>
      <p>Username: {user.username}</p>
      <p>Score: {user.score}</p>
      <Link to="/user">Back to list</Link>
    </div>
  )
}
