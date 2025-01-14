import { TAcademicSemester } from '../AcademicSemester/academicSemester.interface'
import { User } from './user.model'

const findLastStudentIdForSemester = async (year: string, code: string) => {
    // Find the last student ID for the specific year and semester code
    const lastStudentId = await User.findOne({ role: 'student', id: { $regex: `^${year}${code}` } }, { id: 1 })
        .sort({ createdAt: -1 })
        .lean()
    return lastStudentId?.id ? lastStudentId.id : undefined
}

export const generateStudentId = async (payload: TAcademicSemester) => {
    let currentId = (0).toString()
    const lastStudentId = await findLastStudentIdForSemester(payload.year, payload.code)
    if (lastStudentId) {
        currentId = lastStudentId.substring(6)
    }

    // Increment the ID
    let incrementId = (parseInt(currentId) + 1).toString().padStart(4, '0')
    incrementId = `${payload.year}${payload.code}${incrementId}`
    return incrementId
}

// faculty id
export const findLastFacultyId = async () => {
    // Find the last faculty ID
    const lastFacultyId = await User.findOne({ role: 'faculty' }, { id: 1 }).sort({ createdAt: -1 }).lean()
    return lastFacultyId?.id ? lastFacultyId.id.substring(2) : undefined
}
export const generateFacultyId = async () => {
    let currentId = (0).toString()
    const lastFacultyId = await findLastFacultyId()
    if (lastFacultyId) {
        currentId = lastFacultyId.substring(1)
    }

    // Increment the ID
    let incrementId = (parseInt(currentId) + 1).toString().padStart(4, '0')
    incrementId = `F${incrementId}`
    return incrementId
}
