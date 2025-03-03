import mongoose from 'mongoose'
import { Student } from './student.model'
import AppError from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import { User } from '../User/user.model'
import { TStudent } from './student.interface'
import QueryBuilder from '../../builder/QueryBuilder'
import { studentSearchableFields } from './student.constant'

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
    const studentQuery = new QueryBuilder(
        Student.find()
            .populate('user')
            .populate('admissionSemester')
            .populate({
                path: 'academicDepartment',
                populate: { path: 'academicFaculty' },
            }),
        query,
    )
        .search(studentSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields()
    const result = await studentQuery.modelQuery
    const meta = await studentQuery.countTotal()
    return { meta, result }
}

const getSingleStudentFromDB = async (id: string) => {
    const result = await Student.findById(id)
        .populate('admissionSemester')
        .populate({
            path: 'academicDepartment',
            populate: { path: 'academicFaculty' },
        })
    if (!result) throw new AppError(StatusCodes.NOT_FOUND, 'Student not found')
    return result
}

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
    const { name, guardian, localGuardian, ...remainingStudentData } = payload
    const modifiedUpdatedData: Record<string, unknown> = {
        ...remainingStudentData,
    }
    if (name && Object.keys(name).length) {
        for (const [key, value] of Object.entries(name)) {
            modifiedUpdatedData[`name.${key}`] = value
        }
    }
    if (guardian && Object.keys(guardian).length) {
        for (const [key, value] of Object.entries(guardian)) {
            modifiedUpdatedData[`guardian.${key}`] = value
        }
    }
    if (localGuardian && Object.keys(localGuardian).length) {
        for (const [key, value] of Object.entries(localGuardian)) {
            modifiedUpdatedData[`localGuardian.${key}`] = value
        }
    }

    const updateStudent = await Student.findByIdAndUpdate(id, modifiedUpdatedData, {
        new: true,
        runValidators: true,
    })
    if (!updateStudent) throw new AppError(StatusCodes.NOT_FOUND, 'Student not found')
    return updateStudent
}

const deleteStudentFromDB = async (id: string) => {
    const studentId = await Student.findOne({ id })
    if (!studentId) throw new AppError(StatusCodes.NOT_FOUND, 'Student not found')

    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        const deleteStudent = await Student.findByIdAndUpdate(id, { isDeleted: true }, { new: true, session })
        if (!deleteStudent) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to delete Student')
        }

        // get user _id from deletedStudent
        const userId = deleteStudent.user
        const deletedUser = await User.findByIdAndUpdate(userId, { isDeleted: true }, { new: true, session })
        if (!deletedUser) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to delete User')
        }
        await session.commitTransaction()
        await session.endSession()
        return deleteStudent
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        await session.abortTransaction()
        await session.endSession()
        throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to delete Student')
    }
}

export const StudentServices = {
    getAllStudentsFromDB,
    getSingleStudentFromDB,
    updateStudentIntoDB,
    deleteStudentFromDB,
}
