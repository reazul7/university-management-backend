import { UserService } from './user.service'
import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'

const createStudent = catchAsync(async (req, res) => {
    const { student: studentData } = req.body
    const password = studentData?.password
    const result = await UserService.createStudentIntoDB(req.file, password, studentData)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Student created successfully',
        data: result,
    })
})

const createFaculty = catchAsync(async (req, res) => {
    const { faculty: facultyData } = req.body
    const password = facultyData?.password
    const result = await UserService.createFacultyIntoDB(req.file, password, facultyData)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Faculty created successfully',
        data: result,
    })
})

const createAdmin = catchAsync(async (req, res) => {
    const { admin: adminData } = req.body
    const password = adminData?.password
    const result = await UserService.createAdminIntoDB(req.file, password, adminData)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Admin created successfully',
        data: result,
    })
})

const getMe = catchAsync(async (req, res) => {
    const { userId, role } = req.user
    const result = await UserService.getMe(userId, role)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'User is retrieved successfully',
        data: result,
    })
})

const changeStatus = catchAsync(async (req, res) => {
    const id = req.params.id
    const result = await UserService.changeStatusIntoDB(id, req.body)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'User status changed successfully',
        data: result,
    })
})

export const UserControllers = { createStudent, createFaculty, createAdmin, getMe, changeStatus }
