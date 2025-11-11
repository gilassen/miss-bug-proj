import { UserPreview } from './UserPreview.jsx'

export function UserList({ users, onRemoveUser, onEditUser }) {
  return (
    <ul className="user-list clean-list">
      {users.map(user => (
        <li key={user._id} className="user-item">
          <UserPreview
            user={user}
            onRemoveUser={onRemoveUser}
            onEditUser={onEditUser}
          />
        </li>
      ))}
    </ul>
  )
}
