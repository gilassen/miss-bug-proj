import { useState } from 'react'
import { showErrorMsg } from '../services/event-bus.service'
import { userService } from '../services/user.service'
import { LoginForm } from './LoginForm'

export function LoginSignup({ setUser }) {

    const [isSignup, setIsSignup] = useState(false)

    function onSubmit(credentials) {
        isSignup ? signup(credentials) : login(credentials)
    }

    async function login(credentials) {
        try {
            const user = await userService.login(credentials)
            setUser(user)
        } catch (err) {
            showErrorMsg('Oops try again')
        }
    }

    async function signup(credentials) {
        try {
            const user = await userService.signup(credentials)
            setUser(user)
        } catch {
            showErrorMsg('Oops try again')
        }
    }

    return (
        <div className="login-page">
            <LoginForm onSubmit={onSubmit} isSignup={isSignup} />

            <div className="btns">
                <a href="#" onClick={() => setIsSignup(!isSignup)}>
                    {isSignup ? 'Already a member? Login' : 'New user? Signup here'}
                </a>
            </div>
        </div>
    )
}
