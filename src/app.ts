/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { StudentRoutes } from './app/modules/Student/student.route'
import { UserRoutes } from './app/modules/User/user.route'
import globalErrorHandler from './app/middleware/globalErrorHandler'
import notFound from './app/middleware/notFound'

const app: Application = express()

// parser
app.use(express.json())
app.use(cors())

// application route
app.use('/api/v1/users', UserRoutes)
app.use('/api/v1/students', StudentRoutes)

app.get('/', (req: Request, res: Response) => {
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
