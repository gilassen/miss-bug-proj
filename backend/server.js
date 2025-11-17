import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import path from 'path'

import { bugRoutes } from './api/bug/bug.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { authRoutes } from './api/auth/auth.routes.js'
import { loggerMiddleware } from './middlewares/logger.middleware.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3030

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.use(loggerMiddleware)

app.use('/api/bug', bugRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('public'))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve('public/index.html'))
    })
}

app.listen(PORT, () => console.log('Server ready at port', PORT))
