import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import { StudentRoutes } from './app/modules/Student/student.route'
import { UserRoutes } from './app/modules/User/user.route'
import globalErrorHandler from './app/middleware/globalErrorHandler'

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

app.use(globalErrorHandler)
export default app
