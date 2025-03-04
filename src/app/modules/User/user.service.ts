/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose'
import config from '../../config'
import { User } from './user.model'
import { TUser } from './user.interface'
import { Admin } from '../Admin/admin.model'
import AppError from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import { TAdmin } from '../Admin/admin.interface'
import { Student } from '../Student/student.model'
import { Faculty } from '../Faculty/faculty.model'
import { TFaculty } from '../Faculty/faculty.interface'
import { TStudent } from '../Student/student.interface'
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary'
import { AcademicSemester } from '../AcademicSemester/academicSemester.model'
import { AcademicDepartment } from '../AcademicDepartment/academicDepartment.model'
import { generateAdminId, generateFacultyId, generateStudentId } from './user.utils'

const createStudentIntoDB = async (file: any, password: string, payload: TStudent) => {
    // create a user object
    const userData: Partial<TUser> = {}

    // If the password not provided then use the default password
    userData.password = password || (config.default_password as string)
    userData.email = payload.email
    userData.role = 'student'

    // find Academic Semester and Department
    const admissionSemester = await AcademicSemester.findById(payload.admissionSemester)
    if (!admissionSemester) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Admission Semester not found')
    }
    const academicDepartment = await AcademicDepartment.findById(payload.academicDepartment)
    if (!academicDepartment) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Academic Department not found')
    }
    payload.academicFaculty = academicDepartment.academicFaculty

    const session = await mongoose.startSession()

    try {
        session.startTransaction()
        userData.id = await generateStudentId(admissionSemester)

        // send image to cloudinary server
        if (file) {
            const imageName = `${userData?.id}${payload?.name?.firstName}`
            const path = file?.path
            const { secure_url } = await sendImageToCloudinary(path, imageName)
            payload.profileImgUrl = secure_url as string
        }

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

const createFacultyIntoDB = async (file: any, password: string, payload: TFaculty) => {
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

        // send image to cloudinary server
        if (file) {
            const imageName = `${userData?.id}${payload?.name?.firstName}`
            const path = file?.path
            const { secure_url } = await sendImageToCloudinary(path, imageName)
            payload.profileImgUrl = secure_url as string
        }

        // create a user [transaction-1]
        const newUser = await User.create([userData], { session })
        if (!newUser.length) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create user')
        }

        // create a faculty [transaction-2]
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

const createAdminIntoDB = async (file: any, password: string, payload: TAdmin) => {
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

        // send image to cloudinary server
        if (file) {
            const imageName = `${userData?.id}${payload?.name?.firstName}`
            const path = file?.path
            const { secure_url } = await sendImageToCloudinary(path, imageName)
            payload.profileImgUrl = secure_url as string
        }

        // create a user [transaction-1]
        const newUser = await User.create([userData], { session })
        if (!newUser.length) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create user')
        }

        // create a admin [transaction-2]
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

const getMe = async (userId: string, role: string) => {
    let result = null
    if (role === 'admin') {
        result = await Admin.findOne({ id: userId }).populate('user')
    }
    if (role === 'faculty') {
        result = await Faculty.findOne({ id: userId }).populate('user')
    }
    if (role === 'student') {
        result = await Student.findOne({ id: userId }).populate('user')
    }
    return result
}

const changeStatusIntoDB = async (id: string, payload: { status: string }) => {
    const result = await User.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    })
    if (!result) {
        throw new AppError(StatusCodes.NOT_FOUND, 'User not found')
    }
    return result
}

export const UserService = { createStudentIntoDB, createFacultyIntoDB, createAdminIntoDB, getMe, changeStatusIntoDB }
