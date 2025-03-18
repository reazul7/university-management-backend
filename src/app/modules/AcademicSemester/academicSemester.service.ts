import AppError from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import QueryBuilder from '../../builder/QueryBuilder'
import { AcademicSemester } from './academicSemester.model'
import { TAcademicSemester } from './academicSemester.interface'
import { AcademicSemesterNameCodeMapper } from './academicSemester.constant'

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
    if (AcademicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid semester name and code combination.')
    }
    const result = await AcademicSemester.create(payload)
    return result
}

const getAllAcademicSemestersFromDB = async (query: Record<string, unknown>) => {
    const academicSemesterQuery = new QueryBuilder(AcademicSemester.find(), query).filter().sort().paginate().fields()
    const result = await academicSemesterQuery.modelQuery
    const meta = await academicSemesterQuery.countTotal()
    return { meta, result }
}

const getSingleAcademicSemesterFromDB = async (id: string) => {
    const result = await AcademicSemester.findById(id)
    return result
}

const updateAcademicSemesterIntoDB = async (id: string, payload: Partial<TAcademicSemester>) => {
    if (payload.name && payload.code && AcademicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new AppError(StatusCodes.CONFLICT, 'Invalid semester name and code combination.')
    }

    // Check for duplicate combination of name, code, and year
    const { name, code, year } = payload
    if (name || code || year) {
        const existingSemester = await AcademicSemester.findOne({
            _id: { $ne: id },
            name: name ?? (await AcademicSemester.findById(id))?.name,
            code: code ?? (await AcademicSemester.findById(id))?.code,
            year: year ?? (await AcademicSemester.findById(id))?.year,
        })

        if (existingSemester) {
            throw new AppError(
                StatusCodes.CONFLICT,
                'An academic semester with the same name, code, and year already exists.',
            )
        }
    }

    // Proceed with the update
    const result = await AcademicSemester.findOneAndUpdate({ _id: id }, payload, {
        new: true,
        runValidators: true,
    })
    return result
}

export const AcademicSemesterServices = {
    createAcademicSemesterIntoDB,
    getAllAcademicSemestersFromDB,
    getSingleAcademicSemesterFromDB,
    updateAcademicSemesterIntoDB,
}
