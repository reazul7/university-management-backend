import { Model, Types } from 'mongoose'

export type TUserName = {
    firstName: string
    middleName?: string
    lastName: string
}

export type TAdmin = {
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
    isDeleted: boolean
}

export interface AdminModel extends Model<TAdmin> {
    isUserExists(id: string): Promise<TAdmin | null>
}
