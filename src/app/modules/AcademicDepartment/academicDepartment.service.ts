import AppError from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import QueryBuilder from '../../builder/QueryBuilder'
import { AcademicDepartment } from './academicDepartment.model'
import { TAcademicDepartment } from './academicDepartment.interface'
import { Student } from '../Student/student.model'
import { Faculty } from '../Faculty/faculty.model'
import { OfferedCourse } from '../OfferedCourse/offeredCourse.model'
import { EnrolledCourse } from '../EnrolledCourse/enrolledCourse.model'

const createAcademicDepartmentIntoDB = async (payload: string) => {
    const result = await AcademicDepartment.create(payload)
    return result
}

const getAllAcademicDepartmentsFromDB = async (query: Record<string, unknown>) => {
    const academicDepartmentQuery = new QueryBuilder(AcademicDepartment.find().populate('academicFaculty'), query)
        .search(['name', 'shortCode'])
        .filter()
        .sort()
        .paginate()
        .fields()
    const result = await academicDepartmentQuery.modelQuery
    const meta = await academicDepartmentQuery.countTotal()
    return { meta, result }
}

const getAllAcademicDepartmentsListFromDB = async () => {
    const result = await AcademicDepartment.find({}, { _id: 1, name: 1, shortCode: 1 }).sort({ name: 1 })
    return { result }
}

const getSingleAcademicDepartmentFromDB = async (id: string) => {
    const result = await AcademicDepartment.findById(id).populate('academicFaculty')
    if (!result) throw new AppError(StatusCodes.NOT_FOUND, 'Academic Department not found')
    return result
}

const updateAcademicDepartmentIntoDB = async (id: string, payload: Partial<TAcademicDepartment>) => {
    const result = await AcademicDepartment.findOneAndUpdate({ _id: id }, payload, { new: true })
    if (!result) throw new AppError(StatusCodes.NOT_FOUND, 'Academic Department not found')
    return result
}

const deleteAcademicDepartmentIntoDB = async (id: string) => {
    const isAcademicDepartmentExists = await AcademicDepartment.findById(id)
    if (!isAcademicDepartmentExists) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Academic Department not found')
    }

    const [studentCount, facultyCount, offeredCourseCount, enrolledCourseCount] = await Promise.all([
        Student.countDocuments({ academicDepartment: id }),
        Faculty.countDocuments({ academicDepartment: id }),
        OfferedCourse.countDocuments({ academicDepartment: id }),
        EnrolledCourse.countDocuments({ academicDepartment: id }),
    ])

    if (studentCount || facultyCount || offeredCourseCount || enrolledCourseCount) {
        const dependencies: string[] = []

        if (studentCount) dependencies.push(`student: ${studentCount}`)
        if (facultyCount) dependencies.push(`faculty: ${facultyCount}`)
        if (offeredCourseCount) dependencies.push(`offeredCourse: ${offeredCourseCount}`)
        if (enrolledCourseCount) dependencies.push(`enrolledCourse: ${enrolledCourseCount}`)

        throw new AppError(
            StatusCodes.BAD_REQUEST,
            `Cannot delete this Academic Department because dependencies exist (${dependencies.join(', ')}).`,
        )
    }

    const result = await AcademicDepartment.findByIdAndDelete(id)
    return result
}

export const AcademicDepartmentServices = {
    createAcademicDepartmentIntoDB,
    getAllAcademicDepartmentsFromDB,
    getAllAcademicDepartmentsListFromDB,
    getSingleAcademicDepartmentFromDB,
    updateAcademicDepartmentIntoDB,
    deleteAcademicDepartmentIntoDB,
}
