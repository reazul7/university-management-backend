import catchAsync from '../../utils/catchAsync'
import { StatusCodes } from 'http-status-codes'
import sendResponse from '../../utils/sendResponse'
import { OfferedCourseServices } from './offeredCourse.service'

const createOfferedCourse = catchAsync(async (req, res) => {
    const result = await OfferedCourseServices.createOfferedCourseIntoDB(req.body)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Offered Course is created successfully',
        data: result,
    })
})

const getMyOfferedCourses = catchAsync(async (req, res) => {
    const userId = req.user?.userId
    const result = await OfferedCourseServices.getMyOfferedCoursesFromDB(userId, req.query)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Student Offered Courses fetched successfully',
        data: result,
    })
})

const getAllOfferedCourses = catchAsync(async (req, res) => {
    const result = await OfferedCourseServices.getAllOfferedCoursesFromDB(req.query)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Offered Courses fetched successfully',
        data: result,
    })
})

const getSingleOfferedCourse = catchAsync(async (req, res) => {
    const { offeredCourseId } = req.params
    const result = await OfferedCourseServices.getSingleOfferedCourseFromDB(offeredCourseId)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Offered Course fetched successfully',
        data: result,
    })
})

const updateOfferedCourse = catchAsync(async (req, res) => {
    const { offeredCourseId } = req.params
    const offeredCourse = req.body
    const result = await OfferedCourseServices.updateOfferedCourseIntoDB(offeredCourseId, offeredCourse)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Offered Course updated successfully',
        data: result,
    })
})

const deleteOfferedCourse = catchAsync(async (req, res) => {
    const { offeredCourseId } = req.params
    const result = await OfferedCourseServices.deleteOfferedCourseFromDB(offeredCourseId)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Offered Course deleted successfully',
        data: result,
    })
})

export const OfferedCourseControllers = {
    createOfferedCourse,
    getMyOfferedCourses,
    getAllOfferedCourses,
    getSingleOfferedCourse,
    updateOfferedCourse,
    deleteOfferedCourse,
}
