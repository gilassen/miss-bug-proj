import { loggerService } from '../services/logger.service.js'

export function loggerMiddleware(req, res, next) {
    loggerService.info(`${req.method} ${req.url}`)
    next()
}
