import { useState } from "react"
import { useNavigate, NavLink } from "react-router-dom"

import { userService } from "../services/user.service"
import { LoginSignup } from "./LoginSignup"
import { UserMsg } from "./UserMsg"

export function AppHeader() {

    const [user, setUser] = useState(userService.getLoggedinUser())
    const navigate = useNavigate()

    async function onLogout() {
        try {
            await userService.logout()
            setUser(null)
            navigate('/')
        } catch (err) {
            console.log('Error logging out', err)
        }
    }

    return (
        <header className="app-header">
            <UserMsg />

            <div className="header-container">
                <h1>Bugs are Forever</h1>

                <nav className="app-nav">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/bug">Bugs</NavLink>
                    <NavLink to="/about">About</NavLink>
                    {user && <NavLink to="/profile">Profile</NavLink>}
                    {user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}
                </nav>

                <GreetUser user={user} onLogout={onLogout} setUser={setUser} />
            </div>
        </header>
    )
}

function GreetUser({ user, onLogout, setUser }) {

    if (!user) return <LoginSignup setUser={setUser} />

    return (
        <div className="greet-user">
            <NavLink to={`/user/${user._id}`}>{user.fullname}</NavLink>
            <button onClick={onLogout}>Logout</button>
        </div>
    )
}
