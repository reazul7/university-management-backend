import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { StatusCodes } from 'http-status-codes'
import { EnrolledCourseServices } from './enrolledCourse.service'

const createEnrolledCourse = catchAsync(async (req, res) => {
    const userId = req.user.userId
    const result = await EnrolledCourseServices.createEnrolledCourseIntoDB(userId, req.body)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Student enrolled course successfully',
        data: result,
    })
})

const getAllEnrolledCourses = catchAsync(async (req, res) => {
    const result = await EnrolledCourseServices.getAllEnrolledCoursesFromDB()
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Enrolled courses fetched successfully',
        data: result,
    })
})

const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
    const userId = req.user?.userId
    const role = req.user?.role
    const result = await EnrolledCourseServices.updateEnrolledCourseMarksIntoDB(userId, role, req.body)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Student marks updated successfully',
        data: result,
    })
})

export const EnrolledCourseControllers = { createEnrolledCourse, getAllEnrolledCourses, updateEnrolledCourseMarks }
