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
import QueryBuilder from '../../builder/QueryBuilder'

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
    /**
     * Step 1: check if the semester registration id is exists!
     * Step 2: check if the academic faculty id is exists!
     * Step 3: check if the academic department id is exists!
     * Step 4: check if the course id is exists!
     * Step 5: check if the faculty id is exists!
     * Step 6: check if the department is belong to the  faculty
     * Step 7: check if the same offered course same section in same registered semester exists
     * Step 8: get the schedules of the faculties
     * Step 9: check if the faculty is available at that time. If not then throw error
     * Step 10: create the offered course
     */
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

const updateOfferedCourseIntoDB = async (
    id: string,
    payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
    /**
     * Step 1: check if the offered course exists
     * Step 2: check if the faculty exists
     * Step 3: check if the semester registration status is upcoming
     * Step 4: check if the faculty is available at that time. If not then throw error
     * Step 5: update the offered course
     */

    const { faculty, days, startTime, endTime } = payload

    // check below id's are exists
    const isOfferedCourseExist = await OfferedCourse.findById(id)
    if (!isOfferedCourseExist) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Offered Course not found')
    }

    const isFacultyExists = await Faculty.findById(faculty)
    if (!isFacultyExists) {
        throw new AppError(StatusCodes.NOT_FOUND, 'This Faculty not found')
    }

    const semesterRegistration = isOfferedCourseExist.semesterRegistration
    const semesterRegistrationStatus = await SemesterRegistration.findById(semesterRegistration)
    if (semesterRegistrationStatus?.status !== 'UPCOMING') {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            `Cannot update this offered course as it is ${semesterRegistrationStatus?.status}`,
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

    const result = await OfferedCourse.findByIdAndUpdate(id, payload, { new: true })
    return result
}

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
    const offeredCourseQuery = new QueryBuilder(OfferedCourse.find(), query).filter().sort().paginate().fields()
    const result = await offeredCourseQuery.modelQuery
    return result
}

const getSingleOfferedCourseFromDB = async (id: string) => {
    const result = await OfferedCourse.findById(id)
    if (!result) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Offered Course not found')
    }
    return result
}

const deleteOfferedCourseFromDB = async (id: string) => {
    /**
     * Step 1: check if the offered course exists
     * Step 2: check if the semester registration status is upcoming
     * Step 3: delete the offered course
     */
    const isOfferedCourseExist = await OfferedCourse.findById(id)
    if (!isOfferedCourseExist) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Offered Course not found')
    }
    const semesterRegistration = isOfferedCourseExist.semesterRegistration
    const semesterRegistrationStatus = await SemesterRegistration.findById(semesterRegistration).select('status')
    if (semesterRegistrationStatus?.status !== 'UPCOMING') {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            `Cannot delete this offered course as it is ${semesterRegistrationStatus?.status}`,
        )
    }

    const result = await OfferedCourse.findByIdAndDelete(id)
    return result
}

export const OfferedCourseServices = {
    createOfferedCourseIntoDB,
    getAllOfferedCoursesFromDB,
    getSingleOfferedCourseFromDB,
    updateOfferedCourseIntoDB,
    deleteOfferedCourseFromDB,
}
