import { Model, Types } from 'mongoose'

export type TUserName = {
    firstName: string
    middleName?: string
    lastName: string
}

export type TFaculty = {
    id: string
    user: Types.ObjectId
    name: TUserName
    designation: string
    gender: 'male' | 'female' | 'other'
    religion: 'muslim' | 'hindu' | 'buddhist' | 'christian' | 'others'
    dateOfBirth: Date
    email: string
    contactNumber: string
    emergencyContactNumber: string
    bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
    presentAddress: string
    permanentAddress: string
    profileImgUrl?: string
    academicDepartment: Types.ObjectId
    academicFaculty: Types.ObjectId
    isDeleted: boolean
}

export interface FacultyModel extends Model<TFaculty> {
    isUserExists(id: string): Promise<TFaculty | null>
}
