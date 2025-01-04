import { StatusCodes } from 'http-status-codes'
import { StudentServices } from './student.service'
import sendResponse from '../../utils/sendResponse'
import catchAsync from '../../utils/catchAsync'

const getAllStudents = catchAsync(async (req, res) => {
    const result = await StudentServices.getAllStudentsFromDB()
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Students fetched successfully',
        data: result,
    })
})

const getSingleStudent = catchAsync(async (req, res) => {
    const { studentId } = req.params
    const result = await StudentServices.getSingleStudentFromDB(studentId)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Student fetched successfully',
        data: result,
    })
})

const updateStudent = catchAsync(async (req, res) => {
    const { studentId } = req.params
    const { student } = req.body
    const result = await StudentServices.updateStudentIntoDB(studentId, student)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Student update successfully',
        data: result,
    })
})

const deleteStudent = catchAsync(async (req, res) => {
    const { studentId } = req.params
    const result = await StudentServices.deleteStudentFromDB(studentId)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Student deleted successfully',
        data: result,
    })
})

export const StudentController = {
    getAllStudents,
    getSingleStudent,
    updateStudent,
    deleteStudent,
}
