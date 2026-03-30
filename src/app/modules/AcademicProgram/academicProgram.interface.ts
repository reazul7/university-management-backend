import { Types } from 'mongoose'

export type TAcademicProgram = {
    name: string
    degree: string
    academicDepartment: Types.ObjectId
    durationInYears: number
    totalCredits: number
}
