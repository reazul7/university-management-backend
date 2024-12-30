import { AcademicSemesterNameCodeMapper } from './academicSemester.constant'
import { TAcademicSemester } from './academicSemester.interface'
import { AcademicSemester } from './academicSemester.model'

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
    if (AcademicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new Error('Invalid semester name and code combination.')
    }
    const result = await AcademicSemester.create(payload)
    return result
}

const getAllAcademicSemestersFromDB = async () => {
    const result = await AcademicSemester.find()
    return result
}

const getSingleAcademicSemesterFromDB = async (id: string) => {
    const result = await AcademicSemester.findById(id)
    return result
}

const updateAcademicSemesterIntoDB = async (id: string, payload: Partial<TAcademicSemester>) => {
    if (
        payload.name &&
        payload.code &&
        AcademicSemesterNameCodeMapper[payload.name] !== payload.code
    ) {
        throw new Error('Invalid semester name and code combination.')
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
            throw new Error(
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
