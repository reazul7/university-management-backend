import { Model, Types } from 'mongoose'

export type TUserName = {
    firstName: string
    middleName?: string
    lastName: string
}

export type TGuardian = {
    fatherName: string
    fatherOccupation: string
    fatherContactNumber: string
    motherName: string
    motherOccupation: string
    motherContactNumber: string
}

export type TLocalGuardian = {
    name: string
    occupation: string
    contactNumber: string
    address: string
}

export type TStudent = {
    id: string
    user: Types.ObjectId
    name: TUserName
    gender: 'male' | 'female' | 'other'
    religion: 'muslim' | 'hindu' | 'buddhist' | 'christian' | 'others'
    dateOfBirth: Date
    email: string
    contactNumber: string
    emergencyNumber: string
    bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
    presentAddress: string
    permanentAddress: string
    guardian: TGuardian
    localGuardian: TLocalGuardian
    profileImgUrl?: string
    isDeleted: boolean
}

export type StudentMethods = {
    isUserExists(id: string): Promise<TStudent | null>
}

export type StudentModel = Model<
    TStudent,
    Record<string, never>,
    StudentMethods
>
