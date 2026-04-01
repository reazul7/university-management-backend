import { Types } from 'mongoose'

export type TAcademicDepartment = {
    name: string
    shortCode: string
    academicFaculty: Types.ObjectId
}
