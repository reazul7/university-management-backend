import mongoose from 'mongoose'
import { User } from '../User/user.model'
import { Faculty } from './faculty.model'
import AppError from '../../errors/AppError'
import { TFaculty } from './faculty.interface'
import { StatusCodes } from 'http-status-codes'
import QueryBuilder from '../../builder/QueryBuilder'
import { FacultySearchableFields } from './faculty.constant'

const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {
    const facultyQuery = new QueryBuilder(Faculty.find().populate('academicDepartment academicFaculty'), query)
        .search(FacultySearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields()
    const result = await facultyQuery.modelQuery
    const meta = await facultyQuery.countTotal()
    return { meta, result }
}

const getSingleFacultyFromDB = async (id: string) => {
    const result = await Faculty.findById(id).populate('academicDepartment')
    if (!result) throw new AppError(StatusCodes.NOT_FOUND, 'Faculty not found')
    return result
}

const updateFacultyIntoDB = async (id: string, payload: Partial<TFaculty>) => {
    const { name, ...remainingFacultyData } = payload
    const modifiedUpdatedData: Record<string, unknown> = {
        ...remainingFacultyData,
    }
    if (name && Object.keys(name).length) {
        for (const [key, value] of Object.entries(name)) {
            modifiedUpdatedData[`name.${key}`] = value
        }
    }

    const updateFaculty = await Faculty.findByIdAndUpdate(id, modifiedUpdatedData, {
        new: true,
        runValidators: true,
    })
    if (!updateFaculty) throw new AppError(StatusCodes.NOT_FOUND, 'Faculty not found')
    return updateFaculty
}

const deleteFacultyFromDB = async (id: string) => {
    const session = await mongoose.startSession()

    try {
        session.startTransaction()
        const deleteFaculty = await Faculty.findByIdAndUpdate(id, { isDeleted: true }, { new: true, session })
        if (!deleteFaculty) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to delete Faculty')
        }

        // get user ID from deletedFaculty
        const userId = deleteFaculty.user
        const deleteUser = await User.findByIdAndUpdate(
            { _id: userId },
            {
                isDeleted: true,
            },
            { new: true, session },
        )
        if (!deleteUser) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to delete User')
        }
        await session.commitTransaction()
        await session.endSession()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        await session.abortTransaction()
        await session.endSession()
        throw new Error(error)
    }
    const result = await Faculty.findByIdAndDelete(id)
    if (!result) throw new AppError(StatusCodes.NOT_FOUND, 'Faculty not found')
}

export const FacultyServices = {
    getAllFacultiesFromDB,
    getSingleFacultyFromDB,
    updateFacultyIntoDB,
    deleteFacultyFromDB,
}
