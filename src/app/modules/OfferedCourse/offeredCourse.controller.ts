import { StatusCodes } from 'http-status-codes'
import { OfferedCourseServices } from './offeredCourse.service'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'

const createOfferedCourse = catchAsync(async (req, res) => {
    const result = await OfferedCourseServices.createOfferedCourseIntoDB(req.body)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Course created successfully',
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

export const OfferedCourseControllers = { createOfferedCourse, updateOfferedCourse }
