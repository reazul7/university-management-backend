import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AcademicSemesterServices } from './academicSemester.service'

const createAcademicSemester = catchAsync(async (req, res) => {
    const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(req.body)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Academic Semester created successfully',
        data: result,
    })
})

const getAllAcademicSemesters = catchAsync(async (req, res) => {
    const result = await AcademicSemesterServices.getAllAcademicSemestersFromDB(req.query)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Academic Semesters fetched successfully',
        meta: result.meta,
        data: result.result,
    })
})
const getSingleAcademicSemester = catchAsync(async (req, res) => {
    const { academicSemesterId } = req.params
    const result = await AcademicSemesterServices.getSingleAcademicSemesterFromDB(academicSemesterId)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Academic Semester fetched successfully',
        data: result,
    })
})
const updateAcademicSemester = catchAsync(async (req, res) => {
    const { academicSemesterId } = req.params
    const result = await AcademicSemesterServices.updateAcademicSemesterIntoDB(academicSemesterId, req.body)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Academic Semester update successfully',
        data: result,
    })
})

export const AcademicSemesterControllers = {
    createAcademicSemester,
    getAllAcademicSemesters,
    getSingleAcademicSemester,
    updateAcademicSemester,
}
