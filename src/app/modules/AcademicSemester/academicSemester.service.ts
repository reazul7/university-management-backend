import AppError from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import QueryBuilder from '../../builder/QueryBuilder'
import { AcademicSemester } from './academicSemester.model'
import { TAcademicSemester } from './academicSemester.interface'
import { AcademicSemesterNameCodeMapper } from './academicSemester.constant'
import { SemesterRegistration } from '../SemesterRegistration/semesterRegistration.model'
import { OfferedCourse } from '../OfferedCourse/offeredCourse.model'
import { EnrolledCourse } from '../EnrolledCourse/enrolledCourse.model'
import { Student } from '../Student/student.model'
import { User } from '../User/user.model'

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
    if (AcademicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid semester name and code combination.')
    }
    const result = await AcademicSemester.create(payload)
    return result
}

const getAllAcademicSemestersFromDB = async (query: Record<string, unknown>) => {
    const academicSemesterQuery = new QueryBuilder(AcademicSemester.find(), query)
        .search(['name'])
        .filter()
        .sort()
        .paginate()
        .fields()
    const result = await academicSemesterQuery.modelQuery
    const meta = await academicSemesterQuery.countTotal()
    return { meta, result }
}

const getSingleAcademicSemesterFromDB = async (id: string) => {
    const result = await AcademicSemester.findById(id)
    return result
}

const updateAcademicSemesterIntoDB = async (id: string, payload: Partial<TAcademicSemester>) => {
    if (payload.name && payload.code && AcademicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new AppError(StatusCodes.CONFLICT, 'Invalid semester name and code combination.')
    }

    // Check for duplicate combination of name, code, and year
    const { name, code, year } = payload
    if (name || code || year) {
        const existingSemester = await AcademicSemester.findOne({
            _id: { $ne: id },
            name: name ?? (await AcademicSemester.findById(id))?.name,
            code: code ?? (await AcademicSemester.findById(id))?.code,
            year: year ?? (await AcademicSemester.findById(id))?.year,
        })

        if (existingSemester) {
            throw new AppError(
                StatusCodes.CONFLICT,
                'An academic semester with the same name, code, and year already exists.',
            )
        }
    }

    // Proceed with the update
    const result = await AcademicSemester.findOneAndUpdate({ _id: id }, payload, {
        new: true,
        runValidators: true,
    })
    return result
}

const deleteAcademicSemesterIntoDB = async (id: string) => {
    const isAcademicSemesterExists = await AcademicSemester.findById(id)
    if (!isAcademicSemesterExists) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Academic Semester not found')
    }

    const semesterBasedStudentUserIdPattern = `^${isAcademicSemesterExists.year}${isAcademicSemesterExists.code}`

    const [semesterRegistrationCount, offeredCourseCount, enrolledCourseCount, studentCount, studentUserCount] =
        await Promise.all([
            SemesterRegistration.countDocuments({ academicSemester: id }),
            OfferedCourse.countDocuments({ academicSemester: id }),
            EnrolledCourse.countDocuments({ academicSemester: id }),
            Student.countDocuments({ admissionSemester: id }),
            User.countDocuments({
                role: 'student',
                id: { $regex: semesterBasedStudentUserIdPattern },
            }),
        ])

    if (semesterRegistrationCount || offeredCourseCount || enrolledCourseCount || studentCount || studentUserCount) {
        const dependencies: string[] = []

        if (semesterRegistrationCount) dependencies.push(`semesterRegistration: ${semesterRegistrationCount}`)
        if (offeredCourseCount) dependencies.push(`offeredCourse: ${offeredCourseCount}`)
        if (enrolledCourseCount) dependencies.push(`enrolledCourse: ${enrolledCourseCount}`)
        if (studentCount) dependencies.push(`student: ${studentCount}`)
        if (studentUserCount) dependencies.push(`studentUserBySemesterId: ${studentUserCount}`)

        throw new AppError(
            StatusCodes.BAD_REQUEST,
            `Cannot delete this Academic Semester because dependencies exist (${dependencies.join(', ')}).`,
        )
    }

    const result = await AcademicSemester.findByIdAndDelete(id)
    return result
}

export const AcademicSemesterServices = {
    createAcademicSemesterIntoDB,
    getAllAcademicSemestersFromDB,
    getSingleAcademicSemesterFromDB,
    updateAcademicSemesterIntoDB,
    deleteAcademicSemesterIntoDB,
}
