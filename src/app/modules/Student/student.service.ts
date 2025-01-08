import mongoose from 'mongoose'
import { Student } from './student.model'
import AppError from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import { User } from '../User/user.model'
import { TStudent } from './student.interface'

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
    const queryObj = { ...query }
    // search term
    const studentSearchableFields = ['email', 'name.firstName', 'presentAddress']
    let searchTerm = ''
    if (query?.searchTerm) {
        searchTerm = query?.searchTerm as string
    }

    const searchQuery = Student.find({
        $or: studentSearchableFields.map(field => ({
            [field]: { $regex: searchTerm, $options: 'i' },
        })),
    })

    // filtering
    const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields']
    excludeFields.forEach(field => delete queryObj[field])

    const filterQuery = searchQuery
        .find(queryObj)
        .populate('admissionSemester')
        .populate({
            path: 'academicDepartment',
            populate: { path: 'academicFaculty' },
        })

    // sorting
    let sort = '-createdAt'
    if (query.sort) {
        sort = query.sort as string
    }
    const sortQuery = filterQuery.sort(sort)

    // paginate area
    let page = 1
    let limit = 1
    let skip = 0

    if (query.limit) {
        limit = Number(query.limit)
    }

    if (query.page) {
        page = Number(query.page)
        skip = (page - 1) * limit
    }

    const paginateQuery = sortQuery.skip(skip)
    const limitQuery = paginateQuery.limit(limit)

    let fields = '-__v'
    if (query.fields) {
        fields = (query.fields as string).split(',').join(' ')
    }
    const filedQuery = await limitQuery.select(fields)
    return filedQuery
}

const getSingleStudentFromDB = async (id: string) => {
    const result = await Student.findOne({ id })
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

    const updateStudent = await Student.findOneAndUpdate({ id }, modifiedUpdatedData, {
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
        const deleteStudent = await Student.findOneAndUpdate({ id }, { isDeleted: true }, { new: true, session })
        if (!deleteStudent) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to delete Student')
        }
        const deletedUser = await User.findOneAndUpdate({ id }, { isDeleted: true }, { new: true, session })
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
