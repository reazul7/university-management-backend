import AppError from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import QueryBuilder from '../../builder/QueryBuilder'
import { AcademicFaculty } from './academicFaculty.model'
import { TAcademicFaculty } from './academicFaculty.interface'
import { AcademicDepartment } from '../AcademicDepartment/academicDepartment.model'
import { Student } from '../Student/student.model'
import { Faculty } from '../Faculty/faculty.model'
import { OfferedCourse } from '../OfferedCourse/offeredCourse.model'
import { EnrolledCourse } from '../EnrolledCourse/enrolledCourse.model'

const createAcademicFacultyIntoDB = async (payload: string) => {
    const result = await AcademicFaculty.create(payload)
    return result
}

const getAllAcademicFacultiesFromDB = async (query: Record<string, unknown>) => {
    const academicFacultyQuery = new QueryBuilder(AcademicFaculty.find(), query)
        .search(['name'])
        .filter()
        .sort()
        .paginate()
        .fields()
    const result = await academicFacultyQuery.modelQuery
    const meta = await academicFacultyQuery.countTotal()
    return { meta, result }
}

const getAllAcademicFacultiesListFromDB = async () => {
    const result = await AcademicFaculty.find({}, { _id: 1, name: 1 }).sort({ name: 1 })
    return { result }
}

const getSingleAcademicFacultyFromDB = async (id: string) => {
    const result = await AcademicFaculty.findById(id)
    if (!result) throw new AppError(StatusCodes.NOT_FOUND, 'Academic Faculty not found')
    return result
}

const updateAcademicFacultyIntoDB = async (id: string, payload: Partial<TAcademicFaculty>) => {
    const result = await AcademicFaculty.findOneAndUpdate({ _id: id }, payload, {
        new: true,
        runValidators: true,
    })
    if (!result) throw new AppError(StatusCodes.NOT_FOUND, 'Academic Faculty not found')
    return result
}

const deleteAcademicFacultyIntoDB = async (id: string) => {
    const isAcademicFacultyExists = await AcademicFaculty.findById(id)
    if (!isAcademicFacultyExists) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Academic Faculty not found')
    }

    const [academicDepartmentCount, studentCount, facultyCount, offeredCourseCount, enrolledCourseCount] =
        await Promise.all([
            AcademicDepartment.countDocuments({ academicFaculty: id }),
            Student.countDocuments({ academicFaculty: id }),
            Faculty.countDocuments({ academicFaculty: id }),
            OfferedCourse.countDocuments({ academicFaculty: id }),
            EnrolledCourse.countDocuments({ academicFaculty: id }),
        ])

    if (academicDepartmentCount || studentCount || facultyCount || offeredCourseCount || enrolledCourseCount) {
        const dependencies: string[] = []

        if (academicDepartmentCount) dependencies.push(`academicDepartment: ${academicDepartmentCount}`)
        if (studentCount) dependencies.push(`student: ${studentCount}`)
        if (facultyCount) dependencies.push(`faculty: ${facultyCount}`)
        if (offeredCourseCount) dependencies.push(`offeredCourse: ${offeredCourseCount}`)
        if (enrolledCourseCount) dependencies.push(`enrolledCourse: ${enrolledCourseCount}`)

        throw new AppError(
            StatusCodes.BAD_REQUEST,
            `Cannot delete this Academic Faculty because dependencies exist (${dependencies.join(', ')}).`,
        )
    }

    const result = await AcademicFaculty.findByIdAndDelete(id)
    return result
}

export const AcademicFacultyServices = {
    createAcademicFacultyIntoDB,
    getAllAcademicFacultiesFromDB,
    getAllAcademicFacultiesListFromDB,
    getSingleAcademicFacultyFromDB,
    updateAcademicFacultyIntoDB,
    deleteAcademicFacultyIntoDB,
}
