/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express'
import { ZodError, ZodIssue } from 'zod'
import { TErrorSource } from '../interface/error'
import config from '../config'
const globalErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = error.statusCode || 500
    let message = error.message || 'Something went wrong!'

    let errorSources: TErrorSource = [
        {
            path: '',
            message: 'Something went wrong!',
        },
    ]

    const handleZodError = (error: ZodError) => {
        const errorSources: TErrorSource = error.issues.map((issue: ZodIssue) => {
            return {
                // path: issue?.path?.join('.'),
                path: issue?.path[issue.path.length - 1],
                message: issue?.message,
            }
        })
        const statusCode = 400
        return {
            statusCode,
            message: 'Validation Error',
            errorSources,
        }
    }

    if (error instanceof ZodError) {
        const simplifiedError = handleZodError(error)
        statusCode = simplifiedError?.statusCode
        message = simplifiedError?.message
        errorSources = simplifiedError?.errorSources
    }

    return res.status(statusCode).json({
        success: false,
        message,
        // error: error,
        errorSources,
        stack: config.node_env === 'development' ? error?.stack : null
    })
}

export default globalErrorHandler
