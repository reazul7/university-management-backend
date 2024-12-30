import { Types } from 'mongoose'
import { TAcademicFaculty } from './academicFaculty.interface'
import { AcademicFaculty } from './academicFaculty.model'
import { StatusCodes } from 'http-status-codes'
import AppError from '../../errors/AppError'

const createAcademicFacultyIntoDB = async (payload: string) => {
    const result = await AcademicFaculty.create(payload)
    return result
}

const getAllAcademicFacultiesFromDB = async () => {
    const result = await AcademicFaculty.find()
    return result
}

const getSingleAcademicFacultyFromDB = async (id: string) => {
    // Check if the provided ID is valid
    if (!Types.ObjectId.isValid(id)) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid Academic Faculty ID')
    }
    const result = await AcademicFaculty.findById(id)
    if(!result) throw new AppError(StatusCodes.NOT_FOUND, 'Academic Faculty not found')
    return result
}

const updateAcademicFacultyIntoDB = async (
    id: string,
    payload: Partial<TAcademicFaculty>,
) => {
    // Check if the provided ID is valid
    if (!Types.ObjectId.isValid(id)) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid Academic Faculty ID')
    }

    const result = await AcademicFaculty.findOneAndUpdate(
        { _id: id },
        payload,
        {
            new: true,
            runValidators: true,
        },
    )
    if(!result) throw new AppError(StatusCodes.NOT_FOUND, 'Academic Faculty not found')
    return result
}

export const AcademicFacultyServices = {
    createAcademicFacultyIntoDB,
    getAllAcademicFacultiesFromDB,
    getSingleAcademicFacultyFromDB,
    updateAcademicFacultyIntoDB,
}
