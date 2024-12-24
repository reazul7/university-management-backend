import { AcademicSemesterNameCodeMapper } from './academicSemester.constant'
import { TAcademicSemester } from './academicSemester.interface'
import { AcademicSemester } from './academicSemester.model'

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
    if(AcademicSemesterNameCodeMapper[payload.name] !== payload.code){
        throw new Error('Invalid semester name and code combination.')
    }
    const result = await AcademicSemester.create(payload)
    return result
}

export const AcademicSemesterServices = { createAcademicSemesterIntoDB }
