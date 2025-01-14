import { UserService } from './user.service'
import { StatusCodes } from 'http-status-codes'
import sendResponse from '../../utils/sendResponse'
import catchAsync from '../../utils/catchAsync'

const createStudent = catchAsync(async (req, res) => {
    const { password, student: studentData } = req.body
    const result = await UserService.createStudentIntoDB(password, studentData)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Student created successfully',
        data: result,
    })
})

const createFaculty = catchAsync(async (req, res) => {
    const { password, faculty: facultyData } = req.body
    const result = await UserService.createFacultyIntoDB(password, facultyData)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Faculty created successfully',
        data: result,
    })
})

const createAdmin = catchAsync(async (req, res) => {
    const { password, admin: adminData } = req.body
    const result = await UserService.createAdminIntoDB(password, adminData)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Admin created successfully',
        data: result,
    })
})

export const UserControllers = { createStudent, createFaculty, createAdmin }
