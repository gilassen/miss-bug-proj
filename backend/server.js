import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { bugRoutes } from './api/bug/bug.routes.js'
import { userRoutes } from './api/user/user.routes.js'

const app = express()

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.use('/api/bug', bugRoutes)
app.use('/api/user', userRoutes)

app.listen(3030, () => console.log('Server ready at port 3030'))
