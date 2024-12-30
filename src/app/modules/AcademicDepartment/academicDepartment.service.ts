import { Types } from 'mongoose'
import { TAcademicDepartment } from './academicDepartment.interface'
import { AcademicDepartment } from './academicDepartment.model'
import AppError from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'

const createAcademicDepartmentIntoDB = async (payload: string) => {
    const result = await AcademicDepartment.create(payload)
    return result
}

const getAllAcademicDepartmentsFromDB = async () => {
    const result = await AcademicDepartment.find().populate('academicFaculty')
    return result
}

const getSingleAcademicDepartmentFromDB = async (id: string) => {
    // Check if the provided ID is valid
    if (!Types.ObjectId.isValid(id)) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid Academic Department ID')
    }
    const result = await AcademicDepartment.findById(id).populate('academicFaculty')
    if (!result) throw new AppError(StatusCodes.NOT_FOUND, 'Academic Department not found')
    return result
}

const updateAcademicDepartmentIntoDB = async (id: string, payload: Partial<TAcademicDepartment>) => {
    // Check if the provided ID is valid
    if (!Types.ObjectId.isValid(id)) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid Academic Department ID')
    }
    const result = await AcademicDepartment.findOneAndUpdate({ _id: id }, payload, { new: true })
    if (!result) throw new AppError(StatusCodes.NOT_FOUND, 'Academic Department not found')
    return result
}

export const AcademicDepartmentServices = {
    createAcademicDepartmentIntoDB,
    getAllAcademicDepartmentsFromDB,
    getSingleAcademicDepartmentFromDB,
    updateAcademicDepartmentIntoDB,
}
