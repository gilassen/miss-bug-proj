import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { userService } from '../services/user.service.js'
import { bugService } from '../services/bug.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { showErrorMsg } from '../services/event-bus.service.js'

export function UserDetails() {
  const [user, setUser] = useState(null)
  const [userBugs, setUserBugs] = useState([])

  const params = useParams()
  const loggedInUser = userService.getLoggedinUser()

  const userIdToLoad = params.userId || loggedInUser?._id

  useEffect(() => {
    loadUser()
    loadUserBugs()
  }, [userIdToLoad])

  async function loadUser() {
    try {
      const data = await userService.getById(userIdToLoad)
      setUser(data)
    } catch (err) {
      showErrorMsg('Cannot load user')
    }
  }

  async function loadUserBugs() {
    try {
      const bugs = await bugService.getAll()
      const filtered = bugs.filter(bug => bug.creator?._id === userIdToLoad)
      setUserBugs(filtered)
    } catch (err) {
      showErrorMsg('Cannot load user bugs')
    }
  }

  if (!user) return <h1>Loading...</h1>

  return (
    <div className="user-details main-layout">
      <h3>User Profile</h3>
      <h4>{user.fullname}</h4>

      <p>Username: {user.username}</p>
      <p>Score: {user.score}</p>

      <hr />

      <h5>My Bugs ({userBugs.length})</h5>
      {userBugs.length > 0 ? (
        <BugList 
          bugs={userBugs} 
          onRemoveBug={() => {}} 
          onEditBug={() => {}} 
        />
      ) : (
        <p>No bugs created yet</p>
      )}

      <Link to="/bug">Back to Bugs</Link>
    </div>
  )
}
