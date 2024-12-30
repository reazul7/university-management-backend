import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AcademicDepartmentServices } from './academicDepartment.service'

const createAcademicDepartment = catchAsync(async (req, res) => {
    const result = await AcademicDepartmentServices.createAcademicDepartmentIntoDB(req.body)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Academic Department created successfully',
        data: result,
    })
})

const getAllAcademicDepartments = catchAsync(async (req, res) => {
    const result = await AcademicDepartmentServices.getAllAcademicDepartmentsFromDB()

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Fetched all Academic Departments',
        data: result,
    })
})

const getSingleAcademicDepartment = catchAsync(async (req, res) => {
    const { academicDepartmentId } = req.params
    const result = await AcademicDepartmentServices.getSingleAcademicDepartmentFromDB(academicDepartmentId)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Fetched Academic Department',
        data: result,
    })
})

const updateAcademicDepartment = catchAsync(async (req, res) => {
    const { academicDepartmentId } = req.params
    const result = await AcademicDepartmentServices.updateAcademicDepartmentIntoDB(academicDepartmentId, req.body)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Academic Department updated successfully',
        data: result,
    })
})

export const AcademicDepartmentControllers = {
    createAcademicDepartment,
    getAllAcademicDepartments,
    getSingleAcademicDepartment,
    updateAcademicDepartment,
}
