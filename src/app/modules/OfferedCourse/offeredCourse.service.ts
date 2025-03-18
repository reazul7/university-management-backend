import AppError from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import { Faculty } from '../Faculty/faculty.model'
import { Student } from '../Student/student.model'
import { OfferedCourse } from './offeredCourse.model'
import QueryBuilder from '../../builder/QueryBuilder'
import { hasTimeConflict } from './offeredCourse.utils'
import { TOfferedCourse } from './offeredCourse.interface'
import { Course, CourseFaculty } from '../Course/course.model'
import { AcademicFaculty } from '../AcademicFaculty/academicFaculty.model'
import { AcademicDepartment } from '../AcademicDepartment/academicDepartment.model'
import { SemesterRegistration } from '../SemesterRegistration/semesterRegistration.model'

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
     * Step 8: Check the Faculty is being to the Course
     * Step 9: get the schedules of the faculties
     * Step 10: check if the faculty is available at that time. If not then throw error
     * Step 11: create the offered course
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

    // 06: check the department is being to the faculty
    const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({ _id: academicDepartment, academicFaculty })
    if (!isDepartmentBelongToFaculty) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            `This ${isAcademicDepartmentExists.name} Department is not belong to this ${isAcademicFacultyExists.name} Faculty`,
        )
    }

    // 07: check if the same offered course same section in same registered semester exists
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

    // 08: Check the Faculty is being to the Course
    const isFacultyBeingToCourse = await CourseFaculty.findOne({
        course: isCourseExists?._id,
        faculties: { $in: [isFacultyExists?._id] },
    })
    if (!isFacultyBeingToCourse) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'This Faculty is not being to this course')
    }

    // 09: get the schedule of the faculties
    const assignedSchedules = await OfferedCourse.find({ semesterRegistration, faculty, days: { $in: days } }).select(
        'days startTime endTime',
    )
    // 10: check if the faculty is available at that time. If not then throw error
    const newSchedule = { days, startTime, endTime }
    if (hasTimeConflict(assignedSchedules, newSchedule)) {
        throw new AppError(StatusCodes.CONFLICT, 'This faculty is not available at that time! Choose other time or day')
    }

    const result = await OfferedCourse.create({ ...payload, academicSemester })
    return result
}

const getMyOfferedCoursesFromDB = async (userId: string, query: Record<string, unknown>) => {
    const student = await Student.findOne({ id: userId })
    if (!student) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Student not found')
    }

    // find ongoing semester
    const currentOngoingRegistrationSemester = await SemesterRegistration.findOne({ status: 'ONGOING' })
    if (!currentOngoingRegistrationSemester) {
        throw new AppError(StatusCodes.NOT_FOUND, 'There is no Ongoing Semester Registration')
    }

    // pagination setup
    const page = Number(query?.page) || 1
    const limit = Number(query?.limit) || 10
    const skip = (page - 1) * limit

    const aggregationQuery = [
        {
            $match: {
                semesterRegistration: currentOngoingRegistrationSemester?._id,
                academicFaculty: student?.academicFaculty,
                academicDepartment: student?.academicDepartment,
            },
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'course',
            },
        },
        {
            $unwind: '$course',
        },
        {
            $lookup: {
                from: 'enrolledcourses',
                let: {
                    currentOngoingRegistrationSemester: currentOngoingRegistrationSemester._id,
                    currentStudent: student._id,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$semesterRegistration', '$$currentOngoingRegistrationSemester'] },
                                    { $eq: ['$student', '$$currentStudent'] },
                                    { $eq: ['$isEnrolled', true] },
                                ],
                            },
                        },
                    },
                ],
                as: 'enrolledCourses',
            },
        },
        {
            $lookup: {
                from: 'enrolledcourses',
                let: { currentStudent: student._id },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [{ $eq: ['$student', '$$currentStudent'] }, { $eq: ['$isCompleted', true] }],
                            },
                        },
                    },
                ],
                as: 'completedCourses',
            },
        },
        {
            $addFields: {
                completedCourseIds: {
                    $map: { input: '$completedCourses', as: 'completed', in: '$$completed.course' },
                },
            },
        },
        {
            $addFields: {
                isPreRequisitesFulFilled: {
                    $or: [
                        { $eq: ['$course.preRequisiteCourses', []] },
                        { $setIsSubset: ['$course.preRequisiteCourses.course', '$completedCourseIds'] },
                    ],
                },
                isAlreadyEnrolled: {
                    $in: [
                        '$course._id',
                        {
                            $map: { input: '$enrolledCourses', as: 'enroll', in: '$$enroll.course' },
                        },
                    ],
                },
            },
        },
        {
            $match: {
                // isAlreadyEnrolled: true,
                isAlreadyEnrolled: false,
                isPreRequisitesFulFilled: true,
            },
        },
    ]
    const paginationQuery = [
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
    ]
    const result = await OfferedCourse.aggregate([...aggregationQuery, ...paginationQuery])
    const total = (await OfferedCourse.aggregate(aggregationQuery)).length
    const totalPage = Math.ceil(result.length / limit)
    return { meta: { page, limit, total, totalPage }, result }
}

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
    const offeredCourseQuery = new QueryBuilder(OfferedCourse.find(), query).filter().sort().paginate().fields()
    const result = await offeredCourseQuery.modelQuery
    const meta = await offeredCourseQuery.countTotal()
    return { meta, result }
}

const getSingleOfferedCourseFromDB = async (id: string) => {
    const result = await OfferedCourse.findById(id)
    if (!result) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Offered Course not found')
    }
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
    getMyOfferedCoursesFromDB,
    updateOfferedCourseIntoDB,
    deleteOfferedCourseFromDB,
}
