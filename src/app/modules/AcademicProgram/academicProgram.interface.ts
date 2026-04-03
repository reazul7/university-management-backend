import { Types } from 'mongoose'

export type TAcademicProgram = {
    name: string
    degree: 'BSc' | 'BA' | 'BBA' | 'LLB' | 'MSc' | 'MA' | 'MBA' | 'LLM'
    level: 'undergraduate' | 'postgraduate'
    programCode: string
    academicDepartment: Types.ObjectId
    durationInMonths: number
    totalSemesters: number
    totalCredits: number
    status: 'active' | 'inactive'
}
