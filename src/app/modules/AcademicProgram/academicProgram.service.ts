import AppError from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import QueryBuilder from '../../builder/QueryBuilder'
import { TAcademicProgram } from './academicProgram.interface'
import { AcademicProgram } from './academicProgram.model'

const createAcademicProgramIntoDB = async (payload: string) => {
    const result = await AcademicProgram.create(payload)
    return result
}

const getAllAcademicProgramsFromDB = async (query: Record<string, unknown>) => {
    const academicProgramQuery = new QueryBuilder(
        AcademicProgram.find().populate('academicDepartment', '_id name academicFaculty'),
        query,
    )
        .search(['name', 'programCode'])
        .filter()
        .sort()
        .paginate()
        .fields()
    const result = await academicProgramQuery.modelQuery
    const meta = await academicProgramQuery.countTotal()
    return { meta, result }
}

const getAllAcademicProgramsListFromDB = async () => {
    const result = await AcademicProgram.find({}, { _id: 1, name: 1 }).sort({ name: 1 })
    return { result }
}

const getSingleAcademicProgramFromDB = async (id: string) => {
    const result = await AcademicProgram.findById(id).populate('academicDepartment')
    if (!result) throw new AppError(StatusCodes.NOT_FOUND, 'Academic Program not found')
    return result
}

const updateAcademicProgramIntoDB = async (id: string, payload: Partial<TAcademicProgram>) => {
    const result = await AcademicProgram.findOneAndUpdate({ _id: id }, payload, { new: true })
    if (!result) throw new AppError(StatusCodes.NOT_FOUND, 'Academic Program not found')
    return result
}

const deleteAcademicProgramIntoDB = async (id: string) => {
    const isAcademicProgramExists = await AcademicProgram.findById(id)
    if (!isAcademicProgramExists) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Academic Program not found')
    }

    const result = await AcademicProgram.findByIdAndDelete(id)
    return result
}

export const AcademicProgramServices = {
    createAcademicProgramIntoDB,
    getAllAcademicProgramsFromDB,
    getAllAcademicProgramsListFromDB,
    getSingleAcademicProgramFromDB,
    updateAcademicProgramIntoDB,
    deleteAcademicProgramIntoDB,
}
