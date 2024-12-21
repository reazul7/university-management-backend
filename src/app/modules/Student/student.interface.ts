import { Model } from 'mongoose'

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
    name: TUserName
    gender: 'male' | 'female' | 'other'
    religion: 'muslim' | 'hindu' | 'buddhist' | 'christian' | 'others'
    dateOfBirth: string
    email: string
    contactNumber: string
    emergencyNumber: string
    bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
    presentAddress: string
    permanentAddress: string
    guardian: TGuardian
    localGuardian: TLocalGuardian
    profileImgUrl?: string
    isActive?: 'active' | 'inactive'
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
