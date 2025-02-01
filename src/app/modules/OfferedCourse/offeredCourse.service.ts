import { StatusCodes } from 'http-status-codes'
import AppError from '../../errors/AppError'
import { SemesterRegistration } from '../SemesterRegistration/semesterRegistration.model'
import { TOfferedCourse } from './offeredCourse.interface'
import { OfferedCourse } from './offeredCourse.model'
import { AcademicFaculty } from '../AcademicFaculty/academicFaculty.model'
import { AcademicDepartment } from '../AcademicDepartment/academicDepartment.model'
import { Course } from '../Course/course.model'
import { Faculty } from '../Faculty/faculty.model'
import { hasTimeConflict } from './offeredCourse.utils'

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
    const {
        semesterRegistration,
        academicFaculty,
        academicDepartment,
        course,
        faculty,
        section,
        days,
        startTime,
        endTime,
    } = payload
    // check below id's are exists
    const isSemesterRegistrationExists = await SemesterRegistration.findById(semesterRegistration)
    if (!isSemesterRegistrationExists) {
        throw new AppError(StatusCodes.NOT_FOUND, 'This Semester Registration not found')
    }
    const academicSemester = isSemesterRegistrationExists.academicSemester

    const isAcademicFacultyExists = await AcademicFaculty.findById(academicFaculty)
    if (!isAcademicFacultyExists) {
        throw new AppError(StatusCodes.NOT_FOUND, 'This Academic Faculty not found')
    }

    const isAcademicDepartmentExists = await AcademicDepartment.findById(academicDepartment)
    if (!isAcademicDepartmentExists) {
        throw new AppError(StatusCodes.NOT_FOUND, 'This Academic Department not found')
    }

    const isCourseExists = await Course.findById(course)
    if (!isCourseExists) {
        throw new AppError(StatusCodes.NOT_FOUND, 'This course not found')
    }

    const isFacultyExists = await Faculty.findById(faculty)
    if (!isFacultyExists) {
        throw new AppError(StatusCodes.NOT_FOUND, 'This Faculty not found')
    }

    // check the department is being to the faculty
    const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({ _id: academicDepartment, academicFaculty })
    if (!isDepartmentBelongToFaculty) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            `This ${isAcademicDepartmentExists.name} Department is not belong to this ${isAcademicFacultyExists.name} Faculty`,
        )
    }

    // check if the same offered course same section in same registered semester exists
    const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection = await OfferedCourse.findOne({
        semesterRegistration,
        course,
        section,
    })
    if (isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            'This Offered Course already exists with same section in same registered semester',
        )
    }

    // get the schedule of the faculties
    const assignedSchedules = await OfferedCourse.find({ semesterRegistration, faculty, days: { $in: days } }).select(
        'days startTime endTime',
    )

    const newSchedule = { days, startTime, endTime }

    if (hasTimeConflict(assignedSchedules, newSchedule)) {
        throw new AppError(StatusCodes.CONFLICT, 'This faculty is not available at that time! Choose other time or day')
    }

    const result = await OfferedCourse.create({ ...payload, academicSemester })
    return result
}

export const OfferedCourseServices = { createOfferedCourseIntoDB }
