import { Request, Response } from 'express'
import { StudentServices } from './student.service'
import studentValidationSchema from './student.validation'

const createStudent = async (req: Request, res: Response) => {
    try {
        const { student: studentData } = req.body
        const zodParsedData = studentValidationSchema.parse(studentData)
        const result = await StudentServices.createStudentIntoDB(zodParsedData)

        res.status(200).json({
            success: true,
            message: 'Student created successfully',
            data: result,
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create student',
            error: error,
        })
    }
}

const getAllStudents = async (req: Request, res: Response) => {
    try {
        const result = await StudentServices.getAllStudentsFromDB()

        res.status(200).json({
            success: true,
            message: 'Students fetched successfully',
            data: result,
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetched students',
            error: error,
        })
    }
}

const getSingleStudent = async (req: Request, res: Response) => {
    try {
        const { studentId } = req.params
        const result = await StudentServices.getSingleStudentFromDB(studentId)

        // if (!result) {
        //     return res.status(404).json({
        //         success: false,
        //         message: 'Student not found',
        //     })
        // }

        res.status(200).json({
            success: true,
            message: 'Student fetched successfully',
            data: result,
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetched student',
            error: error,
        })
    }
}

const deleteStudent = async (req: Request, res: Response) => {
    try {
        const { studentId } = req.params
        const result = await StudentServices.deleteStudentFromDB(studentId)

        // if (!result.ok) {
        //     return res.status(404).json({
        //         success: false,
        //         message: 'Student not found',
        //     })
        // }

        res.status(200).json({
            success: true,
            message: 'Student deleted successfully',
            data: result,
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete student',
            error: error,
        })
    }
}

export const StudentController = {
    createStudent,
    getAllStudents,
    getSingleStudent,
    deleteStudent,
}
