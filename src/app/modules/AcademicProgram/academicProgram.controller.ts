import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AcademicProgramServices } from './academicProgram.service'

const createAcademicProgram = catchAsync(async (req, res) => {
    const result = await AcademicProgramServices.createAcademicProgramIntoDB(req.body)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Academic Program created successfully',
        data: result,
    })
})

const getAllAcademicPrograms = catchAsync(async (req, res) => {
    const result = await AcademicProgramServices.getAllAcademicProgramsFromDB(req.query)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Fetched all Academic Programs',
        meta: result.meta,
        data: result.result,
    })
})

const getAllAcademicProgramsList = catchAsync(async (req, res) => {
    const result = await AcademicProgramServices.getAllAcademicProgramsListFromDB()

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Fetched all Academic Programs List',
        data: result.result,
    })
})

const getSingleAcademicProgram = catchAsync(async (req, res) => {
    const { academicProgramId } = req.params
    const result = await AcademicProgramServices.getSingleAcademicProgramFromDB(academicProgramId)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Fetched Academic Program',
        data: result,
    })
})

const updateAcademicProgram = catchAsync(async (req, res) => {
    const { academicProgramId } = req.params
    const result = await AcademicProgramServices.updateAcademicProgramIntoDB(academicProgramId, req.body)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Academic Program updated successfully',
        data: result,
    })
})

const deleteAcademicProgram = catchAsync(async (req, res) => {
    const { academicProgramId } = req.params
    const result = await AcademicProgramServices.deleteAcademicProgramIntoDB(academicProgramId)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Academic Program deleted successfully',
        data: result,
    })
})

export const AcademicProgramControllers = {
    createAcademicProgram,
    getAllAcademicPrograms,
    getAllAcademicProgramsList,
    getSingleAcademicProgram,
    updateAcademicProgram,
    deleteAcademicProgram,
}
