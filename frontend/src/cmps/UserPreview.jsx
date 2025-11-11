import { Link } from 'react-router-dom'

export function UserPreview({ user, onRemoveUser, onEditUser }) {
  return (
    <article className="user-preview">
      <h4>{user.fullname}</h4>
      <p>Username: {user.username}</p>
      <p>Score: {user.score}</p>

      <div className="actions">
        <button onClick={() => onRemoveUser(user._id)}>❌</button>
        <button onClick={() => onEditUser(user)}>✏️</button>
      </div>

      <div className="details-link">
        <Link to={`/user/${user._id}`}>Details</Link>
      </div>
    </article>
  )
}
