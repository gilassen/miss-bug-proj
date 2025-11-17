import { useState } from "react"
import { userService } from "../services/user.service"

export function LoginForm({ onSubmit, isSignup }) {

    const [credentials, setCredentials] = useState(userService.getEmptyUser())

    function handleChange({ target }) {
        const { name: field, value } = target
        setCredentials(prev => ({ ...prev, [field]: value }))
    }

    function handleSubmit(ev) {
        ev.preventDefault()
        onSubmit(credentials)
    }

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <input
                type="text"
                name="username"
                value={credentials.username}
                placeholder="Username"
                onChange={handleChange}
                required
                autoFocus
            />

            <input
                type="password"
                name="password"
                value={credentials.password}
                placeholder="Password"
                onChange={handleChange}
                required
            />

            {isSignup && (
                <input
                    type="text"
                    name="fullname"
                    value={credentials.fullname}
                    placeholder="Full name"
                    onChange={handleChange}
                    required
                />
            )}

            <button>{isSignup ? "Signup" : "Login"}</button>
        </form>
    )
}
