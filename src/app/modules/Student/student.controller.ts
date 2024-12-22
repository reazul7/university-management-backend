import { StatusCodes } from 'http-status-codes'
import { NextFunction, Request, Response } from 'express'
import { StudentServices } from './student.service'
import sendResponse from '../../utils/sendResponse'

const getAllStudents = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await StudentServices.getAllStudentsFromDB()
        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Students fetched successfully',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

const getSingleStudent = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { studentId } = req.params
        const result = await StudentServices.getSingleStudentFromDB(studentId)

        // if (!result) {
        //     return res.status(404).json({
        //         success: false,
        //         message: 'Student not found',
        //     })
        // }
        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Student fetched successfully',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

const deleteStudent = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { studentId } = req.params
        const result = await StudentServices.deleteStudentFromDB(studentId)

        // if (!result.ok) {
        //     return res.status(404).json({
        //         success: false,
        //         message: 'Student not found',
        //     })
        // }

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Student deleted successfully',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

export const StudentController = {
    getAllStudents,
    getSingleStudent,
    deleteStudent,
}
