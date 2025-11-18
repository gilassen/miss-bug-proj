import { authService } from '../api/auth/auth.service.js'

export function requireAuth(req, res, next) {
    try {
        const token = req.cookies.loginToken
        if (!token) return res.status(401).json({ err: 'Not authenticated' })

        const loggedinUser = authService.validateToken(token)
        if (!loggedinUser) return res.status(401).json({ err: 'Invalid login' })

        req.loggedinUser = loggedinUser

        next()
        
    } catch (err) {
        console.log('Error in requireAuth middleware:', err)
        return res.status(401).json({ err: 'Invalid login' })
    }
}
