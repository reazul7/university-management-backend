/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose'
import config from '../../config'
import { AcademicSemester } from '../AcademicSemester/academicSemester.model'
import { TStudent } from '../Student/student.interface'
import { Student } from '../Student/student.model'
import { TUser } from './user.interface'
import { User } from './user.model'
import { generateAdminId, generateFacultyId, generateStudentId } from './user.utils'
import AppError from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import { TFaculty } from '../Faculty/faculty.interface'
import { AcademicDepartment } from '../AcademicDepartment/academicDepartment.model'
import { Faculty } from '../Faculty/faculty.model'
import { TAdmin } from '../Admin/admin.interface'
import { Admin } from '../Admin/admin.model'

const createStudentIntoDB = async (password: string, payload: TStudent) => {
    // create a user object
    const userData: Partial<TUser> = {}

    // If the password not provided then use the default password
    userData.password = password || (config.default_password as string)
    userData.email = payload.email
    userData.role = 'student'

    const admissionSemester = await AcademicSemester.findById(payload.admissionSemester)

    const session = await mongoose.startSession()

    try {
        session.startTransaction()
        userData.id = await generateStudentId(admissionSemester)

        // create a user [transaction-1]
        const newUser = await User.create([userData], { session })

        if (!newUser.length) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create user')
        }

        // create a student [transaction-2]
        payload.id = newUser[0].id
        payload.user = newUser[0]._id

        const newStudent = await Student.create([payload], { session })

        if (!newStudent.length) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create student')
        }
        await session.commitTransaction()
        await session.endSession()
        return newStudent
    } catch (error: any) {
        await session.abortTransaction()
        await session.endSession()
        throw new Error(error)
    }
}

const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
    // create a user object
    const userData: Partial<TUser> = {}

    // If the password not provided then use the default password
    userData.password = password || (config.default_password as string)
    userData.email = payload.email
    userData.role = 'faculty'

    // find academic department information
    const academicDepartment = await AcademicDepartment.findById(payload.academicDepartment)
    if (!academicDepartment) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Academic department not found')
    }

    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        userData.id = await generateFacultyId()
        // create a user [transaction-1]
        const newUser = await User.create([userData], { session })

        if (!newUser.length) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create user')
        }

        // create a faculty [transaction-]
        payload.id = newUser[0].id
        payload.user = newUser[0]._id

        const newFaculty = await Faculty.create([payload], { session })

        if (!newFaculty.length) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create faculty')
        }
        await session.commitTransaction()
        await session.endSession()
        return newFaculty
    } catch (error: any) {
        await session.abortTransaction()
        await session.endSession()
        throw new Error(error)
    }
}

const createAdminIntoDB = async (password: string, payload: TAdmin) => {
    // create a user object
    const userData: Partial<TUser> = {}

    // If the password not provided then use the default password
    userData.password = password || (config.default_password as string)
    userData.email = payload.email
    userData.role = 'admin'

    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        userData.id = await generateAdminId()
        // create a user [transaction-1]
        const newUser = await User.create([userData], { session })

        if (!newUser.length) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create user')
        }

        // create a faculty [transaction-]
        payload.id = newUser[0].id
        payload.user = newUser[0]._id

        const newAdmin = await Admin.create([payload], { session })

        if (!newAdmin.length) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create admin')
        }
        await session.commitTransaction()
        await session.endSession()
        return newAdmin
    } catch (error: any) {
        await session.abortTransaction()
        await session.endSession()
        throw new Error(error)
    }
}

export const UserService = { createStudentIntoDB, createFacultyIntoDB, createAdminIntoDB }
