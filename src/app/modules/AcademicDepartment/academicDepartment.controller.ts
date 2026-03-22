import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AcademicDepartmentServices } from './academicDepartment.service'

const createAcademicDepartment = catchAsync(async (req, res) => {
    const result = await AcademicDepartmentServices.createAcademicDepartmentIntoDB(req.body)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Academic Department created successfully',
        data: result,
    })
})

const getAllAcademicDepartments = catchAsync(async (req, res) => {
    const result = await AcademicDepartmentServices.getAllAcademicDepartmentsFromDB(req.query)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Fetched all Academic Departments',
        meta: result.meta,
        data: result.result,
    })
})

const getAllAcademicDepartmentsList = catchAsync(async (req, res) => {
    const result = await AcademicDepartmentServices.getAllAcademicDepartmentsListFromDB()

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'All Academic Departments List fetched successfully',
        data: result.result,
    })
})

const getSingleAcademicDepartment = catchAsync(async (req, res) => {
    const { academicDepartmentId } = req.params
    const result = await AcademicDepartmentServices.getSingleAcademicDepartmentFromDB(academicDepartmentId)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Fetched Academic Department',
        data: result,
    })
})

const updateAcademicDepartment = catchAsync(async (req, res) => {
    const { academicDepartmentId } = req.params
    const result = await AcademicDepartmentServices.updateAcademicDepartmentIntoDB(academicDepartmentId, req.body)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Academic Department updated successfully',
        data: result,
    })
})

const deleteAcademicDepartment = catchAsync(async (req, res) => {
    const { academicDepartmentId } = req.params
    const result = await AcademicDepartmentServices.deleteAcademicDepartmentFromDB(academicDepartmentId)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Academic Department deleted successfully',
        data: result,
    })
})

export const AcademicDepartmentControllers = {
    createAcademicDepartment,
    getAllAcademicDepartments,
    getAllAcademicDepartmentsList,
    getSingleAcademicDepartment,
    updateAcademicDepartment,
    deleteAcademicDepartment,
}
