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
    const result = await AcademicFaculty.findById(id)
    return result
}

const updateAcademicFacultyIntoDB = async (
    id: string,
    payload: Partial<TAcademicFaculty>,
) => {
    // Check if the provided ID is valid
    if (!Types.ObjectId.isValid(id)) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Invalid Academic Faculty ID')
    }

    const result = await AcademicFaculty.findOneAndUpdate(
        { _id: id },
        payload,
        {
            new: true,
            runValidators: true,
        },
    )
    return result
}

export const AcademicFacultyServices = {
    createAcademicFacultyIntoDB,
    getAllAcademicFacultiesFromDB,
    getSingleAcademicFacultyFromDB,
    updateAcademicFacultyIntoDB,
}
