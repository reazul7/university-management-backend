import { StatusCodes } from 'http-status-codes'
import sendResponse from '../../utils/sendResponse'
import catchAsync from '../../utils/catchAsync'
import { AcademicSemesterServices } from './academicSemester.service'

const createAcademicSemester = catchAsync(async (req, res) => {
    const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(
        req.body,
    )

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Academic Semester created successfully',
        data: result,
    })
})

export const AcademicSemesterControllers = { createAcademicSemester }
