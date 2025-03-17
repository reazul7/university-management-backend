import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { SemesterRegistrationServices } from './semesterRegistration.service'

const createSemesterRegistration = catchAsync(async (req, res) => {
    const result = await SemesterRegistrationServices.createSemesterRegistrationIntoDB(req.body)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Semester Registration created successfully',
        data: result,
    })
})

const getAllSemesterRegistrations = catchAsync(async (req, res) => {
    const result = await SemesterRegistrationServices.getAllSemesterRegistrationsFromDB(req.query)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Semester Registrations fetched successfully',
        meta: result.meta,
        data: result.result,
    })
})

const getSingleSemesterRegistration = catchAsync(async (req, res) => {
    const { semesterRegistrationId } = req.params
    const result = await SemesterRegistrationServices.getSingleSemesterRegistrationFromDB(semesterRegistrationId)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Semester Registration fetched successfully',
        data: result,
    })
})

const updateSemesterRegistration = catchAsync(async (req, res) => {
    const { semesterRegistrationId } = req.params
    const result = await SemesterRegistrationServices.updateSemesterRegistrationIntoDB(semesterRegistrationId, req.body)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Semester Registration updated successfully',
        data: result,
    })
})

const deleteSemesterRegistration = catchAsync(async (req, res) => {
    const { semesterRegistrationId } = req.params
    const result = await SemesterRegistrationServices.deleteSemesterRegistrationFromDB(semesterRegistrationId)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Semester Registration deleted successfully',
        data: result,
    })
})

export const SemesterRegistrationControllers = {
    createSemesterRegistration,
    getAllSemesterRegistrations,
    getSingleSemesterRegistration,
    updateSemesterRegistration,
    deleteSemesterRegistration,
}
