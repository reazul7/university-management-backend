import { StatusCodes } from 'http-status-codes'
import AppError from '../../errors/AppError'
import { OfferedCourse } from './../OfferedCourse/offeredCourse.model'
import { TEnrolledCourse } from './enrolledCourse.interface'
import { EnrolledCourse } from './enrolledCourse.model'
import { Student } from '../Student/student.model'
import mongoose from 'mongoose'

const createEnrolledCourseIntoDB = async (userId: string, payload: TEnrolledCourse) => {
    /**
     * Step-1: Check if the offered courses is exists
     * Step-2: Check if the student is already enrolled
     * Step-3: Create a Enrolled Course
     */

    const { offeredCourse } = payload
    const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse)
    if (!isOfferedCourseExists) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Offered Course not found')
    }

    if (isOfferedCourseExists?.maxCapacity <= 0) {
        throw new AppError(StatusCodes.BAD_GATEWAY, 'This offered course max capacity is full')
    }

    const student = await Student.findOne({ id: userId }).select('id')
    if (!student) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Student not found')
    }

    const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
        semesterRegistration: isOfferedCourseExists?.semesterRegistration,
        offeredCourse: offeredCourse,
        student: student?._id,
    })
    if (isStudentAlreadyEnrolled) {
        throw new AppError(StatusCodes.CONFLICT, 'Student is already enrolled in this offered course')
    }

    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        const result = await EnrolledCourse.create(
            [
                {
                    semesterRegistration: isOfferedCourseExists?.semesterRegistration,
                    academicSemester: isOfferedCourseExists?.academicSemester,
                    academicFaculty: isOfferedCourseExists?.academicFaculty,
                    academicDepartment: isOfferedCourseExists?.academicDepartment,
                    offeredCourse: offeredCourse,
                    course: isOfferedCourseExists?.course,
                    faculty: isOfferedCourseExists?.faculty,
                    student: student._id,
                    isEnrolled: true,
                },
            ],
            { session },
        )

        if (!result) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to enrolled this course')
        }

        const maxCapacity = isOfferedCourseExists?.maxCapacity
        await OfferedCourse.findByIdAndUpdate(offeredCourse, { maxCapacity: maxCapacity - 1 })
        await session.commitTransaction()
        await session.endSession()
        return result
    } catch (error) {
        await session.abortTransaction()
        await session.endSession()
        throw new AppError(StatusCodes.BAD_REQUEST, `Course not Enrolled: ${error}`)
    }
}

export const EnrolledCourseServices = { createEnrolledCourseIntoDB }
