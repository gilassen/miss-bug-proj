export function requireAdmin(req, res, next) {
    if (!req.loggedinUser) return res.status(401).send('Not logged in')
    if (!req.loggedinUser.isAdmin) return res.status(403).send('Not authorized')
    next()
}
