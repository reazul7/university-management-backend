import { Types } from 'mongoose'

export type TAcademicProgram = {
    name: string
    degree: 'BSc' | 'BA' | 'BBA' | 'LLB' | 'MSc' | 'MA' | 'MBA' | 'LLM'
    level: 'undergraduate' | 'postgraduate'
    academicDepartment: Types.ObjectId
    durationInYears: number
    totalCredits: number
}
