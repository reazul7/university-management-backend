import AppError from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import QueryBuilder from '../../builder/QueryBuilder'
import { AcademicDepartment } from './academicDepartment.model'
import { TAcademicDepartment } from './academicDepartment.interface'

const createAcademicDepartmentIntoDB = async (payload: string) => {
    const result = await AcademicDepartment.create(payload)
    return result
}

const getAllAcademicDepartmentsFromDB = async (query: Record<string, unknown>) => {
    const academicDepartmentQuery = new QueryBuilder(AcademicDepartment.find().populate('academicFaculty'), query)
        .filter()
        .sort()
        .paginate()
        .fields()
    const result = await academicDepartmentQuery.modelQuery
    const meta = await academicDepartmentQuery.countTotal()
    return { meta, result }
}

const getSingleAcademicDepartmentFromDB = async (id: string) => {
    const result = await AcademicDepartment.findById(id).populate('academicFaculty')
    if (!result) throw new AppError(StatusCodes.NOT_FOUND, 'Academic Department not found')
    return result
}

const updateAcademicDepartmentIntoDB = async (id: string, payload: Partial<TAcademicDepartment>) => {
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
