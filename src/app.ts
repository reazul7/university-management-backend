/* eslint-disable @typescript-eslint/no-explicit-any */
import cors from 'cors'
import config from './app/config'
import router from './app/routes'
import cookieParser from 'cookie-parser'
import notFound from './app/middleware/notFound'
import globalErrorHandler from './app/middleware/globalErrorHandler'
import express, { Application, NextFunction, Request, Response } from 'express'

const app: Application = express()

// parser
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(cors({origin: config.frontend_url, credentials: true}))
// app.use(cors({origin: ['http://localhost:3000'], credentials: true}))

// application route
app.use('/api/v1', router)

app.get('/api/v1/test', (req: Request, res: Response) => {
    res.send('Hello World!')
})

// global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    globalErrorHandler(err, req, res, next)
})
// not found route
app.use((req: Request, res: Response, next: NextFunction) => {
    notFound(req, res, next)
})

export default app
