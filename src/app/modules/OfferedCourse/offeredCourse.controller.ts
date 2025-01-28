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

export const OfferedCourseControllers = { createOfferedCourse }
