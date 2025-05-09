import mongoose from 'mongoose'
import AppError from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import { Course } from '../Course/course.model'
import { Student } from '../Student/student.model'
import { Faculty } from '../Faculty/faculty.model'
import QueryBuilder from '../../builder/QueryBuilder'
import { EnrolledCourse } from './enrolledCourse.model'
import { TEnrolledCourse } from './enrolledCourse.interface'
import { calculateGradeAndPoints } from './enrolledCourse.utils'
import { OfferedCourse } from './../OfferedCourse/offeredCourse.model'
import { SemesterRegistration } from '../SemesterRegistration/semesterRegistration.model'

const createEnrolledCourseIntoDB = async (userId: string, payload: TEnrolledCourse) => {
    /**
     * Step-1: Check if the offered courses is exists
     * Step-2: Check if the student is already enrolled
     * Step-3: Check if the maximum credits exceeded
     * Step-4: Create a Enrolled Course
     */

    const { offeredCourse } = payload
    const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse)
    if (!isOfferedCourseExists) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Offered Course not found')
    }

    if (isOfferedCourseExists?.maxCapacity <= 0) {
        throw new AppError(StatusCodes.BAD_GATEWAY, 'This offered course max capacity is full')
    }

    const student = await Student.findOne({ id: userId }, { _id: 1 })
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

    // check total credits exceeds maximum credits
    const course = await Course.findById(isOfferedCourseExists?.course)
    const currentCredit = course?.credits
    const semesterRegistration = await SemesterRegistration.findById(
        isOfferedCourseExists?.semesterRegistration,
    ).select('maxCredit')
    const maxCredit = semesterRegistration?.maxCredit

    // find all enrolled courses
    const enrolledCourses = await EnrolledCourse.aggregate([
        { $match: { semesterRegistration: isOfferedCourseExists?.semesterRegistration, student: student?._id } },
        { $lookup: { from: 'courses', as: 'enrolledCourseData', localField: 'course', foreignField: '_id' } },
        { $unwind: '$enrolledCourseData' },
        { $group: { _id: null, totalEnrolledCredit: { $sum: '$enrolledCourseData.credits' } } },
        { $project: { _id: 0, totalEnrolledCredit: 1 } },
    ])

    // total enrolled credits + new enrolled credits > maxCredit
    const totalEnrolledCredit = enrolledCourses?.length > 0 ? enrolledCourses[0].totalEnrolledCredit : 0
    if (totalEnrolledCredit && maxCredit && totalEnrolledCredit + currentCredit > maxCredit) {
        throw new AppError(StatusCodes.BAD_GATEWAY, 'Total enrolled credits exceed maximum credits')
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

const getAllEnrolledCoursesFromDB = async (query: Record<string, unknown>) => {
    const enrolledCourseQuery = new QueryBuilder(
        EnrolledCourse.find().populate(
            'semesterRegistration academicSemester academicFaculty academicDepartment offeredCourse course student faculty',
        ),
        query,
    )
        .filter()
        .sort()
        .paginate()
        .fields()
    const result = await enrolledCourseQuery.modelQuery
    const meta = await enrolledCourseQuery.countTotal()
    return { meta, result }
}

const getMyEnrolledCoursesFromDB = async (studentId: string, query: Record<string, unknown>) => {
    const student = await Student.findOne({ id: studentId }, { _id: 1 })
    if (!student) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Student not found')
    }

    const enrolledCourseQuery = new QueryBuilder(
        EnrolledCourse.find({ student: student._id }).populate(
            'semesterRegistration academicSemester academicFaculty academicDepartment offeredCourse course student faculty',
        ),
        query,
    )
        .filter()
        .sort()
        .paginate()
        .fields()
    const result = await enrolledCourseQuery.modelQuery
    const meta = await enrolledCourseQuery.countTotal()
    return { meta, result }
}

const updateEnrolledCourseMarksIntoDB = async (userId: string, role: string, payload: Partial<TEnrolledCourse>) => {
    const { semesterRegistration, offeredCourse, student, courseMarks } = payload
    const isSemesterRegistrationExists = await SemesterRegistration.findById(semesterRegistration)
    if (!isSemesterRegistrationExists) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Semester Registration not found')
    }

    const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse)
    if (!isOfferedCourseExists) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Offered Course not found')
    }

    const isStudentExists = await Student.findById(student)
    if (!isStudentExists) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Student not found')
    }

    let isCourseBelongToFaculty = null
    if (role === 'faculty') {
        const faculty = await Faculty.findOne({ id: userId }, { _id: 1 })
        if (!faculty) {
            throw new AppError(StatusCodes.NOT_FOUND, 'Faculty not found')
        }

        isCourseBelongToFaculty = await EnrolledCourse.findOne({
            semesterRegistration,
            offeredCourse,
            student,
            faculty: faculty._id,
        })
    } else {
        isCourseBelongToFaculty = await EnrolledCourse.findOne({
            semesterRegistration,
            offeredCourse,
            student,
            faculty: isOfferedCourseExists?.faculty,
        })
    }
    if (!isCourseBelongToFaculty) {
        throw new AppError(StatusCodes.FORBIDDEN, 'Faculty is not authorized to update this course')
    }

    const modifiedData: Record<string, unknown> = { ...courseMarks }
    if (courseMarks?.finalTerm) {
        const { classTest1, classTest2, midTerm, finalTerm } = courseMarks
        const totalMarks = Math.ceil(classTest1) + Math.ceil(classTest2) + Math.ceil(midTerm) + Math.ceil(finalTerm)

        // if exam marks will be 100 then calculate the marks ratio
        // Math.ceil(classTest1 * 0.1) +
        // Math.ceil(classTest2 * 0.1) +
        // Math.ceil(midTerm * 0.3) +
        // Math.ceil(finalTerm * 0.5)
        const result = calculateGradeAndPoints(totalMarks)

        modifiedData.grade = result.grade
        modifiedData.gradePoints = result.gradePoints
        modifiedData.isCompleted = true
    }

    if (courseMarks && Object.keys(courseMarks).length > 0) {
        for (const [key, value] of Object.entries(courseMarks)) {
            modifiedData[`courseMarks.${key}`] = value
        }
    }

    const result = await EnrolledCourse.findByIdAndUpdate(isCourseBelongToFaculty.id, modifiedData, { new: true })
    return result
}

export const EnrolledCourseServices = {
    createEnrolledCourseIntoDB,
    getAllEnrolledCoursesFromDB,
    getMyEnrolledCoursesFromDB,
    updateEnrolledCourseMarksIntoDB,
}
