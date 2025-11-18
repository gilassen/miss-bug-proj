export function requireAdmin(req, res, next) {
    if (!req.loggedinUser) return res.status(401).json({ err: 'Not logged in' })
    if (!req.loggedinUser.isAdmin) return res.status(403).json({ err: 'Not authorized' })
    next()
}
