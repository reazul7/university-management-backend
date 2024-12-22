import { NextFunction, Request, Response } from 'express'
import { UserService } from './user.service'
import { StatusCodes } from 'http-status-codes'
import sendResponse from '../../utils/sendResponse'

const createStudent = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { password, student: studentData } = req.body
        // const zodParsedData = studentValidationSchema.parse(studentData)
        const result = await UserService.createStudentIntoDB(
            password,
            studentData,
        )

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Student created successfully',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

export const UserControllers = { createStudent }
