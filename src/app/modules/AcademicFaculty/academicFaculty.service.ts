import AppError from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import QueryBuilder from '../../builder/QueryBuilder'
import { AcademicFaculty } from './academicFaculty.model'
import { TAcademicFaculty } from './academicFaculty.interface'

const createAcademicFacultyIntoDB = async (payload: string) => {
    const result = await AcademicFaculty.create(payload)
    return result
}

const getAllAcademicFacultiesFromDB = async (query: Record<string, unknown>) => {
    const academicFacultyQuery = new QueryBuilder(AcademicFaculty.find(), query).filter().sort().paginate().fields()
    const result = await academicFacultyQuery.modelQuery
    const meta = await academicFacultyQuery.countTotal()
    return { meta, result }
}

const getSingleAcademicFacultyFromDB = async (id: string) => {
    const result = await AcademicFaculty.findById(id)
    if (!result) throw new AppError(StatusCodes.NOT_FOUND, 'Academic Faculty not found')
    return result
}

const updateAcademicFacultyIntoDB = async (id: string, payload: Partial<TAcademicFaculty>) => {
    const result = await AcademicFaculty.findOneAndUpdate({ _id: id }, payload, {
        new: true,
        runValidators: true,
    })
    if (!result) throw new AppError(StatusCodes.NOT_FOUND, 'Academic Faculty not found')
    return result
}

export const AcademicFacultyServices = {
    createAcademicFacultyIntoDB,
    getAllAcademicFacultiesFromDB,
    getSingleAcademicFacultyFromDB,
    updateAcademicFacultyIntoDB,
}
