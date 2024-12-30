import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AcademicFacultyServices } from './academicFaculty.service'

const createAcademicFaculty = catchAsync(async (req, res) => {
    const result = await AcademicFacultyServices.createAcademicFacultyIntoDB(req.body)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Academic Faculty created successfully',
        data: result,
    })
})

const getAllAcademicFaculties = catchAsync(async (req, res) => {
    const result = await AcademicFacultyServices.getAllAcademicFacultiesFromDB()

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Academic Faculties fetched successfully',
        data: result,
    })
})

const getSingleAcademicFaculty = catchAsync(async (req, res) => {
    const { academicFacultyId } = req.params
    const result = await AcademicFacultyServices.getSingleAcademicFacultyFromDB(academicFacultyId)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Academic Faculty fetched successfully',
        data: result,
    })
})

const updateAcademicFaculty = catchAsync(async (req, res) => {
    const { academicFacultyId } = req.params
    const result = await AcademicFacultyServices.updateAcademicFacultyIntoDB(
        academicFacultyId,
        req.body,
    )

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Academic Faculty updated successfully',
        data: result,
    })
})

export const AcademicFacultyController = {
    createAcademicFaculty,
    getAllAcademicFaculties,
    getSingleAcademicFaculty,
    updateAcademicFaculty,
}
